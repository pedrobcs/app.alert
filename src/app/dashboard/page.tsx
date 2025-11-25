'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import {
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
  const maxDepositAmount = depositPreview.reduce(
    (max, deposit) => Math.max(max, deposit.amount),
    0,
  );
  const sparklineBars = depositPreview.map((deposit) => ({
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
  const metricHighlights = [
    {
      label: 'Total invested',
      value: formatUSDC(user.totalInvested),
      meta: 'Capital allocated',
      icon: Wallet,
    },
    {
      label: 'Current value',
      value: formatUSDC(user.currentValue),
      meta: 'Marked to NAV',
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
      meta: 'Managed YTD',
      icon: Activity,
    },
  ];
  const quickActions = [
    {
      title: 'Deposit instantly',
      description: 'Move capital into the vault in seconds.',
      href: '/deposit',
      accent: 'from-sky-500/90 to-indigo-500/80',
      icon: ArrowUpRight,
    },
    {
      title: 'Statement history',
      description: 'Full audit trail of every deposit and status.',
      href: '/deposits',
      accent: 'from-purple-500/90 to-pink-500/80',
      icon: Activity,
    },
    {
      title: 'Performance lab',
      description: 'Visualize NAV, YTD and momentum markers.',
      href: '/performance',
      accent: 'from-emerald-500/90 to-lime-500/80',
      icon: LineChart,
    },
  ];
  const latestDeposit = recentDeposits[0];
  const statusPillStyles: Record<string, string> = {
    CREDITED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-100',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 right-0 w-[420px] h-[420px] bg-gradient-to-br from-blue-200/70 via-indigo-200/60 to-purple-200/70 blur-3xl" />
        <div className="absolute -bottom-24 left-[-120px] w-[360px] h-[360px] bg-gradient-to-br from-rose-200/70 via-fuchsia-200/60 to-amber-200/70 blur-3xl" />
      </div>
      <AnimatedBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 relative z-10 space-y-12">
        <section className="grid grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-12 xl:col-span-8 rounded-[32px] bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0px_30px_60px_rgba(15,15,15,0.08)] p-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute right-[-60px] top-[-80px] w-[280px] h-[280px] bg-gradient-to-br from-blue-100/90 to-purple-100/60 blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-gray-500">
                <Sparkles className="w-4 h-4 text-slate-900" />
                Portfolio control center
              </div>
              <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-4">
                <div>
                  <p className="text-sm text-gray-500">Good to see you</p>
                  <h1 className="text-4xl 2xl:text-5xl font-semibold text-gray-900">
                    Welcome back, {formatAddress(user.walletAddress)}
                  </h1>
                </div>
                <div className="flex items-center gap-3 rounded-full border border-black/5 bg-black/5 px-4 py-2 text-sm text-gray-600">
                  <span className="text-xs uppercase tracking-wide text-gray-400">
                    Net change
                  </span>
                  <span
                    className={`text-lg font-semibold ${
                      netChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {formattedNetChange}{' '}
                    <span className="text-xs font-medium text-gray-500">
                      ({formatPercentage(netChangePercentage)})
                    </span>
                  </span>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-[#fbfbfd] to-white p-5 shadow-inner">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
                    Current value
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {formatUSDC(user.currentValue)}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Marked as of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-[#f9f9fb] to-white p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
                    YTD performance
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {formatPercentage(settings?.performanceYTD || 0)}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Apple-style precision benchmark
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-[#f9f9fb] to-white p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
                    Lifetime return
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {formatUSDC(user.returns)}
                  </p>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      isPositiveReturn ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {formatPercentage(user.returnsPercentage || 0)}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                    user.isKycVerified
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {user.isKycVerified ? 'KYC verified' : 'KYC pending review'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-gray-700">
                  <Wallet className="w-4 h-4" />
                  {formatAddress(user.walletAddress)}
                </span>
                {settings?.tokenSymbol && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-gray-700">
                    <Activity className="w-4 h-4" />
                    Token: {settings.tokenSymbol}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-12 xl:col-span-4 rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl border border-white/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                Snapshot
              </p>
              <span className="text-xs rounded-full bg-white/10 px-3 py-1 text-white/70">
                Desk ready
              </span>
            </div>
            <h2 className="mt-8 text-4xl font-semibold">
              {formatUSDC(user.currentValue)}
            </h2>
            <p className="mt-1 text-white/70">
              {netChange >= 0 ? 'Ahead of basis' : 'Below basis'} by{' '}
              {formattedNetChange}
            </p>

            <div className="mt-8 space-y-4 text-sm text-white/80">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span>Minimum deposit</span>
                <strong>{settings?.minimumDeposit ? formatUSDC(settings.minimumDeposit) : '—'}</strong>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span>Operator wallet</span>
                <a
                  href={
                    settings?.operatorWallet
                      ? getArbiscanAddressLink(settings.operatorWallet)
                      : '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sky-200 hover:text-white"
                >
                  {settings?.operatorWallet
                    ? formatAddress(settings.operatorWallet, 3)
                    : '—'}
                  {settings?.operatorWallet && (
                    <ExternalLink className="w-3 h-3" />
                  )}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span>Token address</span>
                <span className="text-white">
                  {settings?.tokenAddress
                    ? formatAddress(settings.tokenAddress, 3)
                    : '—'}
                </span>
              </div>
            </div>

            <Link
              href="/deposit"
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white text-slate-900 py-3 font-semibold hover:bg-slate-100 transition"
            >
              Fund the desk
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricHighlights.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_15px_35px_rgba(15,15,15,0.06)] hover:shadow-[0_25px_45px_rgba(15,15,15,0.12)] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-slate-900/5 p-3">
                  <metric.icon className="w-5 h-5 text-slate-900" />
                </div>
                {metric.meta && (
                  <span
                    className={`text-xs font-semibold ${
                      metric.positive
                        ? 'text-emerald-600'
                        : metric.positive === false
                        ? 'text-rose-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {metric.meta}
                  </span>
                )}
              </div>
              <p className="mt-8 text-3xl font-semibold text-gray-900">
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-gray-500">{metric.label}</p>
            </motion.div>
          ))}
        </section>

        <section className="grid grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-12 lg:col-span-7 rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-[0_35px_65px_rgba(15,15,15,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-gray-400">
                  Momentum
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-gray-900">
                  Portfolio cadence
                </h3>
                <p className="text-sm text-gray-500">
                  Normalized against the last {depositPreview.length || '—'} deposits
                </p>
              </div>
              <Link
                href="/performance"
                className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900"
              >
                Detailed view
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {sparklineBars.length > 0 ? (
              <>
                <div className="mt-10 flex items-end gap-4 h-48">
                  {sparklineBars.map((bar, idx) => (
                    <div key={bar.id} className="flex-1 flex flex-col items-center gap-3">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${bar.height}%` }}
                        transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                        className="w-full rounded-3xl bg-gradient-to-t from-blue-100 to-blue-500 shadow-inner flex items-end justify-center"
                      >
                        <span className="mb-4 text-xs font-semibold text-white drop-shadow">
                          {bar.amount}
                        </span>
                      </motion.div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-900">
                          {bar.label}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
                          {bar.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm text-gray-500">
                  Each bar represents a deposit event. Heights scale against the largest recent deposit to keep the visual lightweight and desktop focused.
                </p>
              </>
            ) : (
              <div className="mt-10 text-center py-16">
                <p className="text-lg font-medium text-gray-600">
                  No deposits yet
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Start a deposit to populate performance visuals.
                </p>
                <Link href="/deposit" className="btn btn-primary mt-6 inline-flex items-center gap-2">
                  Fund now
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-12 lg:col-span-5 rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-[0_25px_55px_rgba(15,15,15,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-gray-400">
                  Quick actions
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-gray-900">
                  Decide fast
                </h3>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {quickActions.map((action, idx) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group block rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-5 hover:-translate-y-1 hover:shadow-xl transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-2xl bg-gradient-to-br ${action.accent} p-3 text-white shadow-lg`}
                    >
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-900">
                        {action.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {action.description}
                      </p>
                    </div>
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 6 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
                    </motion.div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-12 xl:col-span-8 rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-[0_30px_60px_rgba(15,15,15,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-gray-400">
                  Ledger
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-gray-900">
                  Recent deposits
                </h3>
              </div>
              <Link
                href="/deposits"
                className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {recentDeposits.length === 0 ? (
              <div className="mt-12 text-center">
                <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-lg font-medium text-gray-700">
                  Ledger is quiet
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Create your first deposit to activate the desk.
                </p>
              </div>
            ) : (
              <div className="mt-8 overflow-hidden rounded-3xl border border-slate-100">
                <table className="w-full">
                  <thead className="bg-slate-50/80 text-left text-xs uppercase tracking-[0.3em] text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Transaction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white/70">
                    {recentDeposits.slice(0, 6).map((deposit, index) => (
                      <motion.tr
                        key={deposit.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.08 }}
                        className="text-sm text-gray-700"
                      >
                        <td className="px-6 py-5 font-semibold text-gray-900">
                          {formatDate(deposit.createdAt)}
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-lg font-semibold text-gray-900">
                            {formatUSDC(deposit.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                              statusPillStyles[deposit.status] || 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {deposit.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <a
                            href={getArbiscanLink(deposit.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:text-blue-600"
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
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-12 xl:col-span-4 rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-[0_25px_55px_rgba(15,15,15,0.08)] space-y-8"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-gray-400">
                System health
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-gray-900">
                Session brief
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    Compliance
                  </p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {user.isKycVerified ? 'Verified identity' : 'Pending verification'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.isKycVerified ? (
                      <>You're cleared for unlimited deposits.</>
                    ) : (
                      <>Complete verification to unlock higher limits.</>
                    )}
                  </p>
                </div>
                <div
                  className={`rounded-2xl p-4 ${
                    user.isKycVerified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                  }`}
                >
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Latest deposit</span>
                  <span className="text-xs text-gray-400">
                    {latestDeposit ? formatDate(latestDeposit.createdAt) : '—'}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  {latestDeposit ? formatUSDC(latestDeposit.amount) : formatUSDC(settings?.minimumDeposit || 0)}
                </p>
                <p className="text-sm text-gray-500">
                  {latestDeposit ? `Status: ${latestDeposit.status}` : 'Awaiting first entry'}
                </p>
                {latestDeposit && (
                  <a
                    href={getArbiscanLink(latestDeposit.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
                  >
                    Inspect on-chain
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Token</span>
                  <span className="text-xs text-gray-400">NAV {settings?.currentNAV ?? '—'}</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {settings?.tokenSymbol || 'Token TBD'}
                </p>
                <p className="text-sm text-gray-500">
                  Precision-mapped to Arbitrum.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
