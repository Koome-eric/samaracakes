"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WHATSAPP } from "../lib/config";
import { useShop } from "./Shop";

const TOPICS = ["I want to order a birthday cake", "I need a wedding cake quote", "I need event decoration", "Do you deliver to my area?"];
const WaIcon = () => (
  <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
    <circle cx="16" cy="15" r="12" fill="#fff" /><path d="M5 29l3.500-9 6 4.500z" fill="#fff" />
    <circle cx="11" cy="15" r="1.800" fill="#25d366" /><circle cx="16" cy="15" r="1.800" fill="#25d366" /><circle cx="21" cy="15" r="1.800" fill="#25d366" />
  </svg>
);

export default function ChatWidget() {
  const { cartOpen, cake } = useShop();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  if (cartOpen || cake) return null;
  const text = `Hello Samara Cakes, ${msg.trim() || "I have a question."}${name.trim() ? `\n\nName: ${name.trim()}` : ""}`;
  const link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  return (
    <div className="cw">
      <AnimatePresence>
        {open && (
          <motion.div className="cw-panel" role="dialog" aria-label="Chat with Samara Cakes"
            initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.95 }} transition={{ type: "spring", damping: 22 }}>
            <div className="cw-head">
              <span className="chip"><img src="/brand/mark.png" alt="" /></span>
              <div><strong>Samara Cakes</strong><small>Chat with us on WhatsApp</small></div>
              <button onClick={() => setOpen(false)} aria-label="Close chat">×</button>
            </div>
            <div className="cw-body">
              <p className="cw-bub">Hi there. Tell us what you are celebrating and we will help with cakes, decor and delivery.</p>
              <div className="cw-chips">{TOPICS.map((t) => <button key={t} className={msg === t ? "on" : ""} onClick={() => setMsg(t)}>{t}</button>)}</div>
              <textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type your message" aria-label="Your message" />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" aria-label="Your name" />
              <a className="btn wa" href={link} target="_blank" rel="noreferrer" onClick={() => setTimeout(() => { setOpen(false); setMsg(""); }, 600)}>Continue on WhatsApp</a>
              <small className="cw-note">This opens WhatsApp with your message ready to send.</small>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button className="cw-btn" onClick={() => setOpen(!open)} aria-label={open ? "Close chat" : "Chat with us on WhatsApp"} aria-expanded={open}>
        {open ? <span style={{ color: "#fff", fontSize: "2rem", lineHeight: 1 }}>×</span> : <WaIcon />}
      </button>
    </div>
  );
}
