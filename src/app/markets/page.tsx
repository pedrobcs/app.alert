'use client';

import { TradingLayout } from '@/components/trading/TradingLayout';
import { ProfessionalChart } from '@/components/trading/charts/ProfessionalChart';
import { motion } from 'framer-motion';
import { TrendingUp, Search, Filter } from 'lucide-react';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';

export default function MarketsPage() {
  const { prices, loading } = useCryptoPrices();

  if (loading || !prices) {
    return (
      <TradingLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-orange border-t-transparent rounded-full"
          />
        </div>
      </TradingLayout>
    );
  }

  const generateChartData = (points: number = 24) => {
    const data = [];
    let value = 50;
    for (let i = 0; i < points; i++) {
      value += (Math.random() - 0.48) * 5;
      data.push({ time: `${i}:00`, value });
    }
    return data;
  };

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
              Markets
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-500"
            >
              Monitor all crypto markets in real-time
            </motion.p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search markets..."
                className="pl-10 pr-4 py-2 w-64 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange/30 transition-colors"
              />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-colors flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" strokeWidth={2} />
              <span>Filters</span>
            </motion.button>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <ProfessionalChart
            symbol="BTC"
            name="Bitcoin"
            price={prices.BTC.price}
            change24h={prices.BTC.change24h}
            icon="₿"
            color="#F7931A"
            gradient={['#F7931A', '#FFA500']}
            chartData={generateChartData()}
          />
          <ProfessionalChart
            symbol="ETH"
            name="Ethereum"
            price={prices.ETH.price}
            change24h={prices.ETH.change24h}
            icon="Ξ"
            color="#627EEA"
            gradient={['#627EEA', '#8A9FF5']}
            chartData={generateChartData()}
          />
          <ProfessionalChart
            symbol="SOL"
            name="Solana"
            price={prices.SOL.price}
            change24h={prices.SOL.change24h}
            icon="◎"
            color="#14F195"
            gradient={['#14F195', '#9945FF']}
            chartData={generateChartData()}
          />
        </div>
      </div>
    </TradingLayout>
  );
}
