"use server";
import crypto from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { setSession, clearSession, requireAdmin } from "../../lib/auth";
const h = (s) => crypto.createHash("sha256").update(s).digest();

export async function login(fd) {
  const ok = process.env.ADMIN_PASSWORD && crypto.timingSafeEqual(h(String(fd.get("password") || "")), h(process.env.ADMIN_PASSWORD));
  if (!ok) redirect("/admin/login?e=1");
  await setSession();
  redirect("/admin");
}
export async function logout() { await clearSession(); redirect("/admin/login"); }
export async function updateStage(fd) {
  await requireAdmin();
  const stage = String(fd.get("stage"));
  if (!["NEW", "BAKING", "READY", "DELIVERED"].includes(stage)) return;
  await prisma.order.update({ where: { id: String(fd.get("id")) }, data: { stage } });
  revalidatePath("/admin", "layout");
}
export async function createProduct(fd) {
  await requireAdmin();
  const base = parseInt(fd.get("base"), 10), name = String(fd.get("name") || "").trim();
  if (!name || !(base > 0)) return;
  const f = fd.get("image");
  let imageUrl = null;
  if (f && f.size > 0 && f.size < 5e6 && /^image\/(jpeg|png|webp)$/.test(f.type)) {
    const file = `${crypto.randomUUID()}.${f.type.split("/")[1].replace("jpeg", "jpg")}`;
    await mkdir(path.join(process.cwd(), "uploads"), { recursive: true });
    await writeFile(path.join(process.cwd(), "uploads", file), Buffer.from(await f.arrayBuffer()));
    imageUrl = `/api/media/${file}`;
  }
  await prisma.product.create({ data: { imageUrl, name: name.slice(0, 60), desc: String(fd.get("desc") || "").slice(0, 120), base, bg: String(fd.get("bg") || "#ffd9e2") } });
  revalidatePath("/admin/products");
}
export async function toggleProduct(fd) {
  await requireAdmin();
  const id = String(fd.get("id")), p = await prisma.product.findUnique({ where: { id } });
  if (p) await prisma.product.update({ where: { id }, data: { active: !p.active } });
  revalidatePath("/admin/products");
}
export async function deleteProduct(fd) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: String(fd.get("id")) } }).catch(() => {});
  revalidatePath("/admin/products");
}
