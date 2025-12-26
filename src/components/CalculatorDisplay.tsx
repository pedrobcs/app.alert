'use client';

export function CalculatorDisplay({
  input,
  result,
  meta,
  error,
}: {
  input: string;
  result: string;
  meta?: string;
  error?: string | null;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-black/40 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="text-xs uppercase tracking-wide text-zinc-500">Input</div>
      <div className="mt-1 min-h-[1.5rem] font-mono text-lg text-zinc-100 break-words">
        {input || '—'}
      </div>
      <div className="mt-4 text-xs uppercase tracking-wide text-zinc-500">Result</div>
      <div className="mt-1 min-h-[2rem] font-mono text-2xl text-amber-300 break-words">
        {result || '—'}
      </div>
      <div className="mt-2 min-h-[1.25rem] text-sm text-zinc-400">
        {error ? (
          <span className="text-red-300">{error}</span>
        ) : (
          meta || <span className="text-zinc-600"> </span>
        )}
      </div>
    </div>
  );
}
