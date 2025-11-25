'use client';

import { TradingLayout } from '@/components/trading/TradingLayout';
import { motion } from 'framer-motion';
import { History, TrendingUp, TrendingDown, Filter, Calendar, Download } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  icon: string;
  amount: string;
  price: string;
  total: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockHistory: Transaction[] = [
  {
    id: '1',
    type: 'BUY',
    symbol: 'BTC',
    icon: '₿',
    amount: '0.1234',
    price: '95,420.50',
    total: '11,774.91',
    date: '2025-11-24 14:30',
    status: 'completed',
  },
  {
    id: '2',
    type: 'SELL',
    symbol: 'ETH',
    icon: 'Ξ',
    amount: '1.5',
    price: '3,245.80',
    total: '4,868.70',
    date: '2025-11-24 12:15',
    status: 'completed',
  },
  {
    id: '3',
    type: 'BUY',
    symbol: 'SOL',
    icon: '◎',
    amount: '10',
    price: '142.35',
    total: '1,423.50',
    date: '2025-11-24 09:45',
    status: 'completed',
  },
  {
    id: '4',
    type: 'BUY',
    symbol: 'BTC',
    icon: '₿',
    amount: '0.05',
    price: '94,850.00',
    total: '4,742.50',
    date: '2025-11-23 18:20',
    status: 'pending',
  },
  {
    id: '5',
    type: 'SELL',
    symbol: 'SOL',
    icon: '◎',
    amount: '5',
    price: '145.80',
    total: '729.00',
    date: '2025-11-23 16:00',
    status: 'completed',
  },
];

export default function HistoryPage() {
  return (
    <TradingLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Transaction History
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-500"
            >
              View and export your trading history
            </motion.p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-colors flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" strokeWidth={2} />
              <span>Date Range</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-colors flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" strokeWidth={2} />
              <span>Filter</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl bg-orange/10 hover:bg-orange/20 border border-orange/20 text-sm font-semibold text-orange transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </div>

        {/* History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((tx, index) => {
                  const isBuy = tx.type === 'BUY';

                  return (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      className="border-b border-white/5 last:border-0 transition-colors"
                    >
                      {/* Date */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">{tx.date}</p>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl ${
                          isBuy 
                            ? 'bg-emerald-500/10 border border-emerald-500/20' 
                            : 'bg-red-500/10 border border-red-500/20'
                        }`}>
                          {isBuy ? (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
                          )}
                          <span className={`text-xs font-bold ${isBuy ? 'text-emerald-500' : 'text-red-500'}`}>
                            {tx.type}
                          </span>
                        </div>
                      </td>

                      {/* Asset */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{tx.icon}</span>
                          <span className="text-sm font-semibold text-white">{tx.symbol}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white" style={{ fontFeatureSettings: '"tnum"' }}>
                          {tx.amount}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-400" style={{ fontFeatureSettings: '"tnum"' }}>
                          ${tx.price}
                        </p>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white" style={{ fontFeatureSettings: '"tnum"' }}>
                          ${tx.total}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-lg ${
                          tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                          tx.status === 'pending' ? 'bg-orange/10 text-orange' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing 1 to 5 of 127 transactions
            </p>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-colors"
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-xl bg-orange/10 hover:bg-orange/20 border border-orange/20 text-sm font-semibold text-orange transition-colors"
              >
                Next
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </TradingLayout>
  );
}
