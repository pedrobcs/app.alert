import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { DisclaimerModal } from "@/components/DisclaimerModal";

export const metadata: Metadata = {
  title: "FuturesPilot — Crypto Futures Research Copilot",
  description: "FuturesPilot gives discretionary crypto futures teams a workflow OS for research, funding analytics, and execution guardrails without moving capital.",
  keywords: "crypto futures, perpetual swaps, trading desk software, funding analytics, research copilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
          <DisclaimerModal />
        </Providers>
      </body>
    </html>
  );
}
