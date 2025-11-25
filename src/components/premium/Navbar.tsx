'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']
  );
  
  const borderOpacity = useTransform(
    scrollY,
    [0, 100],
    [0, 0.1]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Investir', href: '/deposit' },
    { label: 'Performance', href: '/performance' },
  ];

  return (
    <>
      <motion.nav
        style={{ backgroundColor }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'backdrop-blur-2xl' : ''
        }`}
      >
        <motion.div
          style={{ 
            borderBottomColor: `rgba(255, 255, 255, ${borderOpacity})` 
          }}
          className="border-b"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative w-10 h-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange to-orange-dark rounded-xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-orange to-orange-dark rounded-xl flex items-center justify-center shadow-orange">
                    <Zap className="w-5 h-5 text-white" strokeWidth={2.5} fill="currentColor" />
                  </div>
                </motion.div>
                <span className="text-xl lg:text-2xl font-semibold text-white tracking-tight">
                  ArbiBot
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                  >
                    <Link
                      href={item.href}
                      className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 group"
                    >
                      <span className="relative z-10">{item.label}</span>
                      <motion.div
                        className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        layoutId="navbar-hover"
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Right Side */}
              <div className="flex items-center space-x-3">
                {/* Connect Button - Desktop */}
                <div className="hidden md:block">
                  <ConnectButton.Custom>
                    {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;

                      return (
                        <div {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none' } })}>
                          {(() => {
                            if (!connected) {
                              return (
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={openConnectModal}
                                  className="btn-primary text-sm px-6 py-2.5"
                                >
                                  Conectar
                                </motion.button>
                              );
                            }

                            return (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={openAccountModal}
                                className="px-4 py-2 glass-card rounded-xl text-sm font-medium text-white"
                              >
                                {account.displayName}
                              </motion.button>
                            );
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-white hover:bg-white/5 rounded-xl transition-colors"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" strokeWidth={1.5} />
                  ) : (
                    <Menu className="w-6 h-6" strokeWidth={1.5} />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 md:hidden"
          style={{ top: '64px' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative glass-card m-4 p-6 rounded-2xl space-y-3"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <div className="pt-3 border-t border-white/10">
              <ConnectButton />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
