'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { LoadingScreen } from '@/components/LoadingScreen';
import { formatUSDC, formatDate, getArbiscanLink, isValidTxHash } from '@/lib/utils';
import { ExternalLink, Search, CheckCircle2, Clock, XCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Deposit {
  id: string;
  txHash: string;
  amount: number;
  status: string;
  confirmations: number;
  createdAt: string;
  creditedAt: string | null;
  shares: number;
}

export default function DepositsPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [txHash, setTxHash] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    fetchDeposits();
  }, [isConnected]);

  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/deposits');
      if (!res.ok) throw new Error('Failed to fetch deposits');
      const data = await res.json();
      setDeposits(data.deposits || []);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      toast.error('Failed to load deposits');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleTrackTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidTxHash(txHash)) {
      toast.error('Invalid transaction hash format');
      return;
    }

    try {
      setSubmitting(true);
      toast.loading('Verifying transaction...', { id: 'track' });

      const res = await fetch('/api/deposits/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash,
          userAddress: address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to track deposit');
      }

      toast.success('Deposit tracked successfully!', { id: 'track' });
      setTxHash('');
      fetchDeposits();
    } catch (error: any) {
      console.error('Track error:', error);
      toast.error(error.message || 'Failed to track deposit', { id: 'track' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CREDITED':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'CONFIRMED':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREDITED':
        return 'from-green-400 to-emerald-500 shadow-green-500/50';
      case 'CONFIRMED':
        return 'from-blue-400 to-blue-500 shadow-blue-500/50';
      case 'PENDING':
        return 'from-yellow-400 to-amber-500 shadow-yellow-500/50';
      default:
        return 'from-red-400 to-red-500 shadow-red-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
            Transaction History
          </h1>
          <p className="text-gray-600 text-lg">
            View and track all your USDC deposits
          </p>
        </motion.div>

        {/* Manual Tracking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Track a Transaction
              </h2>
              <p className="text-gray-600">
                Already sent USDC? Enter your transaction hash to track it:
              </p>
            </div>
          </div>
          
          <form onSubmit={handleTrackTransaction} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="0x... (Transaction Hash)"
              className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              disabled={submitting}
            />
            <motion.button
              type="submit"
              disabled={submitting || !txHash}
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              whileTap={{ scale: submitting ? 1 : 0.95 }}
              className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
                submitting || !txHash
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-2xl'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>{submitting ? 'Tracking...' : 'Track'}</span>
            </motion.button>
          </form>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Find your transaction hash on{' '}
              <a
                href="https://arbiscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                Arbiscan.io
              </a>
              {' '}or in your wallet's transaction history.
            </p>
          </div>
        </motion.div>

        {/* Deposits Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-premium"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              All Deposits
            </h2>
            <Link
              href="/deposit"
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Deposit</span>
            </Link>
          </div>

          {deposits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No deposits found</h3>
              <p className="text-gray-600 mb-6">
                Start by making your first deposit or track an existing transaction above.
              </p>
              <Link href="/deposit" className="btn btn-primary inline-flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Make Your First Deposit</span>
              </Link>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Shares
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Confirmations
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Transaction
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit, index) => (
                    <motion.tr
                      key={deposit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                        {formatDate(deposit.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-lg font-bold text-gray-900">
                          {formatUSDC(deposit.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                        {deposit.shares > 0 ? deposit.shares.toFixed(4) : '-'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(deposit.status)}
                          <span
                            className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${getStatusColor(deposit.status)} text-white shadow-lg`}
                          >
                            {deposit.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-900 text-sm font-semibold">
                          {deposit.confirmations}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <a
                          href={getArbiscanLink(deposit.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-semibold group"
                        >
                          <span>View</span>
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600">
            Need help? Contact{' '}
            <a
              href="mailto:support@arbibot.com"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              support@arbibot.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
