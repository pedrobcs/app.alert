/**
 * Trade Log Component
 * 
 * Displays a list of executed trades with details
 */

'use client';

import React from 'react';

export interface Trade {
  id: string;
  signature: string;
  market: string;
  side: 'long' | 'short';
  action: 'open' | 'close';
  entryPrice?: number;
  exitPrice?: number;
  size: number;
  leverage: number;
  realizedPnl?: number;
  unrealizedPnl?: number;
  fees: number;
  signal?: string;
  signalReason?: string;
  status: string;
  executedAt: string;
  closedAt?: string;
}

interface TradeLogProps {
  trades: Trade[];
  isLoading?: boolean;
}

export const TradeLog: React.FC<TradeLogProps> = ({ trades, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Trade History</h3>
        <div className="text-center py-8 text-gray-400">Loading trades...</div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Trade History</h3>
        <div className="text-center py-8 text-gray-400">No trades yet</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Trade History</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
              <th className="pb-3">Time</th>
              <th className="pb-3">Market</th>
              <th className="pb-3">Side</th>
              <th className="pb-3">Action</th>
              <th className="pb-3">Size</th>
              <th className="pb-3">Entry</th>
              <th className="pb-3">Exit</th>
              <th className="pb-3">P&L</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                <td className="py-3 text-sm text-gray-300">
                  {new Date(trade.executedAt).toLocaleString()}
                </td>
                <td className="py-3 text-sm font-medium text-white">
                  {trade.market}
                </td>
                <td className="py-3">
                  <span className={`text-sm font-semibold ${
                    trade.side === 'long' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.side.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-300">
                  {trade.action}
                </td>
                <td className="py-3 text-sm text-gray-300">
                  {trade.size.toFixed(4)}
                </td>
                <td className="py-3 text-sm text-gray-300">
                  {trade.entryPrice ? `$${trade.entryPrice.toFixed(2)}` : '-'}
                </td>
                <td className="py-3 text-sm text-gray-300">
                  {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-'}
                </td>
                <td className="py-3">
                  {trade.realizedPnl !== undefined && trade.realizedPnl !== null ? (
                    <span className={`text-sm font-semibold ${
                      trade.realizedPnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${trade.realizedPnl.toFixed(2)}
                    </span>
                  ) : trade.unrealizedPnl !== undefined ? (
                    <span className={`text-sm ${
                      trade.unrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${trade.unrealizedPnl.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="py-3">
                  <StatusBadge status={trade.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trade Details Modal (simplified) */}
      <div className="mt-4 text-xs text-gray-500">
        Click a transaction to view on Solana Explorer
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors = {
    executed: 'bg-green-900/30 text-green-400 border-green-500/50',
    pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/50',
    failed: 'bg-red-900/30 text-red-400 border-red-500/50',
    cancelled: 'bg-gray-700 text-gray-400 border-gray-600',
  };

  const colorClass = colors[status as keyof typeof colors] || colors.pending;

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded border ${colorClass}`}>
      {status}
    </span>
  );
};

export default TradeLog;
