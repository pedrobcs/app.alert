"use client";

import React from "react";

export type KeyVariant = "black" | "gray" | "red" | "gold";

export function KeyButton(props: {
  label: React.ReactNode;
  ariaLabel: string;
  variant?: KeyVariant;
  onPress: () => void;
  className?: string;
}) {
  const variant = props.variant ?? "black";
  const base =
    "select-none rounded-2xl px-3 py-4 text-center font-extrabold italic tracking-tight shadow-[inset_0_2px_0_rgba(255,255,255,0.14)] active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-emerald-300";

  const styles =
    variant === "black"
      ? "bg-neutral-950 text-neutral-100 hover:bg-neutral-900"
      : variant === "gray"
        ? "bg-gradient-to-b from-neutral-500 to-neutral-700 text-white hover:from-neutral-400 hover:to-neutral-700"
        : variant === "red"
          ? "bg-gradient-to-b from-rose-600 to-rose-800 text-white hover:from-rose-500 hover:to-rose-800"
          : "bg-gradient-to-b from-amber-400 to-amber-600 text-neutral-950 hover:from-amber-300 hover:to-amber-600";

  return (
    <button
      type="button"
      aria-label={props.ariaLabel}
      onClick={props.onPress}
      className={[base, styles, props.className].filter(Boolean).join(" ")}
    >
      {props.label}
    </button>
  );
}

