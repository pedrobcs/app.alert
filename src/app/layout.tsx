import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt';

export const metadata: Metadata = {
  title: 'ArbiBot - Multi-Chain USDC Investment',
  description: 'Premium automated USDC trading on Arbitrum & Solana. Invest, track, and grow your portfolio with our proven trading bot.',
  keywords: 'USDC, Arbitrum, Solana, DeFi, Trading Bot, Crypto Investment, Multi-Chain',
  applicationName: 'ArbiBot',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ArbiBot',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'ArbiBot',
    title: 'ArbiBot - Multi-Chain USDC Investment',
    description: 'Premium automated USDC trading on Arbitrum & Solana',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArbiBot - Multi-Chain USDC Investment',
    description: 'Premium automated USDC trading on Arbitrum & Solana',
  },
};

export const viewport: Viewport = {
  themeColor: '#007AFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#007AFF" />
        
        {/* iOS Specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ArbiBot" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        
        {/* Splash Screens for iOS */}
        <link rel="apple-touch-startup-image" href="/icon-512.png" />
        
        {/* Microsoft */}
        <meta name="msapplication-TileColor" content="#007AFF" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <DisclaimerModal />
          <PWAInstallPrompt />
          <PWAUpdatePrompt />
        </Providers>
      </body>
    </html>
  );
}
