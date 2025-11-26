'use client';

import { create } from 'zustand';
import { format } from 'date-fns';

export type TradeDirection = 'LONG' | 'SHORT';

export interface TradeRow {
  id: string;
  pair: string;
  direction: TradeDirection;
  size: number;
  pnl: number;
  status: 'Closed' | 'Open';
  exchange: string;
  timestamp: string;
}

export interface WalletSnapshot {
  balance: number;
  deposits: number;
  withdrawals: number;
  pending: number;
}

export interface BotStatus {
  status: 'Running' | 'Paused' | 'Error';
  runtime: string;
  version: string;
  mode: string;
  lastSignal: string;
}

export interface ChartPoint {
  date: string;
  pnl: number;
}

export interface MetricSummary {
  totalBalance: number;
  dailyPL: number;
  weeklyPL: number;
  monthlyPL: number;
  winRate: number;
  trades: number;
}

export interface DashboardState {
  metrics: MetricSummary;
  wallet: WalletSnapshot;
  trades: TradeRow[];
  chart: ChartPoint[];
  bot: BotStatus;
  refreshData: () => void;
}

const randomBetween = (min: number, max: number) => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

const mockTrades: TradeRow[] = Array.from({ length: 7 }).map((_, idx) => {
  const direction = Math.random() > 0.5 ? 'LONG' : 'SHORT';
  const pnl = randomBetween(-9500, 15800);
  return {
    id: `ARB-${5600 + idx}`,
    pair: `BTC/USD`,
    direction,
    size: randomBetween(0.8, 2.8),
    pnl,
    status: pnl > 0 ? 'Closed' : 'Open',
    exchange: idx % 2 === 0 ? 'Binance' : 'Bybit',
    timestamp: format(Date.now() - idx * 1000 * 60 * 60 * 5, 'MMM d • HH:mm'),
  };
});

const mockChart: ChartPoint[] = Array.from({ length: 14 }).map((_, idx) => ({
  date: format(Date.now() - (13 - idx) * 24 * 60 * 60 * 1000, 'MMM d'),
  pnl: randomBetween(-4, 12),
}));

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: {
    totalBalance: 1_845_320,
    dailyPL: 18450,
    weeklyPL: 73320,
    monthlyPL: 245280,
    winRate: 68,
    trades: 1427,
  },
  wallet: {
    balance: 1_120_450,
    deposits: 2_450_000,
    withdrawals: 645_000,
    pending: 24_500,
  },
  trades: mockTrades,
  chart: mockChart,
  bot: {
    status: 'Running',
    runtime: '142h live',
    version: 'v3.8.1 Orion',
    mode: 'Adaptive Momentum',
    lastSignal: '5m ago',
  },
  refreshData: () =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        dailyPL: state.metrics.dailyPL + randomBetween(-2500, 5500),
        weeklyPL: state.metrics.weeklyPL + randomBetween(-6000, 9000),
        monthlyPL: state.metrics.monthlyPL + randomBetween(-12000, 20000),
        winRate: Math.min(85, Math.max(55, state.metrics.winRate + randomBetween(-2, 2))),
      },
      chart: state.chart.map((point, idx) =>
        idx === state.chart.length - 1
          ? { ...point, pnl: point.pnl + randomBetween(-2, 3) }
          : point,
      ),
    })),
}));
