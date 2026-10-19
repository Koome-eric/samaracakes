import { login } from "../actions";
export default async function Login({ searchParams }) {
  const { e } = await searchParams;
  return (
    <div className="adm-login">
      <form action={login} className="card login">
        <img src="/brand/logo.png" alt="Samara Cakes" className="llogo" />
        <p>Sign in to manage orders and products.</p>
        <input name="password" type="password" placeholder="Admin password" aria-label="Admin password" autoFocus required />
        {e && <small className="err">Incorrect password. Try again.</small>}
        <button className="abtn">Sign in</button>
      </form>
    </div>
  );
}
