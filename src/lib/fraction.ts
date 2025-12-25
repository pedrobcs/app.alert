export type Rational = { n: number; d: number };

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x === 0 ? 1 : x;
}

export function normalizeRational(r: Rational): Rational {
  if (!Number.isFinite(r.n) || !Number.isFinite(r.d)) return { n: NaN, d: NaN };
  if (r.d === 0) return { n: r.n > 0 ? Infinity : -Infinity, d: 1 };
  if (r.n === 0) return { n: 0, d: 1 };

  const sign = r.d < 0 ? -1 : 1;
  const nn = r.n * sign;
  const dd = r.d * sign;
  const g = gcd(nn, dd);
  return { n: nn / g, d: dd / g };
}

export function rationalFromNumber(value: number, denom: number): Rational {
  if (!Number.isFinite(value)) return { n: value, d: 1 };
  if (!Number.isFinite(denom) || denom <= 0) return normalizeRational({ n: value, d: 1 });
  const n = Math.round(value * denom);
  return normalizeRational({ n, d: denom });
}

export function rationalToNumber(r: Rational): number {
  if (!Number.isFinite(r.n) || !Number.isFinite(r.d)) return NaN;
  return r.n / r.d;
}

export function toMixedNumber(r: Rational): { sign: 1 | -1; whole: number; frac: Rational } {
  const rr = normalizeRational(r);
  const sign: 1 | -1 = rr.n < 0 ? -1 : 1;
  const an = Math.abs(rr.n);
  const whole = Math.floor(an / rr.d);
  const rem = an - whole * rr.d;
  const frac = rem === 0 ? { n: 0, d: 1 } : normalizeRational({ n: rem, d: rr.d });
  return { sign, whole, frac };
}

export function formatMixedFraction(
  r: Rational,
  opts?: { zeroWhole?: boolean; suffix?: string },
): string {
  const { sign, whole, frac } = toMixedNumber(r);
  const prefix = sign < 0 ? "-" : "";
  const showWhole = opts?.zeroWhole ? true : whole !== 0;
  const suffix = opts?.suffix ?? "";

  if (frac.n === 0) return `${prefix}${whole}${suffix}`;
  if (!showWhole) return `${prefix}${frac.n}/${frac.d}${suffix}`;
  return `${prefix}${whole} ${frac.n}/${frac.d}${suffix}`;
}

/**
 * Formats decimal inches into a reduced fraction, defaulting to 1/16 precision.
 * Example: 3.375 -> 3 3/8"
 */
export function formatInchesFraction(inches: number, denom = 16): string {
  const r = rationalFromNumber(inches, denom);
  return formatMixedFraction(r, { suffix: `"` });
}

/**
 * Formats total inches into feet + inches, with fractional inches.
 * Example: 99.375 -> 8' 3 3/8"
 */
export function formatFeetInches(totalInches: number, denom = 16): string {
  if (!Number.isFinite(totalInches)) return `${totalInches}`;
  const sign = totalInches < 0 ? "-" : "";
  const abs = Math.abs(totalInches);
  const feet = Math.floor(abs / 12);
  const inches = abs - feet * 12;
  const inchStr = formatMixedFraction(rationalFromNumber(inches, denom), { suffix: `"` });
  return `${sign}${feet}' ${inchStr}`;
}

