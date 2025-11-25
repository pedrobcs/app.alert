'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { useMemo } from 'react';

interface CryptoChartCardProps {
  ticker: 'BTC' | 'ETH' | 'SOL';
  price?: string;
  change?: number;
  data?: Array<{ value: number }>;
}

const CRYPTO_CONFIG = {
  BTC: {
    name: 'Bitcoin',
    color: '#F7931A',
    gradient: ['#F7931A', '#FFA500'],
    icon: '₿',
  },
  ETH: {
    name: 'Ethereum',
    color: '#627EEA',
    gradient: ['#627EEA', '#8A9FF5'],
    icon: 'Ξ',
  },
  SOL: {
    name: 'Solana',
    color: '#14F195',
    gradient: ['#14F195', '#9945FF'],
    icon: '◎',
  },
};

const generateChartData = () => {
  const data = [];
  let value = 50;
  for (let i = 0; i < 24; i++) {
    value += (Math.random() - 0.5) * 10;
    value = Math.max(20, Math.min(80, value));
    data.push({ value, time: i });
  }
  return data;
};

export function CryptoChartCard({
  ticker,
  price = `${Math.floor(Math.random() * 100000)}`,
  change = Math.random() * 20 - 10,
  data,
}: CryptoChartCardProps) {
  const chartData = useMemo(() => data || generateChartData(), [data]);
  const isPositive = change >= 0;
  const config = CRYPTO_CONFIG[ticker];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative group h-full"
    >
      {/* Card */}
      <div className="glass-card rounded-2xl p-6 h-full overflow-hidden">
        {/* Animated Background Glow */}
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${config.color}40 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Crypto Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
                style={{
                  background: `linear-gradient(135deg, ${config.gradient[0]}15, ${config.gradient[1]}15)`,
                  color: config.color,
                  border: `1px solid ${config.color}30`,
                }}
              >
                {config.icon}
              </motion.div>
              <div>
                <h3 className="text-base font-bold text-white">{config.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{ticker}/USDC</p>
              </div>
            </div>

            {/* Change Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl ${
                isPositive 
                  ? 'bg-emerald-500/10 border border-emerald-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
              )}
              <span className={`text-xs font-bold ${
                isPositive ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {isPositive ? '+' : ''}{change.toFixed(2)}%
              </span>
            </motion.div>
          </div>

          {/* Price */}
          <div>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-white"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              ${price}
            </motion.div>
            <div className="flex items-center space-x-1.5 mt-1">
              <Activity className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">Atualizado agora</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-24 -mx-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={config.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={config.color}
                  strokeWidth={2.5}
                  dot={false}
                  fill={`url(#gradient-${ticker})`}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Footer Stats */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Volume 24h</p>
              <p className="text-sm font-bold text-white mt-0.5">
                ${(Math.random() * 1000).toFixed(1)}M
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Market Cap</p>
              <p className="text-sm font-bold text-white mt-0.5">
                ${(Math.random() * 500).toFixed(1)}B
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Glow Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-1 origin-left"
          style={{
            background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}
