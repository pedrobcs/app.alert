'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface CryptoChartCardProps {
  ticker: 'BTC' | 'ETH' | 'SOL';
  price?: string;
  change?: number;
  data?: Array<{ value: number }>;
}

const CRYPTO_COLORS = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#14F195',
};

const CRYPTO_NAMES = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
};

// Generate sample data for chart
const generateChartData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    value: 50 + Math.random() * 50,
  }));
};

export function CryptoChartCard({
  ticker,
  price = `{PRICE_${ticker}}`,
  change = Math.random() * 20 - 10,
  data = generateChartData(),
}: CryptoChartCardProps) {
  const isPositive = change >= 0;
  const color = CRYPTO_COLORS[ticker];
  const name = CRYPTO_NAMES[ticker];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      {/* Glass Card */}
      <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 overflow-hidden">
        {/* Glow Effect on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-orange/10 via-transparent to-transparent"
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* Crypto Icon */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: `${color}15`, color }}
              >
                {ticker}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{name}</h3>
                <p className="text-xs text-gray-500">{ticker}/USDC</p>
              </div>
            </div>

            {/* Change Badge */}
            <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg ${
              isPositive ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              )}
              <span className={`text-xs font-bold ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {isPositive ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="text-2xl font-bold text-white">
              ${price}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Atualizado agora
            </div>
          </div>

          {/* Mini Chart */}
          <div className="h-20 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <defs>
                  <linearGradient id={`gradient-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  fill={`url(#gradient-${ticker})`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-gray-500">24h Volume</span>
            <span className="text-white font-semibold">
              ${(Math.random() * 1000).toFixed(1)}M
            </span>
          </div>
        </div>

        {/* Hover Glow Line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${color}, transparent)` 
          }}
        />
      </div>
    </motion.div>
  );
}
