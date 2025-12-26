import { describe, expect, it } from 'vitest';
import { pitchFromRiseRun, riseFromPitchRun, runFromPitchRise } from '../../lib/math/pitch';

describe('pitch', () => {
  it('computes pitch inches per 12', () => {
    const r = pitchFromRiseRun(6, 12, { unit: 'ft', precision: 16 });
    expect(r.display).toContain('/12');
    expect(Number(r.meta?.pitchIn)).toBeCloseTo(6, 10);
    expect(Number(r.meta?.angleDeg)).toBeCloseTo(Math.atan(6 / 12) * (180 / Math.PI), 10);
  });

  it('computes rise from pitch and run', () => {
    const r = riseFromPitchRun(6, 12, { unit: 'ft', outUnit: 'ft', precision: 16 });
    // rise/run = 6/12 => rise = run*0.5
    expect(Number(r.meta?.outValue)).toBeCloseTo(6, 12);
  });

  it('computes run from pitch and rise', () => {
    const r = runFromPitchRise(6, 6, { unit: 'ft', outUnit: 'ft', precision: 16 });
    // rise/run = 0.5 => run = 12
    expect(Number(r.meta?.outValue)).toBeCloseTo(12, 12);
  });

  it('rejects division by zero', () => {
    expect(() => pitchFromRiseRun(1, 0 as unknown as number)).toThrow();
    expect(() => runFromPitchRise(0 as unknown as number, 1)).toThrow();
  });
});
