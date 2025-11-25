'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Info, Zap } from 'lucide-react';
import { useState } from 'react';

const tokens = [
  { symbol: 'USDC', name: 'USD Coin', icon: '💵', balance: '8,500.00' },
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿', balance: '0.5234' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', balance: '2.8901' },
  { symbol: 'SOL', name: 'Solana', icon: '◎', balance: '45.231' },
];

export function SwapWidget() {
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState('1000');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Swap</h3>
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-orange" strokeWidth={2} />
          <span className="text-xs text-orange font-semibold">Best Price</span>
        </div>
      </div>

      {/* You Pay */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">You Pay</span>
          <span className="text-xs text-gray-500">Balance: {fromToken.balance}</span>
        </div>
        <div className="relative rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 bg-transparent text-2xl font-bold text-white outline-none"
              placeholder="0.00"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <span className="text-xl">{fromToken.icon}</span>
              <span className="text-sm font-bold text-white">{fromToken.symbol}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-orange/20 border border-white/10 hover:border-orange/30 flex items-center justify-center transition-all"
        >
          <ArrowDown className="w-5 h-5 text-white" strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* You Get */}
      <div className="mt-2 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">You Get</span>
          <span className="text-xs text-gray-500">Balance: {toToken.balance}</span>
        </div>
        <div className="relative rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">0.0105</div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <span className="text-xl">{toToken.icon}</span>
              <span className="text-sm font-bold text-white">{toToken.symbol}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Info Row */}
      <div className="space-y-2 mb-6 p-4 rounded-xl bg-white/5 border border-white/5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Rate</span>
          <span className="text-white font-semibold">1 USDC = 0.0000105 BTC</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <span className="text-gray-500">Liquidity Source</span>
            <Info className="w-3 h-3 text-gray-600" />
          </div>
          <span className="text-white font-semibold">Uniswap V3</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Network Fee</span>
          <span className="text-emerald-500 font-semibold">~$0.50</span>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange to-orange-light hover:shadow-lg hover:shadow-orange/30 text-white font-bold text-base transition-all"
      >
        Review Order
      </motion.button>
    </motion.div>
  );
}
