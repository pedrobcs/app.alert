/**
 * Drift Protocol Client Integration
 * 
 * This module provides wrapper functions for interacting with Drift Protocol v2.
 * 
 * Drift Protocol Documentation:
 * - Main docs: https://docs.drift.trade/
 * - SDK Reference: https://drift-labs.github.io/v2-teacher/#client
 * - TypeScript SDK: https://github.com/drift-labs/protocol-v2/tree/master/sdk
 * 
 * Key Concepts:
 * - DriftClient: Main interface to interact with Drift smart contracts
 * - Markets: Perpetual futures markets (e.g., SOL-PERP, BTC-PERP)
 * - Positions: Long or short positions with leverage
 * - Collateral: USDC deposited as collateral for positions
 */

import {
  DriftClient,
  initialize,
  Wallet,
  MarketType,
  PositionDirection,
  OrderType,
  calculateBidAskPrice,
  convertToNumber,
  PRICE_PRECISION,
  PerpMarkets,
  BN,
} from '@drift-labs/sdk';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { TradeInstruction, Position } from '@/types';

/**
 * Initialize Drift Client
 * 
 * @param connection - Solana RPC connection
 * @param wallet - Wallet/Keypair for signing transactions
 * @param env - 'devnet' or 'mainnet-beta'
 */
export async function initDriftClient(
  connection: Connection,
  wallet: Wallet | Keypair,
  env: 'devnet' | 'mainnet-beta' = 'devnet'
): Promise<DriftClient> {
  // Convert Keypair to Wallet if needed
  const driftWallet = 'secretKey' in wallet ? {
    publicKey: wallet.publicKey,
    signTransaction: async (tx: any) => {
      tx.sign(wallet);
      return tx;
    },
    signAllTransactions: async (txs: any[]) => {
      txs.forEach(tx => tx.sign(wallet));
      return txs;
    },
  } as Wallet : wallet;

  // Initialize DriftClient
  // See: https://drift-labs.github.io/v2-teacher/#initialize-user
  const driftClient = new DriftClient({
    connection,
    wallet: driftWallet,
    env,
    // Use default program ID for the environment
  });

  // Subscribe to Drift state
  await driftClient.subscribe();

  console.log('✅ DriftClient initialized and subscribed');
  console.log(`   Wallet: ${driftWallet.publicKey.toString()}`);
  console.log(`   Environment: ${env}`);

  return driftClient;
}

/**
 * Get available markets from Drift
 */
export async function getMarkets(driftClient: DriftClient): Promise<string[]> {
  try {
    const perpMarkets = driftClient.getPerpMarketAccounts();
    return perpMarkets.map((market) => {
      // Get market symbol
      return getMarketSymbol(market.marketIndex);
    });
  } catch (error) {
    console.error('Error fetching markets:', error);
    return [];
  }
}

/**
 * Get market symbol from market index
 */
function getMarketSymbol(marketIndex: number): string {
  // Map common market indices to symbols
  // This is environment-specific; update based on your Drift env
  const marketMap: { [key: number]: string } = {
    0: 'SOL-PERP',
    1: 'BTC-PERP',
    2: 'ETH-PERP',
    // Add more markets as needed
  };
  return marketMap[marketIndex] || `MARKET-${marketIndex}`;
}

/**
 * Get market index from symbol
 */
function getMarketIndex(symbol: string): number {
  const symbolMap: { [key: string]: number } = {
    'SOL-PERP': 0,
    'BTC-PERP': 1,
    'ETH-PERP': 2,
  };
  return symbolMap[symbol] ?? 0;
}

/**
 * Get current price for a market
 * Uses Drift oracle (Pyth) for price data
 * 
 * @param driftClient - Initialized DriftClient
 * @param marketSymbol - Market symbol (e.g., "SOL-PERP")
 */
export async function getMarketPrice(
  driftClient: DriftClient,
  marketSymbol: string
): Promise<number> {
  try {
    const marketIndex = getMarketIndex(marketSymbol);
    const perpMarket = driftClient.getPerpMarketAccount(marketIndex);
    
    if (!perpMarket) {
      throw new Error(`Market ${marketSymbol} not found`);
    }

    // Get oracle price data
    const oracleData = driftClient.getOracleDataForPerpMarket(marketIndex);
    const price = convertToNumber(oracleData.price, PRICE_PRECISION);

    return price;
  } catch (error) {
    console.error(`Error fetching price for ${marketSymbol}:`, error);
    throw error;
  }
}

/**
 * Open a position on Drift
 * 
 * @param driftClient - Initialized DriftClient
 * @param instruction - Trade instruction with market, side, size, leverage
 * @returns Transaction signature
 */
export async function openPosition(
  driftClient: DriftClient,
  instruction: TradeInstruction
): Promise<string> {
  try {
    // SAFETY CHECK: Prevent accidental live trades
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_LIVE_TRADES !== 'true') {
      throw new Error('🚨 LIVE TRADES DISABLED: Set ALLOW_LIVE_TRADES=true to enable production trading');
    }

    console.log('📈 Opening position:', instruction);

    const marketIndex = getMarketIndex(instruction.market);
    const direction = instruction.side === 'long' ? PositionDirection.LONG : PositionDirection.SHORT;

    // Convert size to base asset amount (with proper precision)
    const baseAssetAmount = new BN(instruction.size * 1e9); // Assuming 9 decimals

    // Place market order
    // See: https://drift-labs.github.io/v2-teacher/#placing-and-cancelling-orders
    const txSig = await driftClient.placePerpOrder({
      orderType: OrderType.MARKET,
      marketIndex,
      direction,
      baseAssetAmount,
      // Optional: add price limit for slippage protection
      // price: new BN(limitPrice * PRICE_PRECISION.toNumber()),
    });

    console.log('✅ Position opened:', txSig);

    return txSig;
  } catch (error) {
    console.error('❌ Error opening position:', error);
    throw error;
  }
}

/**
 * Close a position on Drift
 * 
 * @param driftClient - Initialized DriftClient
 * @param marketSymbol - Market symbol
 * @returns Transaction signature
 */
export async function closePosition(
  driftClient: DriftClient,
  marketSymbol: string
): Promise<string> {
  try {
    // SAFETY CHECK
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_LIVE_TRADES !== 'true') {
      throw new Error('🚨 LIVE TRADES DISABLED: Set ALLOW_LIVE_TRADES=true to enable production trading');
    }

    console.log('📉 Closing position for:', marketSymbol);

    const marketIndex = getMarketIndex(marketSymbol);

    // Get current position
    const position = driftClient.getUser().getPerpPosition(marketIndex);
    
    if (!position || position.baseAssetAmount.eq(new BN(0))) {
      throw new Error(`No open position found for ${marketSymbol}`);
    }

    // Close position by placing opposite order
    const isLong = position.baseAssetAmount.gt(new BN(0));
    const direction = isLong ? PositionDirection.SHORT : PositionDirection.LONG;
    const baseAssetAmount = position.baseAssetAmount.abs();

    const txSig = await driftClient.placePerpOrder({
      orderType: OrderType.MARKET,
      marketIndex,
      direction,
      baseAssetAmount,
      reduceOnly: true, // Important: ensure we only close, not reverse
    });

    console.log('✅ Position closed:', txSig);

    return txSig;
  } catch (error) {
    console.error('❌ Error closing position:', error);
    throw error;
  }
}

/**
 * Get current positions for the user
 * 
 * @param driftClient - Initialized DriftClient
 */
export async function getPositions(driftClient: DriftClient): Promise<Position[]> {
  try {
    const user = driftClient.getUser();
    const perpPositions = user.getPerpPositions();

    const positions: Position[] = [];

    for (const position of perpPositions) {
      if (position.baseAssetAmount.eq(new BN(0))) {
        continue; // Skip empty positions
      }

      const marketIndex = position.marketIndex;
      const marketSymbol = getMarketSymbol(marketIndex);

      // Calculate position metrics
      const baseAssetAmount = convertToNumber(position.baseAssetAmount);
      const isLong = baseAssetAmount > 0;

      const entryPrice = convertToNumber(position.quoteAssetAmount) / Math.abs(baseAssetAmount);
      
      // Get current price for unrealized PnL
      const currentPrice = await getMarketPrice(driftClient, marketSymbol);
      const unrealizedPnl = isLong 
        ? (currentPrice - entryPrice) * Math.abs(baseAssetAmount)
        : (entryPrice - currentPrice) * Math.abs(baseAssetAmount);

      positions.push({
        market: marketSymbol,
        side: isLong ? 'long' : 'short',
        size: Math.abs(baseAssetAmount),
        entryPrice,
        unrealizedPnl,
        leverage: 1, // TODO: Calculate actual leverage
      });
    }

    return positions;
  } catch (error) {
    console.error('Error fetching positions:', error);
    return [];
  }
}

/**
 * Get account balance (collateral)
 * 
 * @param driftClient - Initialized DriftClient
 */
export async function getAccountBalance(driftClient: DriftClient): Promise<number> {
  try {
    const user = driftClient.getUser();
    const totalCollateral = user.getTotalCollateral();
    return convertToNumber(totalCollateral);
  } catch (error) {
    console.error('Error fetching account balance:', error);
    return 0;
  }
}

/**
 * TODO: Production considerations
 * 
 * 1. Price Feed: Currently using Drift's oracle (Pyth). Ensure oracle is reliable and up-to-date.
 *    - Add oracle health checks
 *    - Consider backup price sources
 * 
 * 2. Slippage Protection: Add price limits to market orders to prevent adverse fills
 *    - Calculate acceptable slippage based on volatility
 *    - Use limit orders for large positions
 * 
 * 3. Error Handling: Improve retry logic and error classification
 *    - Network errors vs. protocol errors
 *    - Implement exponential backoff
 * 
 * 4. Position Monitoring: Add real-time position monitoring
 *    - Subscribe to position updates
 *    - Alert on large unrealized losses
 * 
 * 5. Risk Management: Implement account-level risk checks
 *    - Max position size relative to account
 *    - Max total leverage
 *    - Margin requirements
 */

export default {
  initDriftClient,
  getMarkets,
  getMarketPrice,
  openPosition,
  closePosition,
  getPositions,
  getAccountBalance,
};
