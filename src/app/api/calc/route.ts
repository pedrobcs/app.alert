import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { Unit } from '@/lib/units';
import { diagonal } from '@/lib/math/diagonal';
import { convert } from '@/lib/math/conversion';
import { pitchFromRiseRun, riseFromPitchRun, runFromPitchRise } from '@/lib/math/pitch';
import { stairs } from '@/lib/math/stairs';

const UnitSchema = z.enum(['ft', 'in', 'yd', 'm', 'cm', 'mm', 'lb', 'kg']);

const RequestSchema = z.object({
  function: z.string().min(1),
  params: z.record(z.unknown()).default({}),
  inUnit: UnitSchema.default('ft'),
  outUnit: UnitSchema.default('ft'),
  precision: z.number().int().positive().default(16),
});

function json400(errorCode: string, message: string) {
  return NextResponse.json({ ok: false, errorCode, message }, { status: 400 });
}

function json501(functionName: string) {
  return NextResponse.json(
    { ok: false, errorCode: 'NOT_IMPLEMENTED', message: `${functionName} not implemented` },
    { status: 501 },
  );
}

export async function POST(req: Request) {
  let parsed: z.infer<typeof RequestSchema>;
  try {
    const body = await req.json();
    parsed = RequestSchema.parse(body);
  } catch {
    return json400('INVALID_REQUEST', 'Invalid JSON or request shape');
  }

  const fn = parsed.function;
  const inUnit = parsed.inUnit as Unit;
  const outUnit = parsed.outUnit as Unit;
  const precision = parsed.precision;
  const p = parsed.params ?? {};

  try {
    switch (fn) {
      case 'pitchFromRiseRun': {
        const rise = z.number().finite().parse(p.rise);
        const run = z.number().finite().parse(p.run);
        const r = pitchFromRiseRun(rise, run, { unit: inUnit, precision });
        return NextResponse.json({
          ok: true,
          result: Number(r.meta?.pitchIn ?? NaN),
          display: r.display,
          meta: { precision, ...r.meta },
        });
      }
      case 'riseFromPitchRun': {
        const pitch = z.number().finite().parse(p.pitch);
        const run = z.number().finite().parse(p.run);
        const r = riseFromPitchRun(pitch, run, { unit: inUnit, outUnit, precision });
        return NextResponse.json({
          ok: true,
          result: Number(r.meta?.outValue ?? NaN),
          display: r.display,
          meta: { precision, ...r.meta },
        });
      }
      case 'runFromPitchRise': {
        const pitch = z.number().finite().parse(p.pitch);
        const rise = z.number().finite().parse(p.rise);
        const r = runFromPitchRise(pitch, rise, { unit: inUnit, outUnit, precision });
        return NextResponse.json({
          ok: true,
          result: Number(r.meta?.outValue ?? NaN),
          display: r.display,
          meta: { precision, ...r.meta },
        });
      }
      case 'diagonal': {
        const rise = z.number().finite().parse(p.rise);
        const run = z.number().finite().parse(p.run);
        const r = diagonal(rise, run, { unit: inUnit, outUnit, precision });
        return NextResponse.json({
          ok: true,
          result: Number(r.meta?.outValue ?? NaN),
          display: r.display,
          meta: { precision, ...r.meta },
        });
      }
      case 'convert': {
        const value = z.number().finite().parse(p.value);
        const fromUnit = UnitSchema.parse(p.fromUnit) as Unit;
        const toUnit = UnitSchema.parse(p.toUnit) as Unit;
        const r = convert(value, fromUnit, toUnit, { precision });
        return NextResponse.json({
          ok: true,
          result: Number(r.meta?.outValue ?? NaN),
          display: r.display,
          meta: { precision, ...r.meta },
        });
      }
      case 'stairs': {
        const totalRise = z.number().finite().parse(p.totalRise);
        const desiredRisePerStep =
          p.desiredRisePerStep == null
            ? undefined
            : z.number().finite().parse(p.desiredRisePerStep);
        const desiredTread =
          p.desiredTread == null ? undefined : z.number().finite().parse(p.desiredTread);
        const r = stairs(totalRise, {
          unit: inUnit,
          precision,
          desiredRisePerStep,
          desiredTread,
        });
        return NextResponse.json({
          ok: true,
          result: Number(r.meta?.numSteps ?? NaN),
          display: r.display,
          meta: { precision, ...r.meta },
        });
      }
      // documented stubs
      case 'hipRafterLength':
      case 'compoundMiter':
      case 'arcRadiusFromChord':
      case 'circle':
      case 'jackRafter':
      case 'dmsToDeg':
      case 'degToDms':
      case 'tape':
      case 'cost':
        return json501(fn);
      default:
        return json501(fn);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return json400('CALC_ERROR', msg);
  }
}
