import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { DisclaimerModal } from "@/components/DisclaimerModal";

export const metadata: Metadata = {
  title: "USDC Investment Platform - Arbitrum Trading Bot",
  description: "Invest USDC on Arbitrum into an automated trading bot. Secure, transparent, and efficient.",
  keywords: ["USDC", "Arbitrum", "Trading Bot", "DeFi", "Investment", "Cryptocurrency"],
  authors: [{ name: "USDC Investment Platform" }],
  openGraph: {
    title: "USDC Investment Platform - Arbitrum Trading Bot",
    description: "Invest USDC on Arbitrum into an automated trading bot",
    type: "website",
  },
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
