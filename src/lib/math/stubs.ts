import type { CalcResult } from './types';

type NotImplementedError = Error & { code: 'NOT_IMPLEMENTED' };

function notImplemented(name: string): never {
  const err: NotImplementedError = Object.assign(new Error(`${name} is not implemented (stub)`), {
    code: 'NOT_IMPLEMENTED' as const,
  });
  throw err;
}

/**
 * Stub functions to be implemented later:
 * - hip/valley rafter
 * - compound miter
 * - arc radius/length
 * - circle (circumference/area)
 * - jack rafter
 * - dms <-> deg
 * - tape emulator
 * - cost calculator
 */

export function hipRafterLength(): CalcResult {
  return notImplemented('hipRafterLength');
}

export function compoundMiter(): CalcResult {
  return notImplemented('compoundMiter');
}

export function arcRadiusFromChord(): CalcResult {
  return notImplemented('arcRadiusFromChord');
}

export function circle(): CalcResult {
  return notImplemented('circle');
}

export function jackRafter(): CalcResult {
  return notImplemented('jackRafter');
}

export function dmsToDeg(): CalcResult {
  return notImplemented('dmsToDeg');
}

export function degToDms(): CalcResult {
  return notImplemented('degToDms');
}

export function tape(): CalcResult {
  return notImplemented('tape');
}

export function cost(): CalcResult {
  return notImplemented('cost');
}
