'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';

interface TradingViewChartProps {
  symbol: string;
  price: string;
  change24h: number;
  chartData: Array<{ time: string; price: number; volume: number }>;
  color: string;
}

export function TradingViewChart({ symbol, price, change24h, chartData, color }: TradingViewChartProps) {
  const [timeframe, setTimeframe] = useState('1D');
  const isPositive = change24h >= 0;

  const timeframes = ['15m', '1H', '4H', '1D', '1W'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-full rounded-3xl bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-white/10 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-2xl font-bold text-white">{symbol}/USDT</h3>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
              isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10'
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
          </div>
          <div className="flex items-baseline space-x-3">
            <p className="text-3xl font-bold text-white" style={{ fontFeatureSettings: '"tnum"' }}>
              ${price}
            </p>
            <p className="text-sm text-gray-500">Last Price</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-1 bg-black/40 rounded-xl p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-orange text-black'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-gray-400" strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '12px',
              }}
              labelStyle={{ color: '#fff', fontSize: '12px', marginBottom: '4px' }}
              itemStyle={{ color: color, fontSize: '14px', fontWeight: 'bold' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={3}
              fill="url(#priceGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Info Bar */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
        <div>
          <p className="text-xs text-gray-500 mb-1">24h High</p>
          <p className="text-sm font-bold text-emerald-500">${(parseFloat(price) * 1.03).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">24h Low</p>
          <p className="text-sm font-bold text-red-500">${(parseFloat(price) * 0.97).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">24h Volume</p>
          <p className="text-sm font-bold text-white">2.4B</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Market Cap</p>
          <p className="text-sm font-bold text-white">1.87T</p>
        </div>
      </div>
    </motion.div>
  );
}
