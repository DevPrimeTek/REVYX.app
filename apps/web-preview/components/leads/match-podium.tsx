'use client';

// M0.S9 · Match podium — Top1/Top2/Top3 cards. Click → toggle inline MatchReasoning (NOT navigate).
// Per user feedback (M0.S9): selectarea unui card NU duce pe pagina proprietății, ci expandează
// vizual blocul „De ce această potrivire?" cu detalii.

import Link from 'next/link';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useT } from '@/components/i18n/provider';
import { MatchReasoning } from '@/components/leads/match-reasoning';
import type { Lead, Property } from '@/lib/mock';

const PODIUM_STYLE = [
  { medal: '🥇', bgClass: 'border-gold bg-gold/10', label: 'Top 1', size: 'h-28' },
  { medal: '🥈', bgClass: 'border-text-secondary bg-navy-card', label: 'Top 2', size: 'h-24' },
  { medal: '🥉', bgClass: 'border-status-amber/50 bg-status-amber/5', label: 'Top 3', size: 'h-20' },
];

export function MatchPodium({
  lead,
  candidates,
}: {
  lead: Lead;
  candidates: Property[];
}) {
  const { t } = useT();
  const top3 = candidates.slice(0, 3);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const selected = top3[selectedIdx];

  if (top3.length === 0) {
    return <p className="text-text-muted text-[12px]">{t('matchReason.noMatches')}</p>;
  }

  return (
    <div className="flex flex-col gap-sp3">
      {/* Podium row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-sp2 items-end">
        {top3.map((p, idx) => {
          const style = PODIUM_STYLE[idx];
          const active = idx === selectedIdx;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              aria-pressed={active}
              className={
                'group text-left rounded-md border-2 px-sp3 py-sp2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ' +
                (active ? style.bgClass + ' shadow-md' : 'border-border bg-navy-deep hover:border-border-light')
              }
            >
              <div className="flex items-center justify-between gap-sp1">
                <span className="text-[24px]" aria-hidden>{style.medal}</span>
                <Badge variant={idx === 0 ? 'success' : idx === 1 ? 'info' : 'warning'} size="xs">
                  {style.label}
                </Badge>
              </div>
              <p className="font-mono text-[11px] text-text-muted mt-sp1">{p.id}</p>
              <p className="text-[13px] text-text-h font-semibold mt-sp1 line-clamp-2">{p.addr}</p>
              <p className="text-[11px] text-text-secondary mt-sp1">
                {p.zone} · {p.area} m²
              </p>
              <p className="text-[12px] text-gold mt-sp1 font-mono">€{p.priceEur.toLocaleString('ro-MD')}</p>
            </button>
          );
        })}
      </div>

      {/* Inline reasoning + open link */}
      {selected && (
        <div className="flex flex-col gap-sp2">
          <MatchReasoning lead={lead} property={selected} />
          <div className="flex items-center justify-end">
            <Link href={`/properties/${selected.id}`}>
              <Button variant="ghost" size="sm">
                {t('matchReason.openProperty', { id: selected.id })} →
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
