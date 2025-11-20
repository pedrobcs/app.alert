'use client';

import { User } from '@/hooks/useAuth';
import { formatUSDC } from '@/lib/blockchain';

export function BalanceCard({ user, nav }: { user: User; nav: string }) {
  const totalInvested = parseFloat(user.totalInvested);
  const shares = parseFloat(user.shares);
  const navValue = parseFloat(nav);
  const currentValue = shares * navValue;
  const profit = currentValue - totalInvested;
  const profitPercent = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
  
  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">Your Investment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Invested */}
        <div>
          <p className="text-gray-400 text-sm mb-2">Total Invested</p>
          <p className="text-3xl font-bold">${formatUSDC(totalInvested)}</p>
        </div>
        
        {/* Current Value */}
        <div>
          <p className="text-gray-400 text-sm mb-2">Current Value</p>
          <p className="text-3xl font-bold">${formatUSDC(currentValue)}</p>
        </div>
        
        {/* Profit/Loss */}
        <div>
          <p className="text-gray-400 text-sm mb-2">Profit/Loss</p>
          <div>
            <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {profit >= 0 ? '+' : ''}{formatUSDC(profit)}
            </p>
            <p className={`text-sm ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {profit >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Your Shares</span>
          <span className="font-semibold">{shares.toFixed(4)}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-gray-400">NAV per Share</span>
          <span className="font-semibold">${navValue.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}
