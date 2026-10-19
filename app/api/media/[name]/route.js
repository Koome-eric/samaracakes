import { readFile } from "fs/promises";
import path from "path";
const T = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
export async function GET(_r, { params }) {
  const { name } = await params;
  const m = /^[\w-]+\.(jpg|jpeg|png|webp)$/.exec(name);
  if (!m) return new Response("Not found", { status: 404 });
  try {
    const b = await readFile(path.join(process.cwd(), "uploads", name));
    return new Response(b, { headers: { "Content-Type": T[m[1]], "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch { return new Response("Not found", { status: 404 }); }
}
