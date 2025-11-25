'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface TotalBalanceCardProps {
  balance: string;
  change: number;
  chartData?: Array<{ value: number }>;
}

export function TotalBalanceCard({ balance, change, chartData = [] }: TotalBalanceCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isPositive = change >= 0;

  // Generate sparkline data if not provided
  const sparklineData = chartData.length > 0 ? chartData : 
    Array.from({ length: 20 }, (_, i) => ({
      value: 50 + Math.sin(i / 3) * 10 + (Math.random() - 0.5) * 5
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-8 lg:p-10"
    >
      {/* Animated Background Gradient */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange via-orange-light to-transparent rounded-full blur-3xl"
      />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1 font-medium">Total Portfolio Value</p>
            <div className="flex items-center space-x-3">
              <motion.h1
                key={balance}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 0.3 }}
                className={`text-5xl lg:text-6xl font-bold ${isVisible ? 'text-white' : 'text-gray-800'}`}
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                {isVisible ? `$${balance}` : '••••••'}
              </motion.h1>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsVisible(!isVisible)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
              >
                {isVisible ? (
                  <Eye className="w-4 h-4 text-gray-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </motion.button>
            </div>
          </div>

          {/* 24h Change Badge */}
          <div className={`px-4 py-2 rounded-2xl ${
            isPositive 
              ? 'bg-emerald-500/10 border border-emerald-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <div className="flex items-center space-x-2">
              {isPositive ? (
                <TrendingUp className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" strokeWidth={2.5} />
              )}
              <span className={`text-lg font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 text-center mt-1">24h</p>
          </div>
        </div>

        {/* Sparkline Chart */}
        <div className="relative h-24 mt-8">
          <div className="absolute inset-0 bg-gradient-to-t from-orange/10 to-transparent rounded-2xl" />
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#E35404"
                strokeWidth={2.5}
                dot={false}
                animationDuration={2000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5">
          <div>
            <p className="text-xs text-gray-500 mb-1">Daily P/L</p>
            <p className="text-lg font-bold text-emerald-500">+$1,234.56</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Open Positions</p>
            <p className="text-lg font-bold text-white">12</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Win Rate</p>
            <p className="text-lg font-bold text-orange">87.5%</p>
          </div>
        </div>
      </div>

      {/* Glow Effect on Hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-orange/5 to-transparent rounded-3xl opacity-0 pointer-events-none"
      />
    </motion.div>
  );
}
