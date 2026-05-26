'use client';

// M0.S8 · Stepper — vertical step indicator for multi-phase wizards (closure flow).

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export type Step = {
  id: string;
  label: string;
  description?: string;
  status: 'done' | 'active' | 'todo' | 'skipped';
  content?: ReactNode;
};

export function Stepper({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex flex-col">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={s.id} className="relative flex gap-sp3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'h-7 w-7 rounded-full border flex items-center justify-center text-[12px] font-mono shrink-0',
                  s.status === 'done' && 'bg-status-green/20 border-status-green text-status-green',
                  s.status === 'active' && 'bg-gold/20 border-gold text-gold',
                  s.status === 'todo' && 'bg-navy-deep border-border text-text-muted',
                  s.status === 'skipped' && 'bg-navy-deep border-border text-text-muted opacity-50',
                )}
                aria-hidden
              >
                {s.status === 'done' ? '✓' : i + 1}
              </span>
              {!last && (
                <span
                  className={cn(
                    'w-px flex-1 my-sp1',
                    s.status === 'done' ? 'bg-status-green/60' : 'bg-border',
                  )}
                />
              )}
            </div>
            <div className={cn('flex-1 pb-sp4', last && 'pb-0')}>
              <p
                className={cn(
                  'text-[13px] font-semibold',
                  s.status === 'active' ? 'text-gold' : 'text-text-h',
                )}
              >
                {s.label}
              </p>
              {s.description && (
                <p className="text-[12px] text-text-secondary mt-sp1">{s.description}</p>
              )}
              {s.content && <div className="mt-sp2">{s.content}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
