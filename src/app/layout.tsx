import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt';

export const metadata: Metadata = {
  title: 'ArbiBot - Investimentos Inteligentes',
  description: 'Plataforma premium de investimentos em criptomoedas com IA. Multi-chain support (Arbitrum + Solana). Design Apple-inspired.',
  keywords: 'USDC, Arbitrum, Solana, DeFi, Trading Bot, Crypto Investment, Multi-Chain, IA, PWA',
  applicationName: 'ArbiBot',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
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
    title: 'ArbiBot - Investimentos Inteligentes',
    description: 'Plataforma premium de investimentos com IA e multi-chain',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArbiBot - Investimentos Inteligentes',
    description: 'Plataforma premium com IA e multi-chain',
  },
};

export const viewport: Viewport = {
  themeColor: '#E35404',
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
    <html lang="pt-BR">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E35404" />
        
        {/* iOS Specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ArbiBot" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        
        {/* Splash Screens for iOS */}
        <link rel="apple-touch-startup-image" href="/icon-512.png" />
        
        {/* Microsoft */}
        <meta name="msapplication-TileColor" content="#E35404" />
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
