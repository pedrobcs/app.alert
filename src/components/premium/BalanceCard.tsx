'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Eye, EyeOff, Sparkles, Wallet } from 'lucide-react';
import { useState } from 'react';

interface BalanceCardProps {
  balance?: string;
  change?: number;
}

export function BalanceCard({ 
  balance = '0.00',
  change = 12.5
}: BalanceCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative group"
    >
      {/* Main Card */}
      <div className="glass-card rounded-3xl p-8 lg:p-10 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-tr from-orange/5 to-transparent rounded-full blur-2xl" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center shadow-orange"
              >
                <Wallet className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wide uppercase">
                  Saldo Total
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">Todas as carteiras</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVisible(!isVisible)}
              className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-colors group/btn"
            >
              {isVisible ? (
                <Eye className="w-5 h-5 text-gray-400 group-hover/btn:text-white transition-colors" strokeWidth={2} />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400 group-hover/btn:text-white transition-colors" strokeWidth={2} />
              )}
            </motion.button>
          </div>

          {/* Balance Display */}
          <div className="space-y-4">
            <div className="flex items-baseline space-x-3">
              {isVisible ? (
                <>
                  <motion.div
                    key="visible"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl lg:text-7xl font-bold text-white tracking-tight"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    ${balance}
                  </motion.div>
                  <span className="text-2xl text-gray-500 font-medium pb-2">USDC</span>
                </>
              ) : (
                <motion.div
                  key="hidden"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl lg:text-7xl font-bold text-gray-700"
                >
                  ••••••••
                </motion.div>
              )}
            </div>

            {/* Change Indicator */}
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                  isPositive 
                    ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20' 
                    : 'bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20'
                }`}
              >
                <TrendingUp 
                  className={`w-4 h-4 ${
                    isPositive ? 'text-emerald-500' : 'text-red-500 rotate-180'
                  }`}
                  strokeWidth={2.5}
                />
                <span className={`text-sm font-bold ${
                  isPositive ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {isPositive ? '+' : ''}{change.toFixed(2)}%
                </span>
              </motion.div>
              <span className="text-sm text-gray-500">últimas 24h</span>
            </div>
          </div>

          {/* AI Badge */}
          <div className="pt-6 border-t border-white/5">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-orange" />
              </motion.div>
              <div className="flex items-center space-x-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange"></span>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  Atualizado em tempo real por IA
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
}
