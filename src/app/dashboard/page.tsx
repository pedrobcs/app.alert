'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { MetricCard } from '@/components/MetricCard';
import { WalletCard } from '@/components/WalletCard';
import { TradesTable } from '@/components/TradesTable';
import { PLChart } from '@/components/PLChart';
import { useDashboardStore } from '@/store/dashboardStore';
import type { BotStatus } from '@/store/dashboardStore';
import { formatPercentage, formatUSDC } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Gauge, Leaf, ShieldCheck, Signal, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { metrics, wallet, trades, chart, bot } = useDashboardStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  const toPercent = (value: number) =>
    metrics.totalBalance === 0 ? '+0.00%' : formatPercentage((value / metrics.totalBalance) * 100);

  const metricCards = useMemo(
    () => [
      {
        label: 'Total balance',
        value: formatUSDC(metrics.totalBalance),
        change: '+3.8% vs last week',
        trend: 'positive' as const,
        icon: Gauge,
      },
      {
        label: 'Daily P/L',
        value: formatUSDC(metrics.dailyPL),
        change: toPercent(metrics.dailyPL),
        trend: metrics.dailyPL >= 0 ? ('positive' as const) : ('negative' as const),
        icon: Activity,
      },
      {
        label: 'Weekly P/L',
        value: formatUSDC(metrics.weeklyPL),
        change: toPercent(metrics.weeklyPL),
        trend: metrics.weeklyPL >= 0 ? ('positive' as const) : ('negative' as const),
        icon: Zap,
      },
      {
        label: 'Monthly P/L',
        value: formatUSDC(metrics.monthlyPL),
        change: toPercent(metrics.monthlyPL),
        trend: metrics.monthlyPL >= 0 ? ('positive' as const) : ('negative' as const),
        icon: Signal,
      },
      {
        label: 'Win rate',
        value: `${metrics.winRate}%`,
        change: '+1.3% QoQ',
        trend: 'positive' as const,
        icon: Leaf,
      },
      {
        label: 'Trades executed',
        value: metrics.trades.toLocaleString(),
        change: '+18 this week',
        trend: 'neutral' as const,
        icon: ShieldCheck,
      },
    ],
    [metrics],
  );

  return (
    <div className="relative">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-0">
        <Sidebar />
        <div className="flex-1 space-y-8">
          <Topbar loading={loading} />

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {metricCards.map((metric) => (
              <MetricCard key={metric.label} loading={loading} {...metric} />
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PLChart data={chart} loading={loading} />
            </div>
            <WalletCard wallet={wallet} loading={loading} />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <BotStatusCard bot={bot} loading={loading} />
            <div className="xl:col-span-2">
              <TradesTable trades={trades} loading={loading} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

interface BotStatusCardProps {
  bot: BotStatus;
  loading?: boolean;
}

function BotStatusCard({ bot, loading }: BotStatusCardProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-4 h-10 w-24" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-4 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Trading bot</p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">Orion desk</h3>
        </div>
        <Badge variant={bot.status === 'Running' ? 'accent' : bot.status === 'Paused' ? 'warning' : 'danger'}>
          {bot.status}
        </Badge>
      </div>
      <dl className="mt-6 space-y-4 text-sm text-[var(--muted)]">
        <div className="flex items-center justify-between">
          <span>Runtime</span>
          <span className="font-semibold text-[var(--foreground)]">{bot.runtime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Version</span>
          <span className="font-semibold text-[var(--foreground)]">{bot.version}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Mode</span>
          <span className="font-semibold text-[var(--foreground)]">{bot.mode}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Last signal</span>
          <span className="font-semibold text-[var(--foreground)]">{bot.lastSignal}</span>
        </div>
      </dl>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-[var(--muted)]">
        <p className="font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">Status feed</p>
        <p className="mt-2 text-[var(--foreground)]">Adaptive momentum strategy is synced across Binance + Bybit with multi-venue hedging.</p>
      </div>
    </Card>
  );
}
