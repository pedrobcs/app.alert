'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ProfessionalChartProps {
  symbol: string;
  name: string;
  price: string;
  change24h: number;
  icon: string;
  color: string;
  gradient: [string, string];
  chartData: Array<{ time: string; value: number }>;
}

export function ProfessionalChart({
  symbol,
  name,
  price,
  change24h,
  icon,
  color,
  gradient,
  chartData,
}: ProfessionalChartProps) {
  const isPositive = change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-6 group"
    >
      {/* Animated Glow */}
      <motion.div
        animate={{
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${color}60 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{
                background: `linear-gradient(135deg, ${gradient[0]}20, ${gradient[1]}20)`,
                border: `1px solid ${color}30`,
                color: color,
              }}
            >
              {icon}
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white">{name}</h3>
              <p className="text-xs text-gray-500">{symbol}/USD</p>
            </div>
          </div>

          {/* Live Indicator */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-bold text-emerald-500">LIVE</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-2">
          <motion.div
            key={price}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            ${price}
          </motion.div>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
              isPositive 
                ? 'bg-emerald-500/10 border border-emerald-500/20' 
                : 'bg-red-500/10 border border-red-500/20'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
              )}
              <span className={`text-sm font-bold ${
                isPositive ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {isPositive ? '+' : ''}{change24h.toFixed(2)}%
              </span>
            </div>
            <span className="text-xs text-gray-500">24h</span>
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-48 mt-4 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="rgba(255,255,255,0.1)"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.1)"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                }}
                labelStyle={{ color: '#fff', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                fill={`url(#gradient-${symbol})`}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Indicators (Placeholder) */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">RSI</span>
            <span className="text-xs font-bold text-white ml-auto">68.4</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">MACD</span>
            <span className="text-xs font-bold text-emerald-500 ml-auto">+0.42</span>
          </div>
        </div>
      </div>

      {/* Bottom Glow on Hover */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
    </motion.div>
  );
}
