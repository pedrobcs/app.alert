import type { Unit } from '../units';
import { formatValue, fromSI, toSI } from '../units';
import type { CalcResult } from './types';

/**
 * Stair calculator (MVP)
 *
 * Inputs:
 * - totalRise: total vertical rise (length)
 * - desiredRisePerStep: optional, defaults to 7.75 in (typical max)
 * - desiredTread: optional, defaults to 10 in
 *
 * Formula:
 * - numSteps = ceil(totalRise / desiredRisePerStep)
 * - actualRise = totalRise / numSteps
 *
 * Note:
 * - `stair rule` check (2*riser + tread ≈ 63 in ±3) is reported in meta.
 */
export function stairs(
  totalRise: number,
  opts?: { unit?: Unit; precision?: number; desiredRisePerStep?: number; desiredTread?: number },
): CalcResult {
  if (!Number.isFinite(totalRise)) throw new Error('totalRise must be finite');
  if (totalRise <= 0) throw new Error('totalRise must be > 0');

  const unit = opts?.unit ?? 'ft';
  const precision = opts?.precision ?? 16;

  const totalRiseSI = toSI(totalRise, unit).valueSI;

  // defaults specified in inches; convert to SI first, then to current unit for internal math
  const defaultRisePerStepSI = 7.75 * 0.0254;
  const defaultTreadSI = 10 * 0.0254;

  const desiredRiseSI = opts?.desiredRisePerStep
    ? toSI(opts.desiredRisePerStep, unit).valueSI
    : defaultRisePerStepSI;
  const desiredTreadSI = opts?.desiredTread
    ? toSI(opts.desiredTread, unit).valueSI
    : defaultTreadSI;

  if (desiredRiseSI <= 0) throw new Error('desiredRisePerStep must be > 0');

  const numSteps = Math.ceil(totalRiseSI / desiredRiseSI);
  const actualRiseSI = totalRiseSI / numSteps;

  // Stair rule check in inches:
  const actualRiseIn = actualRiseSI / 0.0254;
  const treadIn = desiredTreadSI / 0.0254;
  const rule = 2 * actualRiseIn + treadIn; // target ~63
  const withinRule = Math.abs(rule - 63) <= 3;

  const actualRiseOut = fromSI(actualRiseSI, unit);
  const display = `${numSteps} steps · riser ${formatValue(actualRiseOut, unit, precision)}`;

  return {
    value: actualRiseSI,
    unit: 'm',
    display,
    meta: {
      numSteps,
      actualRiseSI,
      stairRuleIn: rule,
      stairRuleOk: withinRule,
    },
  };
}
