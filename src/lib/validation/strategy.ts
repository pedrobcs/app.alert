export const strategyDirectionValues = ['LONG', 'SHORT', 'NEUTRAL'] as const;
export const strategyStatusValues = ['DRAFT', 'READY', 'LIVE', 'ARCHIVED'] as const;

export type StrategyDirection = (typeof strategyDirectionValues)[number];
export type StrategyStatus = (typeof strategyStatusValues)[number];

export interface StrategyPlan {
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

const STORAGE_KEY = 'futurespilot_strategies';

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const seedStrategies: StrategyPlan[] = [
  {
    id: 'seed-btc-long-breakout',
    title: 'BTC Asia session breakout',
    market: 'BTC',
    direction: 'LONG',
    timeframe: '4H',
    narrative:
      'Funding remains negative while spot demand keeps absorbing sells. Looking to leg in before Tokyo books refill.',
    entryPlan: 'Scale 0.25x every $250 from 64.2k down to 63.2k.',
    invalidation: 'Close below 62.8k or funding flips positive on Binance + OKX.',
    targetPlan: 'First take profit at 65.8k, trail remainder above 66.4k.',
    conviction: 4,
    riskBps: 45,
    status: 'READY',
    tags: ['funding', 'breakout'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-eth-range-short',
    title: 'ETH range fade vs. perps premium',
    market: 'ETH',
    direction: 'SHORT',
    timeframe: '1D',
    narrative:
      'Quarterly basis has normalized but perp premium still +8bps. Targeting mean reversion into US close.',
    entryPlan: 'Aggressive entry 3.28k, add at 3.31k with max 1.5x risk.',
    invalidation: 'Spot closes above 3.34k plus basis widens >120bps.',
    targetPlan: 'Cover 50% at 3.21k, run rest to 3.15k if funding stays elevated.',
    conviction: 3,
    riskBps: 35,
    status: 'LIVE',
    tags: ['range', 'basis'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-sol-liquidity-map',
    title: 'SOL liquidity pocket scalp',
    market: 'SOL',
    direction: 'NEUTRAL',
    timeframe: '2H',
    narrative:
      'CVD shows stacked offers above 195 with thin bids sub 184. Plan to strangle the pocket for delta-neutral carry.',
    entryPlan: 'Sell 190-196 ladder, buy 182-186 ladder with equal size.',
    invalidation: 'Pull plan if order book refills on either side.',
    targetPlan: 'Harvest between 188-189 with quick fills; exit by NY lunch.',
    conviction: 2,
    riskBps: 20,
    status: 'DRAFT',
    tags: ['liquidity', 'market-structure'],
    createdAt: new Date().toISOString(),
  },
];

export const loadStrategies = (): StrategyPlan[] => {
  if (typeof window === 'undefined') {
    return seedStrategies;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStrategies));
    return seedStrategies;
  }

  try {
    const parsed = JSON.parse(raw) as StrategyPlan[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.error('Failed to parse stored strategies', error);
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStrategies));
  return seedStrategies;
};

export const persistStrategies = (plans: StrategyPlan[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
};

export const buildStrategyPlan = (
  plan: Omit<StrategyPlan, 'id' | 'createdAt'>
): StrategyPlan => ({
  ...plan,
  id: generateId(),
  createdAt: new Date().toISOString(),
});

export const STRATEGY_STORAGE_KEY = STORAGE_KEY;
export const defaultStrategies = seedStrategies;
