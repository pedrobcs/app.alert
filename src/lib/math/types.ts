export type CalcResult = {
  /** Normalized value in SI base (meters for length, kg for mass, etc.) */
  value: number;
  /** SI base unit for `value` */
  unit: string;
  /** Human-friendly string (usually in outUnit) */
  display: string;
  meta?: Record<string, unknown>;
};
