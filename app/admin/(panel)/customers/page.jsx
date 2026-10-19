import { prisma } from "../../../../lib/prisma";
import { fmt, dt } from "../../../../lib/fmt";
export const dynamic = "force-dynamic";

export default async function Customers() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, select: { customerName: true, phone: true, total: true, status: true, createdAt: true } });
  const m = {};
  orders.forEach((o) => { const c = (m[o.phone] ||= { name: o.customerName, phone: o.phone, n: 0, spent: 0, last: o.createdAt }); c.n++; if (o.status === "PAID") c.spent += o.total; });
  const rows = Object.values(m).sort((a, b) => b.spent - a.spent);
  return (<>
    <div className="top"><div><h1>Customers</h1><p>{rows.length} customers, ranked by what they have paid.</p></div></div>
    <div className="tw"><table className="t"><thead><tr><th>Customer</th><th>Phone</th><th className="num">Orders</th><th className="num">Paid total</th><th>Last order</th><th /></tr></thead>
      <tbody>{rows.map((c) => <tr key={c.phone}><td>{c.name}</td><td>{c.phone}</td><td className="num">{c.n}</td><td className="num">{fmt(c.spent)}</td><td>{dt(c.last)}</td><td><a className="lnk" href={`https://wa.me/${c.phone}`} target="_blank" rel="noreferrer">WhatsApp</a></td></tr>)}
        {!rows.length && <tr><td colSpan="6" className="empty">Customers appear after their first order.</td></tr>}</tbody></table></div>
  </>);
}
