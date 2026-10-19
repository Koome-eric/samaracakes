"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WHATSAPP, MPESA_TILL, CURRENCY, SIZES, FLAVOURS, COLOURS } from "../lib/config";

export const fmt = (n) => `${CURRENCY} ${n.toLocaleString()}`;
const Ctx = createContext(null);
export const useShop = () => useContext(Ctx);

export function ShopProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cake, setCake] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("samara-cart") || "[]")); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem("samara-cart", JSON.stringify(items)); } catch {} }, [items]);
  const value = {
    items, cake, cartOpen, count: items.reduce((s, i) => s + i.qty, 0),
    openCake: setCake, closeCake: () => setCake(null),
    openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
    add: (it) => { setItems((l) => [...l, { ...it, id: Date.now() }]); setCake(null); setCartOpen(true); },
    qty: (id, d) => setItems((l) => l.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))),
    remove: (id) => setItems((l) => l.filter((i) => i.id !== id)),
    clear: () => setItems([]),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function Customizer() {
  const { cake, closeCake, add } = useShop();
  const [f, setF] = useState({ size: 0, flavour: 0, colour: 0, message: "", date: "", notes: "" });
  useEffect(() => { if (cake) setF({ size: 0, flavour: 0, colour: 0, message: "", date: "", notes: "" }); }, [cake]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  if (!cake) return null;
  const price = cake.base + SIZES[f.size].add + FLAVOURS[f.flavour].add;
  const col = COLOURS[f.colour][1];
  return (
    <AnimatePresence>
      <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCake}>
        <motion.div className="modal" role="dialog" aria-label={`Customise ${cake.name}`} onClick={(e) => e.stopPropagation()}
          initial={{ y: 60, scale: 0.96 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", damping: 20 }}>
          <div className="preview" style={{ background: cake.bg }}>
            <svg viewBox="0 0 200 200" width="220">
              <motion.rect animate={{ fill: col }} x="20" y="110" width="160" height={f.size === 3 ? 70 : 60} rx="16" stroke="#3a0820" strokeWidth="3" />
              <motion.rect animate={{ fill: col }} x={f.size === 3 ? 50 : 40} y="60" width={f.size === 3 ? 100 : 120} height="55" rx="14" stroke="#3a0820" strokeWidth="3" />
              <path d="M28 128 q14 18 28 0 t28 0 t28 0 t28 0 t28 0" fill="none" stroke="#3a0820" strokeWidth="3" strokeLinecap="round" />
              <circle cx="100" cy="48" r="11" fill="#c10373" stroke="#3a0820" strokeWidth="3" />
            </svg>
            {f.message && <p className="msg">{f.message}</p>}
          </div>
          <div className="panel">
            <button className="x" onClick={closeCake} aria-label="Close">×</button>
            <h3>{cake.name}</h3>
            <label>Size<select value={f.size} onChange={set("size")}>{SIZES.map((s, i) => <option key={s.label} value={i}>{s.label}</option>)}</select></label>
            <label>Flavour<select value={f.flavour} onChange={set("flavour")}>{FLAVOURS.map((s, i) => <option key={s.label} value={i}>{s.label}</option>)}</select></label>
            <div className="sw" role="radiogroup" aria-label="Frosting colour">{COLOURS.map(([n, c], i) => (
              <button key={n} role="radio" aria-checked={f.colour === i} aria-label={n} title={n} className={f.colour === i ? "on" : ""} style={{ background: c }} onClick={() => setF({ ...f, colour: i })} />
            ))}</div>
            <label>Message on cake<input maxLength={30} value={f.message} onChange={set("message")} placeholder="Happy Birthday Amina" /></label>
            <label>Date needed<input type="date" value={f.date} onChange={set("date")} /></label>
            <label>Notes<input value={f.notes} onChange={set("notes")} placeholder="Allergies, theme, toppers" /></label>
            <button className="btn" disabled={!f.date} onClick={() => add({ name: cake.name, size: SIZES[f.size].label, flavour: FLAVOURS[f.flavour].label, colour: COLOURS[f.colour][0], message: f.message, date: f.date, notes: f.notes, price, qty: 1 })}>
              Add to cart · {fmt(price)}
            </button>
            {!f.date && <small>Choose the date you need it.</small>}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function CartDrawer() {
  const { items, cartOpen, closeCart, qty, remove, clear } = useShop();
  const [c, setC] = useState({ name: "", phone: "", mode: "Delivery", address: "" });
  const set = (k) => (e) => setC({ ...c, [k]: e.target.value });
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const ready = items.length && c.name && c.phone && (c.mode === "Pickup" || c.address);
  const lines = items.map((i, n) => `${n + 1}. ${i.name} x${i.qty} - ${i.size}, ${i.flavour}, ${i.colour} frosting${i.message ? `, message "${i.message}"` : ""}, needed ${i.date}${i.notes ? ` (${i.notes})` : ""} = ${fmt(i.price * i.qty)}`);
  const text = `Hello Samara Cakes, I would like to order:\n\n${lines.join("\n")}\n\nTotal: ${fmt(total)}\nName: ${c.name}\nPhone: ${c.phone}\n${c.mode}${c.mode === "Delivery" ? `: ${c.address}` : ""}\n\nI will pay via M-Pesa Till ${MPESA_TILL} and send the confirmation here.`;
  const [st, setSt] = useState({ s: "idle" });
  async function pay() {
    setSt({ s: "sending" });
    try {
      const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...c, items: items.map(({ name, size, flavour, colour, message, date, notes, qty }) => ({ name, size, flavour, colour, message, date, notes, qty })) }) });
      const d = await r.json();
      if (!r.ok) return setSt({ s: "failed", msg: d.error });
      setSt({ s: "waiting" });
      for (let n = 0; n < 40; n++) {
        await new Promise((res) => setTimeout(res, 3000));
        const o = await (await fetch(`/api/orders/${d.orderId}`)).json();
        if (o.status === "PAID") {
          const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hello Samara Cakes, I have paid for my order (M-Pesa receipt ${o.mpesaReceipt}).\n\n${lines.join("\n")}`)}`;
          setSt({ s: "paid", receipt: o.mpesaReceipt, wa }); clear(); return;
        }
        if (o.status === "FAILED") return setSt({ s: "failed", msg: o.failReason || "Payment was not completed." });
      }
      setSt({ s: "failed", msg: "We did not receive your payment in time. If money left your account, message us on WhatsApp with the M-Pesa receipt." });
    } catch { setSt({ s: "failed", msg: "Network problem. Check your connection and try again." }); }
  }
  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div className="overlay right" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart}>
          <motion.aside className="drawer" role="dialog" aria-label="Your cart" onClick={(e) => e.stopPropagation()}
            initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: "spring", damping: 26 }}>
            <button className="x" onClick={closeCart} aria-label="Close cart">×</button>
            <h3>Your cart</h3>
            {st.s === "paid" ? (
              <div className="pay ok"><strong>Payment received. Receipt {st.receipt}.</strong><br />We have your order and will start baking.<br /><a href={st.wa} target="_blank" rel="noreferrer">Message us on WhatsApp</a></div>
            ) : !items.length && <p>Your cart is empty. Pick a cake and customise it to get started.</p>}
            {items.map((i) => (
              <div className="line" key={i.id}>
                <div><strong>{i.name}</strong><small>{i.size} · {i.flavour} · {i.colour}{i.message ? ` · "${i.message}"` : ""}<br />Needed {i.date}</small></div>
                <div className="q"><button onClick={() => qty(i.id, -1)} aria-label="Fewer">−</button>{i.qty}<button onClick={() => qty(i.id, 1)} aria-label="More">+</button></div>
                <span>{fmt(i.price * i.qty)}</span>
                <button className="rm" onClick={() => remove(i.id)}>Remove</button>
              </div>
            ))}
            {!!items.length && (<>
              <div className="tot"><span>Total</span><strong>{fmt(total)}</strong></div>
              <input placeholder="Your name" value={c.name} onChange={set("name")} aria-label="Your name" />
              <input placeholder="M-Pesa number, e.g. 0712345678" value={c.phone} onChange={set("phone")} aria-label="M-Pesa phone number" inputMode="tel" />
              <select value={c.mode} onChange={set("mode")} aria-label="Delivery or pickup"><option>Delivery</option><option>Pickup</option></select>
              {c.mode === "Delivery" && <input placeholder="Delivery address" value={c.address} onChange={set("address")} aria-label="Delivery address" />}
              <p className="pay">You will get an M-Pesa prompt on your phone. Enter your PIN to pay {fmt(total)}.</p>
              {st.s === "failed" && <p className="pay err">{st.msg}</p>}
              <button className="btn mp" disabled={!ready || st.s === "sending" || st.s === "waiting"} onClick={pay}>
                {st.s === "sending" ? "Sending prompt..." : st.s === "waiting" ? "Waiting for your PIN..." : "Pay with M-Pesa"}
              </button>
              <a className="wa-link" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">Prefer to arrange payment on WhatsApp?</a>
            </>)}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
