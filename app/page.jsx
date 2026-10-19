"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ShopProvider, Customizer, CartDrawer, useShop, fmt } from "../components/Shop";
import { CAKES } from "../lib/config";
import { Img, Vid } from "../components/Media";
import * as Art from "../components/Art";

const tiers = [
  { y: 250, w: 300, h: 86, c: "#ffd9e2" },
  { y: 175, w: 220, h: 80, c: "#cfe6bf" },
  { y: 105, w: 150, h: 74, c: "#f7e1c0" },
];
function HeroCake() {
  return (
    <svg viewBox="0 0 400 400" aria-label="Three-tier cake assembling">
      <ellipse cx="200" cy="352" rx="170" ry="16" fill="#3a082022" />
      {tiers.map((t, i) => (
        <motion.g key={i} initial={{ y: -420, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.35, type: "spring", stiffness: 90, damping: 11 }}>
          <rect x={200 - t.w / 2} y={t.y} width={t.w} height={t.h} rx="22" fill={t.c} stroke="#3a0820" strokeWidth="3" />
          <path d={`M${200 - t.w / 2 + 8} ${t.y + 18} q18 22 36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0`} fill="none" stroke="#c10373" strokeWidth="5" strokeLinecap="round" />
        </motion.g>
      ))}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: "spring" }} style={{ transformOrigin: "200px 90px" }}>
        <circle cx="200" cy="82" r="16" fill="#c10373" stroke="#3a0820" strokeWidth="3" />
        <path d="M200 66 q10-22 24-20" stroke="#3a0820" strokeWidth="3" fill="none" />
      </motion.g>
    </svg>
  );
}
const dots = ["#c10373", "#cfe6bf", "#f7e1c0", "#3a0820", "#ffb3c7"];
const occasions = [
  ["Birthdays", "Cakes from KES 4,500", "#ffd9e2", "/media/occ-birthday.jpg"], ["Weddings", "Tiered & bespoke", "#cfe6bf", "/media/occ-wedding.jpg"],
  ["Baby showers", "Sets & towers", "#f7e1c0", "/media/occ-baby.jpg"], ["Corporate", "Boxes & tables", "#d9ccff", "/media/occ-corporate.jpg"],
];
const cakes = CAKES;
const decor = [["Balloon arches & garlands", "#c10373"], ["Flower walls", "#cfe6bf"], ["Dessert tables", "#f7e1c0"], ["Neon & backdrops", "#d9ccff"], ["Table styling", "#ffd9e2"]];

function Landing() {
  const { openCake, openCart, count } = useShop();
  const [cakes, setCakes] = useState(CAKES);
  useEffect(() => { fetch("/api/products").then((r) => r.json()).then((d) => Array.isArray(d) && d.length && setCakes(d)).catch(() => {}); }, []);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.7 } };
  return (
    <>
      <nav><div className="wrap">
        <a href="#" className="logo" aria-label="Samara Cakes home"><img src="/brand/mark.png" alt="" width="46" height="46" /><span>Samara <b>Cakes</b></span></a>
        <div className="links"><a href="#occasions">Occasions</a><a href="#cakes">Cakes</a><a href="#decor">Decor</a><a href="#how">How it works</a></div>
        <div style={{ display: "flex", gap: 10 }}><button className="btn alt" onClick={openCart}>Cart ({count})</button><a href="#book" className="btn">Book a date</a></div>
      </div></nav>

      <header className="hero"><div className="wrap">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>Cakes and spaces worth the photo.</motion.h1>
          <p>Custom celebration cakes, dessert tables and full event styling, designed with you and delivered to your door.</p>
          <div className="cta"><a href="#cakes" className="btn">Order a cake</a><a href="#decor" className="btn alt">Style my event</a></div>
        </div>
        <div className="stage">
          <Vid src="/media/hero.mp4" poster="/media/hero.jpg" fallback={<HeroCake />} />
          {dots.map((c, i) => (
            <motion.span key={i} className="sprinkle" style={{ background: c, left: `${12 + i * 18}%`, top: `${8 + (i % 3) * 12}%` }}
              animate={{ y: [0, 18, 0], rotate: [i * 30, i * 30 + 40, i * 30] }} transition={{ repeat: Infinity, duration: 3 + i, ease: "easeInOut" }} />
          ))}
        </div>
      </div></header>

      <div className="marquee" aria-hidden><div>{Array(8).fill("Birthday cakes ✦ Wedding tiers ✦ Dessert tables ✦ Balloon arches ✦ Flower walls ✦ ").join("")}</div></div>

      <section id="occasions"><div className="wrap">
        <motion.div {...fade}><h2>Start with the occasion.</h2><p className="sub">Tell us what you are celebrating and we will show you the cakes and decor that fit.</p></motion.div>
        <div className="occ">{occasions.map(([t, s, c, im]) => (
          <a href="#cakes" key={t} className="tile ph" style={{ background: c }}><div className="tbg"><Img src={im} alt="" fallback={null} /></div><i /><h3>{t}</h3><span>{s}</span></a>
        ))}</div>
      </div></section>

      <section id="cakes" style={{ paddingTop: 0 }}><div className="wrap">
        <motion.div {...fade}><h2>Signature cakes.</h2><p className="sub">Baked to order, 48 hours notice. Every cake can be resized, relabelled and recoloured.</p></motion.div>
        <div className="menu">{cakes.map(({ name: n, desc: d, base, bg: c, imageUrl: im }, i) => (
          <motion.article key={n} className="cake" {...fade} transition={{ duration: 0.7, delay: i * 0.12 }} whileHover={{ y: -8 }}>
            <div className="art" style={{ background: c }}><Img src={im} alt={n} fallback={<Art.CakeArt i={i} />} /></div>
            <div className="row"><h3>{n}</h3><span className="price">from {fmt(base)}</span></div>
            <p>{d}</p><button className="btn" onClick={() => openCake({ name: n, base, bg: c })}>Customise this cake</button>
          </motion.article>
        ))}</div>
      </div></section>

      <section className="decor" id="decor" ref={ref}><div className="wrap">
        <motion.div {...fade}><h2>Event decor, start to finish.</h2><p className="sub">One team for the cake, the arch and the table. Fewer vendors, a calmer day.</p></motion.div>
        <motion.div className="dgrid" style={{ x }}>{[["Balloon arches & garlands", <Art.Balloons />], ["Flower walls", <Art.Flowers />], ["Dessert tables", <Art.Cupcakes />], ["Neon & backdrops", <Art.Neon />], ["Table styling", <Art.Flowers bg="#f7e1c0" />]].map(([t, a], i) => (
          <div key={t} className="dtile"><Img src={`/media/decor-${i + 1}.jpg`} alt={t} fallback={a} /><span>{t}</span></div>
        ))}</motion.div>
      </div></section>

      <section id="reels" style={{ paddingTop: 0 }}><div className="wrap feat">
        <div className="featv"><Vid src="/media/story.mp4" poster="/media/story.jpg" fallback={<Art.CakeArt i={0} />} /></div>
        <motion.div {...fade}><h2>Made by hand, finished for the table.</h2><p className="sub">Layer by layer, every cake is decorated to match your theme, and we bring the styling to go with it.</p><a href="#book" className="btn">Plan your event</a></motion.div>
      </div></section>

      <section id="how"><div className="wrap">
        <motion.h2 {...fade}>How booking works.</motion.h2>
        <div className="steps" style={{ marginTop: 40 }}>
          {[["Tell us the date", "Pick your event and guest count."], ["Choose your look", "Cakes, colours and decor."], ["Approve the quote", "A fixed price, no surprises."], ["We deliver and set up", "You enjoy the party."]].map(([t, d], i) => (
            <motion.div key={t} {...fade} transition={{ duration: 0.6, delay: i * 0.1 }}><h3>{t}</h3><p>{d}</p></motion.div>
          ))}
        </div>
      </div></section>

      <section style={{ paddingTop: 0 }}><div className="wrap">
        <motion.p className="quote" {...fade}>"The cake matched the balloon arch down to the shade of pink. Guests thought we had a stylist team of ten."</motion.p>
        <p style={{ marginTop: 16, opacity: .7 }}>Amina K., 30th birthday</p>
      </div></section>

      <section id="book" style={{ paddingTop: 0 }}><div className="wrap">
        <motion.h2 {...fade}>Book your date.</motion.h2>
        <p className="sub">Dates fill quickly. Send the details and get a quote within one day.</p>
        <form className="book" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="Your name" aria-label="Your name" />
          <input type="date" aria-label="Event date" />
          <select aria-label="Event type"><option>Birthday</option><option>Wedding</option><option>Baby shower</option><option>Corporate</option></select>
          <input type="number" placeholder="Guests" aria-label="Number of guests" />
          <button className="btn">Request my quote</button>
        </form>
      </div></section>
      <footer><img src="/brand/logo.png" alt="Samara Cakes" width="150" style={{ display: "block", margin: "0 auto 12px" }} />© 2026 Samara Cakes. Baked and styled with care.</footer>
    </>
  );
}

export default function Page() {
  return <ShopProvider><Landing /><Customizer /><CartDrawer /></ShopProvider>;
}
