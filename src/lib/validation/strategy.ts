import { z } from 'zod';

export const strategyDirectionValues = ['LONG', 'SHORT', 'NEUTRAL'] as const;
export const strategyStatusValues = ['DRAFT', 'READY', 'LIVE', 'ARCHIVED'] as const;

export const createStrategySchema = z.object({
  title: z.string().min(3).max(100),
  market: z.string().min(2).max(20),
  direction: z.enum(strategyDirectionValues),
  timeframe: z.string().min(2).max(50),
  narrative: z.string().min(10).max(2000),
  entryPlan: z.string().min(3).max(500),
  invalidation: z.string().min(3).max(500),
  targetPlan: z.string().min(3).max(500),
  conviction: z.number().int().min(1).max(5),
  riskBps: z.number().int().min(10).max(500),
  tags: z.array(z.string().min(1).max(20)).max(6).optional().default([]),
});

export const updateStrategyStatusSchema = z.object({
  status: z.enum(strategyStatusValues),
});

export type StrategyDirection = (typeof strategyDirectionValues)[number];
export type StrategyStatus = (typeof strategyStatusValues)[number];
