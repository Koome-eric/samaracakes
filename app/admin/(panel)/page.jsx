import { prisma } from "../../../lib/prisma";
import { fmt, dt } from "../../../lib/fmt";
export const dynamic = "force-dynamic";

export default async function Overview() {
  const since = new Date(); since.setUTCHours(0, 0, 0, 0); since.setUTCDate(since.getUTCDate() - 13);
  const [paid14, byStatus, recent, paidItems] = await Promise.all([
    prisma.order.findMany({ where: { status: "PAID", createdAt: { gte: since } }, select: { total: true, createdAt: true } }),
    prisma.order.groupBy({ by: ["status"], _count: true, _sum: { total: true } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.orderItem.findMany({ where: { order: { status: "PAID" } }, select: { name: true, qty: true, unitPrice: true } }),
  ]);
  const S = Object.fromEntries(byStatus.map((s) => [s.status, s]));
  const revenue = S.PAID?._sum.total || 0, paidCount = S.PAID?._count || 0;
  const days = [...Array(14)].map((_, i) => { const d = new Date(since); d.setUTCDate(since.getUTCDate() + i); return { k: d.toISOString().slice(0, 10), l: d.getUTCDate(), v: 0 }; });
  paid14.forEach((o) => { const d = days.find((x) => x.k === o.createdAt.toISOString().slice(0, 10)); if (d) d.v += o.total; });
  const max = Math.max(...days.map((d) => d.v), 1), last14 = days.reduce((s, d) => s + d.v, 0);
  const top = Object.entries(paidItems.reduce((m, i) => { const r = (m[i.name] ||= { u: 0, r: 0 }); r.u += i.qty; r.r += i.qty * i.unitPrice; return m; }, {})).sort((a, b) => b[1].r - a[1].r).slice(0, 5);
  return (<>
    <div className="top"><div><h1>Overview</h1><p>How Samara Cakes is doing.</p></div></div>
    <div className="kpis">
      <div className="kpi"><small>Revenue (paid)</small><b>{fmt(revenue)}</b></div>
      <div className="kpi"><small>Paid orders</small><b>{paidCount}</b></div>
      <div className="kpi"><small>Average order</small><b>{fmt(paidCount ? Math.round(revenue / paidCount) : 0)}</b></div>
      <div className="kpi"><small>Awaiting payment</small><b>{S.PENDING_PAYMENT?._count || 0}</b></div>
    </div>
    <div className="grid2">
      <div className="card"><div className="ch"><h3>Revenue, last 14 days</h3><strong>{fmt(last14)}</strong></div>
        <svg viewBox="0 0 700 220" width="100%" role="img" aria-label="Daily revenue for the last 14 days">
          <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c10373" /><stop offset="1" stopColor="#4e051e" stopOpacity=".7" /></linearGradient></defs>
          {[0, 1, 2, 3].map((i) => <line key={i} x1="0" x2="700" y1={30 + i * 53} y2={30 + i * 53} stroke="#ece9f2" />)}
          {days.map((d, i) => { const h = (d.v / max) * 150; return <g key={d.k}><title>{`${d.k}: ${fmt(d.v)}`}</title><rect x={i * 50 + 8} y={190 - h} width="34" height={Math.max(h, 3)} rx="8" fill={d.v ? "url(#g)" : "#ece9f2"} /><text x={i * 50 + 25} y="212" textAnchor="middle" fontSize="12" fill="#6b6478">{d.l}</text></g>; })}
        </svg></div>
      <div className="card"><h3>Best sellers</h3>
        <table className="t"><thead><tr><th>Cake</th><th className="num">Sold</th><th className="num">Revenue</th></tr></thead>
          <tbody>{top.map(([n, v]) => <tr key={n}><td>{n}</td><td className="num">{v.u}</td><td className="num">{fmt(v.r)}</td></tr>)}{!top.length && <tr><td colSpan="3" className="empty">No paid orders yet.</td></tr>}</tbody></table></div>
    </div>
    <div className="card"><div className="ch"><h3>Recent orders</h3><a href="/admin/orders" className="lnk">View all orders</a></div>
      <div className="tw"><table className="t"><thead><tr><th>Order</th><th>Customer</th><th>Placed</th><th>Payment</th><th>Stage</th><th className="num">Total</th></tr></thead>
        <tbody>{recent.map((o) => <tr key={o.id}><td>#{o.id.slice(-6)}</td><td>{o.customerName}</td><td>{dt(o.createdAt)}</td><td><span className={`pill p-${o.status}`}>{o.status === "PENDING_PAYMENT" ? "Awaiting" : o.status === "PAID" ? "Paid" : "Failed"}</span></td><td><span className={`pill s-${o.stage}`}>{o.stage[0] + o.stage.slice(1).toLowerCase()}</span></td><td className="num">{fmt(o.total)}</td></tr>)}
          {!recent.length && <tr><td colSpan="6" className="empty">Orders will appear here.</td></tr>}</tbody></table></div></div>
  </>);
}
