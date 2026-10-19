import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { fmt, dt } from "../../../../lib/fmt";
import { updateStage } from "../../actions";
export const dynamic = "force-dynamic";
const TABS = [["", "All"], ["PAID", "Paid"], ["PENDING_PAYMENT", "Awaiting payment"], ["FAILED", "Failed"]];
const STAGES = ["NEW", "BAKING", "READY", "DELIVERED"];

export default async function Orders({ searchParams }) {
  const { status = "", q = "" } = await searchParams;
  const where = { ...(status && { status }), ...(q && { OR: [{ customerName: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }, { id: { endsWith: q } }] }) };
  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, take: 100, include: { items: true } });
  return (<>
    <div className="top"><div><h1>Orders</h1><p>{orders.length} shown. Update the stage as each cake moves along.</p></div>
      <form className="search"><input name="q" defaultValue={q} placeholder="Search name, phone or order number" aria-label="Search orders" />{status && <input type="hidden" name="status" value={status} />}<button className="abtn">Search</button></form></div>
    <div className="tabs">{TABS.map(([v, l]) => <Link key={l} href={`/admin/orders?status=${v}${q ? `&q=${q}` : ""}`} className={status === v ? "on" : ""}>{l}</Link>)}</div>
    <div className="tw"><table className="t">
      <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Placed</th><th>Payment</th><th>Stage</th><th className="num">Total</th></tr></thead>
      <tbody>{orders.map((o) => (
        <tr key={o.id}>
          <td><b>#{o.id.slice(-6)}</b>{o.mpesaReceipt && <small className="sub">{o.mpesaReceipt}</small>}</td>
          <td>{o.customerName}<small className="sub">{o.phone} · {o.mode}{o.address ? `: ${o.address}` : ""}</small></td>
          <td><details><summary>{o.items.length} item{o.items.length > 1 ? "s" : ""}</summary><ul className="dl">{o.items.map((i) => <li key={i.id}><b>{i.name}</b> x{i.qty}<small className="sub">{i.size} · {i.flavour} · {i.colour}{i.message ? ` · "${i.message}"` : ""} · needed {i.neededOn}{i.notes ? ` · ${i.notes}` : ""}</small></li>)}</ul></details></td>
          <td>{dt(o.createdAt)}</td>
          <td><span className={`pill p-${o.status}`}>{o.status === "PENDING_PAYMENT" ? "Awaiting" : o.status === "PAID" ? "Paid" : "Failed"}</span>{o.failReason && <small className="sub">{o.failReason}</small>}</td>
          <td><form action={updateStage} className="sf"><input type="hidden" name="id" value={o.id} /><select name="stage" defaultValue={o.stage} aria-label="Stage">{STAGES.map((s) => <option key={s} value={s}>{s[0] + s.slice(1).toLowerCase()}</option>)}</select><button className="abtn sm">Save</button></form></td>
          <td className="num">{fmt(o.total)}</td>
        </tr>))}
        {!orders.length && <tr><td colSpan="7" className="empty">No orders match.</td></tr>}</tbody></table></div>
  </>);
}
