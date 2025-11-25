'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import {
  cn,
  formatUSDC,
  formatPercentage,
  formatAddress,
  formatDate,
  getArbiscanLink,
  getArbiscanAddressLink,
} from '@/lib/utils';
import {
  TrendingUp,
  Wallet,
  Activity,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  LineChart,
  ShieldCheck,
  Sun,
  Moon,
  Cpu,
  Globe2,
  Radar,
  Signal,
  Layers,
  Zap,
  Timer,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface UserData {
  user: {
    walletAddress: string;
    totalInvested: number;
    totalShares: number;
    currentValue: number;
    returns: number;
    returnsPercentage: number;
    isKycVerified: boolean;
  };
  recentDeposits: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    txHash: string;
  }>;
  settings: {
    operatorWallet: string;
    tokenAddress: string;
    tokenSymbol: string;
    minimumDeposit: number;
    currentNAV: number;
    performanceYTD: number;
  } | null;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('dashboard-theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      return;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('dashboard-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    fetchUserData();
  }, [isConnected, address]);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user');
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await res.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setTimeout(() => setLoading(false), 800); // Smooth transition
    }
  };

  if (!isConnected) {
    return null;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navbar />
        <AnimatedBackground />
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="text-xl text-gray-600 mb-4">Failed to load dashboard</p>
            <button onClick={fetchUserData} className="btn btn-primary">
              Retry
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const { user, recentDeposits, settings } = userData;
  const isPositiveReturn = user.returns >= 0;
  const netChange = user.currentValue - user.totalInvested;
  const formattedNetChange = `${netChange >= 0 ? '+' : '-'}${formatUSDC(
    Math.abs(netChange),
  )}`;
  const netChangePercentage =
    user.totalInvested > 0 ? (netChange / user.totalInvested) * 100 : 0;
  const depositPreview = recentDeposits.slice(0, 6);
  const fallbackDeposits: UserData['recentDeposits'] = [
    {
      id: 'mock-1',
      amount: 48250,
      status: 'CREDITED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      txHash: `0x${'a'.repeat(64)}`,
    },
    {
      id: 'mock-2',
      amount: 18300,
      status: 'CONFIRMED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      txHash: `0x${'b'.repeat(64)}`,
    },
    {
      id: 'mock-3',
      amount: 9600,
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
      txHash: `0x${'c'.repeat(64)}`,
    },
    {
      id: 'mock-4',
      amount: 25600,
      status: 'CREDITED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 54).toISOString(),
      txHash: `0x${'d'.repeat(64)}`,
    },
    {
      id: 'mock-5',
      amount: 14200,
      status: 'CONFIRMED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      txHash: `0x${'e'.repeat(64)}`,
    },
    {
      id: 'mock-6',
      amount: 7200,
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
      txHash: `0x${'f'.repeat(64)}`,
    },
  ];
  const depositSource = depositPreview.length ? depositPreview : fallbackDeposits;
  const tableDeposits = recentDeposits.length
    ? recentDeposits.slice(0, 6)
    : fallbackDeposits;
  const latestDeposit = recentDeposits[0] ?? fallbackDeposits[0];
  const maxDepositAmount = depositSource.reduce(
    (max, deposit) => Math.max(max, deposit.amount),
    0,
  );
  const sparklineBars = depositSource.map((deposit) => ({
    id: deposit.id,
    label: new Date(deposit.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    height: maxDepositAmount
      ? Math.max(18, (deposit.amount / maxDepositAmount) * 100)
      : 18,
    amount: formatUSDC(deposit.amount),
    status: deposit.status,
  }));

  const themeIsDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const textMuted = themeIsDark ? 'text-slate-400' : 'text-gray-500';
  const textSoft = themeIsDark ? 'text-slate-500' : 'text-gray-400';
  const panelBaseClass = themeIsDark
    ? 'bg-white/5 border-white/10 text-white shadow-[0_30px_90px_rgba(3,6,22,0.7)]'
    : 'bg-white/90 border-white/70 text-gray-900 shadow-[0_45px_90px_rgba(15,15,30,0.12)]';
  const solidPanelClass = themeIsDark
    ? 'bg-[#070912]/90 border-white/10 text-white shadow-[0_40px_80px_rgba(3,5,20,0.85)]'
    : 'bg-white border-white/70 text-gray-900 shadow-[0_35px_75px_rgba(15,15,30,0.15)]';
  const softPanelClass = themeIsDark
    ? 'bg-white/8 border-white/10 text-white'
    : 'bg-white/85 border-white/70 text-gray-900';
  const isUsingMockDeposits = recentDeposits.length === 0;

  const statusPillStyles = themeIsDark
    ? {
        CREDITED: 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/30',
        CONFIRMED: 'bg-blue-500/15 text-blue-200 border border-blue-400/30',
        PENDING: 'bg-amber-500/15 text-amber-200 border border-amber-400/30',
      }
    : {
        CREDITED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-100',
        PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
      };

  const utilization =
    user.totalInvested > 0
      ? Math.min(99, Math.max(12, Math.round((user.currentValue / user.totalInvested) * 100)))
      : 74;

  const heroBadges = [
    {
      label: 'Desk utilization',
      value: `${utilization}%`,
      meta: 'Live coverage',
      accent: 'from-sky-500 to-cyan-400',
      icon: Radar,
    },
    {
      label: 'Signal strength',
      value: '98.2%',
      meta: 'AI confidence',
      accent: 'from-purple-500 to-pink-500',
      icon: Cpu,
    },
    {
      label: 'Latency',
      value: '31ms',
      meta: 'Global route',
      accent: 'from-emerald-500 to-lime-400',
      icon: Globe2,
    },
  ];

  const actionShortcuts = [
    {
      title: 'Instant deposit',
      description: 'Fund the vault with guided settlement.',
      href: '/deposit',
      accent: 'from-sky-500/90 via-blue-500/90 to-indigo-500/90',
      icon: DollarSign,
    },
    {
      title: 'Statement vault',
      description: 'Audit every movement with receipts.',
      href: '/deposits',
      accent: 'from-purple-500/90 via-pink-500/80 to-rose-500/80',
      icon: Zap,
    },
    {
      title: 'Performance lab',
      description: 'Drill into NAV, YTD & sharpe curves.',
      href: '/performance',
      accent: 'from-emerald-500/90 via-lime-500/80 to-green-400/80',
      icon: LineChart,
    },
  ];

  const alphaSignals = [
    {
      title: 'Liquidity sweep',
      subtitle: 'Arbitrum delta neutral program',
      delta: '+3.4%',
      status: 'Executing',
      chip: 'AutoPilot',
    },
    {
      title: 'Basis capture',
      subtitle: 'Cross-exchange drift window',
      delta: '+1.1%',
      status: 'Monitoring',
      chip: 'Manual',
    },
    {
      title: 'Volatility buffer',
      subtitle: 'Options hedge primed',
      delta: '-0.3%',
      status: 'Cooling',
      chip: 'AI Guard',
    },
    {
      title: 'Yield recycler',
      subtitle: 'Stable loop compounding',
      delta: '+0.8%',
      status: 'Scaling',
      chip: 'Flow',
    },
  ];

  const globalNodes = [
    { region: 'Singapore', load: '72%', latency: '143ms', delta: '+8%' },
    { region: 'New York', load: '58%', latency: '46ms', delta: '+2%' },
    { region: 'Frankfurt', load: '64%', latency: '88ms', delta: '+5%' },
    { region: 'São Paulo', load: '41%', latency: '192ms', delta: '-3%' },
  ];

  const missionTimeline = [
    {
      time: '08:32 UTC',
      title: 'Vault rebalance',
      detail: 'Delta neutrality sweep',
      result: '+0.42%',
    },
    {
      time: '12:10 UTC',
      title: 'Gamma hedge',
      detail: 'Options ladder trimmed',
      result: '+0.18%',
    },
    {
      time: '15:55 UTC',
      title: 'Liquidity bridge',
      detail: 'Cross-chain refill',
      result: '+$1.2M',
    },
    {
      time: '18:27 UTC',
      title: 'Auto compounding',
      detail: 'Yield recycler synced',
      result: '+0.24%',
    },
  ];

  const signalPulses = [
    {
      label: 'Desk utilization',
      value: utilization / 100,
      valueLabel: `${utilization}%`,
      meta: formatUSDC(user.currentValue),
      accent: 'from-indigo-500 via-blue-500 to-cyan-400',
    },
    {
      label: 'Cash buffer',
      value: 0.32,
      valueLabel: '32%',
      meta: 'Ready liquidity',
      accent: 'from-emerald-500 to-lime-400',
    },
    {
      label: 'AI uptime',
      value: 0.97,
      valueLabel: '97%',
      meta: 'Guardian online',
      accent: 'from-fuchsia-500 to-purple-500',
    },
  ];

  const kineticStats = [
    {
      label: 'Total invested',
      value: formatUSDC(user.totalInvested),
      meta: 'Capital deployed',
      icon: Wallet,
    },
    {
      label: 'Current value',
      value: formatUSDC(user.currentValue),
      meta: 'Marked NAV',
      icon: DollarSign,
    },
    {
      label: 'Lifetime returns',
      value: formatUSDC(user.returns),
      meta: formatPercentage(user.returnsPercentage || 0),
      icon: TrendingUp,
      positive: isPositiveReturn,
    },
    {
      label: 'YTD performance',
      value: formatPercentage(settings?.performanceYTD || 0),
      meta: 'Fund benchmark',
      icon: Activity,
    },
  ];

  return (
    <div
      className={cn(
        'min-h-screen relative overflow-hidden transition-colors duration-700',
        themeIsDark ? 'bg-[#03050d] text-slate-50' : 'bg-[#f5f5f7] text-slate-900',
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`theme-backdrop-${theme}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className={cn(
              'absolute -top-32 right-0 w-[520px] h-[520px] blur-[140px]',
              themeIsDark
                ? 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_rgba(67,56,202,0.25),_transparent)]'
                : 'bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.4),_rgba(99,102,241,0.2),_transparent)]',
            )}
          />
          <div
            className={cn(
              'absolute -bottom-20 left-[-80px] w-[420px] h-[420px] blur-[160px]',
              themeIsDark
                ? 'bg-[radial-gradient(circle,_rgba(248,113,113,0.35),_rgba(236,72,153,0.2),_transparent)]'
                : 'bg-[radial-gradient(circle,_rgba(251,191,36,0.35),_rgba(244,114,182,0.2),_transparent)]',
            )}
          />
        </motion.div>
      </AnimatePresence>
      <AnimatedBackground />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-12 relative z-10 space-y-10">
        <section className="grid grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={cn(
              'col-span-12 xl:col-span-8 rounded-[36px] p-10 relative overflow-hidden border backdrop-blur-2xl',
              themeIsDark
                ? 'bg-gradient-to-br from-[#111325]/95 via-[#0c0f1e]/90 to-[#05060d]/95 border-white/10 text-white shadow-[0_45px_120px_rgba(1,2,8,0.9)]'
                : 'bg-gradient-to-br from-white/95 via-white/90 to-slate-50/90 border-white/60 text-gray-900 shadow-[0_45px_90px_rgba(15,15,30,0.15)]',
            )}
          >
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1.2 }}
                className={cn(
                  'absolute right-[-80px] top-[-120px] w-[320px] h-[320px] blur-[120px]',
                  themeIsDark
                    ? 'bg-[radial-gradient(circle,_rgba(56,189,248,0.4),_transparent)]'
                    : 'bg-[radial-gradient(circle,_rgba(59,130,246,0.3),_transparent)]',
                )}
              />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className={cn(
                        'flex items-center gap-3 text-[11px] uppercase tracking-[0.5em]',
                        themeIsDark ? 'text-white/60' : 'text-gray-500',
                      )}
                    >
                      <Sparkles className="w-4 h-4" />
                      Mission control
                    </div>
                    <h1 className="mt-4 text-4xl 2xl:text-5xl font-semibold leading-tight">
                      {formatAddress(user.walletAddress)} desk
                    </h1>
                    <p className={cn('mt-3 text-lg max-w-2xl', textMuted)}>
                      Your capital is {isPositiveReturn ? 'compounding' : 'stabilizing'} across the
                      ArbiBot CRM core. This panel mirrors an Apple-grade command center so every
                      action feels luxurious yet surgical.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-semibold tracking-[0.3em]',
                        themeIsDark ? 'bg-white/10 text-white/70' : 'bg-black/5 text-gray-600',
                      )}
                    >
                      LIVE
                    </span>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className={cn(
                        'rounded-full p-3 border transition-all duration-500',
                        themeIsDark
                          ? 'border-white/10 bg-white/5 text-amber-200 hover:bg-white/10'
                          : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
                      )}
                      aria-label="Toggle dashboard theme"
                    >
                      <motion.div
                        key={theme}
                        initial={{ rotate: -30, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        {themeIsDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      </motion.div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className={cn('rounded-2xl border px-6 py-4', softPanelClass)}>
                    <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Net change</p>
                    <p className="mt-2 text-3xl font-semibold">{formattedNetChange}</p>
                    <p
                      className={cn(
                        'text-sm font-semibold mt-1',
                        netChange >= 0 ? 'text-emerald-400' : 'text-rose-400',
                      )}
                    >
                      {formatPercentage(netChangePercentage)}
                    </p>
                  </div>
                  <div className={cn('rounded-2xl border px-6 py-4', softPanelClass)}>
                    <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>
                      Current value
                    </p>
                    <p className="mt-2 text-3xl font-semibold">{formatUSDC(user.currentValue)}</p>
                    <p className={cn('text-sm mt-1', textMuted)}>
                      Marked {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {heroBadges.map((badge) => (
                    <div
                      key={badge.label}
                      className={cn(
                        'rounded-3xl border px-5 py-4 flex flex-col gap-2',
                        softPanelClass,
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg',
                            badge.accent,
                          )}
                        >
                          <badge.icon className="w-5 h-5" />
                        </div>
                        <span className={cn('text-xs font-semibold', textMuted)}>{badge.meta}</span>
                      </div>
                      <p className="text-2xl font-semibold">{badge.value}</p>
                      <p className={cn('text-sm uppercase tracking-[0.3em]', textSoft)}>
                        {badge.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border',
                      user.isKycVerified
                        ? themeIsDark
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                          : 'border-emerald-100 bg-emerald-50 text-emerald-700'
                        : themeIsDark
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                        : 'border-amber-100 bg-amber-50 text-amber-700',
                    )}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {user.isKycVerified ? 'KYC verified' : 'KYC pending'}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border',
                      softPanelClass,
                    )}
                  >
                    <Wallet className="w-4 h-4" />
                    {formatAddress(user.walletAddress)}
                  </span>
                  {settings?.tokenSymbol && (
                    <span
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border',
                        softPanelClass,
                      )}
                    >
                      <Activity className="w-4 h-4" />
                      Token: {settings.tokenSymbol}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={cn(
              'col-span-12 xl:col-span-4 rounded-[36px] p-8 border space-y-6',
              solidPanelClass,
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Live systems</p>
                <h3 className="mt-3 text-2xl font-semibold">Neural vitals</h3>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <Radar className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-5">
              {signalPulses.map((pulse) => (
                <div key={pulse.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={cn('font-semibold uppercase tracking-[0.3em]', textSoft)}>
                      {pulse.label}
                    </span>
                    <span className="font-semibold">{pulse.valueLabel}</span>
                  </div>
                  <div className={cn('h-2 rounded-full overflow-hidden', themeIsDark ? 'bg-white/10' : 'bg-black/5')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pulse.value * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className={cn('h-full rounded-full bg-gradient-to-r', pulse.accent)}
                    />
                  </div>
                  <p className={cn('text-xs uppercase tracking-[0.3em]', textMuted)}>
                    {pulse.meta}
                  </p>
                </div>
              ))}
            </div>

            <div
              className={cn(
                'rounded-3xl border px-5 py-4 space-y-3 transition-colors',
                themeIsDark
                  ? 'border-white/10 bg-white/5'
                  : 'border-black/5 bg-white/80 shadow-lg shadow-black/5',
              )}
            >
              <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Latest move</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold">
                    {formatUSDC(latestDeposit.amount)}
                  </p>
                  <p className={cn('text-sm', textMuted)}>{formatDate(latestDeposit.createdAt)}</p>
                </div>
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-semibold tracking-[0.2em] border',
                    statusPillStyles[latestDeposit.status] ??
                      (themeIsDark
                        ? 'border-white/20 text-white/70'
                        : 'border-slate-200 text-gray-600'),
                  )}
                >
                  {latestDeposit.status}
                </span>
              </div>
              <Link
                href="/deposit"
                className={cn(
                  'inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold justify-center transition-all',
                  themeIsDark
                    ? 'bg-white text-slate-900 hover:bg-slate-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800',
                )}
              >
                Boost desk
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {kineticStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 * index }}
              className={cn('rounded-[28px] border p-6 backdrop-blur-xl', panelBaseClass)}
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    'rounded-2xl p-3',
                    themeIsDark ? 'bg-white/10' : 'bg-slate-900/5',
                  )}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    stat.positive === undefined
                      ? textSoft
                      : stat.positive
                      ? 'text-emerald-400'
                      : 'text-rose-400',
                  )}
                >
                  {stat.meta}
                </span>
              </div>
              <p className="mt-6 text-3xl font-semibold">{stat.value}</p>
              <p className={cn('mt-2 text-sm', textMuted)}>{stat.label}</p>
            </motion.div>
          ))}
        </section>

        <section className="grid grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn('col-span-12 lg:col-span-7 rounded-[32px] border p-8', panelBaseClass)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Cadence</p>
                <h3 className="mt-3 text-2xl font-semibold">Portfolio rhythm</h3>
                <p className={cn('text-sm', textMuted)}>
                  Normalized against the last {depositSource.length} deposits
                </p>
              </div>
              <Link
                href="/performance"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border',
                  themeIsDark ? 'border-white/10 hover:bg-white/5' : 'border-black/5 hover:bg-black/5',
                )}
              >
                Detailed view
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-10">
              <div className="flex items-end gap-4 h-52">
                {sparklineBars.map((bar, idx) => (
                  <div key={bar.id} className="flex-1 flex flex-col items-center gap-3">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${bar.height}%` }}
                      transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                      className={cn(
                        'w-full rounded-3xl flex items-end justify-center',
                        themeIsDark
                          ? 'bg-gradient-to-t from-slate-800 to-blue-500 shadow-[0_25px_45px_rgba(5,8,25,0.65)]'
                          : 'bg-gradient-to-t from-blue-100 to-blue-500 shadow-inner',
                      )}
                    >
                      <span className="mb-4 text-xs font-semibold text-white drop-shadow-lg">
                        {bar.amount}
                      </span>
                    </motion.div>
                    <div className="text-center">
                      <p className="text-xs font-semibold">{bar.label}</p>
                      <p className={cn('text-[11px] uppercase tracking-[0.3em]', textSoft)}>
                        {bar.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className={cn('mt-6 text-sm', textMuted)}>
                Each bar mirrors a deposit event. Heights scale to the largest inflow for a clean,
                desktop-first visualization.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn('col-span-12 lg:col-span-5 rounded-[32px] border p-8 space-y-4', panelBaseClass)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Flight deck</p>
                <h3 className="mt-3 text-2xl font-semibold">Quick actions</h3>
              </div>
            </div>
            {actionShortcuts.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={cn(
                  'group block rounded-3xl border px-5 py-4 transition-all duration-300',
                  themeIsDark
                    ? 'border-white/10 bg-white/5 hover:bg-white/10'
                    : 'border-slate-200 bg-white/90 hover:-translate-y-1 hover:shadow-xl',
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg',
                      action.accent,
                    )}
                  >
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{action.title}</p>
                    <p className={cn('text-sm', textMuted)}>{action.description}</p>
                  </div>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpRight className={cn('w-5 h-5', textMuted)} />
                  </motion.div>
                </div>
              </Link>
            ))}
          </motion.div>
        </section>

        <section className="grid grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={cn('col-span-12 lg:col-span-5 rounded-[32px] border p-8', panelBaseClass)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Alpha feed</p>
                <h3 className="mt-3 text-2xl font-semibold">Signal stream</h3>
              </div>
              <Signal className="w-5 h-5" />
            </div>
            <ul className="mt-6 space-y-4">
              {alphaSignals.map((signal, idx) => (
                <motion.li
                  key={signal.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className={cn(
                    'rounded-3xl border px-4 py-4 flex items-center gap-4',
                    themeIsDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-white',
                  )}
                >
                  <div
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.3em]',
                      themeIsDark ? 'bg-white/10 text-white/80' : 'bg-slate-900/5 text-gray-600',
                    )}
                  >
                    {signal.chip}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{signal.title}</p>
                    <p className={cn('text-sm', textMuted)}>{signal.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        'text-lg font-semibold',
                        signal.delta.startsWith('+') ? 'text-emerald-400' : 'text-rose-400',
                      )}
                    >
                      {signal.delta}
                    </p>
                    <p className={cn('text-xs uppercase tracking-[0.3em]', textSoft)}>
                      {signal.status}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn('col-span-12 lg:col-span-3 rounded-[32px] border p-8 space-y-4', panelBaseClass)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Global mesh</p>
                <h3 className="mt-3 text-xl font-semibold">Node coverage</h3>
              </div>
              <Globe2 className="w-5 h-5" />
            </div>
            {globalNodes.map((node) => (
              <div
                key={node.region}
                className={cn(
                  'rounded-2xl border px-4 py-3 flex items-center justify-between',
                  themeIsDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-white',
                )}
              >
                <div>
                  <p className="font-semibold">{node.region}</p>
                  <p className={cn('text-xs uppercase tracking-[0.3em]', textSoft)}>
                    {node.latency}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{node.load}</p>
                  <p className={cn('text-xs', node.delta.startsWith('+') ? 'text-emerald-400' : 'text-rose-400')}>
                    {node.delta}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className={cn('col-span-12 lg:col-span-4 rounded-[32px] border p-8 space-y-4', panelBaseClass)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Timeline</p>
                <h3 className="mt-3 text-2xl font-semibold">Mission log</h3>
              </div>
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-5">
              {missionTimeline.map((event, idx) => (
                <motion.div
                  key={event.time}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className={cn(
                    'rounded-2xl border px-4 py-3 flex items-center gap-4',
                    themeIsDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-white',
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-2xl flex items-center justify-center',
                      themeIsDark ? 'bg-white/10' : 'bg-slate-900/5',
                    )}
                  >
                    <Timer className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{event.title}</p>
                    <p className={cn('text-sm', textMuted)}>{event.detail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.3em]">{event.time}</p>
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        event.result.startsWith('-')
                          ? 'text-rose-400'
                          : event.result.includes('$')
                          ? 'text-sky-400'
                          : 'text-emerald-400',
                      )}
                    >
                      {event.result}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn('col-span-12 xl:col-span-8 rounded-[32px] border p-8', panelBaseClass)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Ledger</p>
                <h3 className="mt-3 text-2xl font-semibold">Recent deposits</h3>
              </div>
              <Link
                href="/deposits"
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border',
                  themeIsDark ? 'border-white/10 hover:bg-white/5' : 'border-black/5 hover:bg-black/5',
                )}
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            {isUsingMockDeposits && (
              <p className={cn('mt-2 text-xs uppercase tracking-[0.3em]', textMuted)}>
                Previewing mock ledger flow until live deposits arrive.
              </p>
            )}
            <div
              className={cn(
                'mt-8 overflow-hidden rounded-3xl border backdrop-blur-xl',
                themeIsDark ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/90',
              )}
            >
              <table className="w-full text-sm">
                <thead
                  className={cn(
                    'text-left text-[11px] uppercase tracking-[0.4em]',
                    themeIsDark ? 'bg-white/5 text-white/60' : 'bg-slate-50 text-gray-500',
                  )}
                >
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Transaction</th>
                  </tr>
                </thead>
                <tbody className={themeIsDark ? 'divide-white/5' : 'divide-slate-100'}>
                  {tableDeposits.map((deposit, index) => (
                    <motion.tr
                      key={deposit.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={cn(
                        'text-sm',
                        themeIsDark ? 'text-slate-200' : 'text-gray-800',
                      )}
                    >
                      <td className="px-6 py-5 font-semibold">{formatDate(deposit.createdAt)}</td>
                      <td className="px-6 py-5">
                        <span className="text-lg font-semibold">
                          {formatUSDC(deposit.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]',
                            statusPillStyles[deposit.status] ??
                              (themeIsDark
                                ? 'border border-white/20 text-white/70'
                                : 'border border-slate-200 text-gray-600'),
                          )}
                        >
                          {deposit.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <a
                          href={getArbiscanLink(deposit.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'inline-flex items-center gap-1 font-semibold',
                            themeIsDark ? 'text-sky-300 hover:text-white' : 'text-slate-900 hover:text-blue-600',
                          )}
                        >
                          View on-chain
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className={cn('col-span-12 xl:col-span-4 rounded-[32px] border p-8 space-y-5', panelBaseClass)}
          >
            <div>
              <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>System health</p>
              <h3 className="mt-3 text-2xl font-semibold">Session brief</h3>
            </div>
            <div
              className={cn(
                'rounded-2xl border px-4 py-4 flex items-center justify-between',
                themeIsDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-white',
              )}
            >
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Compliance</p>
                <p className="mt-2 text-lg font-semibold">
                  {user.isKycVerified ? 'Identity verified' : 'Verification pending'}
                </p>
                <p className={cn('text-sm', textMuted)}>
                  {user.isKycVerified
                    ? "You're cleared for unlimited deposits."
                    : 'Complete verification to unlock higher limits.'}
                </p>
              </div>
              <div
                className={cn(
                  'rounded-2xl p-4',
                  user.isKycVerified
                    ? themeIsDark
                      ? 'bg-emerald-500/15 text-emerald-200'
                      : 'bg-emerald-50 text-emerald-600'
                    : themeIsDark
                    ? 'bg-amber-500/15 text-amber-200'
                    : 'bg-amber-50 text-amber-600',
                )}
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div
              className={cn(
                'rounded-2xl border px-4 py-4 space-y-3',
                themeIsDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-white',
              )}
            >
              <div className="flex items-center justify-between text-sm">
                <span className={textMuted}>Latest deposit</span>
                <span className={textSoft}>{formatDate(latestDeposit.createdAt)}</span>
              </div>
              <p className="text-2xl font-semibold">{formatUSDC(latestDeposit.amount)}</p>
              <p className={cn('text-sm', textMuted)}>Status: {latestDeposit.status}</p>
              <a
                href={getArbiscanLink(latestDeposit.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-semibold',
                  themeIsDark ? 'text-sky-300 hover:text-white' : 'text-blue-600',
                )}
              >
                Inspect on-chain
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div
              className={cn(
                'rounded-2xl border px-4 py-4 space-y-2',
                themeIsDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-white',
              )}
            >
              <div className="flex items-center justify-between text-sm">
                <span className={textMuted}>Token</span>
                <span className={textSoft}>NAV {settings?.currentNAV ?? '—'}</span>
              </div>
              <p className="text-lg font-semibold">
                {settings?.tokenSymbol || 'Token TBD'}
              </p>
              <p className={cn('text-sm', textMuted)}>Precision-mapped to Arbitrum.</p>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
