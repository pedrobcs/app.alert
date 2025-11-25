'use client';

import { motion } from 'framer-motion';
import { Brain, Activity, Zap, Clock } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';

export function AIStatusFooter() {
  const { status } = useAIInsights();

  if (!status) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Side - Status */}
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange/20 to-orange-dark/20 border border-orange/30 flex items-center justify-center"
          >
            <Brain className="w-7 h-7 text-orange" strokeWidth={2} />
          </motion.div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <h3 className="text-base font-bold text-white">
                IA {status.status === 'active' ? 'Ativa' : 'Otimizando'}
              </h3>
            </div>
            <p className="text-sm text-gray-400">
              {status.mode === 'optimizing' ? 'Otimizando estratégias' : 'Analisando mercado'}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Assets Analyzed */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
              <Activity className="w-4 h-4 text-orange" strokeWidth={2} />
              <p className="text-xs text-gray-500 font-medium">Ativos</p>
            </div>
            <p className="text-lg font-bold text-white">
              {status.assetsAnalyzed.toLocaleString()}
            </p>
          </div>

          {/* Models Active */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
              <Zap className="w-4 h-4 text-emerald-500" strokeWidth={2} />
              <p className="text-xs text-gray-500 font-medium">Modelos</p>
            </div>
            <p className="text-lg font-bold text-emerald-500">
              {status.modelsActive}
            </p>
          </div>

          {/* Performance */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
              <Activity className="w-4 h-4 text-blue-500" strokeWidth={2} />
              <p className="text-xs text-gray-500 font-medium">Performance</p>
            </div>
            <p className="text-lg font-bold text-blue-500">
              {status.avgPerformance}
            </p>
          </div>

          {/* Uptime */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
              <Clock className="w-4 h-4 text-purple-500" strokeWidth={2} />
              <p className="text-xs text-gray-500 font-medium">Uptime</p>
            </div>
            <p className="text-lg font-bold text-purple-500">
              {status.uptime}
            </p>
          </div>
        </div>
      </div>

      {/* Update Time */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center lg:justify-start">
        <p className="text-xs text-gray-500">
          Última atualização: {new Date(status.lastUpdate).toLocaleTimeString('pt-BR')}
        </p>
      </div>
    </motion.div>
  );
}
