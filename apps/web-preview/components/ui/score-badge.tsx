// M0.S6 · Priority + metric pills · friendly labels only (no scoring acronyms in UI).
//
// The numeric score is intentionally NOT shown to agents — they react to the
// label (Foarte mare / Mare / Medie / Scăzută). The underlying formula stays
// hidden in the backend (BRD §7) per Senior PM directive.

import { Badge } from './badge';
import { leadTemperatureFromScore, type LeadTemperature } from '@/lib/utils';

const priorityKeyByTemp: Record<LeadTemperature, string> = {
  hot: 'lead.priorityLabel.hot',
  qualified: 'lead.priorityLabel.qualified',
  warm: 'lead.priorityLabel.warm',
  cold: 'lead.priorityLabel.cold',
};

export function LeadPriorityBadge({
  ls,
  t,
  size = 'sm',
}: {
  ls: number;
  t: (key: string) => string;
  size?: 'xs' | 'sm';
}) {
  const temp = leadTemperatureFromScore(ls);
  return (
    <Badge variant={temp} size={size}>
      {t(priorityKeyByTemp[temp])}
    </Badge>
  );
}

/** Backwards-compatible alias — older imports keep working. */
export const LeadScoreBadge = LeadPriorityBadge;

/**
 * A small, label-only metric pill (no acronyms exposed).
 * Use it for human-readable KPIs on profile / dashboard / cabinet.
 */
export function MetricPill({
  label,
  display,
  tone = 'neutral',
}: {
  label: string;
  display: string;
  tone?: 'neutral' | 'positive' | 'warning';
}) {
  const toneClass =
    tone === 'positive'
      ? 'text-status-green'
      : tone === 'warning'
      ? 'text-status-amber'
      : 'text-text-h';
  return (
    <span className="inline-flex items-baseline gap-sp1 text-[12px]">
      <span className="text-text-muted">{label}</span>
      <span className={`font-semibold ${toneClass}`}>{display}</span>
    </span>
  );
}

/** Backwards-compatible alias for ScorePill — keep label, hide numeric formula reference. */
export function ScorePill({ label, value }: { label: string; value: number }) {
  // Render as a tone-aware metric without exposing the raw 0.xx number.
  const display =
    value >= 0.75 ? '●●●' : value >= 0.55 ? '●●○' : value >= 0.35 ? '●○○' : '○○○';
  const tone: 'positive' | 'neutral' | 'warning' =
    value >= 0.75 ? 'positive' : value >= 0.45 ? 'neutral' : 'warning';
  return <MetricPill label={label} display={display} tone={tone} />;
}
