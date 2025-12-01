'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, PenSquare } from 'lucide-react';
import toast from 'react-hot-toast';

import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { LoadingScreen } from '@/components/LoadingScreen';
import { StrategyForm } from '@/components/StrategyForm';
import {
  StrategyDirection,
  StrategyStatus,
  strategyStatusValues,
} from '@/lib/validation/strategy';
import { formatDate } from '@/lib/utils';

interface StrategyPlan {
  id: string;
  title: string;
  market: string;
  direction: StrategyDirection;
  timeframe: string;
  narrative: string;
  entryPlan: string;
  invalidation: string;
  targetPlan: string;
  conviction: number;
  riskBps: number;
  status: StrategyStatus;
  tags: string[];
  createdAt: string;
}

interface StrategiesResponse {
  plans: StrategyPlan[];
  summary: {
    total: number;
    statusCounts: Record<string, number>;
    avgRiskBps: number;
    avgConviction: string;
    activeMarkets: number;
    nextUp: StrategyPlan[];
  };
}

const statusDetails: Record<StrategyStatus, { label: string; accent: string; description: string }> = {
  DRAFT: {
    label: 'Draft',
    accent: 'border-gray-200',
    description: 'Still validating narrative or liquidity plan.',
  },
  READY: {
    label: 'Ready',
    accent: 'border-blue-200',
    description: 'Guardrails in place. Waiting for trigger.',
  },
  LIVE: {
    label: 'Live',
    accent: 'border-green-200',
    description: 'Actively monitored by the desk.',
  },
  ARCHIVED: {
    label: 'Archived',
    accent: 'border-gray-200 opacity-60',
    description: 'Kept for reference and post-mortems.',
  },
};

export default function StrategiesPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [data, setData] = useState<StrategiesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/strategies');
      if (!res.ok) {
        throw new Error('Failed to load strategies');
      }
      const payload = await res.json();
      setData(payload);
    } catch (error) {
      console.error('Strategies fetch error:', error);
      const message =
        error instanceof Error ? error.message : 'Unable to load playbooks';
      toast.error(message);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, []);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    fetchPlans();
  }, [isConnected, router, fetchPlans]);

  const groupedPlans = useMemo(() => {
    const groups: Record<StrategyStatus, StrategyPlan[]> = {
      DRAFT: [],
      READY: [],
      LIVE: [],
      ARCHIVED: [],
    };

    data?.plans.forEach((plan) => {
      groups[plan.status].push(plan);
    });

    return groups;
  }, [data]);

  const handleStatusChange = async (id: string, status: StrategyStatus) => {
    try {
      setStatusUpdating(id);
      const res = await fetch(`/api/strategies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error || 'Failed to update status');
      }

      const updated = await res.json();
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          plans: prev.plans.map((plan) => (plan.id === id ? updated.plan : plan)),
        };
      });
      toast.success('Status updated');
    } catch (error) {
      console.error('Update strategy status error:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to update status';
      toast.error(message);
    } finally {
      setStatusUpdating(null);
    }
  };

  if (!isConnected) {
    return null;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navbar />
        <AnimatedBackground />
        <div className="flex items-center justify-center min-h-[80vh]">
          <p className="text-gray-600">Unable to load strategies.</p>
        </div>
      </div>
    );
  }

  const statusOrder: StrategyStatus[] = ['READY', 'LIVE', 'DRAFT', 'ARCHIVED'];

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
            <Sparkles className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">Playbook studio</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Keep every futures idea accountable with entry math, funding context, and guardrails. No executions happen here—this is your desk OS.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {statusOrder.map((status) => (
              <motion.section
                key={status}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500">{statusDetails[status].label}</p>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {statusDetails[status].label} ({groupedPlans[status]?.length || 0})
                    </h2>
                    <span className="text-sm text-gray-500">{statusDetails[status].description}</span>
                  </div>
                </div>

                {groupedPlans[status] && groupedPlans[status].length > 0 ? (
                  <div className="space-y-4">
                    {groupedPlans[status].map((plan) => (
                      <div
                        key={plan.id}
                        className={`card-premium border ${statusDetails[status].accent}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                                {plan.market}
                              </span>
                              <span className="text-xs font-semibold text-gray-500">{plan.direction}</span>
                              <span className="text-xs font-semibold text-gray-400">{plan.timeframe}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{plan.narrative}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <label className="text-xs font-semibold text-gray-500">Status</label>
                            <select
                              className="input w-40"
                              value={plan.status}
                              disabled={statusUpdating === plan.id}
                              onChange={(e) =>
                                handleStatusChange(plan.id, e.target.value as StrategyStatus)
                              }
                            >
                              {strategyStatusValues.map((value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
                          <div>
                            <p className="font-semibold text-gray-500 mb-1">Entry</p>
                            <p>{plan.entryPlan}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-500 mb-1">Invalidation</p>
                            <p>{plan.invalidation}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-500 mb-1">Target</p>
                            <p>{plan.targetPlan}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between mt-4 text-xs text-gray-500 gap-3">
                          <div className="flex items-center space-x-3">
                            <span>Conviction: {plan.conviction}/5</span>
                            <span>Risk: {plan.riskBps} bps</span>
                            <span>Created: {formatDate(plan.createdAt)}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {plan.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card flex items-center space-x-3 text-gray-500">
                    <PenSquare className="w-5 h-5" />
                    <span>No playbooks in this stage yet.</span>
                  </div>
                )}
              </motion.section>
            ))}
          </div>

          <div className="space-y-8">
            <StrategyForm onCreated={fetchPlans} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card-premium"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-2">Need inspo?</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Review ready queue</h3>
              <p className="text-sm text-gray-600">
                {data.summary.nextUp.length > 0
                  ? 'Take one of the ready playbooks live once liquidity and funding align.'
                  : 'Once you add playbooks they will show up here for quick review.'}
              </p>
              <div className="mt-4 space-y-3">
                {data.summary.nextUp.slice(0, 3).map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{plan.title}</p>
                      <p className="text-xs text-gray-500">{plan.market} · Conviction {plan.conviction}/5</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
