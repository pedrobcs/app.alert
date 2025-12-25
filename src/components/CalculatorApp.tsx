"use client";

import React, { useCallback, useMemo, useState } from "react";
import { CalculatorDisplay } from "@/components/CalculatorDisplay";
import { Keypad, type KeySpec } from "@/components/Keypad";
import type { Unit } from "@/lib/math";
import { useI18n } from "@/lib/i18n/I18nProvider";

type Mode =
  | "pitchFromRiseRun"
  | "riseFromPitchRun"
  | "runFromPitchRise"
  | "diagonal"
  | "convert"
  | "stairs";

type ApiResponse =
  | {
      ok: true;
      result: number;
      unit: string;
      display: string;
      outUnit: Unit;
      resultOut: number | null;
      meta: unknown;
    }
  | { ok: false; errorCode: string; message: string; details?: unknown };

const lengthUnits: Unit[] = ["ft", "in", "m", "cm", "mm", "yd"];
const massUnits: Unit[] = ["kg", "lbs"];
const areaUnits: Unit[] = ["acre"];
const tonUnits: Unit[] = ["ton", "metric_ton"];

function safeParseNumber(s: string): number | null {
  const v = Number(s);
  return Number.isFinite(v) ? v : null;
}

export function CalculatorApp() {
  const { locale, setLocale, t } = useI18n();
  const [mode, setMode] = useState<Mode>("pitchFromRiseRun");
  const [inUnit, setInUnit] = useState<Unit>("ft");
  const [outUnit, setOutUnit] = useState<Unit>("ft");
  const [precision, setPrecision] = useState<number>(16);

  const [fields, setFields] = useState<Record<string, string>>({
    rise: "",
    run: "",
    pitch: "",
    value: "",
    totalRise: "",
    desiredRise: "",
    desiredTread: "",
  });
  const [activeField, setActiveField] = useState<string>("rise");
  const [lastDisplay, setLastDisplay] = useState<string>("0.");
  const [inputLine, setInputLine] = useState<string>("");
  const [errorLine, setErrorLine] = useState<string>("");

  const modeConfig = useMemo(() => {
    switch (mode) {
      case "pitchFromRiseRun":
        return {
          label: t("modePitch"),
          fields: ["rise", "run"] as const,
          fieldLabels: { rise: t("fieldRise"), run: t("fieldRun") },
        };
      case "riseFromPitchRun":
        return {
          label: t("modeRise"),
          fields: ["pitch", "run"] as const,
          fieldLabels: { pitch: t("fieldPitch"), run: t("fieldRun") },
        };
      case "runFromPitchRise":
        return {
          label: t("modeRun"),
          fields: ["pitch", "rise"] as const,
          fieldLabels: { pitch: t("fieldPitch"), rise: t("fieldRise") },
        };
      case "diagonal":
        return {
          label: t("modeDiag"),
          fields: ["rise", "run"] as const,
          fieldLabels: { rise: t("fieldRise"), run: t("fieldRun") },
        };
      case "convert":
        return {
          label: t("modeConvert"),
          fields: ["value"] as const,
          fieldLabels: { value: t("fieldValue") },
        };
      case "stairs":
        return {
          label: t("modeStairs"),
          fields: ["totalRise", "desiredRise", "desiredTread"] as const,
          fieldLabels: {
            totalRise: t("fieldTotalRise"),
            desiredRise: t("fieldDesiredRise"),
            desiredTread: t("fieldDesiredTread"),
          },
        };
    }
  }, [mode, t]);

  const relevantUnits = useMemo(() => {
    if (mode === "convert") {
      return [...lengthUnits, ...massUnits, ...areaUnits, ...tonUnits];
    }
    return lengthUnits;
  }, [mode]);

  const setFieldValue = useCallback((key: string, updater: (prev: string) => string) => {
    setFields((prev) => ({ ...prev, [key]: updater(prev[key] ?? "") }));
  }, []);

  const pressDigit = useCallback(
    (ch: string) => {
      setErrorLine("");
      setFieldValue(activeField, (prev) => {
        if (ch === "." && prev.includes(".")) return prev;
        return prev + ch;
      });
    },
    [activeField, setFieldValue],
  );

  const pressBackspace = useCallback(() => {
    setErrorLine("");
    setFieldValue(activeField, (prev) => prev.slice(0, -1));
  }, [activeField, setFieldValue]);

  const pressToggleSign = useCallback(() => {
    setErrorLine("");
    setFieldValue(activeField, (prev) => {
      if (!prev) return "-";
      if (prev.startsWith("-")) return prev.slice(1);
      return "-" + prev;
    });
  }, [activeField, setFieldValue]);

  const pressClear = useCallback(() => {
    setErrorLine("");
    setFieldValue(activeField, () => "");
  }, [activeField, setFieldValue]);

  const pressClearAll = useCallback(() => {
    setErrorLine("");
    setFields({
      rise: "",
      run: "",
      pitch: "",
      value: "",
      totalRise: "",
      desiredRise: "",
      desiredTread: "",
    });
    setLastDisplay("0.");
    setInputLine("");
  }, []);

  const pressNextField = useCallback(() => {
    const idx = modeConfig.fields.findIndex((f) => f === activeField);
    const next = modeConfig.fields[(idx + 1) % modeConfig.fields.length] as string;
    setActiveField(next);
  }, [activeField, modeConfig.fields]);

  const callApi = useCallback(async (): Promise<void> => {
    setErrorLine("");

    const params: Record<string, number> = {};
    for (const k of modeConfig.fields) {
      const raw = fields[k] ?? "";
      if (!raw) continue;
      const n = safeParseNumber(raw);
      if (n === null) {
        setErrorLine(`Invalid number: ${k}`);
        return;
      }
      params[k] = n;
    }

    // Basic required fields
    if (mode === "pitchFromRiseRun" || mode === "diagonal") {
      if (params.rise === undefined || params.run === undefined) {
        setErrorLine("Missing rise/run");
        return;
      }
    }
    if (mode === "riseFromPitchRun") {
      if (params.pitch === undefined || params.run === undefined) {
        setErrorLine("Missing pitch/run");
        return;
      }
    }
    if (mode === "runFromPitchRise") {
      if (params.pitch === undefined || params.rise === undefined) {
        setErrorLine("Missing pitch/rise");
        return;
      }
    }
    if (mode === "convert") {
      if (params.value === undefined) {
        setErrorLine("Missing value");
        return;
      }
    }
    if (mode === "stairs") {
      if (params.totalRise === undefined) {
        setErrorLine("Missing totalRise");
        return;
      }
    }

    const body = {
      function: mode,
      params,
      inUnit,
      outUnit,
      precision,
    };

    const res = await fetch("/api/calc", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as ApiResponse;
    if (!data.ok) {
      setErrorLine(`${data.errorCode}: ${data.message}`);
      return;
    }

    const fieldPairs = modeConfig.fields
      .map((k) => `${modeConfig.fieldLabels[k as keyof typeof modeConfig.fieldLabels]}=${fields[k] || "?"}`)
      .join(" • ");
    setInputLine(`${modeConfig.label} • ${fieldPairs} • ${inUnit}→${outUnit}`);
    setLastDisplay(data.display);
  }, [fields, inUnit, mode, modeConfig, outUnit, precision]);

  const modeKeys: KeySpec[] = [
    {
      label: t("modePitch"),
      ariaLabel: "Mode Pitch",
      onPress: () => {
        setMode("pitchFromRiseRun");
        setActiveField("rise");
      },
      variant: mode === "pitchFromRiseRun" ? "gold" : "black",
    },
    {
      label: t("modeRise"),
      ariaLabel: "Mode Rise",
      onPress: () => {
        setMode("riseFromPitchRun");
        setActiveField("pitch");
      },
      variant: mode === "riseFromPitchRun" ? "gold" : "black",
    },
    {
      label: t("modeRun"),
      ariaLabel: "Mode Run",
      onPress: () => {
        setMode("runFromPitchRise");
        setActiveField("pitch");
      },
      variant: mode === "runFromPitchRise" ? "gold" : "black",
    },
    {
      label: t("modeDiag"),
      ariaLabel: "Mode Diagonal",
      onPress: () => {
        setMode("diagonal");
        setActiveField("rise");
      },
      variant: mode === "diagonal" ? "gold" : "black",
    },
    {
      label: t("modeConvert"),
      ariaLabel: "Mode Convert",
      onPress: () => {
        setMode("convert");
        setActiveField("value");
      },
      variant: mode === "convert" ? "gold" : "black",
    },
    {
      label: t("modeStairs"),
      ariaLabel: "Mode Stairs",
      onPress: () => {
        setMode("stairs");
        setActiveField("totalRise");
      },
      variant: mode === "stairs" ? "gold" : "black",
    },
  ];

  const keypadKeys: KeySpec[] = [
    // Row: Clear-ish
    { label: t("clear"), ariaLabel: "Clear", onPress: pressClear, variant: "red", colSpan: 2 },
    { label: t("clearAll"), ariaLabel: "Clear All", onPress: pressClearAll, variant: "black", colSpan: 2 },
    { label: "⌫", ariaLabel: "Backspace", onPress: pressBackspace, variant: "black" },

    // Row: 7 8 9 ÷ Next
    { label: "7", ariaLabel: "7", onPress: () => pressDigit("7"), variant: "gray" },
    { label: "8", ariaLabel: "8", onPress: () => pressDigit("8"), variant: "gray" },
    { label: "9", ariaLabel: "9", onPress: () => pressDigit("9"), variant: "gray" },
    { label: "÷", ariaLabel: "Divide (next field)", onPress: pressNextField, variant: "black" },
    { label: "+/−", ariaLabel: "Toggle sign", onPress: pressToggleSign, variant: "black" },

    // Row: 4 5 6 × =
    { label: "4", ariaLabel: "4", onPress: () => pressDigit("4"), variant: "gray" },
    { label: "5", ariaLabel: "5", onPress: () => pressDigit("5"), variant: "gray" },
    { label: "6", ariaLabel: "6", onPress: () => pressDigit("6"), variant: "gray" },
    { label: "×", ariaLabel: "Multiply (noop)", onPress: () => setErrorLine("× not implemented in MVP"), variant: "black" },
    { label: "=", ariaLabel: "Equals (calculate)", onPress: callApi, variant: "black" },

    // Row: 1 2 3 − (noop) .
    { label: "1", ariaLabel: "1", onPress: () => pressDigit("1"), variant: "gray" },
    { label: "2", ariaLabel: "2", onPress: () => pressDigit("2"), variant: "gray" },
    { label: "3", ariaLabel: "3", onPress: () => pressDigit("3"), variant: "gray" },
    { label: "−", ariaLabel: "Minus (noop)", onPress: () => setErrorLine("− not implemented in MVP"), variant: "black" },
    { label: ".", ariaLabel: "Decimal point", onPress: () => pressDigit("."), variant: "gray" },

    // Row: 0 + (noop) (spacer)
    { label: "0", ariaLabel: "0", onPress: () => pressDigit("0"), variant: "gray", colSpan: 2 },
    { label: "+", ariaLabel: "Plus (noop)", onPress: () => setErrorLine("+ not implemented in MVP"), variant: "black" },
    { label: "→", ariaLabel: "Next field", onPress: pressNextField, variant: "black", colSpan: 2 },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <header className="flex items-center justify-between gap-4">
          <div className="text-lg font-bold tracking-tight">{t("appName")}</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm font-semibold hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              aria-label="Toggle language"
            >
              {locale.toUpperCase()}
            </button>
          </div>
        </header>

        <div className="mt-5">
          <CalculatorDisplay
            title={`${t("calculatorTitle")} • ${modeConfig.label}`}
            subtitle={`${activeField}: ${modeConfig.fieldLabels[activeField as keyof typeof modeConfig.fieldLabels] ?? activeField}`}
            inputLine={errorLine ? `Error: ${errorLine}` : inputLine}
            resultLine={lastDisplay}
            hintLine={`Tap a field to edit • precision 1/${precision}`}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="flex flex-wrap items-center gap-2">
            {modeConfig.fields.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setActiveField(k)}
                className={[
                  "rounded-xl px-3 py-2 text-sm font-semibold",
                  activeField === k
                    ? "bg-emerald-500 text-neutral-950"
                    : "bg-neutral-800 text-neutral-100 hover:bg-neutral-700",
                ].join(" ")}
              >
                {modeConfig.fieldLabels[k as keyof typeof modeConfig.fieldLabels]}
                <span className="ml-2 font-mono text-xs opacity-80">
                  {fields[k] || "…"}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="text-xs text-neutral-300">
              {t("inUnit")}
              <select
                className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
                value={inUnit}
                onChange={(e) => setInUnit(e.target.value as Unit)}
              >
                {relevantUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs text-neutral-300">
              {t("outUnit")}
              <select
                className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
                value={outUnit}
                onChange={(e) => setOutUnit(e.target.value as Unit)}
              >
                {relevantUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs text-neutral-300">
              {t("precision")}
              <select
                className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
                value={precision}
                onChange={(e) => setPrecision(Number(e.target.value))}
              >
                {[2, 4, 8, 16, 32].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5">
          <Keypad keys={modeKeys} />
        </div>

        <div className="mt-5">
          <Keypad keys={keypadKeys} />
        </div>
      </div>
    </div>
  );
}

