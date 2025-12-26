import { describe, expect, it } from "vitest";
import { CalcError } from "@/lib/errors";
import type { CalcContext } from "@/lib/math/context";
import { pitchFromRiseRun, riseFromPitchRun, runFromPitchRise } from "@/lib/math/pitch";

describe("pitch / rise / run", () => {
  it("computes pitch from rise/run as X/12", () => {
    const ctx: CalcContext = { inUnit: "ft", outUnit: "ft", precision: 16 };
    const res = pitchFromRiseRun({ rise: 6, run: 12 }, ctx);
    expect(res.unit).toBe("pitch/12");
    expect(res.value).toBeCloseTo(6, 12);
    expect(res.display).toBe("6/12");
    expect(res.meta?.angleDeg).toBeCloseTo(26.565, 2);
  });

  it("computes rise from pitch and run", () => {
    const ctx: CalcContext = { inUnit: "ft", outUnit: "ft", precision: 16 };
    const res = riseFromPitchRun({ pitch: 6, run: 12 }, ctx);
    expect(res.unit).toBe("m");
    expect(res.value).toBeCloseTo(1.8288, 10); // 6 ft in meters
    expect(res.display).toBe('6\' 0"');
  });

  it("computes run from pitch and rise", () => {
    const ctx: CalcContext = { inUnit: "ft", outUnit: "ft", precision: 16 };
    const res = runFromPitchRise({ pitch: 6, rise: 6 }, ctx);
    expect(res.unit).toBe("m");
    expect(res.display).toBe('12\' 0"');
  });

  it("rejects division by zero", () => {
    const ctx: CalcContext = { inUnit: "ft", outUnit: "ft", precision: 16 };
    expect(() => pitchFromRiseRun({ rise: 1, run: 0 }, ctx)).toThrow(CalcError);
    expect(() => runFromPitchRise({ pitch: 0, rise: 1 }, ctx)).toThrow(CalcError);
  });
});

