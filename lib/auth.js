import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const sign = (v) => crypto.createHmac("sha256", process.env.ADMIN_SECRET || "").update(v).digest("hex");
export async function setSession() {
  const v = String(Date.now() + 7 * 864e5);
  (await cookies()).set("sc_admin", `${v}.${sign(v)}`, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: 604800 });
}
export async function clearSession() { (await cookies()).set("sc_admin", "", { path: "/admin", maxAge: 0 }); }
export async function isAdmin() {
  if (!process.env.ADMIN_SECRET) return false;
  const [v, sig] = ((await cookies()).get("sc_admin")?.value || "").split(".");
  if (!v || !sig) return false;
  const good = sign(v);
  return sig.length === good.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good)) && Number(v) > Date.now();
}
export async function requireAdmin() { if (!(await isAdmin())) redirect("/admin/login"); }
