"use client";

import React from "react";

export function CalculatorDisplay(props: {
  title: string;
  subtitle?: string;
  inputLine: string;
  resultLine: string;
  hintLine?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-bold tracking-tight text-neutral-200">
          {props.title}
        </div>
        {props.subtitle ? (
          <div className="text-xs text-neutral-400">{props.subtitle}</div>
        ) : null}
      </div>

      <div className="mt-3 rounded-xl border border-neutral-700 bg-[#b8c7bb] p-5 text-neutral-950">
        <div className="text-right text-xs font-semibold tracking-tight text-neutral-800">
          {props.inputLine || "\u00A0"}
        </div>
        <div className="mt-1 text-right text-5xl font-black tabular-nums">
          {props.resultLine || "0."}
        </div>
      </div>

      {props.hintLine ? (
        <div className="mt-2 text-xs text-neutral-400">{props.hintLine}</div>
      ) : null}
    </div>
  );
}

