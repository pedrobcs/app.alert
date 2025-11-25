'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  icon: string;
  apy: number;
  dailyPL: number;
  dailyPLAmount: string;
  balance: string;
  balanceUSD: string;
  startDate: string;
  liquidity: string;
  status: 'active' | 'staking' | 'locked';
}

const mockAssets: Asset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '₿',
    apy: 8.5,
    dailyPL: 3.2,
    dailyPLAmount: '+$1,547.20',
    balance: '0.5234',
    balanceUSD: '$49,890.50',
    startDate: '2024-01-15',
    liquidity: 'High',
    status: 'active',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'Ξ',
    apy: 5.2,
    dailyPL: -1.5,
    dailyPLAmount: '-$145.30',
    balance: '2.8901',
    balanceUSD: '$9,379.44',
    startDate: '2024-02-01',
    liquidity: 'High',
    status: 'staking',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    icon: '◎',
    apy: 12.8,
    dailyPL: 5.7,
    dailyPLAmount: '+$366.71',
    balance: '45.231',
    balanceUSD: '$6,437.01',
    startDate: '2024-03-10',
    liquidity: 'Medium',
    status: 'active',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💵',
    apy: 4.5,
    dailyPL: 0.0,
    dailyPLAmount: '$0.00',
    balance: '8,500.00',
    balanceUSD: '$8,500.00',
    startDate: '2024-01-01',
    liquidity: 'Very High',
    status: 'locked',
  },
];

const statusColors = {
  active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  staking: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  locked: 'bg-orange/10 text-orange border-orange/20',
};

export function CryptoAssetsTable() {
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
            <h3 className="text-lg font-bold text-white mb-1">Your Assets</h3>
            <p className="text-sm text-gray-500">Active positions and holdings</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-colors"
          >
            Add Asset
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
                APY
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Daily P/L
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Liquidity
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mockAssets.map((asset, index) => {
              const isPositivePL = asset.dailyPL >= 0;

              return (
                <motion.tr
                  key={asset.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                  className="border-b border-white/5 last:border-0 transition-colors group"
                >
                  {/* Asset */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                        {asset.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{asset.symbol}</p>
                        <p className="text-xs text-gray-500">{asset.name}</p>
                      </div>
                    </div>
                  </td>

                  {/* APY */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-emerald-500" strokeWidth={2} />
                      <span className="text-sm font-semibold text-emerald-500">{asset.apy}%</span>
                    </div>
                  </td>

                  {/* Daily P/L */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1">
                        {isPositivePL ? (
                          <TrendingUp className="w-3 h-3 text-emerald-500" strokeWidth={2} />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" strokeWidth={2} />
                        )}
                        <span className={`text-sm font-bold ${isPositivePL ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isPositivePL ? '+' : ''}{asset.dailyPL}%
                        </span>
                      </div>
                      <span className={`text-xs ${isPositivePL ? 'text-emerald-500/60' : 'text-red-500/60'}`}>
                        {asset.dailyPLAmount}
                      </span>
                    </div>
                  </td>

                  {/* Balance */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white" style={{ fontFeatureSettings: '"tnum"' }}>
                        {asset.balance}
                      </span>
                      <span className="text-xs text-gray-500">{asset.balanceUSD}</span>
                    </div>
                  </td>

                  {/* Start Date */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{asset.startDate}</span>
                  </td>

                  {/* Liquidity */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-white font-medium">{asset.liquidity}</span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-lg border ${statusColors[asset.status]}`}>
                      {asset.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
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
