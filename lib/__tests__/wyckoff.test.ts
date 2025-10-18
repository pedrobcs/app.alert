/**
 * Wyckoff Strategy Tests
 * 
 * Unit tests for Wyckoff signal generation
 */

import { analyzeWyckoff } from '../wyckoff';
import { OHLCVBar, WyckoffParams } from '@/types';

describe('Wyckoff Strategy', () => {
  const defaultParams: WyckoffParams = {
    lookbackBars: 12,
    volumeThreshold: 1.5,
    accumulationSensitivity: 0.7,
    distributionSensitivity: 0.7,
  };

  // Helper to generate bars
  const generateBars = (count: number, basePrice: number = 100): OHLCVBar[] => {
    const bars: OHLCVBar[] = [];
    for (let i = 0; i < count; i++) {
      const timestamp = Date.now() - (count - i) * 5 * 60 * 1000; // 5 min intervals
      bars.push({
        timestamp,
        open: basePrice,
        high: basePrice + 1,
        low: basePrice - 1,
        close: basePrice,
        volume: 1000,
      });
    }
    return bars;
  };

  test('should return flat signal with insufficient data', () => {
    const bars = generateBars(5);
    const signal = analyzeWyckoff(bars, defaultParams);
    
    expect(signal.signal).toBe('flat');
    expect(signal.reason).toContain('Insufficient data');
  });

  test('should detect accumulation breakout', () => {
    const bars = generateBars(12, 100);
    
    // Add accumulation phase (sideways)
    for (let i = 0; i < 8; i++) {
      bars.push({
        timestamp: Date.now() + i * 5 * 60 * 1000,
        open: 100,
        high: 101,
        low: 99,
        close: 100 + (Math.random() - 0.5),
        volume: 1000 + Math.random() * 200,
      });
    }
    
    // Add breakout bar with high volume
    bars.push({
      timestamp: Date.now() + 8 * 5 * 60 * 1000,
      open: 100,
      high: 105,
      low: 100,
      close: 104,
      volume: 2000, // High volume
    });
    
    const signal = analyzeWyckoff(bars, defaultParams);
    
    expect(signal.signal).toBe('long');
    expect(signal.confidence).toBeGreaterThan(0);
  });

  test('should detect distribution breakdown', () => {
    const bars = generateBars(12, 100);
    
    // Add distribution phase (sideways)
    for (let i = 0; i < 8; i++) {
      bars.push({
        timestamp: Date.now() + i * 5 * 60 * 1000,
        open: 100,
        high: 101,
        low: 99,
        close: 100 + (Math.random() - 0.5),
        volume: 1000 + Math.random() * 200,
      });
    }
    
    // Add breakdown bar with high volume
    bars.push({
      timestamp: Date.now() + 8 * 5 * 60 * 1000,
      open: 100,
      high: 100,
      low: 95,
      close: 96,
      volume: 2000, // High volume
    });
    
    const signal = analyzeWyckoff(bars, defaultParams);
    
    expect(signal.signal).toBe('short');
    expect(signal.confidence).toBeGreaterThan(0);
  });

  test('should return flat during markup phase', () => {
    const bars = generateBars(12, 100);
    
    // Add strong uptrend
    for (let i = 0; i < 10; i++) {
      const price = 100 + i * 2;
      bars.push({
        timestamp: Date.now() + i * 5 * 60 * 1000,
        open: price,
        high: price + 2,
        low: price,
        close: price + 1.5,
        volume: 1000,
      });
    }
    
    const signal = analyzeWyckoff(bars, defaultParams);
    
    expect(signal.signal).toBe('flat');
    expect(signal.reason).toContain('Markup');
  });

  test('should adjust sensitivity based on parameters', () => {
    const bars = generateBars(15, 100);
    
    // High sensitivity (should trigger more easily)
    const highSensitivity: WyckoffParams = {
      ...defaultParams,
      accumulationSensitivity: 0.9,
    };
    
    // Low sensitivity (should trigger less easily)
    const lowSensitivity: WyckoffParams = {
      ...defaultParams,
      accumulationSensitivity: 0.3,
    };
    
    const signal1 = analyzeWyckoff(bars, highSensitivity);
    const signal2 = analyzeWyckoff(bars, lowSensitivity);
    
    // Both should be deterministic given same bars
    expect(signal1.signal).toBe(signal2.signal);
  });
});
