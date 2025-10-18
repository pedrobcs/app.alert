/**
 * Wyckoff Trading Strategy Implementation
 * 
 * This module implements a simplified Wyckoff method for detecting accumulation
 * and distribution phases in market data. The strategy analyzes price action
 * and volume patterns over a configurable lookback period.
 * 
 * Wyckoff Method Basics:
 * 1. Accumulation Phase: Smart money accumulates positions before markup
 *    - Characterized by: sideways price action, increasing volume on up moves
 *    - Signal: Breakout above resistance on high volume = LONG entry
 * 
 * 2. Distribution Phase: Smart money distributes positions before markdown
 *    - Characterized by: sideways price action, increasing volume on down moves
 *    - Signal: Breakdown below support on high volume = SHORT entry
 * 
 * 3. Markup/Markdown: Trending phases (we follow the trend)
 * 
 * References:
 * - Wyckoff Method: https://school.stockcharts.com/doku.php?id=market_analysis:the_wyckoff_method
 * - Volume Spread Analysis: Similar concept to Wyckoff
 */

import { OHLCVBar, WyckoffSignal, WyckoffParams } from '@/types';

/**
 * Analyzes OHLCV data using Wyckoff methodology and returns trading signal
 * 
 * @param bars - Array of OHLCV bars (must be in chronological order)
 * @param params - Wyckoff strategy parameters
 * @returns WyckoffSignal with action and reasoning
 */
export function analyzeWyckoff(
  bars: OHLCVBar[],
  params: WyckoffParams
): WyckoffSignal {
  // Validation
  if (bars.length < params.lookbackBars) {
    return {
      signal: 'flat',
      reason: `Insufficient data: need ${params.lookbackBars} bars, got ${bars.length}`,
      confidence: 0,
    };
  }

  // Get the most recent bars for analysis
  const recentBars = bars.slice(-params.lookbackBars);
  const latestBar = recentBars[recentBars.length - 1];
  
  // Calculate key metrics
  const metrics = calculateMetrics(recentBars);
  
  // Detect Wyckoff phase
  const phase = detectPhase(recentBars, metrics, params);
  
  // Generate signal based on phase and price action
  const signal = generateSignal(recentBars, metrics, phase, params);
  
  return signal;
}

interface Metrics {
  avgVolume: number;
  avgPrice: number;
  volatility: number;
  trend: 'up' | 'down' | 'sideways';
  volumeTrend: 'increasing' | 'decreasing' | 'stable';
  support: number;
  resistance: number;
  priceRange: number;
}

/**
 * Calculate key metrics from bars
 */
function calculateMetrics(bars: OHLCVBar[]): Metrics {
  const closes = bars.map(b => b.close);
  const volumes = bars.map(b => b.volume);
  const highs = bars.map(b => b.high);
  const lows = bars.map(b => b.low);
  
  // Average volume
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  
  // Average price
  const avgPrice = closes.reduce((a, b) => a + b, 0) / closes.length;
  
  // Volatility (standard deviation of closes)
  const variance = closes.reduce((sum, price) => {
    return sum + Math.pow(price - avgPrice, 2);
  }, 0) / closes.length;
  const volatility = Math.sqrt(variance);
  
  // Trend detection (simple: compare first half to second half)
  const midPoint = Math.floor(bars.length / 2);
  const firstHalfAvg = closes.slice(0, midPoint).reduce((a, b) => a + b, 0) / midPoint;
  const secondHalfAvg = closes.slice(midPoint).reduce((a, b) => a + b, 0) / (closes.length - midPoint);
  
  const trendThreshold = avgPrice * 0.02; // 2% threshold
  let trend: 'up' | 'down' | 'sideways';
  if (secondHalfAvg > firstHalfAvg + trendThreshold) {
    trend = 'up';
  } else if (secondHalfAvg < firstHalfAvg - trendThreshold) {
    trend = 'down';
  } else {
    trend = 'sideways';
  }
  
  // Volume trend
  const firstHalfVolAvg = volumes.slice(0, midPoint).reduce((a, b) => a + b, 0) / midPoint;
  const secondHalfVolAvg = volumes.slice(midPoint).reduce((a, b) => a + b, 0) / (volumes.length - midPoint);
  
  let volumeTrend: 'increasing' | 'decreasing' | 'stable';
  if (secondHalfVolAvg > firstHalfVolAvg * 1.2) {
    volumeTrend = 'increasing';
  } else if (secondHalfVolAvg < firstHalfVolAvg * 0.8) {
    volumeTrend = 'decreasing';
  } else {
    volumeTrend = 'stable';
  }
  
  // Support and resistance (simple: lowest low and highest high)
  const support = Math.min(...lows);
  const resistance = Math.max(...highs);
  const priceRange = resistance - support;
  
  return {
    avgVolume,
    avgPrice,
    volatility,
    trend,
    volumeTrend,
    support,
    resistance,
    priceRange,
  };
}

/**
 * Detect current Wyckoff phase
 */
function detectPhase(
  bars: OHLCVBar[],
  metrics: Metrics,
  params: WyckoffParams
): 'accumulation' | 'markup' | 'distribution' | 'markdown' {
  const latestBar = bars[bars.length - 1];
  const { trend, volumeTrend, priceRange, avgPrice } = metrics;
  
  // Narrow range indicates accumulation or distribution
  const isNarrowRange = (priceRange / avgPrice) < 0.03; // 3% range
  
  if (trend === 'sideways' && isNarrowRange) {
    // Check if volume is building (sign of accumulation/distribution)
    if (volumeTrend === 'increasing') {
      // Look at recent price action to determine which
      const recentBars = bars.slice(-3);
      const upMoves = recentBars.filter(b => b.close > b.open).length;
      
      if (upMoves >= 2) {
        return 'accumulation'; // Building for upward breakout
      } else {
        return 'distribution'; // Building for downward breakdown
      }
    }
    
    // Default sideways to accumulation if price is near support
    if (latestBar.close < metrics.avgPrice) {
      return 'accumulation';
    } else {
      return 'distribution';
    }
  }
  
  // Trending phases
  if (trend === 'up') {
    return 'markup';
  } else if (trend === 'down') {
    return 'markdown';
  }
  
  // Default
  return latestBar.close < metrics.avgPrice ? 'accumulation' : 'distribution';
}

/**
 * Generate trading signal based on Wyckoff analysis
 */
function generateSignal(
  bars: OHLCVBar[],
  metrics: Metrics,
  phase: 'accumulation' | 'markup' | 'distribution' | 'markdown',
  params: WyckoffParams
): WyckoffSignal {
  const latestBar = bars[bars.length - 1];
  const prevBar = bars[bars.length - 2];
  
  // Check for volume spike
  const volumeSpike = latestBar.volume > metrics.avgVolume * params.volumeThreshold;
  
  // ACCUMULATION PHASE - Look for breakout
  if (phase === 'accumulation') {
    // Breakout conditions:
    // 1. Price breaks above resistance
    // 2. High volume confirms breakout
    // 3. Strong bullish candle
    
    const breakoutPrice = metrics.resistance * (1 - params.accumulationSensitivity * 0.01);
    const isBullishCandle = latestBar.close > latestBar.open;
    const strongMove = (latestBar.close - latestBar.open) / latestBar.open > 0.005; // 0.5% move
    
    if (latestBar.close > breakoutPrice && volumeSpike && isBullishCandle && strongMove) {
      return {
        signal: 'long',
        reason: `Accumulation breakout: Price broke above ${breakoutPrice.toFixed(2)} with ${(latestBar.volume / metrics.avgVolume).toFixed(1)}x volume`,
        confidence: Math.min(0.9, params.accumulationSensitivity),
        metadata: {
          phase,
          volumeSpike: true,
          priceAction: 'breakout',
        },
      };
    }
    
    // Still accumulating - no signal
    return {
      signal: 'flat',
      reason: `Accumulation phase: waiting for breakout above ${breakoutPrice.toFixed(2)}`,
      confidence: 0.3,
      metadata: { phase },
    };
  }
  
  // DISTRIBUTION PHASE - Look for breakdown
  if (phase === 'distribution') {
    // Breakdown conditions:
    // 1. Price breaks below support
    // 2. High volume confirms breakdown
    // 3. Strong bearish candle
    
    const breakdownPrice = metrics.support * (1 + params.distributionSensitivity * 0.01);
    const isBearishCandle = latestBar.close < latestBar.open;
    const strongMove = (latestBar.open - latestBar.close) / latestBar.open > 0.005; // 0.5% move
    
    if (latestBar.close < breakdownPrice && volumeSpike && isBearishCandle && strongMove) {
      return {
        signal: 'short',
        reason: `Distribution breakdown: Price broke below ${breakdownPrice.toFixed(2)} with ${(latestBar.volume / metrics.avgVolume).toFixed(1)}x volume`,
        confidence: Math.min(0.9, params.distributionSensitivity),
        metadata: {
          phase,
          volumeSpike: true,
          priceAction: 'breakdown',
        },
      };
    }
    
    // Still distributing - no signal
    return {
      signal: 'flat',
      reason: `Distribution phase: waiting for breakdown below ${breakdownPrice.toFixed(2)}`,
      confidence: 0.3,
      metadata: { phase },
    };
  }
  
  // MARKUP PHASE - Follow the trend (cautiously)
  if (phase === 'markup') {
    // Look for continuation patterns or wait for pullback
    // For safety, we'll be conservative and wait for accumulation
    
    return {
      signal: 'flat',
      reason: 'Markup phase: waiting for pullback to accumulation before entry',
      confidence: 0.2,
      metadata: { phase, priceAction: 'trending up' },
    };
  }
  
  // MARKDOWN PHASE - Follow the trend (cautiously)
  if (phase === 'markdown') {
    // Look for continuation patterns or wait for bounce
    // For safety, we'll be conservative and wait for distribution
    
    return {
      signal: 'flat',
      reason: 'Markdown phase: waiting for bounce to distribution before entry',
      confidence: 0.2,
      metadata: { phase, priceAction: 'trending down' },
    };
  }
  
  // Default: no signal
  return {
    signal: 'flat',
    reason: 'No clear Wyckoff signal detected',
    confidence: 0,
    metadata: { phase },
  };
}

/**
 * TODO: Fine-tune these parameters based on backtesting
 * - Test different lookback periods (5, 12, 24 bars)
 * - Test different volume thresholds (1.2x, 1.5x, 2.0x)
 * - Test different sensitivity levels for accumulation vs distribution
 * - Consider adding RSI or other momentum indicators for confirmation
 */

export default analyzeWyckoff;
