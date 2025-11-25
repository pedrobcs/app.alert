'use client';

import { motion } from 'framer-motion';
import { Sparkles, Brain, TrendingUp, AlertCircle, Zap } from 'lucide-react';

interface AIInsightsProps {
  alerts?: string[];
  predictions?: string[];
  insights?: string[];
}

export function AIInsights({
  alerts = ['{AI_ALERTS}'],
  predictions = ['{AI_PREDICTIONS}'],
  insights = ['{AI_SMART_INSIGHTS}'],
}: AIInsightsProps) {
  const sections = [
    {
      title: 'Alertas Inteligentes',
      icon: AlertCircle,
      color: 'text-orange',
      bgColor: 'bg-orange/10',
      items: alerts,
    },
    {
      title: 'Previsões de IA',
      icon: Brain,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      items: predictions,
    },
    {
      title: 'Insights Estratégicos',
      icon: Zap,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      items: insights,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-orange/10 rounded-xl">
          <Sparkles className="w-6 h-6 text-orange" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Inteligência Artificial</h2>
          <p className="text-sm text-gray-500">Análise em tempo real do mercado</p>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, sectionIndex) => {
          const Icon = section.icon;
          
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + sectionIndex * 0.1 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 overflow-hidden h-full">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className={`inline-flex p-3 ${section.bgColor} rounded-xl`}>
                    <Icon className={`w-5 h-5 ${section.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white">
                    {section.title}
                  </h3>

                  {/* Items */}
                  <div className="space-y-3">
                    {section.items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + sectionIndex * 0.1 + index * 0.05 }}
                        className="flex items-start space-x-2"
                      >
                        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange mt-2" />
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {item}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Confiança</span>
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-3 rounded-full ${
                                i < 4 ? 'bg-orange' : 'bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-orange font-semibold ml-1">85%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow effect on hover */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-orange to-transparent"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Status Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-4 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
            </div>
            <span className="text-sm text-gray-400">
              IA ativa • Analisando {Math.floor(Math.random() * 1000 + 5000)} ativos
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-green-500">
              Performance otimizada
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
