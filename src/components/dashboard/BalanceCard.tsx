'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus, RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface BalanceCardProps {
  balance: string;
  change24h: number;
  sparklineData?: Array<{ value: number }>;
}

export function BalanceCard({ balance, change24h, sparklineData = [] }: BalanceCardProps) {
  const isPositive = change24h >= 0;

  // Generate sparkline data if not provided
  const data = sparklineData.length > 0 ? sparklineData : 
    Array.from({ length: 24 }, (_, i) => ({
      value: 50 + Math.sin(i / 3) * 10 + (Math.random() - 0.5) * 3
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-8"
    >
      {/* Animated Background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-80 h-80 bg-orange rounded-full blur-3xl"
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-2 font-medium">Total Balance</p>
            <motion.h1
              key={balance}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.3 }}
              className="text-5xl font-bold text-white"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              ${balance}
            </motion.h1>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange to-orange-light hover:shadow-lg hover:shadow-orange/30 text-white font-bold text-sm flex items-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span>Add Funds</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-400" strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        {/* 24h Change */}
        <div className="flex items-center space-x-4 mb-6">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl ${
            isPositive 
              ? 'bg-emerald-500/10 border border-emerald-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" strokeWidth={2.5} />
            )}
            <span className={`text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{change24h.toFixed(2)}%
            </span>
          </div>
          <span className="text-sm text-gray-500">Last 24 hours</span>
        </div>

        {/* Sparkline */}
        <div className="relative h-20">
          <div className="absolute inset-0 bg-gradient-to-t from-orange/5 to-transparent rounded-xl" />
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#E35404"
                strokeWidth={2}
                dot={false}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Update Time */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <span>Updated in real-time</span>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-500">Live</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
