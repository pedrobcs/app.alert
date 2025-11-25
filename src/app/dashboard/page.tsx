'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/premium/DashboardLayout';
import { BalanceCard } from '@/components/premium/BalanceCard';
import { CryptoChartCard } from '@/components/premium/CryptoChartCard';
import { AIInsights } from '@/components/premium/AIInsights';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus, Clock, ExternalLink, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface UserData {
  address: string;
  totalBalance: number;
  totalDeposits: number;
}

interface Deposit {
  id: string;
  amount: number;
  chain: string;
  txHash: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
    fetchUserData();
  }, [isConnected, address]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setDeposits(data.deposits || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getExplorerUrl = (chain: string, txHash: string) => {
    if (chain === 'SOLANA') {
      return `https://explorer.solana.com/tx/${txHash}`;
    }
    return `https://arbiscan.io/tx/${txHash}`;
  };

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
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-title-1 text-white">Dashboard</h1>
          <p className="text-body-2 text-gray-400">
            Bem-vindo de volta, {' '}
            <span className="text-orange font-semibold">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </p>
        </motion.div>

        {/* Balance Card */}
        <BalanceCard 
          balance={userData?.totalBalance.toFixed(2) || '0.00'}
          change={12.5}
        />

        {/* Crypto Charts */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <h2 className="text-title-2 text-white">Mercado de Criptomoedas</h2>
            <div className="flex items-center space-x-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-sm text-gray-500">Ao vivo</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CryptoChartCard ticker="BTC" price="95,420.50" change={2.5} />
            <CryptoChartCard ticker="ETH" price="3,245.80" change={-1.2} />
            <CryptoChartCard ticker="SOL" price="142.35" change={5.8} />
          </div>
        </div>

        {/* AI Insights */}
        <AIInsights
          alerts={[
            'BTC apresenta forte suporte em $90k',
            'Volume de ETH aumentou 35% nas últimas 24h',
          ]}
          predictions={[
            'SOL pode atingir $160 nas próximas 48h',
            'BTC consolidando antes de próximo movimento',
          ]}
          insights={[
            'Diversifique entre múltiplas chains',
            'Momento ideal para DCA (Dollar Cost Average)',
          ]}
        />

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-title-2 text-white">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              
              return (
                <Link key={index} href={action.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group"
                  >
                    <div className="glass-card rounded-2xl p-8 overflow-hidden relative h-full">
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
                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{
                              background: `linear-gradient(135deg, ${action.gradient[0]}15, ${action.gradient[1]}15)`,
                              border: `1px solid ${action.gradient[0]}30`,
                            }}
                          >
                            <Icon 
                              className="w-7 h-7" 
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
                        <ArrowUpRight className="w-6 h-6 text-gray-600 group-hover:text-orange transition-colors" />
                      </div>

                      {/* Bottom Glow */}
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
          </div>
        </div>

        {/* Recent Deposits */}
        {deposits.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-title-2 text-white">Depósitos Recentes</h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-4 text-sm font-semibold text-gray-400">Data</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-400">Valor</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-400">Chain</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
                      <th className="text-right p-4 text-sm font-semibold text-gray-400">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deposits.slice(0, 5).map((deposit, index) => (
                      <motion.tr
                        key={deposit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="p-4 text-sm text-gray-300">
                          {formatDate(deposit.createdAt)}
                        </td>
                        <td className="p-4 text-sm font-semibold text-white">
                          ${deposit.amount.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${
                            deposit.chain === 'SOLANA' 
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                              : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          }`}>
                            {deposit.chain}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-semibold border border-emerald-500/20">
                            {deposit.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={getExplorerUrl(deposit.chain, deposit.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-orange hover:text-orange-light text-sm font-medium transition-colors group"
                          >
                            <span>Ver TX</span>
                            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
