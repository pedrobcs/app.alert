import { describe, expect, it } from 'vitest';
import { reduceRational, toMixedFractionString, toRational } from '../lib/fraction';

describe('fraction', () => {
  it('reduces rationals and normalizes sign', () => {
    expect(reduceRational({ n: 2, d: 4 })).toEqual({ n: 1, d: 2 });
    expect(reduceRational({ n: -2, d: 4 })).toEqual({ n: -1, d: 2 });
    expect(reduceRational({ n: 2, d: -4 })).toEqual({ n: -1, d: 2 });
  });

  it('rounds to nearest denominator', () => {
    expect(toRational(0.5, 16)).toEqual({ n: 1, d: 2 });
    expect(toMixedFractionString(3.125, 16)).toBe('3 1/8');
  });

  it('handles carry when rounding hits 1', () => {
    // 1.999... to nearest 1/16 should become 2
    expect(toMixedFractionString(1.9999, 16)).toBe('2');
  });
});
