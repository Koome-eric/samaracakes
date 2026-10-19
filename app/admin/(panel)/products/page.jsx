import { prisma } from "../../../../lib/prisma";
import { fmt } from "../../../../lib/fmt";
import { createProduct, toggleProduct, deleteProduct } from "../../actions";
export const dynamic = "force-dynamic";

export default async function Products() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });
  return (<>
    <div className="top"><div><h1>Products</h1><p>Cakes shown on the website. Hidden products stay saved but customers cannot order them.</p></div></div>
    <form action={createProduct} className="card pform">
      <h3>Add a cake</h3>
      <input name="name" placeholder="Name, e.g. Lemon Drizzle" required aria-label="Name" />
      <input name="desc" placeholder="Short description" aria-label="Description" />
      <input name="base" type="number" min="1" placeholder="Starting price (KES)" required aria-label="Starting price" />
      <label className="clr">Photo (jpg, png, webp, under 5 MB)<input name="image" type="file" accept="image/jpeg,image/png,image/webp" /></label>
      <label className="clr">Card colour<input name="bg" type="color" defaultValue="#ffd9e2" /></label>
      <button className="abtn">Add product</button>
    </form>
    <div className="tw" style={{ marginTop: 20 }}><table className="t">
      <thead><tr><th>Product</th><th>Description</th><th className="num">From</th><th>Status</th><th /></tr></thead>
      <tbody>{products.map((p) => (
        <tr key={p.id}><td>{p.imageUrl ? <img src={p.imageUrl} alt="" className="thumb" /> : <span className="sw" style={{ background: p.bg }} />}{p.name}</td><td>{p.desc}</td><td className="num">{fmt(p.base)}</td>
          <td><span className={`pill ${p.active ? "p-PAID" : "s-NEW"}`}>{p.active ? "Live" : "Hidden"}</span></td>
          <td className="acts"><form action={toggleProduct}><input type="hidden" name="id" value={p.id} /><button className="abtn ghost sm">{p.active ? "Hide" : "Show"}</button></form>
            <form action={deleteProduct}><input type="hidden" name="id" value={p.id} /><button className="abtn danger sm">Delete</button></form></td></tr>))}
        {!products.length && <tr><td colSpan="5" className="empty">No products yet. The site adds the starter cakes when first opened, or add one above.</td></tr>}</tbody></table></div>
    <p className="note">Sizes and flavours (and their price add-ons) are set in lib/config.js.</p>
  </>);
}
