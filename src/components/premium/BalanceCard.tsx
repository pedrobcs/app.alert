'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface BalanceCardProps {
  balance?: string;
  change?: number;
}

export function BalanceCard({ 
  balance = '{TOTAL_BALANCE}',
  change = 12.5
}: BalanceCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="relative group"
    >
      {/* Glass Card */}
      <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" 
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange/10 rounded-xl">
                <TrendingUp className="w-5 h-5 text-orange" strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-gray-400">Saldo Total</span>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVisible(!isVisible)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {isVisible ? (
                <Eye className="w-5 h-5 text-gray-400" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
            </motion.button>
          </div>

          {/* Balance */}
          <div className="space-y-3">
            <div className="flex items-end space-x-3">
              {isVisible ? (
                <>
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-5xl md:text-6xl font-bold text-white"
                  >
                    {balance}
                  </motion.div>
                  <span className="text-2xl text-gray-500 pb-2">USDC</span>
                </>
              ) : (
                <div className="text-5xl md:text-6xl font-bold text-gray-600">
                  ••••••••
                </div>
              )}
            </div>

            {/* Change Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full ${
                change >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}>
                <TrendingUp className={`w-4 h-4 ${
                  change >= 0 ? 'text-green-500' : 'text-red-500 rotate-180'
                }`} />
                <span className={`text-sm font-semibold ${
                  change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {change >= 0 ? '+' : ''}{change}%
                </span>
              </div>
              <span className="text-sm text-gray-500">últimas 24h</span>
            </div>
          </div>

          {/* AI Badge */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-orange" />
              <span className="text-xs text-gray-400">
                Atualizado em tempo real por IA
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange/10 to-transparent rounded-bl-full opacity-50" />
      </div>
    </motion.div>
  );
}
