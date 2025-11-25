'use client';

import { TradingLayout } from '@/components/trading/TradingLayout';
import { PortfolioTable } from '@/components/trading/tables/PortfolioTable';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useWalletBalance } from '@/hooks/useWalletBalance';

export default function PortfolioPage() {
  const { balance } = useWalletBalance();

  return (
    <TradingLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Portfolio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-gray-500"
          >
            Manage and track your crypto holdings
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange" strokeWidth={2} />
              </div>
              <span className="text-xs text-gray-500">Total Value</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              ${balance?.total || '0.00'}
            </p>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-emerald-500">+{balance?.change24h || '0'}%</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-500" strokeWidth={2} />
              </div>
              <span className="text-xs text-gray-500">Total P/L</span>
            </div>
            <p className="text-2xl font-bold text-emerald-500 mb-1">+$5,751.03</p>
            <span className="text-xs text-gray-500">+15.2% all time</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-blue-500" strokeWidth={2} />
              </div>
              <span className="text-xs text-gray-500">Assets</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">12</p>
            <span className="text-xs text-gray-500">3 chains</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-purple-500" strokeWidth={2} />
              </div>
              <span className="text-xs text-gray-500">24h Change</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">+$1,234.56</p>
            <span className="text-xs text-emerald-500">+3.2%</span>
          </motion.div>
        </div>

        {/* Portfolio Table */}
        <PortfolioTable />
      </div>
    </TradingLayout>
  );
}
