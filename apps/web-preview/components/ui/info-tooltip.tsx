'use client';

// M0.S6 · Info tooltip · accessible (button + popover, ESC + outside click close)
// Used to expose 1-2 line column / metric explanations on demand.

import { useEffect, useRef, useState } from 'react';

export function InfoTooltip({
  label,
  body,
  className = '',
}: {
  label: string;
  body: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-border-light text-[9px] font-mono text-text-muted hover:text-gold hover:border-gold cursor-pointer transition-colors duration-fast focus-visible:outline-none focus-visible:border-gold focus-visible:text-gold"
      >
        i
      </button>
      {open && (
        <div
          role="tooltip"
          className="absolute left-1/2 top-full mt-1 -translate-x-1/2 z-30 w-64 rounded-md border border-border bg-navy-deep px-sp2 py-sp2 shadow-lg text-[11px] text-text-secondary leading-snug whitespace-normal"
        >
          <span className="block text-text-h font-medium mb-0.5">{label}</span>
          {body}
        </div>
      )}
    </div>
  );
}
