import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] transition-colors',
  {
    variants: {
      variant: {
        neutral: 'border-black/10 text-[var(--muted)] dark:border-white/20',
        success: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10',
        danger: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
        warning: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
        accent: 'border-[#ff9a3c]/40 text-[#ff9a3c] bg-[#ff6a0022]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
