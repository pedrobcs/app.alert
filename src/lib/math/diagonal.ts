import { assertFiniteNumber, CalcError, invariant } from "@/lib/errors";
import type { CalcContext } from "@/lib/math/context";
import type { CalcResult } from "@/lib/math/types";
import { isLengthUnit, lengthToMeters, metersToLength, formatValue } from "@/lib/units";

export function diagonal(
  params: { rise: number; run: number },
  ctx: CalcContext,
): CalcResult<{ riseM: number; runM: number }> {
  assertFiniteNumber(params.rise, "rise");
  assertFiniteNumber(params.run, "run");

  invariant(
    isLengthUnit(ctx.inUnit) && isLengthUnit(ctx.outUnit),
    new CalcError({
      errorCode: "INVALID_UNIT",
      message: `diagonal requires length in/out units; got in=${ctx.inUnit} out=${ctx.outUnit}`,
    }),
  );

  const riseM = lengthToMeters(params.rise, ctx.inUnit);
  const runM = lengthToMeters(params.run, ctx.inUnit);
  const diagM = Math.sqrt(riseM * riseM + runM * runM);
  const out = metersToLength(diagM, ctx.outUnit);

  return {
    value: diagM,
    unit: "m",
    display: formatValue(out, ctx.outUnit, ctx.precision),
    meta: { riseM, runM },
  };
}

