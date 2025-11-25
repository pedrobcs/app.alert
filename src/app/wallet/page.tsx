'use client';

import { TradingLayout } from '@/components/trading/TradingLayout';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useAccount } from 'wagmi';

export default function WalletPage() {
  const { balance } = useWalletBalance();
  const { address, isConnected } = useAccount();

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
            Wallet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-gray-500"
          >
            Manage your funds and transactions
          </motion.p>
        </div>

        {/* Main Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange/10 via-black to-black border border-orange/20 p-8"
        >
          <motion.div
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute top-0 right-0 w-64 h-64 bg-orange/30 rounded-full blur-3xl"
          />

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Wallet Balance</p>
                <p className="text-xs text-gray-600 font-mono">
                  {isConnected && address ? `${address.slice(0, 12)}...${address.slice(-8)}` : 'Not Connected'}
                </p>
              </div>
            </div>

            <p className="text-5xl font-bold text-white mb-8">
              ${balance?.total || '0.00'}
            </p>

            <div className="grid grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/30 transition-all flex flex-col items-center space-y-2"
              >
                <ArrowDownLeft className="w-5 h-5 text-emerald-500" strokeWidth={2} />
                <span className="text-sm font-semibold text-emerald-500">Deposit</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 transition-all flex flex-col items-center space-y-2"
              >
                <ArrowUpRight className="w-5 h-5 text-red-500" strokeWidth={2} />
                <span className="text-sm font-semibold text-red-500">Withdraw</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 transition-all flex flex-col items-center space-y-2"
              >
                <RefreshCw className="w-5 h-5 text-blue-500" strokeWidth={2} />
                <span className="text-sm font-semibold text-blue-500">Swap</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Assets Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { symbol: 'USDC', amount: balance?.usdc || '0', color: '#2775CA' },
            { symbol: 'SOL', amount: balance?.sol || '0', color: '#14F195' },
            { symbol: 'ETH', amount: balance?.eth || '0', color: '#627EEA' },
          ].map((asset, index) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-6"
            >
              <p className="text-sm text-gray-500 mb-2">{asset.symbol}</p>
              <p className="text-2xl font-bold text-white" style={{ fontFeatureSettings: '"tnum"' }}>
                {asset.amount}
              </p>
              <div className="mt-3 h-1 bg-white/5 rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{ 
                    width: `${Math.random() * 40 + 40}%`,
                    background: asset.color
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </TradingLayout>
  );
}
