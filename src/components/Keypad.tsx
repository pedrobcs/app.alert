"use client";

import React from "react";
import { KeyButton, type KeyVariant } from "@/components/KeyButton";

export type KeySpec = {
  label: React.ReactNode;
  ariaLabel: string;
  variant?: KeyVariant;
  onPress: () => void;
  colSpan?: number;
  className?: string;
};

export function Keypad(props: { keys: KeySpec[] }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {props.keys.map((k, idx) => {
        const col =
          k.colSpan === 2
            ? "col-span-2"
            : k.colSpan === 3
              ? "col-span-3"
              : k.colSpan === 4
                ? "col-span-4"
                : k.colSpan === 5
                  ? "col-span-5"
                  : "";
        return (
          <KeyButton
            key={idx}
            label={k.label}
            ariaLabel={k.ariaLabel}
            variant={k.variant}
            onPress={k.onPress}
            className={[col, k.className].filter(Boolean).join(" ")}
          />
        );
      })}
    </div>
  );
}

