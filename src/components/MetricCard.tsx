'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  description?: string;
  loading?: boolean;
  icon?: LucideIcon;
}

export function MetricCard({ label, value, change, trend = 'neutral', description, loading, icon: Icon }: MetricCardProps) {
  if (loading) {
    return (
      <Card className="min-h-[142px]">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-4 h-10 w-32" />
        <Skeleton className="mt-2 h-4 w-20" />
      </Card>
    );
  }

  return (
    <Card className="min-h-[142px] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
        <span>{label}</span>
        {Icon ? <Icon className="h-4 w-4 text-[var(--muted)]" /> : null}
      </div>
      <div className="mt-4 flex items-baseline gap-3 text-3xl font-semibold text-[var(--foreground)]">
        <span>{value}</span>
        {change ? (
          <span
            className={cn(
              'text-sm font-medium flex items-center gap-1',
              trend === 'positive' && 'text-emerald-500 dark:text-emerald-400',
              trend === 'negative' && 'text-rose-500 dark:text-rose-400',
              trend === 'neutral' && 'text-[var(--muted)]',
            )}
          >
            {trend === 'positive' && <TrendingUp className="h-4 w-4" />}
            {trend === 'negative' && <TrendingDown className="h-4 w-4" />}
            {change}
          </span>
        ) : null}
      </div>
      {description ? <p className="mt-2 text-sm text-[var(--muted)]">{description}</p> : null}
    </Card>
  );
}
