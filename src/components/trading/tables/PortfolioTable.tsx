'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface PortfolioAsset {
  symbol: string;
  icon: string;
  name: string;
  amount: string;
  value: string;
  pl: number;
  plAmount: string;
  chartData: Array<{ value: number }>;
  color: string;
}

const mockAssets: PortfolioAsset[] = [
  {
    symbol: 'BTC',
    icon: '₿',
    name: 'Bitcoin',
    amount: '0.5234',
    value: '49,890.50',
    pl: 12.5,
    plAmount: '+5,547.20',
    chartData: Array.from({ length: 10 }, (_, i) => ({ value: 50 + Math.sin(i) * 10 + Math.random() * 5 })),
    color: '#F7931A',
  },
  {
    symbol: 'ETH',
    icon: 'Ξ',
    name: 'Ethereum',
    amount: '2.8901',
    value: '9,379.44',
    pl: -3.2,
    plAmount: '-311.15',
    chartData: Array.from({ length: 10 }, (_, i) => ({ value: 45 - Math.sin(i) * 8 + Math.random() * 5 })),
    color: '#627EEA',
  },
  {
    symbol: 'SOL',
    icon: '◎',
    name: 'Solana',
    amount: '45.231',
    value: '6,437.01',
    pl: 8.7,
    plAmount: '+515.83',
    chartData: Array.from({ length: 10 }, (_, i) => ({ value: 55 + Math.cos(i) * 12 + Math.random() * 5 })),
    color: '#14F195',
  },
];

export function PortfolioTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Portfolio Holdings</h3>
            <p className="text-sm text-gray-500">Your current positions</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-colors"
          >
            Manage
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                P/L
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Chart
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {mockAssets.map((asset, index) => {
              const isPositive = asset.pl >= 0;

              return (
                <motion.tr
                  key={asset.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                  className="border-b border-white/5 last:border-0 transition-colors"
                >
                  {/* Asset */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{
                          background: `${asset.color}15`,
                          border: `1px solid ${asset.color}30`,
                          color: asset.color,
                        }}
                      >
                        {asset.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{asset.symbol}</p>
                        <p className="text-xs text-gray-500">{asset.name}</p>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-white" style={{ fontFeatureSettings: '"tnum"' }}>
                      {asset.amount}
                    </p>
                  </td>

                  {/* Value */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-white" style={{ fontFeatureSettings: '"tnum"' }}>
                      ${asset.value}
                    </p>
                  </td>

                  {/* P/L */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1">
                        {isPositive ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-red-500" strokeWidth={2} />
                        )}
                        <span className={`text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isPositive ? '+' : ''}{asset.pl.toFixed(1)}%
                        </span>
                      </div>
                      <span className={`text-xs ${isPositive ? 'text-emerald-500/60' : 'text-red-500/60'}`}>
                        {asset.plAmount}
                      </span>
                    </div>
                  </td>

                  {/* Chart */}
                  <td className="px-6 py-4">
                    <div className="w-24 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={asset.chartData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={asset.color}
                            strokeWidth={1.5}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" strokeWidth={2} />
                    </motion.button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
