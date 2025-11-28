'use client';

import { Button } from '@/components/ui/button';
import { Bell, CircleUserRound, RefreshCcw, Search, Sun, MoonStar } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useDashboardStore } from '@/store/dashboardStore';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState } from 'react';

interface TopbarProps {
  loading?: boolean;
}

export function Topbar({ loading }: TopbarProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const refreshData = useDashboardStore((state) => state.refreshData);
  const [refreshing, setRefreshing] = useState(false);
  const currentTheme = useMemo(() => (theme === 'system' ? resolvedTheme : theme), [theme, resolvedTheme]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshData();
    setTimeout(() => setRefreshing(false), 800);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-3 rounded-2xl border border-black/5 bg-white/80 px-4 py-2 dark:border-white/10 dark:bg-white/5">
        <Search className="h-4 w-4 text-[var(--muted)]" />
        <input
          placeholder="Search bots, trades, or wallets"
          className="flex-1 border-none bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Refresh metrics"
          onClick={handleRefresh}
          className="rounded-2xl border border-black/5 text-[var(--muted)] hover:text-[var(--foreground)] dark:border-white/10"
          disabled={refreshing}
        >
          <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          className="rounded-2xl border border-black/5 text-[var(--muted)] hover:text-[var(--foreground)] dark:border-white/10"
          onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
        >
          {currentTheme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="rounded-2xl border border-black/5 text-[var(--muted)] hover:text-[var(--foreground)] dark:border-white/10"
        >
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5">
          <div className="text-right text-xs">
            <p className="font-semibold text-[var(--foreground)]">Elaine Rivers</p>
            <p className="text-[var(--muted)]">Quant Lead</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff6a00] to-[#ff9a3c] text-sm font-semibold text-black">
            <CircleUserRound className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
