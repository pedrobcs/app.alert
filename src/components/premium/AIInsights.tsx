'use client';

import { motion } from 'framer-motion';
import { Sparkles, Brain, TrendingUp, AlertCircle, Zap, Target } from 'lucide-react';

interface AIInsightsProps {
  alerts?: string[];
  predictions?: string[];
  insights?: string[];
}

export function AIInsights({
  alerts = ['BTC apresenta forte suporte em $90k', 'Volume de ETH aumentou 35% nas últimas 24h'],
  predictions = ['SOL pode atingir $160 nas próximas 48h', 'BTC consolidando antes de próximo movimento'],
  insights = ['Diversifique entre múltiplas chains', 'Momento ideal para DCA (Dollar Cost Average)'],
}: AIInsightsProps) {
  const sections = [
    {
      title: 'Alertas Inteligentes',
      icon: AlertCircle,
      color: '#E35404',
      gradient: ['#E35404', '#FF6B1A'],
      items: alerts,
      emoji: '🚨',
    },
    {
      title: 'Previsões de IA',
      icon: Brain,
      color: '#A855F7',
      gradient: ['#A855F7', '#C084FC'],
      items: predictions,
      emoji: '🧠',
    },
    {
      title: 'Insights Estratégicos',
      icon: Zap,
      color: '#3B82F6',
      gradient: ['#3B82F6', '#60A5FA'],
      items: insights,
      emoji: '⚡',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center lg:text-left"
      >
        <div className="inline-flex items-center space-x-3 glass-card px-6 py-3 rounded-2xl mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-orange" />
          </motion.div>
          <span className="text-sm font-bold text-orange tracking-wide">AI-POWERED INSIGHTS</span>
        </div>
        <h2 className="text-title-1 text-white mb-3">Inteligência Artificial</h2>
        <p className="text-body-2 text-gray-400">
          Análise em tempo real do mercado com tecnologia de ponta
        </p>
      </motion.div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, sectionIndex) => {
          const Icon = section.icon;
          
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              whileHover={{ y: -6 }}
              className="group h-full"
            >
              <div className="glass-card rounded-2xl p-6 h-full overflow-hidden relative">
                {/* Animated Background Glow */}
                <motion.div
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: sectionIndex * 0.5,
                  }}
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${section.color}30 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 space-y-5">
                  {/* Icon & Title */}
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${section.gradient[0]}15, ${section.gradient[1]}15)`,
                        border: `1px solid ${section.color}30`,
                      }}
                    >
                      {section.emoji}
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{section.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Em tempo real</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {section.items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + sectionIndex * 0.1 + index * 0.05 }}
                        className="flex items-start space-x-3 group/item"
                      >
                        <div
                          className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                          style={{ backgroundColor: section.color }}
                        />
                        <p className="text-sm text-gray-300 leading-relaxed group-hover/item:text-white transition-colors">
                          {item}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Confidence Bar */}
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 font-medium">Confiança</span>
                      <span className="text-xs font-bold" style={{ color: section.color }}>
                        85%
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ delay: 0.8 + sectionIndex * 0.2, duration: 1 }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${section.gradient[0]}, ${section.gradient[1]})`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Glow Line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 h-1 origin-left"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${section.color}, transparent)`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">IA Ativa</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Analisando {Math.floor(Math.random() * 1000 + 5000).toLocaleString()} ativos
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-emerald-500" strokeWidth={2} />
            <span className="text-sm font-semibold text-emerald-500">
              Performance otimizada
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
