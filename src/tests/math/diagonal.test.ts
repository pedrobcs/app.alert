import { describe, expect, it } from 'vitest';
import { diagonal } from '../../lib/math/diagonal';

describe('diagonal', () => {
  it('computes 3-4-5 triangle', () => {
    const r = diagonal(3, 4, { unit: 'ft', outUnit: 'ft', precision: 16 });
    expect(Number(r.meta?.outValue)).toBeCloseTo(5, 12);
  });

  it('rejects both zero', () => {
    expect(() => diagonal(0, 0, { unit: 'ft' })).toThrow(/cannot be zero/);
  });
});
