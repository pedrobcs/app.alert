'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/premium/DashboardLayout';
import { BalanceCard } from '@/components/premium/BalanceCard';
import { LivePriceCard } from '@/components/premium/LivePriceCard';
import { AIPredictionCard } from '@/components/premium/AIPredictionCard';
import { SmartAlert } from '@/components/premium/SmartAlert';
import { AIStatusFooter } from '@/components/premium/AIStatusFooter';
import { motion } from 'framer-motion';
import { 
  Sparkles,
  BarChart3,
  Brain,
  AlertCircle,
  Lightbulb,
  ArrowUpRight,
  Plus,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { useAIInsights } from '@/hooks/useAIInsights';
import { useWalletBalance } from '@/hooks/useWalletBalance';

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  
  // Real-time data hooks
  const { prices, loading: pricesLoading } = useCryptoPrices();
  const { alerts, predictions, insights } = useAIInsights();
  const { balance } = useWalletBalance();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
  }, [isConnected, router]);

  if (pricesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-orange border-t-transparent rounded-full"
          />
        </div>
      </DashboardLayout>
    );
  }

  const quickActions = [
    {
      title: 'Novo Depósito',
      description: 'Depositar USDC e começar a investir',
      icon: Plus,
      href: '/deposit',
      gradient: ['#E35404', '#FF6B1A'],
    },
    {
      title: 'Performance',
      description: 'Ver histórico e retornos',
      icon: TrendingUp,
      href: '/performance',
      gradient: ['#10B981', '#059669'],
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Header Premium */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center lg:text-left"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 glass-card px-6 py-3 rounded-full mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-orange" />
            </motion.div>
            <span className="text-sm font-bold text-orange tracking-wide">
              DASHBOARD EM TEMPO REAL
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="text-title-1 text-white mb-3">
            Bem-vindo de volta
          </h1>
          <p className="text-body-1 text-gray-400">
            Carteira conectada: {' '}
            <span className="text-orange font-semibold">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </p>
        </motion.div>

        {/* Balance Card - Real Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BalanceCard 
            balance={balance?.total || '0.00'}
            change={parseFloat(balance?.change24h || '0')}
          />
        </motion.div>

        {/* Live Crypto Prices Section */}
        <div className="space-y-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="inline-flex items-center space-x-2 glass-card px-6 py-3 rounded-full mb-6">
              <BarChart3 className="w-4 h-4 text-orange" />
              <span className="text-sm font-bold text-orange tracking-wide">
                MERCADO AO VIVO
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-title-2 text-white mb-2">Mercado de Criptomoedas</h2>
                <p className="text-body-2 text-gray-400">Preços atualizados a cada 5 segundos</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-sm text-emerald-500 font-semibold">Ao vivo</span>
              </div>
            </div>
          </motion.div>

          {/* Live Price Cards Grid */}
          {prices && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <LivePriceCard
                symbol={prices.BTC.symbol}
                name={prices.BTC.name}
                price={prices.BTC.price}
                change24h={prices.BTC.change24h}
                volume24h={prices.BTC.volume24h}
                marketCap={prices.BTC.marketCap}
                icon="₿"
                color="#F7931A"
                gradient={['#F7931A', '#FFA500']}
              />
              <LivePriceCard
                symbol={prices.ETH.symbol}
                name={prices.ETH.name}
                price={prices.ETH.price}
                change24h={prices.ETH.change24h}
                volume24h={prices.ETH.volume24h}
                marketCap={prices.ETH.marketCap}
                icon="Ξ"
                color="#627EEA"
                gradient={['#627EEA', '#8A9FF5']}
              />
              <LivePriceCard
                symbol={prices.SOL.symbol}
                name={prices.SOL.name}
                price={prices.SOL.price}
                change24h={prices.SOL.change24h}
                volume24h={prices.SOL.volume24h}
                marketCap={prices.SOL.marketCap}
                icon="◎"
                color="#14F195"
                gradient={['#14F195', '#9945FF']}
              />
            </motion.div>
          )}
        </div>

        {/* AI Intelligence Center */}
        <div className="space-y-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 glass-card px-6 py-3 rounded-full mb-6">
              <Brain className="w-4 h-4 text-orange" />
              <span className="text-sm font-bold text-orange tracking-wide">
                CENTRO DE INTELIGÊNCIA IA
              </span>
            </div>
            <div>
              <h2 className="text-title-2 text-white mb-2">Análise em Tempo Real</h2>
              <p className="text-body-2 text-gray-400">Insights gerados por inteligência artificial</p>
            </div>
          </motion.div>

          {/* AI Modules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Smart Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-5 h-5 text-orange" />
                <h3 className="text-lg font-bold text-white">Alertas Inteligentes</h3>
                <div className="flex-1 flex justify-end">
                  <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-bold text-emerald-500">
                    EM TEMPO REAL
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <SmartAlert
                    key={alert.id}
                    type={alert.type}
                    message={alert.message}
                    severity={alert.severity as 'high' | 'medium' | 'low'}
                    confidence={alert.confidence}
                    timestamp={alert.timestamp}
                  />
                ))}
              </div>
            </motion.div>

            {/* AI Predictions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-bold text-white">Previsões IA</h3>
              </div>
              <div className="space-y-3">
                {predictions && Object.entries(predictions).map(([symbol, pred]) => (
                  <AIPredictionCard
                    key={symbol}
                    symbol={symbol}
                    {...pred}
                  />
                ))}
              </div>
            </motion.div>

            {/* Strategic Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-white">Insights Estratégicos</h3>
              </div>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="glass-card rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        insight.priority === 'high' ? 'bg-orange/10 border border-orange/20' :
                        insight.priority === 'medium' ? 'bg-blue-500/10 border border-blue-500/20' :
                        'bg-gray-500/10 border border-gray-500/20'
                      }`}>
                        <Lightbulb className={`w-5 h-5 ${
                          insight.priority === 'high' ? 'text-orange' :
                          insight.priority === 'medium' ? 'text-blue-500' :
                          'text-gray-500'
                        }`} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white mb-1">{insight.title}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-2">
                          {insight.description}
                        </p>
                        <span className="text-xs font-semibold text-orange">{insight.action}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              
              return (
                <Link key={index} href={action.href}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group"
                  >
                    <div className="glass-card rounded-2xl p-8 overflow-hidden relative h-full">
                      <motion.div
                        animate={{
                          opacity: [0.1, 0.2, 0.1],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5,
                        }}
                        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl"
                        style={{
                          background: `radial-gradient(circle, ${action.gradient[0]}40 0%, transparent 70%)`,
                        }}
                      />

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{
                              background: `linear-gradient(135deg, ${action.gradient[0]}15, ${action.gradient[1]}15)`,
                              border: `1px solid ${action.gradient[0]}30`,
                            }}
                          >
                            <Icon 
                              className="w-8 h-8" 
                              style={{ color: action.gradient[0] }}
                              strokeWidth={2}
                            />
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-6 h-6 text-gray-600 group-hover:text-orange transition-colors" strokeWidth={2} />
                      </div>

                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 right-0 h-1 origin-left"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${action.gradient[0]}, transparent)`,
                        }}
                      />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        </div>

        {/* AI Status Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <AIStatusFooter />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
