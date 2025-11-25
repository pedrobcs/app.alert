'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  color: string;
  index?: number;
}

export function MetricCard({ label, value, change, icon: Icon, color, index = 0 }: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-white/10 p-5"
    >
      {/* Glow Effect */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20"
        style={{ background: color }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `${color}15`,
              border: `1px solid ${color}30`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
          </div>
          {change !== undefined && (
            <div className={`text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">{label}</p>
        <p className="text-2xl font-bold text-white" style={{ fontFeatureSettings: '"tnum"' }}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}
