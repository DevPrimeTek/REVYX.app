'use client';

// Val 1 (AGI §18.7 Financial Readiness Score RM) · Indicator prietenos: cât de pregătit
// financiar e clientul să cumpere ACUM. Derivat din buget confirmat + pre-aprobare bancară.
// NU expune formule/acronime în UI (convenția M0.S6). Folosit pe lead header + listă.

import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/components/i18n/provider';
import { useBuyerAssessment } from '@/lib/buyer-assessment-store';
import type { Lead } from '@/lib/mock';

type Level = 'low' | 'med' | 'high';

/** §18.7 FRS — calcul simplu non-ML, dar prezentat ca 3 niveluri prietenoase. */
function frsLevel(lead: Lead, bank: string): Level {
  let frs = 0.3;
  if (lead.confirmedBudgetMax != null) frs += 0.25;
  if (bank === 'in_progress' || bank === 'approved') frs += 0.25;
  if (bank === 'approved') frs += 0.2;
  if (frs >= 0.8) return 'high';
  if (frs >= 0.55) return 'med';
  return 'low';
}

export function FinancialReadinessBadge({
  lead,
  variant = 'inline',
}: {
  lead: Lead;
  variant?: 'inline' | 'compact';
}) {
  const { t } = useT();
  const assessment = useBuyerAssessment(lead.id);
  const level = frsLevel(lead, assessment.bankPreapproval);

  const dots = level === 'high' ? '●●●' : level === 'med' ? '●●○' : '●○○';
  const color = level === 'high' ? 'text-status-green' : level === 'med' ? 'text-status-amber' : 'text-status-red';
  const labelKey = `lead.financialReadiness${level === 'low' ? 'Low' : level === 'med' ? 'Med' : 'High'}`;

  if (variant === 'compact') {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${color}`} title={t('lead.financialReadiness')}>
        <span className="font-mono">{dots}</span>
        {t(labelKey)}
      </span>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-navy-deep/50 px-sp3 py-sp2 flex items-center justify-between gap-sp3 flex-wrap text-[13px]">
      <div className="flex items-center gap-sp2">
        <span className="text-text-secondary">{t('lead.financialReadiness')}</span>
        <InfoTooltip label={t('lead.financialReadiness')} body={t('lead.financialReadinessHelp')} />
      </div>
      <div className="flex items-center gap-sp2">
        <span className={`font-mono ${color}`}>{dots}</span>
        <Badge variant={level === 'high' ? 'success' : level === 'med' ? 'updated' : 'warning'} size="xs">
          {t(labelKey)}
        </Badge>
      </div>
    </div>
  );
}
