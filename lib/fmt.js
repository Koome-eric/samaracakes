export const fmt = (n) => `KES ${Number(n || 0).toLocaleString("en-KE")}`;
export const dt = (d) => new Date(d).toLocaleString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
