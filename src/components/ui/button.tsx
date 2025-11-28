'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9a3c]/50 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-[#ff6a00] to-[#ff9a3c] text-black border-transparent shadow-[0_15px_30px_rgba(255,122,24,0.35)]',
        ghost: 'bg-transparent border-transparent text-[var(--muted)] hover:text-[var(--foreground)]',
        outline: 'border border-white/20 text-white hover:border-white/60 hover:text-white',
        subtle: 'bg-white/5 text-white border-white/10 hover:bg-white/10',
      },
      size: {
        default: 'h-11 px-5 py-2',
        icon: 'h-10 w-10',
        sm: 'h-9 px-4 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
