import { Badge } from './badge';
import { formatScore, leadTemperatureFromScore } from '@/lib/utils';

export function LeadScoreBadge({ ls }: { ls: number }) {
  const temp = leadTemperatureFromScore(ls);
  const label: Record<typeof temp, string> = {
    cold: 'Rece',
    warm: 'Warm',
    qualified: 'Calificat',
    hot: 'HOT',
  };
  return (
    <Badge variant={temp} size="sm">
      LS {formatScore(ls)} · {label[temp]}
    </Badge>
  );
}

export function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-sp1 font-mono text-[11px] text-text-secondary">
      <span className="uppercase tracking-label text-text-muted">{label}</span>
      <span className="text-text-h">{formatScore(value)}</span>
    </span>
  );
}
