'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Shield, AlertCircle, ArrowRight } from 'lucide-react';

interface SignalCardProps {
  symbol: string;
  icon: string;
  type: 'LONG' | 'SHORT';
  entry: string;
  target: string;
  stop: string;
  confidence: number;
  gradient: [string, string];
}

export function SignalCard({
  symbol,
  icon,
  type,
  entry,
  target,
  stop,
  confidence,
  gradient,
}: SignalCardProps) {
  const isLong = type === 'LONG';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-5 group"
    >
      {/* Animated Glow */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl ${
          isLong ? 'bg-emerald-500/40' : 'bg-red-500/40'
        }`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{
                background: `linear-gradient(135deg, ${gradient[0]}15, ${gradient[1]}15)`,
                border: `1px solid ${gradient[0]}30`,
              }}
            >
              {icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{symbol}</h4>
              <p className="text-xs text-gray-500">Signal Active</p>
            </div>
          </div>

          {/* Type Badge */}
          <div className={`px-3 py-1.5 rounded-xl ${
            isLong 
              ? 'bg-emerald-500/10 border border-emerald-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <div className="flex items-center space-x-1.5">
              {isLong ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
              )}
              <span className={`text-xs font-bold ${isLong ? 'text-emerald-500' : 'text-red-500'}`}>
                {type}
              </span>
            </div>
          </div>
        </div>

        {/* Levels */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <ArrowRight className="w-3 h-3 text-blue-500" strokeWidth={2} />
              </div>
              <span className="text-xs text-gray-500">Entry</span>
            </div>
            <span className="text-sm font-bold text-white">${entry}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Target className="w-3 h-3 text-emerald-500" strokeWidth={2} />
              </div>
              <span className="text-xs text-gray-500">Target</span>
            </div>
            <span className="text-sm font-bold text-emerald-500">${target}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Shield className="w-3 h-3 text-red-500" strokeWidth={2} />
              </div>
              <span className="text-xs text-gray-500">Stop Loss</span>
            </div>
            <span className="text-sm font-bold text-red-500">${stop}</span>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-orange" strokeWidth={2} />
              <span className="text-xs text-gray-500 font-medium">Confidence</span>
            </div>
            <span className="text-xs font-bold text-orange">{confidence}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-orange to-orange-light rounded-full"
            />
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange/30 rounded-xl text-sm font-semibold text-white transition-all group/btn flex items-center justify-center space-x-2"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" strokeWidth={2} />
        </motion.button>
      </div>
    </motion.div>
  );
}
