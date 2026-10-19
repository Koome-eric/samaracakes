import { prisma } from "../../../../lib/prisma";
const OK = { ResultCode: 0, ResultDesc: "Accepted" };

export async function POST(req) {
  if (new URL(req.url).searchParams.get("s") !== process.env.MPESA_CALLBACK_SECRET) return Response.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const cb = body?.Body?.stkCallback;
  if (!cb) return Response.json(OK);
  const order = await prisma.order.findUnique({ where: { checkoutRequestId: cb.CheckoutRequestID } });
  if (order && order.status === "PENDING_PAYMENT") {
    if (cb.ResultCode === 0) {
      const m = Object.fromEntries((cb.CallbackMetadata?.Item || []).map((i) => [i.Name, i.Value]));
      const ok = Number(m.Amount) >= order.total;
      await prisma.order.update({ where: { id: order.id }, data: ok ? { status: "PAID", mpesaReceipt: String(m.MpesaReceiptNumber) } : { status: "FAILED", failReason: "The amount paid did not match your order. Please message us on WhatsApp." } });
    } else {
      await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED", failReason: cb.ResultDesc || "Payment was not completed." } });
    }
  }
  return Response.json(OK);
}
