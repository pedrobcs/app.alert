export class CalcError extends Error {
  public readonly errorCode: string;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(opts: { errorCode: string; message: string; status?: number; details?: unknown }) {
    super(opts.message);
    this.name = "CalcError";
    this.errorCode = opts.errorCode;
    this.status = opts.status ?? 400;
    this.details = opts.details;
  }
}

export function invariant(cond: unknown, error: CalcError): asserts cond {
  if (!cond) throw error;
}

export function assertFiniteNumber(
  value: unknown,
  name: string,
): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new CalcError({
      errorCode: "INVALID_NUMBER",
      message: `${name} must be a finite number`,
      details: { name, value },
    });
  }
}

