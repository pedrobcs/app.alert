'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, Bot, Layers, Settings, Wallet } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/deposits', label: 'Deposits', icon: Wallet },
  { href: '/performance', label: 'Performance', icon: Layers },
  { href: '/admin', label: 'Admin', icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel sticky top-6 hidden h-[calc(100vh-48px)] w-64 flex-col justify-between p-6 lg:flex">
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">ArbiBot CRM</p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">Control room</h2>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all',
                  active
                    ? 'bg-gradient-to-r from-[#ff6a00]/90 to-[#ff9a3c]/90 text-black shadow-[0_12px_30px_rgba(255,122,24,0.35)]'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5',
                )}
              >
                <Icon className={cn('h-4 w-4', active && 'text-black')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[var(--muted)]">
        <p className="font-semibold text-[var(--foreground)]">Need more automation?</p>
        <p className="mt-2">Extend ArbiBot with bespoke strategies and desk automation.</p>
        <Link href="/contact" className="mt-4 inline-flex text-xs font-semibold text-[#ff9a3c]">
          Contact desk →
        </Link>
      </div>
    </aside>
  );
}
