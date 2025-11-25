'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, BarChart, ComposedChart } from 'recharts';

const generateChartData = (points: number = 50) => {
  const data = [];
  let value = 50000;
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.48) * 2000;
    data.push({
      time: `${i}:00`,
      value: value,
      volume: Math.random() * 1000000000,
    });
  }
  return data;
};

const periods = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
const assets = [
  { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { symbol: 'SOL', name: 'Solana', color: '#14F195' },
];

export function ProfessionalChart() {
  const [selectedPeriod, setSelectedPeriod] = useState('1W');
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [chartData] = useState(generateChartData(50));

  const currentPrice = chartData[chartData.length - 1].value;
  const previousPrice = chartData[0].value;
  const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
  const isPositive = priceChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        {/* Asset Selector */}
        <div className="flex items-center space-x-2">
          {assets.map((asset) => (
            <motion.button
              key={asset.symbol}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedAsset(asset)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                selectedAsset.symbol === asset.symbol
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-white/5 text-gray-400 border border-transparent hover:border-white/10'
              }`}
            >
              {asset.symbol}
            </motion.button>
          ))}
        </div>

        {/* Period Selector */}
        <div className="flex items-center space-x-1 p-1 bg-white/5 rounded-xl border border-white/10">
          {periods.map((period) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                selectedPeriod === period
                  ? 'bg-orange text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {period}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Info */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-2">
          <motion.h2
            key={currentPrice}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold text-white"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            ${currentPrice.toFixed(2)}
          </motion.h2>
          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl ${
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
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500">{selectedAsset.name} • {selectedPeriod}</p>
      </div>

      {/* Main Chart */}
      <div className="relative h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${selectedAsset.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={selectedAsset.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={selectedAsset.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 1000', 'dataMax + 1000']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '12px',
              }}
              labelStyle={{ color: '#fff', fontSize: '12px', marginBottom: '4px' }}
              itemStyle={{ color: selectedAsset.color, fontSize: '14px', fontWeight: 'bold' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={selectedAsset.color}
              strokeWidth={2.5}
              fill={`url(#gradient-${selectedAsset.symbol})`}
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div className="relative h-16 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <Bar dataKey="volume" fill={selectedAsset.color} opacity={0.3} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Indicators */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-gray-500" strokeWidth={2} />
            <span className="text-xs text-gray-500 font-medium">RSI (14)</span>
          </div>
          <span className="text-sm font-bold text-white">68.4</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-gray-500" strokeWidth={2} />
            <span className="text-xs text-gray-500 font-medium">MACD</span>
          </div>
          <span className="text-sm font-bold text-emerald-500">+0.42</span>
        </div>
      </div>
    </motion.div>
  );
}
