import type { Unit } from '../units';
import { formatValue, fromSI, toSI } from '../units';
import type { CalcResult } from './types';

export function diagonal(
  rise: number,
  run: number,
  opts?: { unit?: Unit; outUnit?: Unit; precision?: number },
): CalcResult {
  if (!Number.isFinite(rise) || !Number.isFinite(run)) throw new Error('Inputs must be finite');
  if (run === 0 && rise === 0) throw new Error('Both rise and run cannot be zero');

  const unit = opts?.unit ?? 'ft';
  const outUnit = opts?.outUnit ?? unit;
  const precision = opts?.precision ?? 16;

  const riseSI = toSI(rise, unit).valueSI;
  const runSI = toSI(run, unit).valueSI;
  const diagSI = Math.sqrt(riseSI * riseSI + runSI * runSI);
  const out = fromSI(diagSI, outUnit);

  return {
    value: diagSI,
    unit: 'm',
    display: formatValue(out, outUnit, precision),
    meta: { outValue: out, outUnit },
  };
}
