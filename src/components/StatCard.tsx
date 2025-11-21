'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  delay?: number;
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
};

const glowClasses = {
  blue: 'shadow-blue-500/50',
  purple: 'shadow-purple-500/50',
  green: 'shadow-green-500/50',
  orange: 'shadow-orange-500/50',
  red: 'shadow-red-500/50',
};

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  isPositive,
  color,
  delay = 0,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    // Animate number counting
    const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    const duration = 1000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      current += increment;
      step++;

      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        const formatted = value.includes('$')
          ? `$${Math.floor(current).toLocaleString()}`
          : value.includes('%')
          ? `${current.toFixed(2)}%`
          : Math.floor(current).toString();
        setDisplayValue(formatted);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="card-premium group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg ${glowClasses[color]} group-hover:shadow-2xl transition-shadow duration-300`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>
        
        {change && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (delay + 300) / 1000 }}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {change}
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: (delay + 200) / 1000 }}
      >
        <p className="text-sm text-gray-600 mb-2 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 number-counter">
          {displayValue}
        </p>
      </motion.div>

      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
    </motion.div>
  );
}
