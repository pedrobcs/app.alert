'use client';

import { motion } from 'framer-motion';
import { Search, Bell, User, Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';

export function InstitutionalHeader() {
  const { address, isConnected } = useAccount();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 border-b border-white/[0.08] bg-black/50 backdrop-blur-xl flex items-center justify-between px-6"
    >
      {/* Left - Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search assets, markets, insights..."
            className="w-full h-10 pl-10 pr-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange/30 transition-colors"
          />
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center space-x-3">
        {/* Wallet Address */}
        {isConnected && address && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-2 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl"
          >
            <Wallet className="w-4 h-4 text-orange" strokeWidth={2} />
            <span className="text-sm font-mono text-white">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </motion.div>
        )}

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl flex items-center justify-center transition-colors"
        >
          <Bell className="w-4 h-4 text-gray-400" strokeWidth={2} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange rounded-full"></span>
        </motion.button>

        {/* User Avatar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-gradient-to-br from-orange/20 to-orange-dark/20 border border-orange/20 rounded-xl flex items-center justify-center"
        >
          <User className="w-4 h-4 text-orange" strokeWidth={2} />
        </motion.button>
      </div>
    </motion.header>
  );
}
