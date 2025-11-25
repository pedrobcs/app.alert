'use client';

import { motion } from 'framer-motion';
import { Bell, Moon, Sun, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useAccount } from 'wagmi';

export function Topbar() {
  const [isDark, setIsDark] = useState(true);
  const { balance } = useWalletBalance();
  const { address, isConnected } = useAccount();

  const formatBalance = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(value));
  };

  return (
    <div className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8">
      {/* Left - Greeting */}
      <div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mb-1"
        >
          Good Evening, Trader
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500"
        >
          Welcome back to your trading dashboard
        </motion.p>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center space-x-4">
        {/* Total Balance */}
        {isConnected && balance && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange/10 via-black to-black border border-orange/20 px-6 py-3"
          >
            <motion.div
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute top-0 right-0 w-16 h-16 bg-orange/30 rounded-full blur-xl"
            />
            <div className="relative z-10">
              <p className="text-xs text-gray-500 mb-1">Total Balance</p>
              <motion.p
                key={balance.total}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold text-white"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                {formatBalance(balance.total)}
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDark(!isDark)}
          className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
        >
          {isDark ? (
            <Moon className="w-5 h-5 text-gray-400" strokeWidth={2} />
          ) : (
            <Sun className="w-5 h-5 text-orange" strokeWidth={2} />
          )}
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-400" strokeWidth={2} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange rounded-full"></span>
        </motion.button>

        {/* User Menu */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-3 pl-1 pr-4 py-1 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center">
            <User className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold text-white">
              {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect'}
            </p>
            <p className="text-xs text-gray-500">Pro Trader</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" strokeWidth={2} />
        </motion.button>
      </div>
    </div>
  );
}
