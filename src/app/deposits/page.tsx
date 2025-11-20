'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { formatUSDC, formatDate, getArbiscanLink, isValidTxHash } from '@/lib/utils';
import { ExternalLink, Search } from 'lucide-react';
import toast from 'react-hot-toast';

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
      setDeposits(data.deposits);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      toast.error('Failed to load deposits');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidTxHash(txHash)) {
      toast.error('Invalid transaction hash');
      return;
    }

    try {
      setSubmitting(true);
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

      toast.success('Deposit tracked successfully!');
      setTxHash('');
      fetchDeposits();
    } catch (error: any) {
      console.error('Track error:', error);
      toast.error(error.message || 'Failed to track deposit');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transaction History
          </h1>
          <p className="text-gray-600">
            View and track all your USDC deposits
          </p>
        </div>

        {/* Manual Tracking Form */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Track a Transaction
          </h2>
          <p className="text-gray-600 mb-4">
            Already sent USDC? Enter your transaction hash to track it:
          </p>
          <form onSubmit={handleTrackTransaction} className="flex gap-4">
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="0x..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>{submitting ? 'Tracking...' : 'Track'}</span>
            </button>
          </form>
        </div>

        {/* Deposits Table */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Deposits
          </h2>

          {deposits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No deposits found</p>
              <button
                onClick={() => router.push('/deposit')}
                className="btn btn-primary"
              >
                Make Your First Deposit
              </button>
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
                      Shares
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Confirmations
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Transaction
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr key={deposit.id} className="border-b border-gray-100">
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {formatDate(deposit.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                        {formatUSDC(deposit.amount)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {deposit.shares > 0 ? deposit.shares.toFixed(4) : '-'}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            deposit.status === 'CREDITED'
                              ? 'bg-green-100 text-green-800'
                              : deposit.status === 'CONFIRMED'
                              ? 'bg-blue-100 text-blue-800'
                              : deposit.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {deposit.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {deposit.confirmations}
                      </td>
                      <td className="py-4 px-4">
                        <a
                          href={getArbiscanLink(deposit.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-600 hover:underline text-sm"
                        >
                          <span>View</span>
                          <ExternalLink className="w-4 h-4" />
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
