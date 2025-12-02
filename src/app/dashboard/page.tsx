'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Activity, ArrowRight, Gauge, NotebookPen, Sparkles, Target, CheckCircle2 } from 'lucide-react';

import { Navbar } from '@/components/Navbar';
import { StatCard } from '@/components/StatCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { StrategyPlan, loadStrategies } from '@/lib/validation/strategy';
import { formatDate } from '@/lib/utils';

interface FundingRow {
  id: string;
  pair: string;
  venue: string;
  fundingBps: number;
  nextWindow: string;
  pressure: string;
  confidence: string;
}

interface MarketPulseItem {
  id: string;
  title: string;
  change: string;
  detail: string;
}

interface ActionItem {
  id: string;
  label: string;
  description: string;
}

const fundingRadar: FundingRow[] = [
  {
    id: 'btc-binance',
    pair: 'BTC-PERP',
    venue: 'Binance',
    fundingBps: -6.2,
    nextWindow: '08:00 UTC',
    pressure: 'Longs paying shorts',
    confidence: 'HIGH',
  },
  {
    id: 'eth-okx',
    pair: 'ETH-PERP',
    venue: 'OKX',
    fundingBps: -2.1,
    nextWindow: '12:00 UTC',
    pressure: 'Neutralizing',
    confidence: 'MED',
  },
  {
    id: 'sol-bybit',
    pair: 'SOL-PERP',
    venue: 'Bybit',
    fundingBps: 4.4,
    nextWindow: '16:00 UTC',
    pressure: 'Shorts paying longs',
    confidence: 'LOW',
  },
];

const marketPulse: MarketPulseItem[] = [
  {
    id: 'open-interest',
    title: 'Open interest expansion',
    change: '+8.3%',
    detail: 'OI on BTC perps added $480M overnight with no spot follow through. Dealers likely short gamma into Asia.',
  },
  {
    id: 'basis',
    title: 'Basis normalized',
    change: '-12 bps',
    detail: 'Quarterly futures basis retraced back inside 60bps annualized after aggressive short hedging.',
  },
  {
    id: 'liquidity',
    title: 'Liquidity pockets',
    change: 'New level',
    detail: 'CVD shows resting bids at 62.8k BTC with thin books above 65k. Expect slippage if chasing breakout legs.',
  },
];

const actionItems: ActionItem[] = [
  {
    id: 'journal-touch',
    label: 'Journal update',
    description: 'Document why ETH structure shifted to balanced after Shanghai gamma roll-off.',
  },
  {
    id: 'funding-check',
    label: 'Funding hedge',
    description: 'Consider offsetting BTC funding bleed with calendar spreads if premium persists.',
  },
  {
    id: 'liquidity-review',
    label: 'Liquidity review',
    description: 'Recalculate max venue size for SOL after Bybit slippage alert triggered.',
  },
];

export default function DashboardPage() {
  const [strategies, setStrategies] = useState<StrategyPlan[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      const stored = loadStrategies();
      setStrategies(stored);
      setLastUpdated(new Date().toISOString());
      setLoading(false);
    };

    load();
    const syncFromStorage = () => load();
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  const strategySummary = useMemo(() => {
    if (!strategies.length) {
      return {
        livePlans: 0,
        readyPlans: 0,
        drafts: 0,
        avgConviction: '0.0',
        avgRiskBps: 0,
        activeMarkets: 0,
      };
    }

    const livePlans = strategies.filter((plan) => plan.status === 'LIVE').length;
    const readyPlans = strategies.filter((plan) => plan.status === 'READY').length;
    const drafts = strategies.filter((plan) => plan.status === 'DRAFT').length;
    const totalConviction = strategies.reduce((sum, plan) => sum + plan.conviction, 0);
    const totalRisk = strategies.reduce((sum, plan) => sum + plan.riskBps, 0);
    const activeMarkets = new Set(strategies.map((plan) => plan.market)).size;

    return {
      livePlans,
      readyPlans,
      drafts,
      avgConviction: (totalConviction / strategies.length).toFixed(1),
      avgRiskBps: Math.round(totalRisk / strategies.length),
      activeMarkets,
    };
  }, [strategies]);

  const upcoming = useMemo(
    () => strategies.filter((plan) => plan.status !== 'ARCHIVED').slice(0, 4),
    [strategies]
  );

  if (loading) {
    return <LoadingScreen />;
  }

  const statCards = [
    {
      icon: NotebookPen,
      label: 'Live strategies',
      value: strategySummary.livePlans.toString(),
      color: 'blue' as const,
      delay: 0,
    },
    {
      icon: Target,
      label: 'Ready to launch',
      value: strategySummary.readyPlans.toString(),
      color: 'green' as const,
      delay: 100,
    },
    {
      icon: Gauge,
      label: 'Avg. conviction',
      value: strategySummary.avgConviction,
      color: 'purple' as const,
      delay: 200,
    },
    {
      icon: Activity,
      label: 'Avg. risk per play (bps)',
      value: `${strategySummary.avgRiskBps} bps`,
      color: 'orange' as const,
      delay: 300,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fef9f4] to-[#f8efe7] relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">FuturesPilot Workspace</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient">Research cockpit</h1>
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Snapshot refreshed <span className="font-semibold">{new Date(lastUpdated).toLocaleTimeString()}</span>. Keep an eye on funding pressure and the playbooks queued for activation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card-premium xl:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Funding radar</h2>
                <p className="text-gray-500">Per-venue funding outlook for the next window</p>
              </div>
              <div className="text-sm text-gray-500">
                Updated <span className="font-semibold">hourly</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                    <th className="pb-4">Pair</th>
                    <th className="pb-4">Venue</th>
                    <th className="pb-4">Funding (bps)</th>
                    <th className="pb-4">Pressure</th>
                    <th className="pb-4">Next window</th>
                  </tr>
                </thead>
                <tbody>
                  {fundingRadar.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 font-semibold text-gray-900">{row.pair}</td>
                      <td className="py-3 text-gray-600">{row.venue}</td>
                      <td className={`py-3 font-bold ${row.fundingBps < 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {row.fundingBps.toFixed(1)}
                      </td>
                      <td className="py-3 text-gray-600">{row.pressure}</td>
                      <td className="py-3 text-gray-500">{row.nextWindow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card-premium"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Market pulse</h2>
                <p className="text-gray-500">Narratives from the last session</p>
              </div>
            </div>
            <div className="space-y-4">
              {marketPulse.map((pulse) => (
                <div key={pulse.id} className="rounded-2xl border border-gray-100 p-4 bg-white/60">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{pulse.title}</h3>
                    <span className="text-sm font-bold text-blue-600">{pulse.change}</span>
                  </div>
                  <p className="text-sm text-gray-600">{pulse.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card-premium lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming playbooks</h2>
              <Link href="/strategies" className="text-blue-600 font-semibold inline-flex items-center space-x-1">
                <span>Go to Playbooks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                  <NotebookPen className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-gray-600">No playbooks logged yet. Capture your next idea to kick off funding checks.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((plan) => (
                  <div key={plan.id} className="p-4 rounded-2xl border border-gray-100 bg-white/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.3em]">{plan.market}</p>
                        <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          plan.status === 'READY'
                            ? 'bg-blue-100 text-blue-700'
                            : plan.status === 'LIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {plan.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{plan.narrative}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                      <span>Conviction: {plan.conviction}/5</span>
                      <span>Risk: {plan.riskBps} bps</span>
                      <span>{formatDate(plan.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-premium"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Action queue</h2>
              <span className="text-xs text-gray-500 uppercase tracking-[0.4em]">Desk ops</span>
            </div>
            <div className="space-y-4">
              {actionItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card-premium border border-dashed border-blue-200"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-blue-500 mb-2">Next step</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Document your next futures play</h2>
              <p className="text-gray-600 max-w-2xl">
                Capture narrative, funding plan, and guardrails before the window opens. FuturesPilot keeps the whole desk on the same page without touching executions.
              </p>
            </div>
            <Link href="/strategies" className="btn btn-primary inline-flex items-center space-x-2">
              <span>Open Playbook Studio</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
