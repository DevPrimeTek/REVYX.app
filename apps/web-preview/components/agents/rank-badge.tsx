'use client';

// M0.S9 · AgentRankBadge — badge vizual + grad pentru Top3 / Top10 / Performer.
// Calculat din rang APS în tot lotul de agenți (mock). Apare pe dashboard, profil, cabinet agent.

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/components/i18n/provider';
import { agents, type Agent } from '@/lib/mock';

export type AgentRank = 'top1' | 'top3' | 'top10' | 'performer' | 'developing';

export function rankOfAgent(agent: Agent, all: readonly Agent[] = agents): AgentRank {
  const sorted = [...all].sort((a, b) => b.aps - a.aps);
  const idx = sorted.findIndex((a) => a.id === agent.id);
  if (idx === 0) return 'top1';
  if (idx < 3) return 'top3';
  if (idx < 10) return 'top10';
  if (agent.aps >= 0.65) return 'performer';
  return 'developing';
}

const STYLE: Record<AgentRank, { medal: string; variant: 'success' | 'updated' | 'info' | 'warning' }> = {
  top1: { medal: '🏆', variant: 'updated' },
  top3: { medal: '🥇', variant: 'success' },
  top10: { medal: '🎖️', variant: 'info' },
  performer: { medal: '⭐', variant: 'info' },
  developing: { medal: '📈', variant: 'warning' },
};

export function AgentRankBadge({
  agent,
  size = 'sm',
  showLabel = true,
}: {
  agent: Agent;
  size?: 'xs' | 'sm';
  showLabel?: boolean;
}) {
  const { t } = useT();
  const rank = useMemo(() => rankOfAgent(agent), [agent]);
  const s = STYLE[rank];

  return (
    <Badge variant={s.variant} size={size}>
      <span aria-hidden>{s.medal}</span>
      {showLabel && <span>{t(`rank.${rank}`)}</span>}
    </Badge>
  );
}

/** Visual stars (1..5) derived from APS — used in performance card. */
export function PerformanceStars({ value }: { value: number }) {
  const stars = Math.max(1, Math.min(5, Math.round(value * 5)));
  return (
    <span className="text-gold tracking-wider" aria-label={`${stars}/5`}>
      {'★'.repeat(stars)}
      <span className="text-text-muted">{'★'.repeat(5 - stars)}</span>
    </span>
  );
}
