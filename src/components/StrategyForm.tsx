'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  StrategyDirection,
  StrategyPlan,
  buildStrategyPlan,
  strategyDirectionValues,
} from '@/lib/validation/strategy';
import { motion } from 'framer-motion';
import { Loader2, PlusCircle } from 'lucide-react';

interface StrategyFormProps {
  onCreate: (plan: StrategyPlan) => void;
}

const initialState = {
  title: '',
  market: 'BTC',
  direction: 'LONG' as StrategyDirection,
  timeframe: '1D',
  narrative: '',
  entryPlan: '',
  invalidation: '',
  targetPlan: '',
  conviction: 3,
  riskBps: 50,
  tags: '',
};

const inputClasses =
  'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm text-gray-900';

export function StrategyForm({ onCreate }: StrategyFormProps) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title || !form.narrative || !form.entryPlan || !form.invalidation || !form.targetPlan) {
      toast.error('Please complete all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const tags = form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const plan = buildStrategyPlan({
        title: form.title.trim(),
        market: form.market.trim().toUpperCase(),
        direction: form.direction,
        timeframe: form.timeframe.trim(),
        narrative: form.narrative.trim(),
        entryPlan: form.entryPlan.trim(),
        invalidation: form.invalidation.trim(),
        targetPlan: form.targetPlan.trim(),
        conviction: form.conviction,
        riskBps: form.riskBps,
        status: 'DRAFT',
        tags,
      });

      onCreate(plan);
      setForm(initialState);
      toast.success('Playbook captured');
    } catch (error) {
      console.error('Create strategy error:', error);
      toast.error('Failed to capture playbook');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="card-premium space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-blue-500 mb-2">New playbook</p>
        <h2 className="text-2xl font-bold text-gray-900">Capture a futures idea</h2>
        <p className="text-sm text-gray-600">
          Define narrative, risk, and execution guardrails. FuturesPilot keeps everything organized—no live trading required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-600">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            className={inputClasses}
            placeholder="BTC long on Asia open"
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Market</label>
          <input
            type="text"
            value={form.market}
            onChange={(e) => updateField('market', e.target.value)}
            className={inputClasses}
            placeholder="BTC"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-600">Direction</label>
          <select
            className={inputClasses}
            value={form.direction}
            onChange={(e) => updateField('direction', e.target.value as StrategyDirection)}
          >
            {strategyDirectionValues.map((direction) => (
              <option key={direction} value={direction}>
                {direction}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Timeframe</label>
          <input
            type="text"
            value={form.timeframe}
            onChange={(e) => updateField('timeframe', e.target.value)}
            className={inputClasses}
            placeholder="1D"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Risk (bps)</label>
          <input
            type="number"
            value={form.riskBps}
            min={10}
            max={500}
            step={5}
            onChange={(e) => updateField('riskBps', Number(e.target.value))}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-600">Narrative</label>
        <textarea
          className={`${inputClasses} min-h-[100px]`}
          value={form.narrative}
          onChange={(e) => updateField('narrative', e.target.value)}
          placeholder="What is the structural or short-term reason to take this trade?"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-600">Entry plan</label>
          <textarea
            className={`${inputClasses} min-h-[80px]`}
            value={form.entryPlan}
            onChange={(e) => updateField('entryPlan', e.target.value)}
            placeholder="Scale between..."
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Invalidation</label>
          <textarea
            className={`${inputClasses} min-h-[80px]`}
            value={form.invalidation}
            onChange={(e) => updateField('invalidation', e.target.value)}
            placeholder="If funding flips positive and..."
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Target plan</label>
          <textarea
            className={`${inputClasses} min-h-[80px]`}
            value={form.targetPlan}
            onChange={(e) => updateField('targetPlan', e.target.value)}
            placeholder="Take profit ladder..."
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-600">Conviction ({form.conviction}/5)</label>
          <input
            type="range"
            min={1}
            max={5}
            value={form.conviction}
            onChange={(e) => updateField('conviction', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">Tags</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => updateField('tags', e.target.value)}
            className={inputClasses}
            placeholder="funding, breakout"
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: submitting ? 1 : 1.01 }}
        whileTap={{ scale: submitting ? 1 : 0.99 }}
        className={`w-full btn btn-primary flex items-center justify-center space-x-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
        <span>{submitting ? 'Saving...' : 'Save playbook'}</span>
      </motion.button>
    </motion.form>
  );
}
