/**
 * Bot Status Component
 * 
 * Displays bot status, current position, and performance stats
 */

'use client';

import React from 'react';
import { Position } from '@/types';

interface BotStats {
  totalTrades: number;
  successfulTrades: number;
  totalPnl: number;
  winRate: number;
}

interface BotStatusProps {
  botId: string;
  name: string;
  market: string;
  status: 'stopped' | 'running' | 'paused' | 'error';
  lastSignal?: {
    signal: string;
    reason: string;
    confidence: number;
  };
  lastSignalTime?: Date;
  currentPosition?: Position;
  stats: BotStats;
  errorMessage?: string;
}

export const BotStatus: React.FC<BotStatusProps> = ({
  name,
  market,
  status,
  lastSignal,
  lastSignalTime,
  currentPosition,
  stats,
  errorMessage,
}) => {
  const statusColors = {
    stopped: 'bg-gray-600 text-gray-300',
    running: 'bg-green-600 text-white',
    paused: 'bg-yellow-600 text-white',
    error: 'bg-red-600 text-white',
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{name}</h2>
          <p className="text-gray-400 mt-1">{market}</p>
        </div>
        <div className={`px-4 py-2 rounded-full font-semibold ${statusColors[status]}`}>
          {status.toUpperCase()}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="text-xl">❌</span>
            <div className="flex-1">
              <h4 className="font-semibold text-red-400 mb-1">Error</h4>
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Current Position */}
      {currentPosition ? (
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Current Position</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Side</div>
              <div className={`text-lg font-bold ${
                currentPosition.side === 'long' ? 'text-green-400' : 'text-red-400'
              }`}>
                {currentPosition.side.toUpperCase()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Size</div>
              <div className="text-lg font-bold text-white">
                {currentPosition.size.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Entry Price</div>
              <div className="text-lg font-bold text-white">
                ${currentPosition.entryPrice.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Unrealized P&L</div>
              <div className={`text-lg font-bold ${
                currentPosition.unrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ${currentPosition.unrealizedPnl.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-700 rounded-lg p-4 text-center text-gray-400">
          No open position
        </div>
      )}

      {/* Last Signal */}
      {lastSignal && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Last Signal</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Signal:</span>
              <span className={`font-bold ${
                lastSignal.signal === 'long' ? 'text-green-400' :
                lastSignal.signal === 'short' ? 'text-red-400' :
                'text-gray-400'
              }`}>
                {lastSignal.signal.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Confidence:</span>
              <span className="text-white">{(lastSignal.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="mt-2 p-3 bg-gray-800 rounded text-sm text-gray-300">
              {lastSignal.reason}
            </div>
            {lastSignalTime && (
              <div className="text-xs text-gray-500 mt-2">
                {new Date(lastSignalTime).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Total Trades</div>
            <div className="text-2xl font-bold text-white">{stats.totalTrades}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Successful</div>
            <div className="text-2xl font-bold text-green-400">{stats.successfulTrades}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-white">{stats.winRate.toFixed(0)}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Total P&L</div>
            <div className={`text-2xl font-bold ${
              stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              ${stats.totalPnl.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotStatus;
