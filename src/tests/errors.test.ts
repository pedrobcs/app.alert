import { describe, expect, it } from "vitest";
import { assertFiniteNumber, CalcError } from "@/lib/errors";

describe("errors", () => {
  it("assertFiniteNumber throws CalcError on invalid inputs", () => {
    expect(() => assertFiniteNumber("nope", "x")).toThrow(CalcError);
    expect(() => assertFiniteNumber(Number.NaN, "x")).toThrow(CalcError);
  });
});

