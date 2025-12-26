'use client';

import React from 'react';

export type KeyVariant = 'key' | 'op' | 'fn' | 'ctl' | 'wide';

export function KeyButton({
  label,
  onPress,
  variant = 'key',
  ariaLabel,
  disabled,
}: {
  label: React.ReactNode;
  onPress: () => void;
  variant?: KeyVariant;
  ariaLabel?: string;
  disabled?: boolean;
}) {
  const base =
    'select-none rounded-2xl border text-base sm:text-lg font-semibold transition active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60';

  const cls =
    variant === 'op'
      ? `${base} border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800`
      : variant === 'fn'
        ? `${base} border-zinc-700 bg-gradient-to-b from-zinc-900 to-zinc-950 text-amber-200 hover:from-zinc-800 hover:to-zinc-900`
        : variant === 'ctl'
          ? `${base} border-zinc-700 bg-zinc-950 text-zinc-200 hover:bg-zinc-900`
          : variant === 'wide'
            ? `${base} border-zinc-700 bg-gradient-to-b from-amber-400 to-orange-500 text-zinc-950 hover:from-amber-300 hover:to-orange-400`
            : `${base} border-zinc-700 bg-zinc-950 text-zinc-100 hover:bg-zinc-900`;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onPress}
      aria-label={ariaLabel}
      className={`${cls} h-14 sm:h-16 px-4 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
}
