export type Rational = { n: number; d: number };

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

export function reduceRational(r: Rational): Rational {
  if (!Number.isFinite(r.n) || !Number.isFinite(r.d) || r.d === 0) {
    throw new Error('Invalid rational');
  }
  const sign = r.d < 0 ? -1 : 1;
  const g = gcd(r.n, r.d);
  return { n: (r.n / g) * sign, d: (r.d / g) * sign };
}

export function toRational(value: number, denom: number): Rational {
  if (!Number.isFinite(value)) throw new Error('Invalid value');
  if (!Number.isFinite(denom) || denom <= 0) throw new Error('Invalid denom');
  const n = Math.round(value * denom);
  return reduceRational({ n, d: denom });
}

export function toMixedFractionString(value: number, denom: number): string {
  if (!Number.isFinite(value)) return 'NaN';
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const whole = Math.floor(abs + 1e-12);
  const frac = abs - whole;
  const r = toRational(frac, denom);
  const n = Math.abs(r.n);
  const d = r.d;

  // carry if rounding made fraction == 1
  if (n === d) return `${sign}${whole + 1}`;

  if (n === 0) return `${sign}${whole}`;
  if (whole === 0) return `${sign}${n}/${d}`;
  return `${sign}${whole} ${n}/${d}`;
}
