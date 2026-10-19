import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
const display = Fraunces({ subsets: ["latin"], variable: "--f-display", axes: ["SOFT", "opsz"] });
const body = Manrope({ subsets: ["latin"], variable: "--f-body" });
export const metadata = { title: "Samara Cakes | Cakes, desserts & event styling", description: "Custom celebration cakes, dessert tables and event decor." };
export default function RootLayout({ children }) {
  return <html lang="en" className={`${display.variable} ${body.variable}`}><body>{children}</body></html>;
}
