'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { formatUSDC } from '@/lib/blockchain';

interface Transaction {
  id: string;
  type: string;
  amount: string;
  shares?: string;
  txHash?: string;
  description?: string;
  createdAt: string;
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'text-green-500';
      case 'WITHDRAWAL':
        return 'text-red-500';
      case 'PROFIT_DISTRIBUTION':
        return 'text-blue-500';
      case 'FEE':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return '↓';
      case 'WITHDRAWAL':
        return '↑';
      case 'PROFIT_DISTRIBUTION':
        return '💰';
      case 'FEE':
        return '⚡';
      default:
        return '•';
    }
  };
  
  if (loading) {
    return (
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Transaction History</h2>
        <div className="flex justify-center py-12">
          <div className="spinner w-8 h-8"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No transactions yet</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`text-2xl ${getTypeColor(tx.type)}`}>
                  {getTypeIcon(tx.type)}
                </div>
                <div>
                  <p className="font-semibold">
                    {tx.type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-gray-400">
                    {format(new Date(tx.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                  {tx.description && (
                    <p className="text-xs text-gray-500 mt-1">{tx.description}</p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-bold ${getTypeColor(tx.type)}`}>
                  ${formatUSDC(parseFloat(tx.amount))}
                </p>
                {tx.shares && (
                  <p className="text-xs text-gray-400">
                    {parseFloat(tx.shares).toFixed(4)} shares
                  </p>
                )}
                {tx.txHash && (
                  <a
                    href={`https://arbiscan.io/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-arbitrum hover:underline"
                  >
                    View on Arbiscan →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
