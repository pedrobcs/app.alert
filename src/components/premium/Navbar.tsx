'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, Wallet } from 'lucide-react';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Investimentos', href: '/deposits' },
    { label: 'Performance', href: '/performance' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Glass Background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border-b border-white/10" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-orange blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
              <Wallet className="w-8 h-8 text-orange relative z-10" strokeWidth={1.5} />
            </motion.div>
            <span className="text-xl font-semibold text-white tracking-tight">
              ArbiBot<span className="text-orange">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Connect Button */}
          <div className="hidden md:block">
            <ConnectButton.Custom>
              {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={openConnectModal}
                            className="px-6 py-2.5 bg-orange hover:bg-orange-light text-white text-sm font-medium rounded-full transition-all duration-200 shadow-orange"
                          >
                            Conectar
                          </motion.button>
                        );
                      }

                      return (
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={openAccountModal}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-full transition-all duration-200 border border-white/10"
                          >
                            {account.displayName}
                          </motion.button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-3"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-gray-300 hover:text-white transition-colors py-2"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10">
              <ConnectButton />
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
