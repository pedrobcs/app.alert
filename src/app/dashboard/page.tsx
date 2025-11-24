'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { StatCard } from '@/components/StatCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { formatUSDC, formatPercentage } from '@/lib/utils';
import {
  TrendingUp,
  Wallet,
  Activity,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useHaptics } from '@/lib/haptics';

interface UserData {
  user: {
    walletAddress: string;
    totalInvested: number;
    totalShares: number;
    currentValue: number;
    returns: number;
    returnsPercentage: number;
    isKycVerified: boolean;
  };
  recentDeposits: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    txHash: string;
    chain: string;
  }>;
  settings: {
    operatorWallet: string;
    tokenAddress: string;
    tokenSymbol: string;
    minimumDeposit: number;
    currentNAV: number;
    performanceYTD: number;
  } | null;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const haptics = useHaptics();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    fetchUserData();
  }, [isConnected, address]);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user');
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await res.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  if (!isConnected) {
    return null;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <Navbar />
        <AnimatedBackground />
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="text-xl text-gray-600 mb-4">Failed to load dashboard</p>
            <button onClick={fetchUserData} className="btn btn-primary">
              Retry
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const { user, recentDeposits, settings } = userData;
  const isPositiveReturn = user.returns >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden safe-bottom">
      <AnimatedBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10">
        {/* Welcome Section - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient">
              Welcome back!
            </h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg">
            Your portfolio is {isPositiveReturn ? 'growing' : 'performing'} 📈
          </p>
        </motion.div>

        {/* Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
          <StatCard
            icon={Wallet}
            label="Total Invested"
            value={formatUSDC(user.totalInvested)}
            color="blue"
            delay={0}
          />

          <StatCard
            icon={DollarSign}
            label="Current Value"
            value={formatUSDC(user.currentValue)}
            color="purple"
            delay={100}
          />

          <StatCard
            icon={isPositiveReturn ? TrendingUp : TrendingUp}
            label="Total Returns"
            value={formatUSDC(user.returns)}
            change={formatPercentage(user.returnsPercentage)}
            isPositive={isPositiveReturn}
            color={isPositiveReturn ? 'green' : 'red'}
            delay={200}
          />

          <StatCard
            icon={Activity}
            label="YTD Performance"
            value={formatPercentage(settings?.performanceYTD || 0)}
            color="orange"
            delay={300}
          />
        </div>

        {/* Action Cards - Mobile First */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/deposit"
              className="card-premium hover:shadow-2xl cursor-pointer group block h-full"
              onClick={(e) => haptics.impact('light', e.currentTarget)}
            >
              <div className="flex items-center justify-between p-2">
                <div>
                  <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/50 transition-shadow">
                      <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      Make a Deposit
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-gray-600">
                    Send USDC to grow your investment
                  </p>
                </div>
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="hidden sm:block"
                >
                  <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 text-green-600 group-hover:text-green-700 transition-colors" />
                </motion.div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/deposits"
              className="card-premium hover:shadow-2xl cursor-pointer group block h-full"
              onClick={(e) => haptics.impact('light', e.currentTarget)}
            >
              <div className="flex items-center justify-between p-2">
                <div>
                  <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                      <Activity className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      View History
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-gray-600">
                    See all your transactions
                  </p>
                </div>
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="hidden sm:block"
                >
                  <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 text-purple-600 group-hover:text-purple-700 transition-colors" />
                </motion.div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Recent Deposits - Mobile Optimized Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card-premium"
        >
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Recent Deposits
            </h2>
            <Link
              href="/deposits"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 group text-sm md:text-base"
            >
              <span>View All</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          {recentDeposits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 md:py-16"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Wallet className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-4 md:mb-6 text-base md:text-lg">No deposits yet</p>
              <Link href="/deposit" className="btn btn-primary">
                Make Your First Deposit
              </Link>
            </motion.div>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 md:py-4 px-3 md:px-4 text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left py-3 md:py-4 px-3 md:px-4 text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-3 md:py-4 px-3 md:px-4 text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Chain
                    </th>
                    <th className="text-left py-3 md:py-4 px-3 md:px-4 text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 md:py-4 px-3 md:px-4 text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Tx
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeposits.map((deposit, index) => (
                    <motion.tr
                      key={deposit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="py-3 md:py-4 px-3 md:px-4 text-xs md:text-sm text-gray-900 font-medium">
                        {new Date(deposit.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-4">
                        <span className="text-base md:text-lg font-bold text-gray-900">
                          {formatUSDC(deposit.amount)}
                        </span>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-4">
                        <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                          <Layers className="w-3 h-3 mr-1" />
                          {deposit.chain || 'ARBITRUM'}
                        </span>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-4">
                        <motion.span
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className={`inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                            deposit.status === 'CREDITED'
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                              : deposit.status === 'CONFIRMED'
                              ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-500/50'
                              : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-500/50'
                          }`}
                        >
                          {deposit.status}
                        </motion.span>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-4">
                        <a
                          href={`https://${deposit.chain === 'SOLANA' ? 'solscan.io' : 'arbiscan.io'}/tx/${deposit.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-semibold group text-xs md:text-sm"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Performance Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-6 md:mt-8 text-center"
        >
          <Link
            href="/performance"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group text-sm md:text-base"
          >
            <span className="font-medium">View Detailed Performance</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
