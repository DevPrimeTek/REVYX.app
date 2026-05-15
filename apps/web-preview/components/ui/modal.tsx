'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  children: ReactNode;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  dismissible = true,
  children,
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && dismissible) onClose();
    }
    document.addEventListener('keydown', onKey);
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-desc' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center px-sp3"
      onClick={(e) => {
        if (dismissible && e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-navy-deep/80 backdrop-blur-sm" aria-hidden="true" />
      <div
        ref={ref}
        tabIndex={-1}
        className={cn(
          'relative w-full bg-navy-card border border-border rounded-lg shadow-lg card-accent-top',
          size === 'sm' && 'max-w-md',
          size === 'md' && 'max-w-lg',
          size === 'lg' && 'max-w-2xl'
        )}
      >
        <header className="px-sp4 pt-sp4 pb-sp2 border-b border-border">
          <h2 id="modal-title" className="text-[20px] font-semibold text-text-h">
            {title}
          </h2>
          {description && (
            <p id="modal-desc" className="text-[13px] text-text-secondary mt-sp1">
              {description}
            </p>
          )}
        </header>
        <div className="px-sp4 py-sp3">{children}</div>
      </div>
    </div>
  );
}
