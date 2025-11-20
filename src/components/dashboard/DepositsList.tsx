'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { formatUSDC } from '@/lib/blockchain';

interface Deposit {
  id: string;
  txHash: string;
  amount: string;
  status: string;
  confirmations: number;
  blockTimestamp: string;
  creditedAt?: string;
  sharesIssued?: string;
}

export function DepositsList() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDeposits();
  }, []);
  
  const fetchDeposits = async () => {
    try {
      const response = await fetch('/api/deposits/list');
      if (response.ok) {
        const data = await response.json();
        setDeposits(data.deposits);
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREDITED':
        return 'text-green-500 bg-green-500/10';
      case 'CONFIRMED':
        return 'text-blue-500 bg-blue-500/10';
      case 'PENDING':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'REJECTED':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };
  
  if (loading) {
    return (
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Your Deposits</h2>
        <div className="flex justify-center py-12">
          <div className="spinner w-8 h-8"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Deposits</h2>
        <button
          onClick={fetchDeposits}
          className="text-sm text-arbitrum hover:underline"
        >
          Refresh
        </button>
      </div>
      
      {deposits.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No deposits yet</p>
      ) : (
        <div className="space-y-4">
          {deposits.map((deposit) => (
            <div
              key={deposit.id}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-lg">
                    ${formatUSDC(parseFloat(deposit.amount))}
                  </p>
                  <p className="text-sm text-gray-400">
                    {format(new Date(deposit.blockTimestamp), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(deposit.status)}`}>
                  {deposit.status}
                </span>
              </div>
              
              {deposit.sharesIssued && (
                <p className="text-sm text-gray-400 mb-2">
                  Shares issued: {parseFloat(deposit.sharesIssued).toFixed(4)}
                </p>
              )}
              
              <div className="flex justify-between items-center">
                <a
                  href={`https://arbiscan.io/tx/${deposit.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-arbitrum hover:underline"
                >
                  {deposit.txHash.slice(0, 10)}...{deposit.txHash.slice(-8)}
                </a>
                <span className="text-xs text-gray-500">
                  {deposit.confirmations} confirmations
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
