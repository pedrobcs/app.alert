'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, AlertCircle, Target, Zap } from 'lucide-react';

interface Signal {
  type: 'BUY' | 'SELL';
  asset: string;
  confidence: number;
  prediction: string;
  probability: number;
  timeframe: string;
  risk: 'low' | 'medium' | 'high';
}

const mockSignals: Signal[] = [
  {
    type: 'BUY',
    asset: 'BTC',
    confidence: 87,
    prediction: 'Strong upward momentum expected',
    probability: 78,
    timeframe: '24-48h',
    risk: 'medium',
  },
  {
    type: 'SELL',
    asset: 'ETH',
    confidence: 72,
    prediction: 'Resistance level approaching',
    probability: 65,
    timeframe: '12-24h',
    risk: 'low',
  },
  {
    type: 'BUY',
    asset: 'SOL',
    confidence: 91,
    prediction: 'Bullish breakout detected',
    probability: 85,
    timeframe: '6-12h',
    risk: 'low',
  },
];

const riskColors = {
  low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  medium: 'bg-orange/10 text-orange border-orange/20',
  high: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function AIInsightsSection() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange/20 to-orange-dark/20 border border-orange/30 flex items-center justify-center">
            <Brain className="w-5 h-5 text-orange" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Insights & Signals</h2>
            <p className="text-sm text-gray-500">Real-time market analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-bold text-emerald-500">AI ACTIVE</span>
        </div>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {mockSignals.map((signal, index) => {
          const isBuy = signal.type === 'BUY';

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-5"
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
                  isBuy ? 'bg-emerald-500/40' : 'bg-red-500/40'
                }`}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{signal.asset === 'BTC' ? '₿' : signal.asset === 'ETH' ? 'Ξ' : '◎'}</span>
                    <span className="text-sm font-bold text-white">{signal.asset}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-xl ${
                    isBuy 
                      ? 'bg-emerald-500/10 border border-emerald-500/20' 
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}>
                    <div className="flex items-center space-x-1">
                      {isBuy ? (
                        <TrendingUp className="w-3 h-3 text-emerald-500" strokeWidth={2.5} />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" strokeWidth={2.5} />
                      )}
                      <span className={`text-xs font-bold ${isBuy ? 'text-emerald-500' : 'text-red-500'}`}>
                        {signal.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prediction */}
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                  {signal.prediction}
                </p>

                {/* Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Probability</span>
                    <span className="text-sm font-bold text-white">{signal.probability}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Timeframe</span>
                    <span className="text-sm font-bold text-white">{signal.timeframe}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Risk Level</span>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-lg border ${riskColors[signal.risk]}`}>
                      {signal.risk.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5">
                      <Zap className="w-3 h-3 text-orange" strokeWidth={2} />
                      <span className="text-xs text-gray-500 font-medium">AI Confidence</span>
                    </div>
                    <span className="text-xs font-bold text-orange">{signal.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${signal.confidence}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className="h-full bg-gradient-to-r from-orange to-orange-light rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange/10 via-black to-black border border-orange/20 p-6"
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
          className="absolute top-0 right-0 w-32 h-32 bg-orange/30 rounded-full blur-2xl"
        />

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-orange" strokeWidth={2} />
              <span className="text-xs text-gray-500 font-medium">Status</span>
            </div>
            <p className="text-lg font-bold text-white">Analyzing</p>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-emerald-500" strokeWidth={2} />
              <span className="text-xs text-gray-500 font-medium">Assets Analyzed</span>
            </div>
            <p className="text-lg font-bold text-emerald-500">5,234</p>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" strokeWidth={2} />
              <span className="text-xs text-gray-500 font-medium">Performance</span>
            </div>
            <p className="text-lg font-bold text-blue-500">87.2%</p>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-purple-500" strokeWidth={2} />
              <span className="text-xs text-gray-500 font-medium">Risk Notes</span>
            </div>
            <p className="text-lg font-bold text-purple-500">3 Active</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
