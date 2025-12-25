import { CalcError } from "@/lib/errors";
import type { CalcContext } from "@/lib/math/context";
import type { CalcResult } from "@/lib/math/types";

function notImplemented(name: string): never {
  throw new CalcError({
    errorCode: "NOT_IMPLEMENTED",
    status: 501,
    message: `${name} is not implemented yet (stub).`,
  });
}

export function hipRafterLength(_params: Record<string, unknown>, _ctx: CalcContext): CalcResult {
  // TODO: implement hip/valley rafter geometry (assumptions documented in README).
  notImplemented("hipRafterLength");
}

export function compoundMiter(_params: Record<string, unknown>, _ctx: CalcContext): CalcResult {
  // TODO: implement compound miter/bevel formulas with references.
  notImplemented("compoundMiter");
}

export function arcRadiusFromChord(_params: Record<string, unknown>, _ctx: CalcContext): CalcResult {
  // TODO: implement R = (h^2 + (c/2)^2)/(2h) and arc length.
  notImplemented("arcRadiusFromChord");
}

export function circle(_params: Record<string, unknown>, _ctx: CalcContext): CalcResult {
  // TODO: implement circumference/area.
  notImplemented("circle");
}

export function jackRafter(_params: Record<string, unknown>, _ctx: CalcContext): CalcResult {
  // TODO: implement jack rafter length.
  notImplemented("jackRafter");
}

export function dmsToDeg(_params: Record<string, unknown>, _ctx: CalcContext): CalcResult {
  // TODO: implement DMS parsing.
  notImplemented("dmsToDeg");
}

export function degToDms(_params: Record<string, unknown>, _ctx: CalcContext): CalcResult {
  // TODO: implement DMS formatting.
  notImplemented("degToDms");
}

export function tape(_params: Record<string, unknown>, _ctx: CalcContext): CalcResult {
  // TODO: emulate tape ticks at precision denom.
  notImplemented("tape");
}

export function cost(_params: Record<string, unknown>, _ctx: CalcContext): CalcResult {
  // TODO: implement cost calculator.
  notImplemented("cost");
}

