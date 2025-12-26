import { describe, expect, it } from 'vitest';
import { stairs } from '../../lib/math/stairs';

describe('stairs', () => {
  it('returns integer steps when exact', () => {
    // 10 ft total rise, with desired rise per step 1 ft => 10 steps
    const r = stairs(10, { unit: 'ft', desiredRisePerStep: 1, precision: 16 });
    expect(r.meta?.numSteps).toBe(10);
  });

  it('ceil steps when not exact', () => {
    // 10 ft total rise, desired 3 ft per step => ceil(3.33)=4 steps
    const r = stairs(10, { unit: 'ft', desiredRisePerStep: 3, precision: 16 });
    expect(r.meta?.numSteps).toBe(4);
  });

  it('rejects invalid totalRise', () => {
    expect(() => stairs(0, { unit: 'ft' })).toThrow(/must be > 0/);
  });
});
