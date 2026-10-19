import { prisma } from "../../../lib/prisma";
import { CAKES } from "../../../lib/config";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await prisma.product.count())) await prisma.product.createMany({ data: CAKES.map((c) => ({ name: c.name, desc: c.desc, base: c.base, bg: c.bg, imageUrl: c.imageUrl })) });
  const rows = await prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: "asc" } });
  return Response.json(rows.map((r) => ({ ...r, imageUrl: r.imageUrl || CAKES.find((c) => c.name === r.name)?.imageUrl || null })));
}
