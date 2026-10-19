"use client";
import { useEffect, useRef, useState } from "react";
// Shows the real file when it exists, otherwise the fallback illustration.
export function Img({ src, alt = "", fallback }) {
  const [ok, setOk] = useState(!!src); const r = useRef(null);
  useEffect(() => { const el = r.current; if (el?.complete && el.naturalWidth === 0) setOk(false); }, []);
  return ok ? <img ref={r} src={src} alt={alt} loading="lazy" onError={() => setOk(false)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : fallback;
}
export function Vid({ src, poster, fallback }) {
  const [ok, setOk] = useState(true); const r = useRef(null);
  useEffect(() => { if (r.current?.error) setOk(false); }, []);
  return ok ? <video ref={r} src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" onError={() => setOk(false)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : fallback;
}
