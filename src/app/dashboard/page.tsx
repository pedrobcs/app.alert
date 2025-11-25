'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { TradingLayout } from '@/components/trading/TradingLayout';
import { TotalBalanceCard } from '@/components/trading/cards/TotalBalanceCard';
import { ProfessionalChart } from '@/components/trading/charts/ProfessionalChart';
import { SignalCard } from '@/components/trading/cards/SignalCard';
import { PortfolioTable } from '@/components/trading/tables/PortfolioTable';
import { motion } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { useWalletBalance } from '@/hooks/useWalletBalance';

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const { prices, loading } = useCryptoPrices();
  const { balance } = useWalletBalance();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
  }, [isConnected, router]);

  if (loading || !prices || !balance) {
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

  // Mock signals data
  const signals = [
    {
      symbol: 'BTC',
      icon: '₿',
      type: 'LONG' as const,
      entry: '94,200',
      target: '98,500',
      stop: '92,100',
      confidence: 87,
      gradient: ['#F7931A', '#FFA500'] as [string, string],
    },
    {
      symbol: 'ETH',
      icon: 'Ξ',
      type: 'SHORT' as const,
      entry: '3,280',
      target: '3,100',
      stop: '3,380',
      confidence: 72,
      gradient: ['#627EEA', '#8A9FF5'] as [string, string],
    },
    {
      symbol: 'SOL',
      icon: '◎',
      type: 'LONG' as const,
      entry: '140',
      target: '155',
      stop: '135',
      confidence: 91,
      gradient: ['#14F195', '#9945FF'] as [string, string],
    },
  ];

  // Generate chart data
  const generateChartData = (points: number = 24, baseValue: number = 50) => {
    const data = [];
    let value = baseValue;
    
    for (let i = 0; i < points; i++) {
      value += (Math.random() - 0.48) * 5;
      value = Math.max(20, Math.min(80, value));
      data.push({
        time: `${i}:00`,
        value: value,
      });
    }
    
    return data;
  };

  return (
    <TradingLayout>
      <div className="space-y-8">
        {/* Total Balance Card */}
        <TotalBalanceCard
          balance={balance.total}
          change={parseFloat(balance.change24h)}
          chartData={generateChartData(20, 60)}
        />

        {/* Section Header - Charts */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Market Overview
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-500"
            >
              Real-time price charts with technical indicators
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-colors flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" strokeWidth={2} />
            <span>View All Markets</span>
          </motion.button>
        </div>

        {/* Professional Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfessionalChart
            symbol="BTC"
            name="Bitcoin"
            price={prices.BTC.price}
            change24h={prices.BTC.change24h}
            icon="₿"
            color="#F7931A"
            gradient={['#F7931A', '#FFA500']}
            chartData={generateChartData(24, 60)}
          />
          <ProfessionalChart
            symbol="ETH"
            name="Ethereum"
            price={prices.ETH.price}
            change24h={prices.ETH.change24h}
            icon="Ξ"
            color="#627EEA"
            gradient={['#627EEA', '#8A9FF5']}
            chartData={generateChartData(24, 55)}
          />
          <ProfessionalChart
            symbol="SOL"
            name="Solana"
            price={prices.SOL.price}
            change24h={prices.SOL.change24h}
            icon="◎"
            color="#14F195"
            gradient={['#14F195', '#9945FF']}
            chartData={generateChartData(24, 50)}
          />
        </div>

        {/* Section Header - Signals */}
        <div className="flex items-center justify-between pt-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Active Trading Signals
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-500"
            >
              AI-powered recommendations for your portfolio
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-orange/10 hover:bg-orange/20 border border-orange/20 text-sm font-semibold text-orange transition-colors flex items-center space-x-2"
          >
            <Target className="w-4 h-4" strokeWidth={2} />
            <span>View All Signals</span>
          </motion.button>
        </div>

        {/* Signals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.map((signal, index) => (
            <motion.div
              key={signal.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SignalCard {...signal} />
            </motion.div>
          ))}
        </div>

        {/* Portfolio Table */}
        <div className="pt-8">
          <PortfolioTable />
        </div>
      </div>
    </TradingLayout>
  );
}
