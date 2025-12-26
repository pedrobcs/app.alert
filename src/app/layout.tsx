import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Construction Calculator — Web App',
  description:
    'A responsive construction calculator web-app with pitch, rise/run, diagonal, conversions, stairs, and more.',
  keywords:
    'construction calculator, pitch, rise, run, diagonal, conversions, stairs, fractions, i18n',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
