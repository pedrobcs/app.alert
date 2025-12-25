import { describe, expect, it } from "vitest";
import type { CalcContext } from "@/lib/math/context";
import { diagonal } from "@/lib/math/diagonal";

describe("diagonal", () => {
  it("computes 3-4-5 triangle", () => {
    const ctx: CalcContext = { inUnit: "ft", outUnit: "ft", precision: 16 };
    const res = diagonal({ rise: 3, run: 4 }, ctx);
    expect(res.unit).toBe("m");
    expect(res.value).toBeCloseTo(1.524, 10); // 5 ft in meters
    expect(res.display).toBe('5\' 0"');
  });
});

