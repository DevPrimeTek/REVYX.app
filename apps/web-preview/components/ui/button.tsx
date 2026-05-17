import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonStyles = cva(
  'inline-flex items-center justify-center gap-sp1 font-body font-semibold transition-all duration-fast ease-standard rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep active:translate-y-px',
  {
    variants: {
      variant: {
        primary:
          'bg-gold text-navy-deep hover:bg-gold-light hover:shadow-gold active:bg-gold-dark',
        secondary:
          'bg-transparent text-text-h border border-border-light hover:bg-navy-hover hover:border-gold/60 active:bg-navy-card',
        ghost:
          'bg-transparent text-text-secondary hover:bg-navy-hover hover:text-text-h active:bg-navy-card',
        destructive:
          'bg-status-red text-white hover:bg-status-red/90 hover:shadow-md active:bg-status-red',
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
