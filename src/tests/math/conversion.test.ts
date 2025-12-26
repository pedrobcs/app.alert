import { describe, expect, it } from 'vitest';
import { convert } from '../../lib/math/conversion';

describe('convert', () => {
  it('converts ft -> in', () => {
    const r = convert(1, 'ft', 'in');
    expect(Number(r.meta?.outValue)).toBeCloseTo(12, 12);
  });

  it('converts in -> cm', () => {
    const r = convert(10, 'in', 'cm');
    expect(Number(r.meta?.outValue)).toBeCloseTo(25.4, 10);
  });

  it('converts lb -> kg', () => {
    const r = convert(1, 'lb', 'kg');
    expect(Number(r.meta?.outValue)).toBeCloseTo(0.45359237, 12);
  });

  it('rejects incompatible conversions', () => {
    expect(() => convert(1, 'ft', 'kg')).toThrow(/Incompatible/);
  });
});
