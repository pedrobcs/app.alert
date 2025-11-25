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
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/deposits', label: 'Deposits' },
        { href: '/performance', label: 'Performance' },
      ]
    : [];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.25 }}
      className="sticky top-0 z-40 border-b border-white/10 bg-[#050505e6] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.05 }}
                transition={{ duration: 0.8 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6a00] via-[#ff8c2b] to-[#ffaf5a] flex items-center justify-center shadow-[0_12px_35px_rgba(255,122,24,0.45)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                <span className="text-black font-bold text-xl relative z-10">AB</span>
              </motion.div>
              <div>
                <span className="font-semibold text-2xl text-white tracking-wide block">
                  ArbiBot OS
                </span>
                <span className="text-[11px] uppercase tracking-[0.5em] text-white/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Live desk
                </span>
              </div>
            </Link>

            {isConnected && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden md:flex gap-1"
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-all duration-300 relative overflow-hidden"
                    >
                      {pathname === link.href && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ff6a00] to-[#ff9a3c] shadow-[0_10px_30px_rgba(255,122,24,0.45)]"
                          transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
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
            className="flex items-center gap-4"
          >
            {!isConnected && (
              <Link
                href="#features"
                className="hidden sm:inline-flex text-sm tracking-[0.4em] uppercase text-white/60 hover:text-white transition-colors"
              >
                Explore
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
