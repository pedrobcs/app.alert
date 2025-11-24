'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useHaptics } from '@/lib/haptics';

export function Navbar() {
  const { isConnected } = useAccount();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const haptics = useHaptics();

  const navLinks = isConnected
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/deposits', label: 'Deposits' },
        { href: '/performance', label: 'Performance' },
      ]
    : [];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    haptics.impact('light', e.currentTarget);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg safe-top"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-6 md:space-x-8">
              <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  <span className="text-white font-bold text-lg md:text-xl relative z-10">AB</span>
                </motion.div>
                <div className="hidden sm:block">
                  <span className="font-bold text-xl md:text-2xl text-gradient block">
                    ArbiBot
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Multi-Chain Trading
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
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
                        onClick={handleLinkClick}
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

            {/* Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-3 md:space-x-4"
            >
              {!isConnected && (
                <Link
                  href="#features"
                  className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Features
                </Link>
              )}
              
              {/* Connect Button */}
              <div className="connect-button-wrapper hidden sm:block">
                <ConnectButton showBalance={false} />
              </div>

              {/* Mobile Connect Button (Simplified) */}
              <div className="connect-button-wrapper sm:hidden">
                <ConnectButton 
                  showBalance={false}
                  accountStatus="avatar"
                  chainStatus="none"
                />
              </div>

              {/* Mobile Menu Button */}
              {isConnected && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMobileMenuOpen(!mobileMenuOpen);
                    haptics.impact('light');
                  }}
                  className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && isConnected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                        pathname === link.href
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
