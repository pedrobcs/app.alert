import { CalcError } from "@/lib/errors";
import type { Unit } from "@/lib/math/types";
import { formatFeetInches, formatInchesFraction } from "@/lib/fraction";

export type LengthUnit = "m" | "cm" | "mm" | "ft" | "in" | "yd";
export type MassUnit = "kg" | "lbs";
export type AreaUnit = "acre";
export type TonUnit = "ton" | "metric_ton";

export function isLengthUnit(u: Unit): u is LengthUnit {
  return u === "m" || u === "cm" || u === "mm" || u === "ft" || u === "in" || u === "yd";
}
export function isMassUnit(u: Unit): u is MassUnit {
  return u === "kg" || u === "lbs";
}
export function isAreaUnit(u: Unit): u is AreaUnit {
  return u === "acre";
}
export function isTonUnit(u: Unit): u is TonUnit {
  return u === "ton" || u === "metric_ton";
}

const INCH_TO_M = 0.0254;
const FOOT_TO_M = 0.3048;
const YARD_TO_M = 0.9144;
const LB_TO_KG = 0.45359237;
const ACRE_TO_M2 = 4046.8564224;
const SHORT_TON_TO_KG = 907.18474;
const METRIC_TON_TO_KG = 1000;

export function lengthToMeters(value: number, unit: LengthUnit): number {
  switch (unit) {
    case "m":
      return value;
    case "cm":
      return value / 100;
    case "mm":
      return value / 1000;
    case "in":
      return value * INCH_TO_M;
    case "ft":
      return value * FOOT_TO_M;
    case "yd":
      return value * YARD_TO_M;
  }
}

export function metersToLength(valueM: number, unit: LengthUnit): number {
  switch (unit) {
    case "m":
      return valueM;
    case "cm":
      return valueM * 100;
    case "mm":
      return valueM * 1000;
    case "in":
      return valueM / INCH_TO_M;
    case "ft":
      return valueM / FOOT_TO_M;
    case "yd":
      return valueM / YARD_TO_M;
  }
}

export function massToKg(value: number, unit: MassUnit): number {
  switch (unit) {
    case "kg":
      return value;
    case "lbs":
      return value * LB_TO_KG;
  }
}

export function kgToMass(valueKg: number, unit: MassUnit): number {
  switch (unit) {
    case "kg":
      return valueKg;
    case "lbs":
      return valueKg / LB_TO_KG;
  }
}

export function tonToKg(value: number, unit: TonUnit): number {
  switch (unit) {
    case "ton":
      return value * SHORT_TON_TO_KG;
    case "metric_ton":
      return value * METRIC_TON_TO_KG;
  }
}

export function kgToTon(valueKg: number, unit: TonUnit): number {
  switch (unit) {
    case "ton":
      return valueKg / SHORT_TON_TO_KG;
    case "metric_ton":
      return valueKg / METRIC_TON_TO_KG;
  }
}

export function areaToM2(value: number, unit: AreaUnit): number {
  switch (unit) {
    case "acre":
      return value * ACRE_TO_M2;
  }
}

export function m2ToArea(valueM2: number, unit: AreaUnit): number {
  switch (unit) {
    case "acre":
      return valueM2 / ACRE_TO_M2;
  }
}

export function convertUnit(value: number, from: Unit, to: Unit): { value: number; kind: string } {
  if (from === to) return { value, kind: "identity" };

  if (isLengthUnit(from) && isLengthUnit(to)) {
    const m = lengthToMeters(value, from);
    return { value: metersToLength(m, to), kind: "length" };
  }
  if (isMassUnit(from) && isMassUnit(to)) {
    const kg = massToKg(value, from);
    return { value: kgToMass(kg, to), kind: "mass" };
  }
  if (isTonUnit(from) && isTonUnit(to)) {
    const kg = tonToKg(value, from);
    return { value: kgToTon(kg, to), kind: "ton" };
  }
  if (isMassUnit(from) && isTonUnit(to)) {
    const kg = massToKg(value, from);
    return { value: kgToTon(kg, to), kind: "mass-ton" };
  }
  if (isTonUnit(from) && isMassUnit(to)) {
    const kg = tonToKg(value, from);
    return { value: kgToMass(kg, to), kind: "ton-mass" };
  }
  if (isAreaUnit(from) && isAreaUnit(to)) {
    const m2 = areaToM2(value, from);
    return { value: m2ToArea(m2, to), kind: "area" };
  }

  throw new CalcError({
    errorCode: "UNSUPPORTED_CONVERSION",
    message: `Unsupported conversion: ${from} -> ${to}`,
    details: { from, to },
  });
}

export function formatValue(value: number, unit: Unit, precisionDenom: number): string {
  if (!Number.isFinite(value)) return `${value}`;

  if (unit === "in") return formatInchesFraction(value, precisionDenom);
  if (unit === "ft") return formatFeetInches(value * 12, precisionDenom);

  const digits = isLengthUnit(unit) ? 3 : 3;
  return `${value.toFixed(digits)} ${unit}`;
}

