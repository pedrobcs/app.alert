'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function Navbar() {
  const { isConnected } = useAccount();
  const pathname = usePathname();

  const navLinks = isConnected
    ? [
        { href: '/dashboard', label: 'Workspace' },
        { href: '/strategies', label: 'Playbooks' },
        { href: '/intelligence', label: 'Intelligence' },
      ]
    : [];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                <span className="text-white font-bold text-xl relative z-10">FP</span>
              </motion.div>
              <div>
                <span className="font-bold text-2xl text-gradient block">
                  FuturesPilot
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Futures Copilot
                </span>
              </div>
            </Link>

            {isConnected && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden md:flex space-x-1"
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${
                        pathname === link.href
                          ? 'text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {pathname === link.href && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                      
                      {pathname !== link.href && (
                        <div className="absolute inset-0 bg-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-4"
          >
            {!isConnected && (
              <Link
                href="#capabilities"
                className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Capabilities
              </Link>
            )}
            <div className="connect-button-wrapper">
              <ConnectButton showBalance={false} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
