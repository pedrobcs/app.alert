'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/premium/DashboardLayout';
import { BalanceCard } from '@/components/premium/BalanceCard';
import { CryptoChartCard } from '@/components/premium/CryptoChartCard';
import { AIInsights } from '@/components/premium/AIInsights';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus, Clock } from 'lucide-react';
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Bem-vindo de volta, <span className="text-orange">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </p>
        </motion.div>

        {/* Balance Card */}
        <BalanceCard 
          balance={userData?.totalBalance.toFixed(2) || '0.00'}
          change={12.5}
        />

        {/* Crypto Charts */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-white mb-6 flex items-center space-x-2"
          >
            <span>Mercado de Criptomoedas</span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse delay-100" />
              <div className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse delay-200" />
            </div>
          </motion.h2>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/deposit">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="inline-flex p-3 bg-orange/10 rounded-xl mb-4">
                    <Plus className="w-6 h-6 text-orange" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Novo Depósito</h3>
                  <p className="text-gray-400">Depositar USDC e começar a investir</p>
                </div>
                <ArrowUpRight className="w-6 h-6 text-gray-600 group-hover:text-orange transition-colors" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </Link>

          <Link href="/performance">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="inline-flex p-3 bg-orange/10 rounded-xl mb-4">
                    <Clock className="w-6 h-6 text-orange" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Performance</h3>
                  <p className="text-gray-400">Ver histórico e retornos</p>
                </div>
                <ArrowUpRight className="w-6 h-6 text-gray-600 group-hover:text-orange transition-colors" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </Link>
        </div>

        {/* Recent Deposits */}
        {deposits.length > 0 && (
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-white mb-6"
            >
              Depósitos Recentes
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
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
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            deposit.chain === 'SOLANA' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {deposit.chain}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex px-2.5 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-semibold">
                            {deposit.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={getExplorerUrl(deposit.chain, deposit.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange hover:text-orange-light text-sm font-medium transition-colors"
                          >
                            Ver TX
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
