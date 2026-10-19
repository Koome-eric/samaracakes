import NavLink from "../NavLink";
import { logout } from "../actions";
import { requireAdmin } from "../../../lib/auth";
export default async function Panel({ children }) {
  await requireAdmin();
  return (
    <div className="adm">
      <aside className="side">
        <div className="brand"><span className="chip"><img src="/brand/mark.png" alt="" /></span>Samara Cakes</div>
        <NavLink href="/admin">Overview</NavLink>
        <NavLink href="/admin/orders">Orders</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/customers">Customers</NavLink>
        <form action={logout} style={{ marginTop: "auto" }}><button>Sign out</button></form>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
