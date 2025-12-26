import { toMixedFractionString } from './fraction';

export type Unit = 'ft' | 'in' | 'yd' | 'm' | 'cm' | 'mm' | 'lb' | 'kg';

export type UnitDimension = 'length' | 'mass';

const DIM: Record<Unit, UnitDimension> = {
  ft: 'length',
  in: 'length',
  yd: 'length',
  m: 'length',
  cm: 'length',
  mm: 'length',
  lb: 'mass',
  kg: 'mass',
};

export function unitDimension(u: Unit): UnitDimension {
  return DIM[u];
}

const LENGTH_TO_M: Record<Exclude<Unit, 'lb' | 'kg'>, number> = {
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  m: 1,
  cm: 0.01,
  mm: 0.001,
};

const LB_TO_KG = 0.45359237;

export function toSI(value: number, unit: Unit): { valueSI: number; siUnit: 'm' | 'kg' } {
  if (!Number.isFinite(value)) throw new Error('Invalid value');
  const dim = unitDimension(unit);
  if (dim === 'length') {
    const factor = LENGTH_TO_M[unit as Exclude<Unit, 'lb' | 'kg'>];
    return { valueSI: value * factor, siUnit: 'm' };
  }
  // mass
  if (unit === 'kg') return { valueSI: value, siUnit: 'kg' };
  return { valueSI: value * LB_TO_KG, siUnit: 'kg' };
}

export function fromSI(valueSI: number, outUnit: Unit): number {
  if (!Number.isFinite(valueSI)) throw new Error('Invalid value');
  const dim = unitDimension(outUnit);
  if (dim === 'length') {
    const factor = LENGTH_TO_M[outUnit as Exclude<Unit, 'lb' | 'kg'>];
    return valueSI / factor;
  }
  // mass
  if (outUnit === 'kg') return valueSI;
  return valueSI / LB_TO_KG;
}

export function formatValue(value: number, unit: Unit, precisionDenom: number): string {
  if (!Number.isFinite(value)) return `NaN ${unit}`;
  const dim = unitDimension(unit);
  if (dim === 'length' && (unit === 'in' || unit === 'ft')) {
    // For "ft", show feet + inches with fraction.
    if (unit === 'ft') {
      const totalIn = value * 12;
      const sign = totalIn < 0 ? '-' : '';
      const absIn = Math.abs(totalIn);
      const feet = Math.floor(absIn / 12);
      const inches = absIn - feet * 12;
      const inchStr = toMixedFractionString(inches, precisionDenom);
      // inchStr already includes sign if negative; we already extracted sign.
      const cleaned = inchStr.startsWith('-') ? inchStr.slice(1) : inchStr;
      if (cleaned === '0') return `${sign}${feet}' 0"`;
      return `${sign}${feet}' ${cleaned}"`;
    }
    return `${toMixedFractionString(value, precisionDenom)} ${unit}`;
  }
  const rounded = Math.round(value * 1e6) / 1e6;
  return `${rounded} ${unit}`;
}
