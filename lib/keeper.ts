/**
 * Drift Trading Bot Keeper
 * 
 * This module implements the keeper/bot logic that runs continuously to:
 * 1. Fetch latest market data (5-min OHLCV)
 * 2. Analyze data using Wyckoff strategy
 * 3. Execute trades based on signals
 * 4. Monitor positions and manage risk
 * 
 * The keeper can run in two modes:
 * - Non-custodial: Prepares transactions for user to sign (requires user presence)
 * - Custodial: Uses server-side private key to sign automatically (24/7 operation)
 * 
 * Security Notes:
 * - NEVER commit private keys to source control
 * - Use environment variables with encryption
 * - Consider using AWS KMS or HashiCorp Vault for production
 * - Always test on devnet first
 * 
 * References:
 * - Drift Keeper Bots: https://github.com/drift-labs/keeper-bots-v2
 */

import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { DriftClient, Wallet } from '@drift-labs/sdk';
import { analyzeWyckoff } from './wyckoff';
import {
  initDriftClient,
  getMarketPrice,
  getPositions,
  openPosition,
  closePosition,
  getAccountBalance,
} from './driftClient';
import { OHLCVBar, BotConfig, WyckoffSignal, TradeInstruction, Position } from '@/types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Keeper state for a single bot
 */
interface KeeperState {
  botId: string;
  config: BotConfig;
  driftClient?: DriftClient;
  isRunning: boolean;
  intervalId?: NodeJS.Timeout;
  lastPollTime?: Date;
  lastSignal?: WyckoffSignal;
  currentPosition?: Position;
  historicalBars: OHLCVBar[];
  errorCount: number;
  stats: {
    totalTrades: number;
    successfulTrades: number;
    totalPnl: number;
  };
}

// Global keeper registry
const keeperRegistry = new Map<string, KeeperState>();

/**
 * Start a keeper for a bot
 * 
 * @param botConfig - Bot configuration from database
 */
export async function startKeeper(botConfig: BotConfig): Promise<void> {
  console.log(`🤖 Starting keeper for bot: ${botConfig.name} (${botConfig.id})`);

  // Check if keeper already running
  if (keeperRegistry.has(botConfig.id)) {
    console.warn(`⚠️  Keeper already running for bot ${botConfig.id}`);
    return;
  }

  // Initialize keeper state
  const keeperState: KeeperState = {
    botId: botConfig.id,
    config: botConfig,
    isRunning: false,
    historicalBars: [],
    errorCount: 0,
    stats: {
      totalTrades: 0,
      successfulTrades: 0,
      totalPnl: 0,
    },
  };

  // Initialize Drift client (only for custodial mode)
  if (botConfig.mode === 'custodial') {
    try {
      keeperState.driftClient = await initializeCustodialClient();
      console.log('✅ Custodial DriftClient initialized');
    } catch (error) {
      console.error('❌ Failed to initialize custodial client:', error);
      throw new Error('Cannot start custodial keeper without valid private key');
    }
  }

  // Register keeper
  keeperRegistry.set(botConfig.id, keeperState);

  // Start polling loop
  keeperState.isRunning = true;
  await runKeeperLoop(keeperState);

  // Set up interval
  const pollInterval = parseInt(process.env.KEEPER_POLL_INTERVAL_MS || '300000'); // 5 minutes default
  keeperState.intervalId = setInterval(async () => {
    await runKeeperLoop(keeperState);
  }, pollInterval);

  console.log(`✅ Keeper started with ${pollInterval}ms interval`);
}

/**
 * Stop a keeper
 */
export function stopKeeper(botId: string): void {
  const keeper = keeperRegistry.get(botId);
  if (!keeper) {
    console.warn(`⚠️  No keeper found for bot ${botId}`);
    return;
  }

  console.log(`🛑 Stopping keeper for bot ${botId}`);

  // Stop interval
  if (keeper.intervalId) {
    clearInterval(keeper.intervalId);
  }

  // Unsubscribe from Drift
  if (keeper.driftClient) {
    keeper.driftClient.unsubscribe();
  }

  // Update state
  keeper.isRunning = false;

  // Remove from registry
  keeperRegistry.delete(botId);

  console.log('✅ Keeper stopped');
}

/**
 * Main keeper loop - runs every interval
 */
async function runKeeperLoop(keeper: KeeperState): Promise<void> {
  if (!keeper.isRunning) {
    return;
  }

  try {
    console.log(`\n🔄 Keeper loop starting for ${keeper.config.name}...`);
    keeper.lastPollTime = new Date();

    // Step 1: Fetch latest market data
    const latestBar = await fetchLatestMarketData(keeper.config.market);
    keeper.historicalBars.push(latestBar);

    // Keep only the bars we need (lookback + some buffer)
    const maxBars = keeper.config.wyckoffParams.lookbackBars * 2;
    if (keeper.historicalBars.length > maxBars) {
      keeper.historicalBars = keeper.historicalBars.slice(-maxBars);
    }

    console.log(`📊 Fetched bar: ${latestBar.close.toFixed(2)} | Vol: ${latestBar.volume.toFixed(0)}`);

    // Step 2: Analyze using Wyckoff strategy
    const signal = analyzeWyckoff(keeper.historicalBars, keeper.config.wyckoffParams);
    keeper.lastSignal = signal;

    console.log(`📈 Signal: ${signal.signal.toUpperCase()} (${signal.confidence.toFixed(2)}) - ${signal.reason}`);

    // Step 3: Check current position
    if (keeper.driftClient) {
      const positions = await getPositions(keeper.driftClient);
      keeper.currentPosition = positions.find(p => p.market === keeper.config.market);
    }

    // Step 4: Execute trades based on signal
    await executeTradeIfNeeded(keeper, signal);

    // Step 5: Monitor risk and manage positions
    await monitorRisk(keeper);

    // Reset error count on success
    keeper.errorCount = 0;
    console.log('✅ Keeper loop completed\n');

  } catch (error) {
    keeper.errorCount++;
    console.error(`❌ Keeper loop error (count: ${keeper.errorCount}):`, error);

    // Stop keeper if too many errors
    const maxRetries = parseInt(process.env.KEEPER_MAX_RETRIES || '3');
    if (keeper.errorCount >= maxRetries) {
      console.error(`🚨 Keeper stopped due to ${keeper.errorCount} consecutive errors`);
      stopKeeper(keeper.botId);
    }
  }
}

/**
 * Fetch latest market data (5-min OHLCV bar)
 * 
 * TODO: Replace this with real data source
 * Options:
 * 1. Drift market data (if available)
 * 2. Pyth price history
 * 3. Third-party API (CoinGecko, Birdeye, etc.)
 */
async function fetchLatestMarketData(marketSymbol: string): Promise<OHLCVBar> {
  // PLACEHOLDER IMPLEMENTATION
  // In production, fetch real OHLCV data from:
  // - Drift historical data API
  // - Pyth price feeds
  // - Third-party market data provider (Birdeye, CoinGecko, etc.)

  console.log(`📡 Fetching market data for ${marketSymbol}...`);

  // For now, generate synthetic data for testing
  // TODO: Replace with real data source
  const basePrice = 100 + Math.random() * 20; // Simulate price around 100-120
  const volatility = 2;

  const bar: OHLCVBar = {
    timestamp: Date.now(),
    open: basePrice + (Math.random() - 0.5) * volatility,
    high: basePrice + Math.random() * volatility,
    low: basePrice - Math.random() * volatility,
    close: basePrice + (Math.random() - 0.5) * volatility,
    volume: 10000 + Math.random() * 5000,
  };

  // Ensure high is highest and low is lowest
  bar.high = Math.max(bar.open, bar.high, bar.low, bar.close);
  bar.low = Math.min(bar.open, bar.high, bar.low, bar.close);

  return bar;
}

/**
 * Execute trade if signal warrants it
 */
async function executeTradeIfNeeded(keeper: KeeperState, signal: WyckoffSignal): Promise<void> {
  const { config, currentPosition, driftClient } = keeper;

  // Need custodial mode to auto-execute
  if (config.mode !== 'custodial' || !driftClient) {
    console.log('ℹ️  Non-custodial mode - skipping auto-execution');
    return;
  }

  // Check if we should act on this signal
  if (signal.signal === 'flat') {
    console.log('➡️  No action signal - holding');
    return;
  }

  // Check if we already have a position in this direction
  if (currentPosition) {
    if (
      (signal.signal === 'long' && currentPosition.side === 'long') ||
      (signal.signal === 'short' && currentPosition.side === 'short')
    ) {
      console.log('ℹ️  Already in position - holding');
      return;
    }

    // Close opposite position first
    console.log(`🔄 Closing ${currentPosition.side} position before opening ${signal.signal}`);
    await closePosition(driftClient, config.market);
    keeper.currentPosition = undefined;
  }

  // Calculate position size
  const accountBalance = await getAccountBalance(driftClient);
  const positionSize = (accountBalance * config.positionSizePct) / 100;

  // Create trade instruction
  const instruction: TradeInstruction = {
    market: config.market,
    side: signal.signal as 'long' | 'short',
    action: 'open',
    size: positionSize,
    leverage: config.maxLeverage,
  };

  // Execute trade
  try {
    console.log(`🚀 Executing ${signal.signal.toUpperCase()} trade:`, instruction);
    const txSig = await openPosition(driftClient, instruction);
    
    keeper.stats.totalTrades++;
    keeper.stats.successfulTrades++;
    
    console.log(`✅ Trade executed: ${txSig}`);
    
    // TODO: Save trade to database
    
  } catch (error) {
    console.error('❌ Trade execution failed:', error);
    keeper.stats.totalTrades++;
    // Don't increment successfulTrades
  }
}

/**
 * Monitor risk and manage positions
 * - Check stop-loss
 * - Check take-profit
 * - Check max daily loss
 */
async function monitorRisk(keeper: KeeperState): Promise<void> {
  const { config, currentPosition, driftClient } = keeper;

  if (!currentPosition || !driftClient) {
    return;
  }

  const { stopLossPct, takeProfitPct } = config;
  const { entryPrice, unrealizedPnl, size } = currentPosition;

  // Calculate P&L percentage
  const pnlPct = (unrealizedPnl / (entryPrice * size)) * 100;

  console.log(`📊 Position P&L: ${pnlPct.toFixed(2)}% (${unrealizedPnl.toFixed(2)} USDC)`);

  // Check stop-loss
  if (pnlPct <= -stopLossPct) {
    console.log(`🛑 STOP LOSS HIT at ${pnlPct.toFixed(2)}% - Closing position`);
    await closePosition(driftClient, config.market);
    keeper.currentPosition = undefined;
    keeper.stats.totalPnl += unrealizedPnl;
    return;
  }

  // Check take-profit
  if (pnlPct >= takeProfitPct) {
    console.log(`🎯 TAKE PROFIT HIT at ${pnlPct.toFixed(2)}% - Closing position`);
    await closePosition(driftClient, config.market);
    keeper.currentPosition = undefined;
    keeper.stats.totalPnl += unrealizedPnl;
    return;
  }

  // TODO: Check max daily loss (requires tracking daily P&L)
}

/**
 * Initialize custodial Drift client using server private key
 * 
 * 🚨 SECURITY WARNING:
 * - NEVER commit private keys to source control
 * - Use encrypted storage in production (AWS KMS, HashiCorp Vault)
 * - Only use on devnet/testnet for development
 * - Consider using hardware wallets for mainnet
 */
async function initializeCustodialClient(): Promise<DriftClient> {
  const privateKey = process.env.KEEPER_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error(
      '🚨 KEEPER_PRIVATE_KEY not set. Cannot run custodial keeper.\n' +
      'To enable custodial mode:\n' +
      '1. Generate keypair: solana-keygen new --outfile keeper-keypair.json\n' +
      '2. Fund the wallet (devnet): solana airdrop 2 --url devnet\n' +
      '3. Set env var: KEEPER_PRIVATE_KEY=\'[1,2,3,...]\' (array from keypair.json)\n' +
      '4. NEVER commit this key to git!'
    );
  }

  // Parse private key (should be JSON array of bytes)
  let secretKey: Uint8Array;
  try {
    const keyArray = JSON.parse(privateKey);
    secretKey = Uint8Array.from(keyArray);
  } catch (error) {
    throw new Error('Invalid KEEPER_PRIVATE_KEY format. Must be JSON array of bytes.');
  }

  const keypair = Keypair.fromSecretKey(secretKey);

  // Initialize connection
  const rpcUrl = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com';
  const connection = new Connection(rpcUrl, 'confirmed');

  // Initialize Drift client
  const env = (process.env.DRIFT_ENV || 'devnet') as 'devnet' | 'mainnet-beta';
  const driftClient = await initDriftClient(connection, keypair, env);

  return driftClient;
}

/**
 * Get keeper status
 */
export function getKeeperStatus(botId: string): any {
  const keeper = keeperRegistry.get(botId);
  if (!keeper) {
    return { isRunning: false, message: 'Keeper not found' };
  }

  return {
    isRunning: keeper.isRunning,
    lastPollTime: keeper.lastPollTime,
    lastSignal: keeper.lastSignal,
    currentPosition: keeper.currentPosition,
    stats: keeper.stats,
    errorCount: keeper.errorCount,
    barsCollected: keeper.historicalBars.length,
  };
}

/**
 * Export keeper registry for debugging
 */
export function getAllKeepers(): Map<string, KeeperState> {
  return keeperRegistry;
}

/**
 * TODO: Production improvements
 * 
 * 1. Persistent State: Save keeper state to database
 *    - Survive server restarts
 *    - Track long-term performance
 * 
 * 2. Better Data Sources: Implement real OHLCV fetching
 *    - Pyth historical data
 *    - Drift market data API
 *    - Backup data sources
 * 
 * 3. Advanced Risk Management:
 *    - Max daily loss limits
 *    - Correlation between positions
 *    - Account-level margin monitoring
 * 
 * 4. Monitoring & Alerts:
 *    - Discord/Telegram notifications
 *    - Email alerts for critical events
 *    - Performance dashboards
 * 
 * 5. Backtesting: Add backtesting framework
 *    - Test strategies on historical data
 *    - Optimize parameters
 *    - Calculate sharpe ratio, max drawdown, etc.
 */

export default {
  startKeeper,
  stopKeeper,
  getKeeperStatus,
  getAllKeepers,
};
