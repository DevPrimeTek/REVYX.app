import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeStyles = cva(
  'inline-flex items-center gap-1 rounded-pill border font-mono uppercase tracking-badge whitespace-nowrap',
  {
    variants: {
      variant: {
        new: 'border-status-green bg-status-green/10 text-status-green',
        updated: 'border-gold bg-gold/10 text-gold',
        critical: 'border-status-red bg-status-red/10 text-status-red',
        info: 'border-status-blue bg-status-blue/10 text-status-blue',
        success: 'border-status-green bg-status-green/10 text-status-green',
        warning: 'border-status-amber bg-status-amber/10 text-status-amber',
        cold: 'border-lead-cold bg-lead-cold/10 text-lead-cold',
        warm: 'border-lead-warm bg-lead-warm/10 text-lead-warm',
        qualified: 'border-lead-qualified bg-lead-qualified/10 text-lead-qualified',
        hot: 'border-lead-hot bg-lead-hot/10 text-lead-hot pulse-hot',
      },
      size: {
        xs: 'h-5 px-2 text-[9px]',
        sm: 'h-6 px-2.5 text-[10px]',
      },
    },
    defaultVariants: {
      variant: 'info',
      size: 'sm',
    },
  }
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeStyles>;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...rest }, ref) => (
    <span ref={ref} className={cn(badgeStyles({ variant, size }), className)} {...rest} />
  )
);
Badge.displayName = 'Badge';
