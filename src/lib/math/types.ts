export type CalcResult<TMeta = unknown> = {
  /** Normalized value (SI base) when it makes sense (e.g. meters, degrees). */
  value: number;
  /** Unit label for the normalized value (e.g. "m", "deg", "pitch/12"). */
  unit: string;
  /** Human-friendly display string for UI. */
  display: string;
  meta?: TMeta;
};

export type Unit =
  | "m"
  | "cm"
  | "mm"
  | "ft"
  | "in"
  | "yd"
  | "kg"
  | "lbs"
  | "acre"
  | "ton"
  | "metric_ton"
  | "deg"
  | "dms";

export type CalcRequest = {
  function: string;
  params: Record<string, unknown>;
  inUnit: Unit;
  outUnit: Unit;
  /** inch fraction denominator (2,4,8,16,32). */
  precision: number;
};

