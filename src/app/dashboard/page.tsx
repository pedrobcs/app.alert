'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { formatUSDC, formatPercentage } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Activity,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

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
      setLoading(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <p className="text-xl text-gray-600">Failed to load dashboard</p>
            <button
              onClick={fetchUserData}
              className="mt-4 btn btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { user, recentDeposits, settings } = userData;
  const isPositiveReturn = user.returns >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            Here's your investment overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total Invested</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatUSDC(user.totalInvested)}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Current Value</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatUSDC(user.currentValue)}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isPositiveReturn ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {isPositiveReturn ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
              <span className="text-sm text-gray-500">Total Returns</span>
            </div>
            <div
              className={`text-3xl font-bold ${
                isPositiveReturn ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatUSDC(user.returns)}
            </div>
            <div
              className={`text-sm ${
                isPositiveReturn ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatPercentage(user.returnsPercentage)}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">YTD Performance</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatPercentage(settings?.performanceYTD || 0)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/deposit"
            className="card hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Make a Deposit
                </h3>
                <p className="text-gray-600">
                  Send USDC to grow your investment
                </p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/deposits"
            className="card hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  View History
                </h3>
                <p className="text-gray-600">
                  See all your transactions
                </p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-purple-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Recent Deposits */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Deposits
          </h2>

          {recentDeposits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No deposits yet</p>
              <Link href="/deposit" className="btn btn-primary">
                Make Your First Deposit
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Transaction
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeposits.map((deposit) => (
                    <tr key={deposit.id} className="border-b border-gray-100">
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {new Date(deposit.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                        {formatUSDC(deposit.amount)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            deposit.status === 'CREDITED'
                              ? 'bg-green-100 text-green-800'
                              : deposit.status === 'CONFIRMED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {deposit.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <a
                          href={`https://arbiscan.io/tx/${deposit.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View on Arbiscan
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
