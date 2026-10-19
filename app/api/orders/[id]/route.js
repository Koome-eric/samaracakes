import { prisma } from "../../../../lib/prisma";
export const dynamic = "force-dynamic";
export async function GET(_req, { params }) {
  const { id } = await params;
  const o = await prisma.order.findUnique({ where: { id }, select: { status: true, mpesaReceipt: true, failReason: true } });
  return o ? Response.json(o) : Response.json({ error: "Not found" }, { status: 404 });
}
