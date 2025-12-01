'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Shield, Activity, Zap, AlertTriangle, Sparkles, Database } from 'lucide-react';

const fundingSeries = [
  { window: '02:00', funding: -8, basis: 42 },
  { window: '06:00', funding: -5, basis: 38 },
  { window: '10:00', funding: -2, basis: 35 },
  { window: '14:00', funding: 1, basis: 33 },
  { window: '18:00', funding: 4, basis: 31 },
  { window: '22:00', funding: 7, basis: 29 },
];

const positioningData = [
  { session: 'Mon', longs: 54, shorts: 46 },
  { session: 'Tue', longs: 58, shorts: 42 },
  { session: 'Wed', longs: 52, shorts: 48 },
  { session: 'Thu', longs: 49, shorts: 51 },
  { session: 'Fri', longs: 61, shorts: 39 },
];

const insightTimeline = [
  {
    id: 'liquidity-gap',
    title: 'Liquidity pocket identified on BTC',
    detail: 'Books thin between 66.1k-66.5k; expect expansion if funding remains negative for two more windows.',
    impact: 'Medium',
  },
  {
    id: 'basis-reset',
    title: 'Quarterly basis reset to 2.9%',
    detail: 'Hedge funds unwound bullish calendars after macro release. Opportunity to reload if curve steepens again.',
    impact: 'High',
  },
  {
    id: 'oi-expansion',
    title: 'Open interest added $520M overnight',
    detail: 'Majority on offshore venues with negative funding—likely short-term fade attempt.',
    impact: 'Medium',
  },
];

const telemetryCards = [
  {
    icon: Shield,
    label: 'Risk budget deployed',
    value: '64% of limit',
    description: 'Based on current playbooks and venue caps.',
  },
  {
    icon: Activity,
    label: 'Funding outlook',
    value: '-3.2 bps avg',
    description: 'Weighted across BTC/ETH/SOL perps next 12h.',
  },
  {
    icon: Zap,
    label: 'Latency to refresh',
    value: '11m',
    description: 'Time since data pipeline last ingested.',
  },
];

export default function IntelligencePage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">Desk intelligence</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Live funding outlook, basis dislocations, and positioning context so your futures desk can respond before execution commands leave OMS.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {telemetryCards.map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="card-premium flex items-start space-x-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="card-premium"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Funding vs basis</p>
                <h2 className="text-2xl font-bold text-gray-900">Premium trend radar</h2>
              </div>
              <span className="text-sm text-gray-500">6 windows</span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fundingSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="window" />
                  <YAxis yAxisId="left" orientation="left" stroke="#10b981" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6366f1" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="funding" stroke="#10b981" name="Funding (bps)" />
                  <Line yAxisId="right" type="monotone" dataKey="basis" stroke="#6366f1" name="Basis (bps annualized)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="card-premium"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Positioning</p>
                <h2 className="text-2xl font-bold text-gray-900">Long vs short balance</h2>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Database className="w-4 h-4" />
                <span>Perp venues</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={positioningData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="longs" stackId="1" stroke="#2563eb" fillOpacity={0.5} fill="#60a5fa" name="Longs %" />
                  <Area type="monotone" dataKey="shorts" stackId="1" stroke="#f97316" fillOpacity={0.5} fill="#fdba74" name="Shorts %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card-premium"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Alert tape</p>
              <h2 className="text-2xl font-bold text-gray-900">Narratives worth acting on</h2>
            </div>
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {insightTimeline.map((insight) => (
              <div key={insight.id} className="rounded-2xl border border-gray-100 p-4 bg-white/70">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      insight.impact === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {insight.impact}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{insight.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
