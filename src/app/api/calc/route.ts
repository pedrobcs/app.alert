import { NextResponse } from "next/server";
import { z } from "zod";
import { CalcError } from "@/lib/errors";
import type { CalcContext } from "@/lib/math/context";
import {
  diagonal,
  pitchFromRiseRun,
  riseFromPitchRun,
  runFromPitchRise,
  stairs,
  convert,
  hipRafterLength,
  compoundMiter,
  arcRadiusFromChord,
  circle,
  jackRafter,
  dmsToDeg,
  degToDms,
  tape,
  cost,
  type Unit,
} from "@/lib/math";
import {
  isLengthUnit,
  isMassUnit,
  isTonUnit,
  isAreaUnit,
  kgToMass,
  kgToTon,
  metersToLength,
  m2ToArea,
} from "@/lib/units";

const unitSchema = z.enum([
  "m",
  "cm",
  "mm",
  "ft",
  "in",
  "yd",
  "kg",
  "lbs",
  "acre",
  "ton",
  "metric_ton",
  "deg",
  "dms",
]);

const requestSchema = z.object({
  function: z.string().min(1),
  params: z.record(z.unknown()).default({}),
  inUnit: unitSchema,
  outUnit: unitSchema,
  precision: z.number().int().positive().max(1024).default(16),
});

const handlers: Record<
  string,
  {
    schema: z.ZodTypeAny;
    run: (params: unknown, ctx: CalcContext) => unknown;
  }
> = {
  pitchFromRiseRun: {
    schema: z.object({ rise: z.number(), run: z.number() }),
    run: (p, ctx) => pitchFromRiseRun(p as { rise: number; run: number }, ctx),
  },
  riseFromPitchRun: {
    schema: z.object({ pitch: z.number(), run: z.number() }),
    run: (p, ctx) => riseFromPitchRun(p as { pitch: number; run: number }, ctx),
  },
  runFromPitchRise: {
    schema: z.object({ pitch: z.number(), rise: z.number() }),
    run: (p, ctx) => runFromPitchRise(p as { pitch: number; rise: number }, ctx),
  },
  diagonal: {
    schema: z.object({ rise: z.number(), run: z.number() }),
    run: (p, ctx) => diagonal(p as { rise: number; run: number }, ctx),
  },
  convert: {
    schema: z.object({ value: z.number() }),
    run: (p, ctx) => convert(p as { value: number }, ctx),
  },
  stairs: {
    schema: z.object({
      totalRise: z.number(),
      desiredRise: z.number().optional(),
      desiredTread: z.number().optional(),
    }),
    run: (p, ctx) =>
      stairs(
        p as { totalRise: number; desiredRise?: number; desiredTread?: number },
        ctx,
      ),
  },

  // Stubs (documented in README)
  hipRafterLength: {
    schema: z.record(z.unknown()),
    run: (p, ctx) => hipRafterLength(p as Record<string, unknown>, ctx),
  },
  compoundMiter: {
    schema: z.record(z.unknown()),
    run: (p, ctx) => compoundMiter(p as Record<string, unknown>, ctx),
  },
  arcRadiusFromChord: {
    schema: z.record(z.unknown()),
    run: (p, ctx) => arcRadiusFromChord(p as Record<string, unknown>, ctx),
  },
  circle: { schema: z.record(z.unknown()), run: (p, ctx) => circle(p as Record<string, unknown>, ctx) },
  jackRafter: {
    schema: z.record(z.unknown()),
    run: (p, ctx) => jackRafter(p as Record<string, unknown>, ctx),
  },
  dmsToDeg: { schema: z.record(z.unknown()), run: (p, ctx) => dmsToDeg(p as Record<string, unknown>, ctx) },
  degToDms: { schema: z.record(z.unknown()), run: (p, ctx) => degToDms(p as Record<string, unknown>, ctx) },
  tape: { schema: z.record(z.unknown()), run: (p, ctx) => tape(p as Record<string, unknown>, ctx) },
  cost: { schema: z.record(z.unknown()), run: (p, ctx) => cost(p as Record<string, unknown>, ctx) },
};

function toOutValue(normalized: { value: number; unit: string }, outUnit: Unit): number | null {
  if (normalized.unit === "m" && isLengthUnit(outUnit)) return metersToLength(normalized.value, outUnit);
  if (normalized.unit === "kg" && isMassUnit(outUnit)) return kgToMass(normalized.value, outUnit);
  if (normalized.unit === "kg" && isTonUnit(outUnit)) return kgToTon(normalized.value, outUnit);
  if (normalized.unit === "m2" && isAreaUnit(outUnit)) return m2ToArea(normalized.value, outUnit);
  return null;
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = requestSchema.parse(json);

    const handler = handlers[body.function];
    if (!handler) {
      return NextResponse.json(
        {
          ok: false,
          errorCode: "UNKNOWN_FUNCTION",
          message: `Unknown function: ${body.function}`,
        },
        { status: 400 },
      );
    }

    const ctx: CalcContext = {
      inUnit: body.inUnit,
      outUnit: body.outUnit,
      precision: body.precision,
    };

    const parsedParams = handler.schema.parse(body.params) as unknown;
    const result = handler.run(parsedParams, ctx) as unknown;

    // Standardize response shape
    const r = result as { value?: unknown; unit?: unknown; display?: unknown; meta?: unknown } | null;
    const normalized = {
      value: typeof r?.value === "number" ? r.value : null,
      unit: typeof r?.unit === "string" ? r.unit : null,
      display: typeof r?.display === "string" ? r.display : null,
      meta: r?.meta ?? null,
    };

    if (normalized.value === null || normalized.unit === null || normalized.display === null) {
      return NextResponse.json(
        { ok: false, errorCode: "INTERNAL_RESULT_SHAPE", message: "Invalid handler result shape" },
        { status: 500 },
      );
    }

    const outValue = toOutValue({ value: normalized.value, unit: normalized.unit }, body.outUnit);

    return NextResponse.json({
      ok: true,
      result: normalized.value,
      unit: normalized.unit,
      display: normalized.display,
      outUnit: body.outUnit,
      resultOut: outValue,
      meta: { precision: body.precision, ...(normalized.meta ?? {}) },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, errorCode: "INVALID_REQUEST", message: "Invalid request", details: err.flatten() },
        { status: 400 },
      );
    }
    if (err instanceof CalcError) {
      return NextResponse.json(
        { ok: false, errorCode: err.errorCode, message: err.message, details: err.details ?? null },
        { status: err.status },
      );
    }

    return NextResponse.json(
      { ok: false, errorCode: "INTERNAL_ERROR", message: "Unexpected error" },
      { status: 500 },
    );
  }
}

