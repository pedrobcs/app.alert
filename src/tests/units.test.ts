import { describe, expect, it } from "vitest";
import { CalcError } from "@/lib/errors";
import {
  areaToM2,
  convertUnit,
  formatValue,
  isAreaUnit,
  isLengthUnit,
  isMassUnit,
  isTonUnit,
  kgToMass,
  kgToTon,
  lengthToMeters,
  m2ToArea,
  massToKg,
  metersToLength,
  tonToKg,
} from "@/lib/units";

describe("units", () => {
  it("type guards work", () => {
    expect(isLengthUnit("ft")).toBe(true);
    expect(isMassUnit("kg")).toBe(true);
    expect(isTonUnit("metric_ton")).toBe(true);
    expect(isAreaUnit("acre")).toBe(true);
  });

  it("length conversions cover all supported length units", () => {
    expect(lengthToMeters(12, "in")).toBeCloseTo(0.3048, 12);
    expect(lengthToMeters(1, "ft")).toBeCloseTo(0.3048, 12);
    expect(lengthToMeters(1, "yd")).toBeCloseTo(0.9144, 12);
    expect(lengthToMeters(100, "cm")).toBeCloseTo(1, 12);
    expect(lengthToMeters(1000, "mm")).toBeCloseTo(1, 12);

    expect(metersToLength(1, "cm")).toBeCloseTo(100, 12);
    expect(metersToLength(1, "mm")).toBeCloseTo(1000, 12);
    expect(metersToLength(0.3048, "ft")).toBeCloseTo(1, 12);
  });

  it("mass/ton conversions", () => {
    const kg = massToKg(1, "lbs");
    expect(kg).toBeCloseTo(0.45359237, 12);
    expect(kgToMass(kg, "lbs")).toBeCloseTo(1, 12);

    const tKg = tonToKg(1, "ton");
    expect(kgToTon(tKg, "ton")).toBeCloseTo(1, 12);
  });

  it("area conversions", () => {
    const m2 = areaToM2(1, "acre");
    expect(m2).toBeCloseTo(4046.8564224, 8);
    expect(m2ToArea(m2, "acre")).toBeCloseTo(1, 8);
  });

  it("convertUnit supports expected cross conversions and identity", () => {
    expect(convertUnit(1, "ft", "ft")).toEqual({ value: 1, kind: "identity" });
    expect(convertUnit(1, "ft", "in").value).toBeCloseTo(12, 12);
    expect(convertUnit(1, "kg", "lbs").value).toBeCloseTo(2.2046, 3);
    expect(convertUnit(1, "kg", "metric_ton").value).toBeCloseTo(0.001, 12);
    expect(convertUnit(1, "metric_ton", "kg").value).toBeCloseTo(1000, 12);
    expect(convertUnit(1, "acre", "acre").value).toBeCloseTo(1, 12);
  });

  it("formatValue formats ft/in with fractions", () => {
    expect(formatValue(12, "in", 16)).toBe('12"');
    expect(formatValue(0.5, "in", 16)).toBe('1/2"');
    expect(formatValue(1.5, "ft", 16)).toBe('1\' 6"');
  });

  it("convertUnit rejects unsupported conversions", () => {
    expect(() => convertUnit(1, "ft", "kg")).toThrow(CalcError);
  });
});

