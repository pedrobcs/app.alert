'use client';

import { TradingLayout } from '@/components/trading/TradingLayout';
import { SignalCard } from '@/components/trading/cards/SignalCard';
import { motion } from 'framer-motion';
import { Target, Filter, Bell } from 'lucide-react';

export default function SignalsPage() {
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
    {
      symbol: 'BTC',
      icon: '₿',
      type: 'SHORT' as const,
      entry: '95,800',
      target: '92,500',
      stop: '97,200',
      confidence: 65,
      gradient: ['#F7931A', '#FFA500'] as [string, string],
    },
    {
      symbol: 'ETH',
      icon: 'Ξ',
      type: 'LONG' as const,
      entry: '3,150',
      target: '3,450',
      stop: '3,050',
      confidence: 82,
      gradient: ['#627EEA', '#8A9FF5'] as [string, string],
    },
    {
      symbol: 'SOL',
      icon: '◎',
      type: 'SHORT' as const,
      entry: '145',
      target: '138',
      stop: '148',
      confidence: 78,
      gradient: ['#14F195', '#9945FF'] as [string, string],
    },
  ];

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
              Trading Signals
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-500"
            >
              AI-powered trading recommendations updated in real-time
            </motion.p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
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
              <Bell className="w-4 h-4" strokeWidth={2} />
              <span>Setup Alerts</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Signals', value: '12', color: 'orange' },
            { label: 'Win Rate', value: '87.5%', color: 'emerald' },
            { label: 'Avg Confidence', value: '82%', color: 'blue' },
            { label: 'Today\'s Alerts', value: '24', color: 'purple' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-5"
            >
              <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-500`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Signals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.map((signal, index) => (
            <motion.div
              key={`${signal.symbol}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SignalCard {...signal} />
            </motion.div>
          ))}
        </div>
      </div>
    </TradingLayout>
  );
}
