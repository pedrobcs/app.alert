/**
 * Hyperliquid Trading API Integration
 * 
 * This module provides wrapper functions for interacting with Hyperliquid L1.
 * 
 * Hyperliquid Documentation:
 * - Main docs: https://hyperliquid.gitbook.io/hyperliquid-docs
 * - API Reference: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api
 * - SDK: https://github.com/nktkas/hyperliquid
 * 
 * Key Concepts:
 * - Hyperliquid is a decentralized perpetual futures exchange on its own L1
 * - Markets: Perpetual futures markets (e.g., BTC, ETH, SOL)
 * - Positions: Long or short positions with leverage
 * - Collateral: USDC deposited as collateral for positions
 */

import { Hyperliquid } from 'hyperliquid';
import { ethers } from 'ethers';
import { TradeInstruction, Position } from '@/types';

/**
 * Hyperliquid Client wrapper
 */
export class HyperliquidClient {
  private sdk: Hyperliquid;
  private wallet: ethers.Wallet;
  private isMainnet: boolean;

  constructor(privateKey: string, isMainnet: boolean = false) {
    this.isMainnet = isMainnet;
    this.wallet = new ethers.Wallet(privateKey);
    
    // Initialize Hyperliquid SDK
    this.sdk = new Hyperliquid({
      privateKey: privateKey,
      testnet: !isMainnet,
    });

    console.log('✅ HyperliquidClient initialized');
    console.log(`   Wallet: ${this.wallet.address}`);
    console.log(`   Network: ${isMainnet ? 'Mainnet' : 'Testnet'}`);
  }

  /**
   * Get wallet address
   */
  getAddress(): string {
    return this.wallet.address;
  }

  /**
   * Get available markets from Hyperliquid
   */
  async getMarkets(): Promise<string[]> {
    try {
      const meta: any = await (this.sdk.info.perpetuals as any).getMeta();
      return meta.universe.map((market: any) => market.name);
    } catch (error) {
      console.error('Error fetching markets:', error);
      return [];
    }
  }

  /**
   * Get current price for a market
   * 
   * @param marketSymbol - Market symbol (e.g., "BTC", "ETH", "SOL")
   */
  async getMarketPrice(marketSymbol: string): Promise<number> {
    try {
      // Get all mids from the info API
      // Note: Using any type as SDK may not have complete type definitions
      const allMids: any = await (this.sdk.info.perpetuals as any).getAllMids();
      
      // Find the price for the specified market
      const price = allMids[marketSymbol];
      
      if (!price) {
        throw new Error(`Market ${marketSymbol} not found`);
      }

      return parseFloat(price);
    } catch (error) {
      console.error(`Error fetching price for ${marketSymbol}:`, error);
      throw error;
    }
  }

  /**
   * Get market metadata
   */
  async getMarketMeta(marketSymbol: string): Promise<any> {
    try {
      const meta: any = await (this.sdk.info.perpetuals as any).getMeta();
      const market = meta.universe.find((m: any) => m.name === marketSymbol);
      return market;
    } catch (error) {
      console.error(`Error fetching market metadata for ${marketSymbol}:`, error);
      throw error;
    }
  }

  /**
   * Open a position on Hyperliquid
   * 
   * @param instruction - Trade instruction with market, side, size, leverage
   * @returns Order result
   */
  async openPosition(instruction: TradeInstruction): Promise<any> {
    try {
      // SAFETY CHECK: Prevent accidental live trades
      if (this.isMainnet && process.env.ALLOW_LIVE_TRADES !== 'true') {
        throw new Error('🚨 LIVE TRADES DISABLED: Set ALLOW_LIVE_TRADES=true to enable mainnet trading');
      }

      console.log('📈 Opening position:', instruction);

      const isBuy = instruction.side === 'long';
      const { size, leverage } = instruction;

      // Set leverage for the asset
      // Note: updateLeverage signature may vary by SDK version
      await (this.sdk.exchange as any).updateLeverage(instruction.market, true, leverage);

      console.log(`📊 Leverage set to ${leverage}x for ${instruction.market}`);

      // Place market order
      // Note: Using any type as SDK signatures may vary
      const order = await (this.sdk.exchange as any).placeOrder({
        coin: instruction.market,
        isBuy: isBuy,
        sz: size,
        limitPx: 0, // Market order (0 = market price)
        orderType: { limit: { tif: 'Ioc' } }, // Immediate or Cancel
        reduceOnly: false,
      });

      console.log('✅ Position opened:', order);

      return order;
    } catch (error) {
      console.error('❌ Error opening position:', error);
      throw error;
    }
  }

  /**
   * Close a position on Hyperliquid
   * 
   * @param marketSymbol - Market symbol
   * @returns Order result
   */
  async closePosition(marketSymbol: string): Promise<any> {
    try {
      // SAFETY CHECK
      if (this.isMainnet && process.env.ALLOW_LIVE_TRADES !== 'true') {
        throw new Error('🚨 LIVE TRADES DISABLED: Set ALLOW_LIVE_TRADES=true to enable mainnet trading');
      }

      console.log('📉 Closing position for:', marketSymbol);

      // Get current position
      const positions = await this.getPositions();
      const position = positions.find(p => p.market === marketSymbol);

      if (!position) {
        throw new Error(`No open position found for ${marketSymbol}`);
      }

      // Close position by placing opposite order with reduceOnly
      const isBuy = position.side === 'short'; // Opposite side to close
      const size = position.size;

      const order = await (this.sdk.exchange as any).placeOrder({
        coin: marketSymbol,
        isBuy: isBuy,
        sz: size,
        limitPx: 0, // Market order
        orderType: { limit: { tif: 'Ioc' } },
        reduceOnly: true,
      });

      console.log('✅ Position closed:', order);

      return order;
    } catch (error) {
      console.error('❌ Error closing position:', error);
      throw error;
    }
  }

  /**
   * Get current positions for the user
   */
  async getPositions(): Promise<Position[]> {
    try {
      const userState: any = await (this.sdk.info.perpetuals as any).getUserState(this.wallet.address);
      
      if (!userState || !userState.assetPositions) {
        return [];
      }

      const positions: Position[] = [];

      for (const assetPosition of userState.assetPositions) {
        const position = assetPosition.position;
        
        if (!position || parseFloat(position.szi) === 0) {
          continue; // Skip empty positions
        }

        const size = Math.abs(parseFloat(position.szi));
        const isLong = parseFloat(position.szi) > 0;
        const entryPrice = parseFloat(position.entryPx);
        const unrealizedPnl = parseFloat(position.unrealizedPnl);
        
        // Get leverage from margin used
        const marginUsed = parseFloat(position.marginUsed);
        const notionalValue = entryPrice * size;
        const leverage = marginUsed > 0 ? notionalValue / marginUsed : 1;

        positions.push({
          market: assetPosition.position.coin,
          side: isLong ? 'long' : 'short',
          size: size,
          entryPrice: entryPrice,
          unrealizedPnl: unrealizedPnl,
          leverage: Math.round(leverage * 10) / 10, // Round to 1 decimal
        });
      }

      return positions;
    } catch (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
  }

  /**
   * Get account balance (cross margin available)
   */
  async getAccountBalance(): Promise<number> {
    try {
      const userState: any = await (this.sdk.info.perpetuals as any).getUserState(this.wallet.address);
      
      if (!userState || !userState.crossMarginSummary) {
        return 0;
      }

      const accountValue = parseFloat(userState.crossMarginSummary.accountValue);
      return accountValue;
    } catch (error) {
      console.error('Error fetching account balance:', error);
      return 0;
    }
  }

  /**
   * Get account equity and margin info
   */
  async getAccountInfo(): Promise<{
    accountValue: number;
    totalMarginUsed: number;
    totalNtlPos: number;
    totalRawUsd: number;
    withdrawable: number;
  }> {
    try {
      const userState: any = await (this.sdk.info.perpetuals as any).getUserState(this.wallet.address);
      
      if (!userState || !userState.crossMarginSummary) {
        return {
          accountValue: 0,
          totalMarginUsed: 0,
          totalNtlPos: 0,
          totalRawUsd: 0,
          withdrawable: 0,
        };
      }

      const summary = userState.crossMarginSummary;

      return {
        accountValue: parseFloat(summary.accountValue),
        totalMarginUsed: parseFloat(summary.totalMarginUsed),
        totalNtlPos: parseFloat(summary.totalNtlPos),
        totalRawUsd: parseFloat(summary.totalRawUsd),
        withdrawable: parseFloat(summary.withdrawable),
      };
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }

  /**
   * Get order book for a market
   */
  async getOrderBook(marketSymbol: string, depth: number = 20): Promise<any> {
    try {
      const l2Data: any = await (this.sdk.info.perpetuals as any).getL2Book(marketSymbol);
      return l2Data;
    } catch (error) {
      console.error(`Error fetching order book for ${marketSymbol}:`, error);
      throw error;
    }
  }

  /**
   * Get recent trades history
   */
  async getTradesHistory(marketSymbol?: string): Promise<any[]> {
    try {
      const fills: any = await (this.sdk.info.perpetuals as any).getUserFills(this.wallet.address);
      
      if (marketSymbol) {
        return fills.filter((fill: any) => fill.coin === marketSymbol);
      }
      
      return fills;
    } catch (error) {
      console.error('Error fetching trades history:', error);
      return [];
    }
  }

  /**
   * Cancel all open orders
   */
  async cancelAllOrders(marketSymbol?: string): Promise<any> {
    try {
      const result = await (this.sdk.exchange as any).cancelAllOrders({
        coin: marketSymbol,
      });
      
      console.log('✅ Cancelled all orders:', result);
      return result;
    } catch (error) {
      console.error('❌ Error cancelling orders:', error);
      throw error;
    }
  }

  /**
   * Get funding rate for a market
   */
  async getFundingRate(marketSymbol: string): Promise<number> {
    try {
      const meta: any = await (this.sdk.info.perpetuals as any).getMeta();
      const market = meta.universe.find((m: any) => m.name === marketSymbol);
      
      if (!market) {
        throw new Error(`Market ${marketSymbol} not found`);
      }

      return parseFloat(market.funding || '0');
    } catch (error) {
      console.error(`Error fetching funding rate for ${marketSymbol}:`, error);
      return 0;
    }
  }
}

/**
 * Initialize Hyperliquid Client
 * 
 * @param privateKey - Ethereum private key (with or without 0x prefix)
 * @param isMainnet - Whether to use mainnet (default: false for testnet)
 */
export function initHyperliquidClient(
  privateKey: string,
  isMainnet: boolean = false
): HyperliquidClient {
  // Ensure private key has 0x prefix
  const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  
  return new HyperliquidClient(formattedKey, isMainnet);
}

/**
 * TODO: Production considerations
 * 
 * 1. Price Feed: Using Hyperliquid's native oracle
 *    - Add health checks for oracle
 *    - Monitor for large price deviations
 * 
 * 2. Slippage Protection: Implement price limits for market orders
 *    - Calculate acceptable slippage based on volatility
 *    - Use limit orders for large positions
 * 
 * 3. Error Handling: Improve retry logic
 *    - Network errors vs. protocol errors
 *    - Implement exponential backoff
 * 
 * 4. Position Monitoring: Add WebSocket subscriptions
 *    - Real-time position updates
 *    - Alert on large unrealized losses
 * 
 * 5. Risk Management: Implement account-level risk checks
 *    - Max position size relative to account
 *    - Max total leverage
 *    - Margin requirements monitoring
 */

const hyperliquidClient = {
  initHyperliquidClient,
  HyperliquidClient,
};

export default hyperliquidClient;
