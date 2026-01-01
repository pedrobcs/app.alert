import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "IntentAssist — Ajuda para Intenção de Partida",
  description: "Uma página simples para reunir as informações necessárias para enviar uma Intenção de Partida, incluindo uma selfie nítida.",
  keywords: "intenção de partida, CBP Home, selfie, formulário, saída voluntária",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
