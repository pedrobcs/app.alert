'use client';

import { TradeRow } from '@/store/dashboardStore';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface TradesTableProps {
  trades: TradeRow[];
  loading?: boolean;
}

export function TradesTable({ trades, loading }: TradesTableProps) {
  if (loading) {
    return (
      <Card className="p-0">
        <div className="divide-y divide-black/5 dark:divide-white/10">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="p-4">
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Recent trades</p>
          <h3 className="text-xl font-semibold text-[var(--foreground)]">Execution log</h3>
        </div>
        <Badge variant="accent">Live</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">
            <tr>
              <th className="px-6 py-3">Pair</th>
              <th className="px-6 py-3">Side</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">P/L</th>
              <th className="px-6 py-3">Exchange</th>
              <th className="px-6 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {trades.map((trade) => (
              <tr key={trade.id} className="text-[var(--foreground)]">
                <td className="px-6 py-4 font-semibold">{trade.pair}</td>
                <td className="px-6 py-4">
                  <Badge variant={trade.direction === 'LONG' ? 'success' : 'danger'}>{trade.direction}</Badge>
                </td>
                <td className="px-6 py-4">{trade.size.toFixed(2)} BTC</td>
                <td
                  className={cn(
                    'px-6 py-4 font-semibold',
                    trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400',
                  )}
                >
                  {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-[var(--muted)]">{trade.exchange}</td>
                <td className="px-6 py-4 text-[var(--muted)]">{trade.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
