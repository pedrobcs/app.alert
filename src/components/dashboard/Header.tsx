'use client';

import { motion } from 'framer-motion';
import { Search, Bell, User, Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';

export function Header() {
  const { address, isConnected } = useAccount();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-20 border-b border-white/5 bg-black/60 backdrop-blur-xl flex items-center justify-between px-8"
    >
      {/* Left - Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search assets, transactions..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange/30 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Right - User Actions */}
      <div className="flex items-center space-x-3">
        {/* Wallet Address */}
        {isConnected && address && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10"
          >
            <Wallet className="w-4 h-4 text-orange" strokeWidth={2} />
            <span className="text-sm font-mono font-semibold text-white">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </motion.div>
        )}

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors group"
        >
          <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" strokeWidth={2} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange rounded-full"></span>
        </motion.button>

        {/* User Avatar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center shadow-lg shadow-orange/20"
        >
          <User className="w-5 h-5 text-white" strokeWidth={2} />
        </motion.button>
      </div>
    </motion.header>
  );
}
