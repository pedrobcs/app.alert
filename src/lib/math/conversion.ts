import type { Unit } from '../units';
import { formatValue, fromSI, toSI, unitDimension } from '../units';
import type { CalcResult } from './types';

export function convert(
  value: number,
  fromUnit: Unit,
  toUnit: Unit,
  opts?: { precision?: number },
): CalcResult {
  if (!Number.isFinite(value)) throw new Error('value must be finite');
  if (unitDimension(fromUnit) !== unitDimension(toUnit)) {
    throw new Error(`Incompatible unit conversion: ${fromUnit} -> ${toUnit}`);
  }
  const precision = opts?.precision ?? 16;

  const { valueSI, siUnit } = toSI(value, fromUnit);
  const out = fromSI(valueSI, toUnit);

  return {
    value: valueSI,
    unit: siUnit,
    display: formatValue(out, toUnit, precision),
    meta: { outValue: out, outUnit: toUnit },
  };
}
