import { assertFiniteNumber, CalcError, invariant } from "@/lib/errors";
import type { CalcContext } from "@/lib/math/context";
import type { CalcResult } from "@/lib/math/types";
import { isLengthUnit, lengthToMeters, metersToLength, formatValue } from "@/lib/units";

function deg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function pitchFromRiseRun(
  params: { rise: number; run: number },
  ctx: CalcContext,
): CalcResult<{ angleDeg: number; slope: number }> {
  assertFiniteNumber(params.rise, "rise");
  assertFiniteNumber(params.run, "run");

  invariant(
    isLengthUnit(ctx.inUnit),
    new CalcError({
      errorCode: "INVALID_UNIT",
      message: `pitchFromRiseRun requires length inUnit; got ${ctx.inUnit}`,
    }),
  );

  invariant(
    params.run !== 0,
    new CalcError({
      errorCode: "DIV_BY_ZERO",
      message: "run must be non-zero",
    }),
  );

  const riseM = lengthToMeters(params.rise, ctx.inUnit);
  const runM = lengthToMeters(params.run, ctx.inUnit);
  const slope = riseM / runM;
  const pitch = slope * 12; // "X per 12"
  const angleDeg = deg(Math.atan(slope));

  // Format pitch like "6/12" or "6.5/12"
  const pitchRounded = Math.round(pitch * ctx.precision) / ctx.precision;
  const pitchStr = `${pitchRounded}/${12}`;

  return {
    value: pitch,
    unit: "pitch/12",
    display: pitchStr,
    meta: { angleDeg, slope },
  };
}

export function riseFromPitchRun(
  params: { pitch: number; run: number },
  ctx: CalcContext,
): CalcResult<{ pitch: number }> {
  assertFiniteNumber(params.pitch, "pitch");
  assertFiniteNumber(params.run, "run");

  invariant(
    isLengthUnit(ctx.inUnit) && isLengthUnit(ctx.outUnit),
    new CalcError({
      errorCode: "INVALID_UNIT",
      message: `riseFromPitchRun requires length in/out units; got in=${ctx.inUnit} out=${ctx.outUnit}`,
    }),
  );

  const runM = lengthToMeters(params.run, ctx.inUnit);
  const riseM = (params.pitch / 12) * runM;
  const out = metersToLength(riseM, ctx.outUnit);

  return {
    value: riseM,
    unit: "m",
    display: formatValue(out, ctx.outUnit, ctx.precision),
    meta: { pitch: params.pitch },
  };
}

export function runFromPitchRise(
  params: { pitch: number; rise: number },
  ctx: CalcContext,
): CalcResult<{ pitch: number }> {
  assertFiniteNumber(params.pitch, "pitch");
  assertFiniteNumber(params.rise, "rise");

  invariant(
    isLengthUnit(ctx.inUnit) && isLengthUnit(ctx.outUnit),
    new CalcError({
      errorCode: "INVALID_UNIT",
      message: `runFromPitchRise requires length in/out units; got in=${ctx.inUnit} out=${ctx.outUnit}`,
    }),
  );

  invariant(
    params.pitch !== 0,
    new CalcError({
      errorCode: "DIV_BY_ZERO",
      message: "pitch must be non-zero",
    }),
  );

  const riseM = lengthToMeters(params.rise, ctx.inUnit);
  const runM = (12 / params.pitch) * riseM;
  const out = metersToLength(runM, ctx.outUnit);

  return {
    value: runM,
    unit: "m",
    display: formatValue(out, ctx.outUnit, ctx.precision),
    meta: { pitch: params.pitch },
  };
}

