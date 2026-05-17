import { forwardRef, type HTMLAttributes, type TableHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Table = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...rest }, ref) => (
    <div className="w-full overflow-x-auto rounded-lg border border-border">
      <table
        ref={ref}
        className={cn('w-full text-left text-[13px] text-text-primary', className)}
        {...rest}
      />
    </div>
  )
);
Table.displayName = 'Table';

export const THead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...rest }, ref) => (
    <thead
      ref={ref}
      className={cn('bg-navy-card text-gold text-[11px] uppercase tracking-label', className)}
      {...rest}
    />
  )
);
THead.displayName = 'THead';

export const TBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...rest }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:nth-child(odd)]:bg-navy [&_tr:nth-child(even)]:bg-navy-mid', className)}
      {...rest}
    />
  )
);
TBody.displayName = 'TBody';

export const TR = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...rest }, ref) => (
    <tr
      ref={ref}
      className={cn('border-b border-border last:border-0 hover:bg-navy-hover transition-colors duration-fast', className)}
      {...rest}
    />
  )
);
TR.displayName = 'TR';

export const TH = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...rest }, ref) => (
    <th ref={ref} className={cn('px-sp3 py-sp2 font-semibold text-left', className)} {...rest} />
  )
);
TH.displayName = 'TH';

export const TD = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...rest }, ref) => (
    <td ref={ref} className={cn('px-sp3 py-sp2 align-middle', className)} {...rest} />
  )
);
TD.displayName = 'TD';
