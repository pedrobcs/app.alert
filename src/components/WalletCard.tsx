'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WalletSnapshot } from '@/store/dashboardStore';
import { formatUSDC } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, Wallet2 } from 'lucide-react';

interface WalletCardProps {
  wallet: WalletSnapshot;
  loading?: boolean;
}

export function WalletCard({ wallet, loading }: WalletCardProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-4 h-10 w-44" />
        <div className="mt-6 grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Wallet overview</p>
          <h3 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">{formatUSDC(wallet.balance)}</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">Available USDC liquidity</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
          <Wallet2 className="h-6 w-6 text-[#ff9a3c]" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl border border-black/5 bg-white/90 p-3 text-[var(--muted)] dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <ArrowUpRight className="h-4 w-4 text-emerald-400" /> Deposits
          </div>
          <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{formatUSDC(wallet.deposits)}</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white/90 p-3 text-[var(--muted)] dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <ArrowDownLeft className="h-4 w-4 text-rose-400" /> Withdrawals
          </div>
          <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{formatUSDC(wallet.withdrawals)}</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white/90 p-3 text-[var(--muted)] dark:border-white/10 dark:bg-white/5">
          <div className="text-[var(--muted)]">Pending</div>
          <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{formatUSDC(wallet.pending)}</p>
        </div>
      </div>
    </Card>
  );
}
