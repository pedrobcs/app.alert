import { assertFiniteNumber, CalcError, invariant } from "@/lib/errors";
import type { CalcContext } from "@/lib/math/context";
import type { CalcResult } from "@/lib/math/types";
import {
  formatValue,
  isAreaUnit,
  isLengthUnit,
  isMassUnit,
  isTonUnit,
  areaToM2,
  kgToMass,
  kgToTon,
  lengthToMeters,
  m2ToArea,
  massToKg,
  metersToLength,
  tonToKg,
} from "@/lib/units";

export function convert(
  params: { value: number },
  ctx: CalcContext,
): CalcResult<{ kind: string; inUnit: string; outUnit: string }> {
  assertFiniteNumber(params.value, "value");
  let normalizedValue = 0;
  let normalizedUnit = "";
  let outValue = 0;
  let kind = "";

  if (isLengthUnit(ctx.inUnit) && isLengthUnit(ctx.outUnit)) {
    normalizedValue = lengthToMeters(params.value, ctx.inUnit);
    normalizedUnit = "m";
    outValue = metersToLength(normalizedValue, ctx.outUnit);
    kind = "length";
  } else if (isMassUnit(ctx.inUnit) && isMassUnit(ctx.outUnit)) {
    normalizedValue = massToKg(params.value, ctx.inUnit);
    normalizedUnit = "kg";
    outValue = kgToMass(normalizedValue, ctx.outUnit);
    kind = "mass";
  } else if (isTonUnit(ctx.inUnit) && isTonUnit(ctx.outUnit)) {
    normalizedValue = tonToKg(params.value, ctx.inUnit);
    normalizedUnit = "kg";
    outValue = kgToTon(normalizedValue, ctx.outUnit);
    kind = "ton";
  } else if (isMassUnit(ctx.inUnit) && isTonUnit(ctx.outUnit)) {
    normalizedValue = massToKg(params.value, ctx.inUnit);
    normalizedUnit = "kg";
    outValue = kgToTon(normalizedValue, ctx.outUnit);
    kind = "mass-ton";
  } else if (isTonUnit(ctx.inUnit) && isMassUnit(ctx.outUnit)) {
    normalizedValue = tonToKg(params.value, ctx.inUnit);
    normalizedUnit = "kg";
    outValue = kgToMass(normalizedValue, ctx.outUnit);
    kind = "ton-mass";
  } else if (isAreaUnit(ctx.inUnit) && isAreaUnit(ctx.outUnit)) {
    normalizedValue = areaToM2(params.value, ctx.inUnit);
    normalizedUnit = "m2";
    outValue = m2ToArea(normalizedValue, ctx.outUnit);
    kind = "area";
  } else {
    invariant(
      false,
      new CalcError({
        errorCode: "UNSUPPORTED_CONVERSION",
        message: `Unsupported conversion: ${ctx.inUnit} -> ${ctx.outUnit}`,
        details: { inUnit: ctx.inUnit, outUnit: ctx.outUnit },
      }),
    );
  }

  return {
    value: normalizedValue,
    unit: normalizedUnit,
    display: formatValue(outValue, ctx.outUnit, ctx.precision),
    meta: { kind, inUnit: ctx.inUnit, outUnit: ctx.outUnit },
  };
}

