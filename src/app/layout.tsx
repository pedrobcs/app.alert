import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { DisclaimerModal } from "@/components/DisclaimerModal";

export const metadata: Metadata = {
  title: "IntentAssist — Intent to Depart helper",
  description: "A simple helper page to collect required information for submitting an Intent to Depart, including a clear selfie.",
  keywords: "intent to depart, CBP Home, selfie, departure, form",
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
