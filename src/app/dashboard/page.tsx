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
  const resolveStatusStyle = (status: string) =>
    statusPillStyles[status as keyof typeof statusPillStyles];

  const utilization =
    user.totalInvested > 0
      ? Math.min(99, Math.max(12, Math.round((user.currentValue / user.totalInvested) * 100)))
      : 74;

  const heroBadges = [
    {
      label: 'Desk utilization',
      value: `${utilization}%`,
      meta: 'Live coverage',
      accent: 'from-[#ff6a00] to-[#ff9a3c]',
      icon: Radar,
    },
    {
      label: 'Signal strength',
      value: '98.2%',
      meta: 'AI confidence',
      accent: 'from-[#ff8031] to-[#ffd399]',
      icon: Cpu,
    },
    {
      label: 'Latency',
      value: '31ms',
      meta: 'Global route',
      accent: 'from-[#f97316] to-[#facc15]',
      icon: Globe2,
    },
  ];

  const actionShortcuts = [
    {
      title: 'Instant deposit',
      description: 'Fund the vault with guided settlement.',
      href: '/deposit',
      accent: 'from-[#ff6a00]/90 via-[#ff8533]/90 to-[#ffaf5a]/90',
      icon: DollarSign,
    },
    {
      title: 'Statement vault',
      description: 'Audit every movement with receipts.',
      href: '/deposits',
      accent: 'from-[#ff4d4d]/90 via-[#ff7846]/80 to-[#ffbf3f]/80',
      icon: Zap,
    },
    {
      title: 'Performance lab',
      description: 'Drill into NAV, YTD & sharpe curves.',
      href: '/performance',
      accent: 'from-[#14b8a6]/90 via-[#0ea5e9]/80 to-[#60a5fa]/80',
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
      accent: 'from-[#ff6a00] via-[#ff8533] to-[#ffb347]',
    },
    {
      label: 'Cash buffer',
      value: 0.32,
      valueLabel: '32%',
      meta: 'Ready liquidity',
      accent: 'from-[#f97316] to-[#facc15]',
    },
    {
      label: 'AI uptime',
      value: 0.97,
      valueLabel: '97%',
      meta: 'Guardian online',
      accent: 'from-[#c084fc] to-[#f472b6]',
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

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-16 relative z-10 space-y-14">
        <section className="text-center space-y-8">
          <p className="text-[11px] uppercase tracking-[0.8em] text-white/60 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ff9a3c]" />
            ArbiBot Intelligence Core
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-white">
            Easier &amp; Smarter Capital Deployment
          </h1>
          <p className="max-w-2xl mx-auto text-base text-white/70 leading-relaxed">
            Monitoring {formatUSDC(user.currentValue)} across {formatUSDC(user.totalInvested)} deployed.
            Your desk stays matte-black, minimal, and laser precise while ArbiBot streams every metric in real-time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/deposit" className="cta-button">
              Deploy capital
              <span className="cta-button-icon">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/performance" className="btn-ghost">
              Performance deck
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="neon-slider">
            <div className="slider-node text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="neon-slider-track">
              <div className="neon-slider-glow" />
            </div>
            <div className="slider-node text-white">
              <Globe2 className="w-5 h-5" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {heroBadges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glow-card p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg', badge.accent)}>
                  <badge.icon className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase tracking-[0.4em] text-white/60">{badge.meta}</span>
              </div>
              <p className="text-3xl font-semibold text-white">{badge.value}</p>
              <p className="text-sm uppercase tracking-[0.4em] text-white/50">{badge.label}</p>
            </motion.div>
          ))}
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
                <div className="rounded-2xl p-3 bg-white/5">
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

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn('lg:col-span-7 rounded-[32px] border p-8 space-y-6', panelBaseClass)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Bot telemetry</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Neural vitals</h3>
                <p className={cn('text-sm', textMuted)}>
                  Desk utilization lives at {utilization}% with automated safeguards on standby.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-full border border-white/15 p-2 text-white/70 hover:text-white transition"
              >
                {themeIsDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <div className="space-y-5">
              {signalPulses.map((pulse) => (
                <div key={pulse.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold uppercase tracking-[0.3em] text-white/60">
                      {pulse.label}
                    </span>
                    <span className="font-semibold">{pulse.valueLabel}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pulse.value * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className={cn('h-full rounded-full bg-gradient-to-r', pulse.accent)}
                    />
                  </div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{pulse.meta}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Latest deposit</p>
                <p className="text-2xl font-semibold text-white">{formatUSDC(latestDeposit.amount)}</p>
                <p className="text-sm text-white/60">{formatDate(latestDeposit.createdAt)}</p>
              </div>
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold tracking-[0.2em] border',
                  resolveStatusStyle(latestDeposit.status) ?? 'border-white/20 text-white/70',
                )}
              >
                {latestDeposit.status}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn('lg:col-span-5 rounded-[32px] border p-8 space-y-5', panelBaseClass)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Flight deck</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Quick actions</h3>
              </div>
            </div>
            {actionShortcuts.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group block rounded-3xl border border-white/10 bg-white/5 px-5 py-4 transition duration-300 hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className={cn('rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg', action.accent)}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-white">{action.title}</p>
                    <p className="text-sm text-white/60">{action.description}</p>
                  </div>
                  <motion.div initial={{ x: 0 }} whileHover={{ x: 6 }} transition={{ duration: 0.3 }}>
                    <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:text-white" />
                  </motion.div>
                </div>
              </Link>
            ))}
          </motion.div>
        </section>

        <section className="grid grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className={cn('col-span-12 lg:col-span-5 rounded-[32px] border p-8', panelBaseClass)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Alpha feed</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Signal stream</h3>
              </div>
              <Signal className="w-5 h-5 text-white/70" />
            </div>
            <ul className="mt-6 space-y-4">
              {alphaSignals.map((signal, idx) => (
                <motion.li
                  key={signal.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * idx }}
                  className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 flex items-center gap-4"
                >
                  <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.3em] text-white/70 bg-white/10">
                    {signal.chip}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{signal.title}</p>
                    <p className="text-sm text-white/60">{signal.subtitle}</p>
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
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">{signal.status}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn('col-span-12 lg:col-span-3 rounded-[32px] border p-8 space-y-4', panelBaseClass)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Global mesh</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Node coverage</h3>
              </div>
              <Globe2 className="w-5 h-5 text-white/70" />
            </div>
            {globalNodes.map((node) => (
              <div key={node.region} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{node.region}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{node.latency}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">{node.load}</p>
                  <p className={cn('text-xs', node.delta.startsWith('+') ? 'text-emerald-400' : 'text-rose-400')}>
                    {node.delta}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={cn('col-span-12 lg:col-span-4 rounded-[32px] border p-8 space-y-4', panelBaseClass)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Timeline</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Mission log</h3>
              </div>
              <Layers className="w-5 h-5 text-white/70" />
            </div>
            <div className="space-y-5">
              {missionTimeline.map((event, idx) => (
                <motion.div
                  key={event.time}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * idx }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/10">
                    <Timer className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{event.title}</p>
                    <p className="text-sm text-white/60">{event.detail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">{event.time}</p>
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
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn('col-span-12 xl:col-span-8 rounded-[32px] border p-8', panelBaseClass)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>Ledger</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Recent deposits</h3>
              </div>
              <Link
                href="/deposits"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:text-white hover:border-white/40 transition"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            {isUsingMockDeposits && (
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/60">
                Previewing mock ledger flow until live deposits arrive.
              </p>
            )}
            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <table className="w-full text-sm text-white/80">
                <thead className="text-left text-[11px] uppercase tracking-[0.4em] text-white/60 bg-white/5">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Transaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tableDeposits.map((deposit, index) => (
                    <motion.tr
                      key={deposit.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * index }}
                      className="text-sm"
                    >
                      <td className="px-6 py-5 font-semibold text-white">{formatDate(deposit.createdAt)}</td>
                      <td className="px-6 py-5">
                        <span className="text-lg font-semibold text-white">
                          {formatUSDC(deposit.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]',
                            resolveStatusStyle(deposit.status) ?? 'border border-white/20 text-white/70',
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
                          className="inline-flex items-center gap-1 font-semibold text-[#ff9a3c] hover:text-white"
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
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={cn('col-span-12 xl:col-span-4 rounded-[32px] border p-8 space-y-5', panelBaseClass)}
          >
            <div>
              <p className={cn('text-xs uppercase tracking-[0.4em]', textSoft)}>System health</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Session brief</h3>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Compliance</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {user.isKycVerified ? 'Identity verified' : 'Verification pending'}
                </p>
                <p className="text-sm text-white/60">
                  {user.isKycVerified
                    ? "You're cleared for unlimited deposits."
                    : 'Complete verification to unlock higher limits.'}
                </p>
              </div>
              <div
                className={cn(
                  'rounded-2xl p-4',
                  user.isKycVerified ? 'bg-emerald-500/15 text-emerald-200' : 'bg-amber-500/15 text-amber-200',
                )}
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Latest deposit</span>
                <span className="text-white/50">{formatDate(latestDeposit.createdAt)}</span>
              </div>
              <p className="text-2xl font-semibold text-white">{formatUSDC(latestDeposit.amount)}</p>
              <p className="text-sm text-white/60">Status: {latestDeposit.status}</p>
              <a
                href={getArbiscanLink(latestDeposit.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff9a3c]"
              >
                Inspect on-chain
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Token</span>
                <span className="text-white/50">NAV {settings?.currentNAV ?? '—'}</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {settings?.tokenSymbol || 'Token TBD'}
              </p>
              <p className="text-sm text-white/60">Precision-mapped to Arbitrum.</p>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
