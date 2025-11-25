'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Plus, Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface BalanceSummaryCardProps {
  balance: string;
  change24h: number;
  changeAmount: string;
}

export function BalanceSummaryCard({ balance, change24h, changeAmount }: BalanceSummaryCardProps) {
  const isPositive = change24h >= 0;

  // Generate micro chart data
  const microChartData = Array.from({ length: 24 }, (_, i) => ({
    value: 50 + Math.sin(i / 3) * 10 + (Math.random() - 0.5) * 5
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/[0.08] p-6"
    >
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Balance</p>
            <motion.h2
              key={balance}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold text-white"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              ${balance}
            </motion.h2>
          </div>

          {/* Add Funds Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-orange hover:bg-orange-light rounded-xl text-sm font-semibold text-white transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Add Funds</span>
          </motion.button>
        </div>

        {/* Change Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg ${
            isPositive ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <TrendingUp className={`w-3.5 h-3.5 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`} strokeWidth={2.5} />
            <span className={`text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{change24h.toFixed(2)}%
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {isPositive ? '+' : ''}{changeAmount} (24h)
          </span>
        </div>

        {/* Micro Chart */}
        <div className="relative h-16 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={microChartData}>
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

        {/* Real-time Update Indicator */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.05]">
          <div className="flex items-center space-x-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-xs text-gray-500">Live updates enabled</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Activity className="w-3 h-3 text-gray-600" strokeWidth={2} />
            <span className="text-xs text-gray-600">Updated just now</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
