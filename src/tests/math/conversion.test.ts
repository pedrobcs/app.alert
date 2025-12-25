import { describe, expect, it } from "vitest";
import { convert } from "@/lib/math/conversion";
import type { CalcContext } from "@/lib/math/context";
import { lengthToMeters, metersToLength } from "@/lib/units";
import { CalcError } from "@/lib/errors";

describe("convert", () => {
  it("converts ft -> in with normalized meters", () => {
    const ctx: CalcContext = { inUnit: "ft", outUnit: "in", precision: 16 };
    const res = convert({ value: 1 }, ctx);
    expect(res.unit).toBe("m");
    expect(res.value).toBeCloseTo(0.3048, 10);
    expect(res.display).toBe('12"');
  });

  it("converts kg <-> lbs", () => {
    const ctx1: CalcContext = { inUnit: "lbs", outUnit: "kg", precision: 16 };
    const res1 = convert({ value: 1 }, ctx1);
    expect(res1.unit).toBe("kg");
    expect(res1.value).toBeCloseTo(0.45359237, 10);

    const ctx2: CalcContext = { inUnit: "kg", outUnit: "lbs", precision: 16 };
    const res2 = convert({ value: 1 }, ctx2);
    expect(res2.unit).toBe("kg");
    expect(res2.display.endsWith(" lbs")).toBe(true);
  });

  it("keeps length conversion roundtrip within tolerance", () => {
    const m = lengthToMeters(10, "ft");
    const ft = metersToLength(m, "ft");
    expect(ft).toBeCloseTo(10, 12);
  });

  it("throws on unsupported unit kinds", () => {
    const ctx: CalcContext = { inUnit: "ft", outUnit: "kg", precision: 16 };
    expect(() => convert({ value: 1 }, ctx)).toThrow(CalcError);
  });

  it("covers ton/mass/area conversion branches", () => {
    const a: CalcContext = { inUnit: "kg", outUnit: "ton", precision: 16 };
    const ra = convert({ value: 1000 }, a);
    expect(ra.unit).toBe("kg");
    expect(ra.display.endsWith(" ton")).toBe(true);

    const b: CalcContext = { inUnit: "ton", outUnit: "kg", precision: 16 };
    const rb = convert({ value: 1 }, b);
    expect(rb.unit).toBe("kg");
    expect(rb.display.endsWith(" kg")).toBe(true);

    const c: CalcContext = { inUnit: "ton", outUnit: "metric_ton", precision: 16 };
    const rc = convert({ value: 1 }, c);
    expect(rc.unit).toBe("kg");
    expect(rc.display.endsWith(" metric_ton")).toBe(true);

    const d: CalcContext = { inUnit: "acre", outUnit: "acre", precision: 16 };
    const rd = convert({ value: 1 }, d);
    expect(rd.unit).toBe("m2");
  });
});

