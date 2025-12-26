import { assertFiniteNumber, CalcError, invariant } from "@/lib/errors";
import type { CalcContext } from "@/lib/math/context";
import type { CalcResult } from "@/lib/math/types";
import { isLengthUnit, lengthToMeters, metersToLength, formatValue } from "@/lib/units";

const INCH_TO_M = 0.0254;

export function stairs(
  params: { totalRise: number; desiredRise?: number; desiredTread?: number },
  ctx: CalcContext,
): CalcResult<{
  numSteps: number;
  actualRiseM: number;
  actualTreadM: number;
  stairRuleM: number;
  stairRuleOk: boolean;
}> {
  assertFiniteNumber(params.totalRise, "totalRise");
  if (params.desiredRise !== undefined) assertFiniteNumber(params.desiredRise, "desiredRise");
  if (params.desiredTread !== undefined) assertFiniteNumber(params.desiredTread, "desiredTread");

  invariant(
    isLengthUnit(ctx.inUnit) && isLengthUnit(ctx.outUnit),
    new CalcError({
      errorCode: "INVALID_UNIT",
      message: `stairs requires length in/out units; got in=${ctx.inUnit} out=${ctx.outUnit}`,
    }),
  );

  // Defaults: 7 3/4" riser and 10" tread (common residential starting point)
  const desiredRiseM =
    params.desiredRise === undefined
      ? 7.75 * INCH_TO_M
      : lengthToMeters(params.desiredRise, ctx.inUnit);
  const desiredTreadM =
    params.desiredTread === undefined
      ? 10 * INCH_TO_M
      : lengthToMeters(params.desiredTread, ctx.inUnit);

  invariant(
    desiredRiseM > 0,
    new CalcError({
      errorCode: "INVALID_PARAM",
      message: "desiredRise must be > 0",
    }),
  );

  const totalRiseM = lengthToMeters(params.totalRise, ctx.inUnit);
  invariant(
    totalRiseM > 0,
    new CalcError({
      errorCode: "INVALID_PARAM",
      message: "totalRise must be > 0",
    }),
  );

  const numSteps = Math.ceil(totalRiseM / desiredRiseM);
  invariant(
    numSteps > 0,
    new CalcError({
      errorCode: "INVALID_PARAM",
      message: "numSteps must be > 0",
    }),
  );

  const actualRiseM = totalRiseM / numSteps;
  const actualTreadM = desiredTreadM;

  // Stair rule: 2*riser + tread ≈ 63" (± 3")
  const targetM = 63 * INCH_TO_M;
  const tolM = 3 * INCH_TO_M;
  const stairRuleM = 2 * actualRiseM + actualTreadM;
  const stairRuleOk = Math.abs(stairRuleM - targetM) <= tolM;

  const outActualRise = metersToLength(actualRiseM, ctx.outUnit);
  const outActualTread = metersToLength(actualTreadM, ctx.outUnit);

  return {
    value: actualRiseM,
    unit: "m",
    display: `${numSteps} steps • rise ${formatValue(outActualRise, ctx.outUnit, ctx.precision)} • tread ${formatValue(outActualTread, ctx.outUnit, ctx.precision)}`,
    meta: { numSteps, actualRiseM, actualTreadM, stairRuleM, stairRuleOk },
  };
}

