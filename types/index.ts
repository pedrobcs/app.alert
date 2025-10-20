export interface OHLCVBar {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WyckoffSignal {
  signal: 'long' | 'short' | 'flat';
  reason: string;
  confidence: number; // 0-1
  metadata?: {
    phase?: 'accumulation' | 'markup' | 'distribution' | 'markdown';
    volumeSpike?: boolean;
    priceAction?: string;
  };
}

export interface WyckoffParams {
  lookbackBars: number;
  volumeThreshold: number;
  accumulationSensitivity: number;
  distributionSensitivity: number;
}

export interface BotConfig {
  id: string;
  userId: string;
  name: string;
  market: string;
  mode: 'non-custodial' | 'custodial';
  status: 'stopped' | 'running' | 'paused' | 'error';
  
  // Strategy params
  timeframe: number;
  wyckoffParams: WyckoffParams;
  
  // Risk management
  positionSizePct: number;
  maxLeverage: number;
  stopLossPct: number;
  takeProfitPct: number;
  maxDailyLoss?: number;
}

export interface TradeInstruction {
  market: string;
  side: 'long' | 'short';
  action: 'open' | 'close';
  size: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface Position {
  market: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  unrealizedPnl: number;
  leverage: number;
}

export interface BotStatus {
  botId: string;
  status: 'stopped' | 'running' | 'paused' | 'error';
  lastSignal?: WyckoffSignal;
  lastSignalTime?: Date;
  currentPosition?: Position;
  stats: {
    totalTrades: number;
    successfulTrades: number;
    totalPnl: number;
    winRate: number;
  };
  errorMessage?: string;
}
