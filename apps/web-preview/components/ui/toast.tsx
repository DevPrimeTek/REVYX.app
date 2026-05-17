'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export type ToastInput = {
  variant?: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
};

type ToastItem = ToastInput & { id: number };

type ToastApi = {
  toast: (t: ToastInput) => void;
};

const ToastCtx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastCtx);
  if (!ctx) {
    throw new Error('useToast must be used within <ToastProvider>');
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setItems((cur) => cur.filter((i) => i.id !== id));
  }, []);

  const toast = useCallback(
    (t: ToastInput) => {
      idRef.current += 1;
      const item: ToastItem = { id: idRef.current, variant: 'info', duration: 4000, ...t };
      setItems((cur) => [...cur, item]);
    },
    []
  );

  const api = useMemo<ToastApi>(() => ({ toast }), [toast]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-sp4 right-sp4 z-50 flex flex-col gap-sp2 pointer-events-none"
      >
        {items.map((i) => (
          <ToastCard key={i.id} item={i} onClose={() => remove(i.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastCard({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  useEffect(() => {
    if (!item.duration) return;
    const id = setTimeout(onClose, item.duration);
    return () => clearTimeout(id);
  }, [item.duration, onClose]);

  const role = item.variant === 'warning' || item.variant === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={cn(
        'pointer-events-auto min-w-[280px] max-w-sm bg-navy-card border rounded-md shadow-lg px-sp3 py-sp2 flex items-start gap-sp2',
        item.variant === 'success' && 'border-status-green/60',
        item.variant === 'warning' && 'border-status-amber/60',
        item.variant === 'error' && 'border-status-red/60',
        item.variant === 'info' && 'border-status-blue/60'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'mt-1 h-2 w-2 rounded-full shrink-0',
          item.variant === 'success' && 'bg-status-green',
          item.variant === 'warning' && 'bg-status-amber',
          item.variant === 'error' && 'bg-status-red',
          item.variant === 'info' && 'bg-status-blue'
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-text-h">{item.title}</p>
        {item.description && (
          <p className="text-[12px] text-text-secondary mt-1">{item.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Închide notificarea"
        className="text-text-muted hover:text-text-h text-[14px] leading-none px-1"
      >
        ×
      </button>
    </div>
  );
}
