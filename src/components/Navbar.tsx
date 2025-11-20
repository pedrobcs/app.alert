'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { isConnected } = useAccount();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AB</span>
              </div>
              <span className="font-bold text-xl text-gray-900">ArbiBot</span>
            </Link>

            {isConnected && (
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/dashboard'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/deposits"
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/deposits'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Deposits
                </Link>
                <Link
                  href="/performance"
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/performance'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Performance
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!isConnected && (
              <Link
                href="#features"
                className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
            )}
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </div>
    </nav>
  );
}
