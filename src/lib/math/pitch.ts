import type { Unit } from '../units';
import { formatValue, fromSI, toSI } from '../units';
import { toMixedFractionString } from '../fraction';
import type { CalcResult } from './types';

function ensureFinitePositive(x: number, name: string) {
  if (!Number.isFinite(x)) throw new Error(`${name} must be a finite number`);
  if (x <= 0) throw new Error(`${name} must be > 0`);
}

export function pitchFromRiseRun(
  rise: number,
  run: number,
  opts?: { unit?: Unit; precision?: number },
): CalcResult {
  ensureFinitePositive(run, 'run');
  if (!Number.isFinite(rise)) throw new Error('rise must be a finite number');

  const unit = opts?.unit ?? 'ft';
  const precision = opts?.precision ?? 16;

  const riseSI = toSI(rise, unit).valueSI;
  const runSI = toSI(run, unit).valueSI;
  ensureFinitePositive(runSI, 'run');

  const ratio = riseSI / runSI;
  const pitchIn = ratio * 12; // inches per 12" run (i.e. per foot)
  const angleDeg = Math.atan2(riseSI, runSI) * (180 / Math.PI);

  const pitchStr = `${toMixedFractionString(pitchIn, precision)}/12`;

  return {
    value: pitchIn * 0.0254, // normalize as "meters of rise per foot of run" is awkward; store inches->m for a stable SI number
    unit: 'm',
    display: pitchStr,
    meta: { angleDeg, pitchIn },
  };
}

export function riseFromPitchRun(
  pitch: number,
  run: number,
  opts?: { unit?: Unit; outUnit?: Unit; precision?: number },
): CalcResult {
  ensureFinitePositive(run, 'run');
  if (!Number.isFinite(pitch)) throw new Error('pitch must be a finite number');
  ensureFinitePositive(pitch, 'pitch');

  const unit = opts?.unit ?? 'ft';
  const outUnit = opts?.outUnit ?? unit;
  const precision = opts?.precision ?? 16;

  const runSI = toSI(run, unit).valueSI;
  const ratio = pitch / 12;
  const riseSI = runSI * ratio;

  const out = fromSI(riseSI, outUnit);
  return {
    value: riseSI,
    unit: 'm',
    display: formatValue(out, outUnit, precision),
    meta: { outValue: out, outUnit },
  };
}

export function runFromPitchRise(
  pitch: number,
  rise: number,
  opts?: { unit?: Unit; outUnit?: Unit; precision?: number },
): CalcResult {
  if (!Number.isFinite(rise)) throw new Error('rise must be a finite number');
  if (!Number.isFinite(pitch)) throw new Error('pitch must be a finite number');
  ensureFinitePositive(pitch, 'pitch');

  const unit = opts?.unit ?? 'ft';
  const outUnit = opts?.outUnit ?? unit;
  const precision = opts?.precision ?? 16;

  const riseSI = toSI(rise, unit).valueSI;
  const ratio = pitch / 12; // rise/run
  if (ratio === 0) throw new Error('division by zero');
  const runSI = riseSI / ratio;

  const out = fromSI(runSI, outUnit);
  return {
    value: runSI,
    unit: 'm',
    display: formatValue(out, outUnit, precision),
    meta: { outValue: out, outUnit },
  };
}
