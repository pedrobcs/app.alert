import { describe, expect, it } from "vitest";
import type { CalcContext } from "@/lib/math/context";
import { stairs } from "@/lib/math/stairs";

describe("stairs", () => {
  it("computes steps for non-integer division", () => {
    const ctx: CalcContext = { inUnit: "in", outUnit: "in", precision: 16 };
    const res = stairs({ totalRise: 100, desiredRise: 7.75, desiredTread: 10 }, ctx);
    expect(res.meta?.numSteps).toBe(13);
    expect(res.meta?.actualRiseM).toBeGreaterThan(0);
    expect(res.display.startsWith("13 steps")).toBe(true);
  });

  it("uses defaults when desired values omitted", () => {
    const ctx: CalcContext = { inUnit: "in", outUnit: "in", precision: 16 };
    const res = stairs({ totalRise: 100 }, ctx);
    expect(res.meta?.numSteps).toBeGreaterThan(0);
  });
});

