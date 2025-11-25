'use client';

import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, BarChart3, Activity } from 'lucide-react';

interface SmartAlertProps {
  type: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  timestamp: string;
}

const alertConfig = {
  breakout: {
    icon: TrendingUp,
    color: '#10B981',
    label: 'Rompimento',
  },
  volume: {
    icon: BarChart3,
    color: '#3B82F6',
    label: 'Volume',
  },
  trend: {
    icon: Activity,
    color: '#F59E0B',
    label: 'Tendência',
  },
};

const severityConfig = {
  high: {
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-500',
  },
  medium: {
    bgColor: 'bg-orange/10',
    borderColor: 'border-orange/30',
    textColor: 'text-orange',
  },
  low: {
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-500',
  },
};

export function SmartAlert({
  type,
  message,
  severity,
  confidence,
  timestamp,
}: SmartAlertProps) {
  const config = alertConfig[type as keyof typeof alertConfig] || alertConfig.trend;
  const severityStyle = severityConfig[severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className="group"
    >
      <div className={`glass-card rounded-xl p-4 border ${severityStyle.borderColor} overflow-hidden relative`}>
        {/* Animated Pulse */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl"
          style={{ background: config.color, opacity: 0.1 }}
        />

        <div className="relative z-10 flex items-start space-x-3">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `${config.color}15`,
              border: `1px solid ${config.color}30`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: config.color }} strokeWidth={2} />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: config.color }}>
                {config.label}
              </span>
              <div className="flex items-center space-x-1.5">
                <AlertCircle className={`w-3 h-3 ${severityStyle.textColor}`} />
                <span className={`text-xs font-bold ${severityStyle.textColor}`}>
                  {severity.toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-sm text-white font-medium leading-tight mb-2">
              {message}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <div className="flex items-center space-x-1">
                <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange rounded-full"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-orange">{confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
