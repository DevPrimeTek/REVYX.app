import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'elevated' | 'formula';
  accentTop?: boolean;
  interactive?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', accentTop, interactive = false, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border transition-all duration-fast ease-standard',
        variant === 'default' && 'bg-navy-mid border-border',
        variant === 'elevated' && 'bg-navy-card border-border shadow-md',
        variant === 'formula' && 'bg-navy-card border-border shadow-md',
        accentTop && 'card-accent-top',
        interactive && 'cursor-pointer hover:-translate-y-0.5 hover:border-border-light',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('px-sp3 pt-sp3 pb-sp2', className)} {...rest} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...rest }, ref) => (
    <h3 ref={ref} className={cn('text-[18px] font-semibold text-text-h', className)} {...rest} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...rest }, ref) => (
    <p ref={ref} className={cn('text-[12px] text-text-secondary mt-sp1', className)} {...rest} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('px-sp3 pb-sp3', className)} {...rest} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn('px-sp3 py-sp2 border-t border-border flex items-center gap-sp2', className)}
      {...rest}
    />
  )
);
CardFooter.displayName = 'CardFooter';
