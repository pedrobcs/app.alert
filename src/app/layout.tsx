import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { DisclaimerModal } from "@/components/DisclaimerModal";

export const metadata: Metadata = {
  title: "ArbiBot Invest - Automated USDC Trading on Arbitrum",
  description: "Invest USDC into an automated BTC trading bot on Arbitrum. Secure, transparent, and profitable.",
  keywords: "USDC, Arbitrum, DeFi, Trading Bot, Crypto Investment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <Providers>
          {children}
          <DisclaimerModal />
        </Providers>
      </body>
    </html>
  );
}
