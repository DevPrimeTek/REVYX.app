import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonStyles = cva(
  'inline-flex items-center justify-center gap-sp1 font-body font-semibold transition-colors duration-fast ease-standard rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none',
  {
    variants: {
      variant: {
        primary:
          'bg-gold text-navy-deep hover:bg-gold-light active:bg-gold-dark',
        secondary:
          'bg-transparent text-text-h border border-border-light hover:bg-navy-hover',
        ghost:
          'bg-transparent text-text-secondary hover:bg-navy-hover hover:text-text-h',
        destructive:
          'bg-status-red text-white hover:bg-status-red/90',
      },
      size: {
        sm: 'h-8 px-sp2 text-[12px]',
        md: 'h-10 px-sp3 text-[14px]',
        lg: 'h-12 px-sp4 text-[15px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & {
    loading?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(buttonStyles({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading ? 'true' : undefined}
      {...rest}
    >
      {loading ? <span className="badge-mono">…</span> : children}
    </button>
  )
);
Button.displayName = 'Button';
