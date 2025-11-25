'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, BarChart3, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface LivePriceCardProps {
  symbol: string;
  name: string;
  price: string;
  change24h: number;
  volume24h: string;
  marketCap: string;
  icon: string;
  color: string;
  gradient: [string, string];
  chartData?: Array<{ value: number }>;
}

export function LivePriceCard({
  symbol,
  name,
  price,
  change24h,
  volume24h,
  marketCap,
  icon,
  color,
  gradient,
}: LivePriceCardProps) {
  const isPositive = change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group h-full"
    >
      <div className="glass-card rounded-2xl p-6 h-full overflow-hidden relative">
        {/* Animated Glow */}
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${gradient[0]}15, ${gradient[1]}15)`,
                  border: `1px solid ${color}30`,
                  color: color,
                }}
              >
                {icon}
              </motion.div>
              <div>
                <h3 className="text-base font-bold text-white">{name}</h3>
                <p className="text-xs text-gray-500">{symbol}/USD</p>
              </div>
            </div>

            {/* Live Badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-bold text-emerald-500">AO VIVO</span>
            </div>
          </div>

          {/* Price */}
          <div>
            <motion.div
              key={price}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-white mb-1"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              ${price}
            </motion.div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                isPositive 
                  ? 'bg-emerald-500/10 border border-emerald-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
                )}
                <span className={`text-xs font-bold ${
                  isPositive ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {isPositive ? '+' : ''}{change24h.toFixed(2)}%
                </span>
              </div>
              <span className="text-xs text-gray-500">24h</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <BarChart3 className="w-3 h-3 text-gray-500" />
                <p className="text-xs text-gray-500">Volume 24h</p>
              </div>
              <p className="text-sm font-bold text-white">${volume24h}</p>
            </div>
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <Activity className="w-3 h-3 text-gray-500" />
                <p className="text-xs text-gray-500">Market Cap</p>
              </div>
              <p className="text-sm font-bold text-white">${marketCap}</p>
            </div>
          </div>

          {/* Action Button */}
          <Link href={`/analysis/${symbol.toLowerCase()}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-sm font-semibold text-white transition-all group/btn flex items-center justify-center space-x-2"
            >
              <span>Ver análise detalhada</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </motion.button>
          </Link>
        </div>

        {/* Bottom Glow */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-1 origin-left"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}
