import { Bebas_Neue, Manrope, Inter } from "next/font/google";

export const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-nav",
});
