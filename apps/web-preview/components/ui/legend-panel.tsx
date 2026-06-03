'use client';

// Componentă reutilizabilă pentru legenda badge-urilor pe orice pagină de listing.

import type { ReactNode } from 'react';

export interface LegendItem {
  badge: ReactNode;
  label: string;
  description: string;
}

export interface LegendGroup {
  title: string;
  items: LegendItem[];
}

export function LegendPanel({ groups }: { groups: LegendGroup[] }) {
  return (
    <aside
      aria-label="Legendă"
      className="border border-border rounded-lg p-sp3 bg-navy-deep/50 flex flex-col gap-sp3"
    >
      <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Legendă</p>
      <div className="flex flex-col gap-sp3">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="text-[11px] text-text-secondary font-semibold mb-sp2">{g.title}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-sp4 gap-y-sp2">
              {g.items.map((item, i) => (
                <div key={i} className="flex items-start gap-sp2">
                  <span className="flex-shrink-0 pt-px">{item.badge}</span>
                  <div className="min-w-0">
                    <span className="text-[12px] text-text-h font-medium">{item.label}</span>
                    <p className="text-[11px] text-text-muted leading-snug">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
