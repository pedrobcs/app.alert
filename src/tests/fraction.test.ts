import { describe, expect, it } from "vitest";
import {
  formatFeetInches,
  formatInchesFraction,
  normalizeRational,
  rationalFromNumber,
  rationalToNumber,
} from "@/lib/fraction";

describe("fraction", () => {
  it("reduces rationals and normalizes sign", () => {
    expect(normalizeRational({ n: 2, d: 4 })).toEqual({ n: 1, d: 2 });
    expect(normalizeRational({ n: 2, d: -4 })).toEqual({ n: -1, d: 2 });
  });

  it("rounds to given denominator", () => {
    expect(rationalFromNumber(0.5, 16)).toEqual({ n: 1, d: 2 });
    expect(rationalFromNumber(0.0625, 16)).toEqual({ n: 1, d: 16 });
  });

  it("returns NaN for invalid rationals", () => {
    expect(Number.isNaN(rationalToNumber({ n: Number.NaN, d: 1 }))).toBe(true);
  });

  it('formats inches fractions like 3 3/8"', () => {
    expect(formatInchesFraction(3.375, 16)).toBe('3 3/8"');
    expect(formatInchesFraction(0.0625, 16)).toBe('1/16"');
  });

  it('formats feet+inches like 8\\\' 3 3/8"', () => {
    expect(formatFeetInches(99.375, 16)).toBe('8\' 3 3/8"');
  });
});

