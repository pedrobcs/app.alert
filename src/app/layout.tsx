import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Construction Master Web — Calculadora de Obra",
  description:
    "Web-app responsivo com calculadoras de obra (pitch/rise/run/diag, conversões, escadas e mais).",
  keywords:
    "calculadora de construção, pitch, rise, run, diagonal, escadas, conversões, fita métrica, obras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
