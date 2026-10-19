import { prisma } from "../../../lib/prisma";
import { priceItem } from "../../../lib/pricing";
import { normalisePhone, stkPush } from "../../../lib/mpesa";

export async function POST(req) {
  const b = await req.json().catch(() => null);
  const phone = normalisePhone(b?.phone);
  if (!b?.name?.trim() || !phone) return Response.json({ error: "Enter your name and a valid Safaricom number, like 0712345678." }, { status: 400 });
  if (b.mode === "Delivery" && !b.address?.trim()) return Response.json({ error: "Enter a delivery address." }, { status: 400 });
  if (!Array.isArray(b.items) || !b.items.length || b.items.length > 20) return Response.json({ error: "Your cart is empty." }, { status: 400 });

  const products = await prisma.product.findMany({ where: { active: true } });
  const items = [];
  for (const i of b.items) {
    const unitPrice = priceItem(i, products);
    const qty = Number(i.qty);
    if (unitPrice === null || !Number.isInteger(qty) || qty < 1 || qty > 20 || !i.date)
      return Response.json({ error: "An item in your cart is no longer valid. Please re-add it." }, { status: 400 });
    items.push({ name: i.name, size: i.size, flavour: i.flavour, colour: String(i.colour || ""), message: String(i.message || "").slice(0, 30) || null, neededOn: String(i.date), notes: String(i.notes || "").slice(0, 200) || null, qty, unitPrice });
  }
  const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  const order = await prisma.order.create({
    data: { customerName: b.name.trim().slice(0, 80), phone, mode: b.mode === "Pickup" ? "Pickup" : "Delivery", address: b.mode === "Pickup" ? null : b.address.trim().slice(0, 200), total, items: { create: items } },
  });
  try {
    const r = await stkPush({ phone, amount: total, ref: `SC${order.id.slice(-8)}` });
    await prisma.order.update({ where: { id: order.id }, data: { checkoutRequestId: r.CheckoutRequestID } });
    return Response.json({ orderId: order.id });
  } catch (e) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED", failReason: e.message } });
    return Response.json({ error: e.message }, { status: 502 });
  }
}
