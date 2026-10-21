// Set these in .env (see .env.example). NEXT_PUBLIC_ values are shown on the site, so they must not be secrets.
export const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""); // country code + number, digits only
export const MPESA_TILL = process.env.NEXT_PUBLIC_MPESA_TILL || "";
export const CURRENCY = "KES";
export const CAKES = [
  { name: "Raspberry Rose", desc: "Vanilla sponge, rose cream", base: 4500, bg: "#ffd9e2", imageUrl: "/media/cake-1.jpg" },
  { name: "Pistachio Cloud", desc: "Pistachio, white chocolate", base: 5500, bg: "#cfe6bf", imageUrl: "/media/cake-2.jpg" },
  { name: "Golden Hour", desc: "Salted caramel, brown butter", base: 5000, bg: "#f7e1c0", imageUrl: "/media/cake-3.jpg" },
];
export const SIZES = [
  { label: '6" (serves 8)', add: 0 }, { label: '8" (serves 14)', add: 1500 },
  { label: '10" (serves 22)', add: 3500 }, { label: "2 tiers (serves 35)", add: 7000 },
];
export const FLAVOURS = [
  { label: "Vanilla", add: 0 }, { label: "Chocolate", add: 0 }, { label: "Red velvet", add: 500 },
  { label: "Pistachio", add: 800 }, { label: "Salted caramel", add: 600 },
];
export const COLOURS = [
  ["Blush", "#ffb3c7"], ["Pistachio", "#cfe6bf"], ["Butter", "#f7e1c0"],
  ["Lilac", "#d9ccff"], ["Ivory", "#ffffff"], ["Berry", "#c10373"],
];
