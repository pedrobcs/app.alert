'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, Target, Shield } from 'lucide-react';

interface AIPredictionCardProps {
  symbol: string;
  trend: string;
  probability: number;
  targetPrice: string;
  timeframe: string;
  support: string;
  resistance: string;
  confidence: number;
}

export function AIPredictionCard({
  symbol,
  trend,
  probability,
  targetPrice,
  timeframe,
  support,
  resistance,
  confidence,
}: AIPredictionCardProps) {
  const isBullish = trend === 'bullish';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="glass-card rounded-2xl p-6 h-full overflow-hidden relative">
        {/* Animated Glow */}
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl ${
            isBullish ? 'bg-emerald-500/30' : 'bg-red-500/30'
          }`}
        />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isBullish ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'
              }`}>
                {isBullish ? (
                  <TrendingUp className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" strokeWidth={2.5} />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{symbol}</h4>
                <p className="text-xs text-gray-500 capitalize">{trend}</p>
              </div>
            </div>

            {/* Probability Badge */}
            <div className={`px-3 py-1.5 rounded-xl ${
              isBullish ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <span className={`text-xs font-bold ${isBullish ? 'text-emerald-500' : 'text-red-500'}`}>
                {probability}%
              </span>
            </div>
          </div>

          {/* Target */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Alvo {timeframe}</p>
            <p className="text-2xl font-bold text-white">${targetPrice}</p>
          </div>

          {/* Support & Resistance */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <Shield className="w-3 h-3 text-emerald-500" />
                <p className="text-xs text-gray-500">Suporte</p>
              </div>
              <p className="text-sm font-bold text-emerald-500">${support}</p>
            </div>
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <Target className="w-3 h-3 text-red-500" />
                <p className="text-xs text-gray-500">Resistência</p>
              </div>
              <p className="text-sm font-bold text-red-500">${resistance}</p>
            </div>
          </div>

          {/* Confidence Bar */}
          <div className="pt-3 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <Brain className="w-3.5 h-3.5 text-orange" />
                <span className="text-xs text-gray-500 font-medium">Confiança IA</span>
              </div>
              <span className="text-xs font-bold text-orange">{confidence}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-orange to-orange-light rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
