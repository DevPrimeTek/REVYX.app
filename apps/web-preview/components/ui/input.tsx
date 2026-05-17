import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, invalid, id, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasError = Boolean(error) || invalid;

    return (
      <div className="flex flex-col gap-sp1">
        {label && (
          <label htmlFor={inputId} className="text-[12px] text-text-secondary font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={cn(
            'h-10 px-sp2 rounded-md bg-navy-deep border text-text-primary placeholder:text-text-muted',
            'transition-colors duration-fast ease-standard',
            hasError ? 'border-status-red focus:border-status-red' : 'border-border focus:border-gold',
            'focus:outline-none',
            className
          )}
          {...rest}
        />
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="text-[12px] text-status-red">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-[12px] text-text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';
