import type { Metadata } from "next";
import { bebasNeue, manrope, inter } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Airon Torres — Front-end Developer Portfolio",
  description:
    "Front-end developer based in Sydney with a Mechanical Engineering background. Passionate about accessibility, React, and building great user experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${bebasNeue.variable} ${manrope.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-neutral-black text-neutral-white font-body antialiased">
        {children}
      </body>
    </html>
  );
}
