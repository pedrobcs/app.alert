'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { Keypad, type KeypadActions } from './Keypad';
import { useI18n } from '@/lib/i18n/I18nProvider';
import type { Unit } from '@/lib/units';

type CalcApiResponse =
  | {
      ok: true;
      result: number;
      display: string;
      meta?: Record<string, unknown>;
    }
  | { ok: false; errorCode: string; message: string };

function safeParseNumberOrFraction(s: string): number | null {
  const t = s.trim();
  if (!t) return null;
  // supports: "3.25", "-2", "3/8", "3 3/8"
  const m = t.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (m) {
    const whole = Number(m[1]);
    const num = Number(m[2]);
    const den = Number(m[3]);
    if (!Number.isFinite(whole) || !Number.isFinite(num) || !Number.isFinite(den) || den === 0)
      return null;
    const sign = whole < 0 ? -1 : 1;
    return whole + sign * (num / den);
  }
  const f = t.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (f) {
    const num = Number(f[1]);
    const den = Number(f[2]);
    if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return null;
    return num / den;
  }
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

async function postCalc(body: {
  function: string;
  params: Record<string, unknown>;
  inUnit: Unit;
  outUnit: Unit;
  precision: number;
}): Promise<CalcApiResponse> {
  const res = await fetch('/api/calc', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return (await res.json()) as CalcApiResponse;
}

export function CalculatorApp() {
  const { dict, locale, toggleLocale } = useI18n();

  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [meta, setMeta] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [unit, setUnit] = useState<Unit>('ft');
  const [outUnit, setOutUnit] = useState<Unit>('ft');
  const [precision, setPrecision] = useState<number>(16);

  const [rise, setRise] = useState<number | null>(null);
  const [run, setRun] = useState<number | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('ccalc.prefs');
      if (saved) {
        const p = JSON.parse(saved) as { unit?: Unit; outUnit?: Unit; precision?: number };
        if (p.unit) setUnit(p.unit);
        if (p.outUnit) setOutUnit(p.outUnit);
        if (typeof p.precision === 'number') setPrecision(p.precision);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('ccalc.prefs', JSON.stringify({ unit, outUnit, precision }));
    } catch {
      // ignore
    }
  }, [unit, outUnit, precision]);

  const parsedInput = useMemo(() => safeParseNumberOrFraction(input), [input]);

  const regsLine = useMemo(() => {
    const parts: string[] = [];
    if (rise != null) parts.push(`rise=${rise}`);
    if (run != null) parts.push(`run=${run}`);
    if (pitch != null) parts.push(`pitch=${pitch}`);
    return parts.join(' · ');
  }, [rise, run, pitch]);

  const actions: KeypadActions = {
    append: (s) => {
      setError(null);
      setInput((v) => (v + s).replace(/\s+/g, ' '));
    },
    backspace: () => {
      setError(null);
      setInput((v) => v.slice(0, -1));
    },
    clear: () => {
      setError(null);
      setInput('');
    },
    clearAll: () => {
      setError(null);
      setInput('');
      setResult('');
      setMeta('');
      setRise(null);
      setRun(null);
      setPitch(null);
    },
    toggleSign: () => {
      setError(null);
      if (!input.trim()) return;
      setInput((v) => (v.trim().startsWith('-') ? v.trim().slice(1) : `-${v.trim()}`));
    },
    setRise: () => {
      setError(null);
      if (parsedInput == null) return;
      setRise(parsedInput);
      setInput('');
    },
    setRun: () => {
      setError(null);
      if (parsedInput == null) return;
      setRun(parsedInput);
      setInput('');
    },
    setPitch: () => {
      setError(null);
      if (parsedInput == null) return;
      setPitch(parsedInput);
      setInput('');
    },
    calcPitch: async () => {
      setError(null);
      if (rise == null || run == null) {
        setError('Set rise and run first');
        return;
      }
      const r = await postCalc({
        function: 'pitchFromRiseRun',
        params: { rise, run },
        inUnit: unit,
        outUnit: unit,
        precision,
      });
      if (!r.ok) {
        setError(`${dict.apiError}: ${r.message}`);
        return;
      }
      setResult(r.display);
      setMeta(typeof r.meta?.angleDeg === 'number' ? `angle=${r.meta.angleDeg}°` : regsLine);
    },
    calcRise: async () => {
      setError(null);
      if (pitch == null || run == null) {
        setError('Set pitch and run first');
        return;
      }
      const r = await postCalc({
        function: 'riseFromPitchRun',
        params: { pitch, run },
        inUnit: unit,
        outUnit: unit,
        precision,
      });
      if (!r.ok) {
        setError(`${dict.apiError}: ${r.message}`);
        return;
      }
      setResult(r.display);
      setMeta(regsLine);
    },
    calcRun: async () => {
      setError(null);
      if (pitch == null || rise == null) {
        setError('Set pitch and rise first');
        return;
      }
      const r = await postCalc({
        function: 'runFromPitchRise',
        params: { pitch, rise },
        inUnit: unit,
        outUnit: unit,
        precision,
      });
      if (!r.ok) {
        setError(`${dict.apiError}: ${r.message}`);
        return;
      }
      setResult(r.display);
      setMeta(regsLine);
    },
    calcDiag: async () => {
      setError(null);
      if (rise == null || run == null) {
        setError('Set rise and run first');
        return;
      }
      const r = await postCalc({
        function: 'diagonal',
        params: { rise, run },
        inUnit: unit,
        outUnit: unit,
        precision,
      });
      if (!r.ok) {
        setError(`${dict.apiError}: ${r.message}`);
        return;
      }
      setResult(r.display);
      setMeta(regsLine);
    },
    calcConv: async () => {
      setError(null);
      if (parsedInput == null) {
        setError('Enter a value to convert');
        return;
      }
      const r = await postCalc({
        function: 'convert',
        params: { value: parsedInput, fromUnit: unit, toUnit: outUnit },
        inUnit: unit,
        outUnit,
        precision,
      });
      if (!r.ok) {
        setError(`${dict.apiError}: ${r.message}`);
        return;
      }
      setResult(r.display);
      setMeta(`${parsedInput} ${unit} → ${outUnit}`);
    },
    calcStairs: async () => {
      setError(null);
      if (parsedInput == null) {
        setError('Enter total rise first');
        return;
      }
      const r = await postCalc({
        function: 'stairs',
        params: { totalRise: parsedInput },
        inUnit: unit,
        outUnit: unit,
        precision,
      });
      if (!r.ok) {
        setError(`${dict.apiError}: ${r.message}`);
        return;
      }
      setResult(r.display);
      setMeta('stairs (MVP defaults)');
    },
  };

  useEffect(() => {
    const runPitch = async () => {
      setError(null);
      if (rise == null || run == null) {
        setError('Set rise and run first');
        return;
      }
      const r = await postCalc({
        function: 'pitchFromRiseRun',
        params: { rise, run },
        inUnit: unit,
        outUnit: unit,
        precision,
      });
      if (!r.ok) {
        setError(`${dict.apiError}: ${r.message}`);
        return;
      }
      setResult(r.display);
      setMeta(typeof r.meta?.angleDeg === 'number' ? `angle=${r.meta.angleDeg}°` : regsLine);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        setError(null);
        setInput((v) => (v + e.key).replace(/\s+/g, ' '));
        return;
      }
      if (e.key === '.') return setInput((v) => v + '.');
      if (e.key === '/') return setInput((v) => v + '/');
      if (e.key === 'Backspace') return setInput((v) => v.slice(0, -1));
      if (e.key === 'Escape') {
        setError(null);
        setInput('');
        setResult('');
        setMeta('');
        setRise(null);
        setRun(null);
        setPitch(null);
        return;
      }
      if (e.key === 'Enter') void runPitch();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dict.apiError, precision, regsLine, rise, run, unit]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-2xl font-bold tracking-tight">{dict.calculator}</div>
          <div className="text-sm text-zinc-400">
            {regsLine || 'Set registers (Rise/Run/Pitch) then run functions.'}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <button
            type="button"
            onClick={toggleLocale}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
            aria-label="Toggle language"
          >
            {locale.toUpperCase()}
          </button>

          <label className="text-sm text-zinc-300">
            {dict.unit}{' '}
            <select
              className="ml-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
            >
              <option value="ft">ft</option>
              <option value="in">in</option>
              <option value="yd">yd</option>
              <option value="m">m</option>
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="lb">lb</option>
              <option value="kg">kg</option>
            </select>
          </label>

          <label className="text-sm text-zinc-300">
            Out{' '}
            <select
              className="ml-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
              value={outUnit}
              onChange={(e) => setOutUnit(e.target.value as Unit)}
            >
              <option value="ft">ft</option>
              <option value="in">in</option>
              <option value="yd">yd</option>
              <option value="m">m</option>
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="lb">lb</option>
              <option value="kg">kg</option>
            </select>
          </label>

          <label className="text-sm text-zinc-300">
            {dict.precision}{' '}
            <select
              className="ml-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
              value={precision}
              onChange={(e) => setPrecision(Number(e.target.value))}
            >
              {[2, 4, 8, 16, 32].map((d) => (
                <option key={d} value={d}>
                  1/{d}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <CalculatorDisplay input={input} result={result} meta={meta} error={error} />

      <Keypad actions={actions} />

      <div className="text-xs text-zinc-500">
        Keyboard: digits, <span className="font-mono">.</span>, <span className="font-mono">/</span>
        , Backspace, Enter (runs Pitch), Esc (AC).
      </div>
    </div>
  );
}
