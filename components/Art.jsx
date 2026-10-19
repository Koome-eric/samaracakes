const P = ["#c10373", "#ffb3c7", "#cfe6bf", "#f7e1c0", "#d9ccff"];
const S = { className: "art", viewBox: "0 0 400 300", preserveAspectRatio: "xMidYMid slice", "aria-hidden": true };
export function Balloons() {
  const n = 13;
  return (<svg {...S}><rect width="400" height="300" fill="#ffe9ee" />
    {[...Array(n)].map((_, i) => { const t = Math.PI * (i / (n - 1)), x = 200 - 170 * Math.cos(t), y = 270 - 210 * Math.sin(t), r = 24 + (i % 3) * 6;
      return <g key={i} className="bob" style={{ animationDelay: `${i * 0.25}s` }}><ellipse cx={x} cy={y} rx={r} ry={r * 1.15} fill={P[i % 5]} stroke="#3a0820" strokeWidth="2.5" /><ellipse cx={x - r / 3} cy={y - r / 2} rx={r / 5} ry={r / 3} fill="#fff" opacity=".6" /></g>; })}</svg>);
}
const Fl = ({ x, y, r, c }) => (<g className="bob">{[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cx={x} cy={y - r * 0.55} rx={r * 0.38} ry={r * 0.55} fill={c} stroke="#3a0820" strokeWidth="2" transform={`rotate(${a} ${x} ${y})`} />)}<circle cx={x} cy={y} r={r * 0.28} fill="#f7e1c0" stroke="#3a0820" strokeWidth="2" /></g>);
export function Flowers({ bg = "#e4f2d8" }) {
  const f = [[60, 70, 34, "#ffb3c7"], [160, 50, 40, "#fff"], [270, 80, 36, "#d9ccff"], [350, 50, 30, "#ffb3c7"], [100, 170, 40, "#c10373"], [210, 160, 34, "#f7e1c0"], [320, 175, 42, "#ffb3c7"], [50, 260, 32, "#fff"], [160, 265, 38, "#d9ccff"], [275, 260, 34, "#c10373"], [360, 270, 30, "#fff"]];
  return <svg {...S}><rect width="400" height="300" fill={bg} />{f.map(([x, y, r, c], i) => <Fl key={i} x={x} y={y} r={r} c={c} />)}</svg>;
}
export function Cupcakes() {
  return (<svg {...S}><rect width="400" height="300" fill="#fff3c9" /><rect y="240" width="400" height="60" fill="#c10373" />
    {[[90, "#ffb3c7"], [200, "#cfe6bf"], [310, "#d9ccff"]].map(([x, c], i) => (
      <g key={i} className="bob" style={{ animationDelay: `${i * 0.4}s` }}>
        <path d={`M${x - 40} 170 L${x + 40} 170 L${x + 30} 240 L${x - 30} 240Z`} fill="#fff" stroke="#3a0820" strokeWidth="3" />
        <path d={`M${x - 48} 172 q10-60 48-60 q38 0 48 60Z`} fill={c} stroke="#3a0820" strokeWidth="3" />
        <circle cx={x} cy="100" r="9" fill="#c10373" stroke="#3a0820" strokeWidth="3" /></g>))}</svg>);
}
export function Neon() {
  return (<svg {...S}><rect width="400" height="300" fill="#2a0516" /><g className="glow"><text x="200" y="165" textAnchor="middle" fontSize="62" style={{ fontFamily: "var(--f-display), serif" }} fill="none" stroke="#ff6fa5" strokeWidth="3">Let’s party</text></g></svg>);
}
export function CakeArt({ i = 0 }) {
  const d = ["#c10373", "#6fae4f", "#e8a400"][i % 3];
  return (<svg className="art" viewBox="0 0 200 180" preserveAspectRatio="xMidYMid slice" aria-hidden><ellipse cx="100" cy="166" rx="82" ry="8" fill="#3a082022" />
    <rect x="30" y="98" width="140" height="64" rx="14" fill="#fff" stroke="#3a0820" strokeWidth="3" />
    <rect x="52" y="52" width="96" height="52" rx="12" fill="#fff" stroke="#3a0820" strokeWidth="3" />
    <path d="M30 112 q0 18 10 18 t10-18 q0 26 10 26 t10-26 q0 16 10 16 t10-16 q0 24 10 24 t10-24 q0 14 10 14 t10-14 q0 20 10 20 t10-20" fill={d} stroke="#3a0820" strokeWidth="2.5" />
    <g className="bob"><circle cx="100" cy="40" r="11" fill={d} stroke="#3a0820" strokeWidth="3" /><path d="M100 29 q8-14 18-12" fill="none" stroke="#3a0820" strokeWidth="3" /></g>
    {[[70, 74], [92, 66], [118, 78], [135, 70], [80, 88]].map(([x, y], k) => <rect key={k} x={x} y={y} width="4" height="10" rx="2" fill={P[k]} transform={`rotate(${k * 40} ${x} ${y})`} />)}</svg>);
}
