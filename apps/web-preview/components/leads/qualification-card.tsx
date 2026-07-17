'use client';

// Val 1 (AGI §18.3) · Card clar pentru întâlnirea de calificare seller — înlocuiește butonul
// ascuns din header. Scope: (1) ghidează agentul prin 10 pași; (2) captează verdict + preț
// minim + motivație; (3) la verdict „Da" creează sarcina „pregătește mandatul". Vizibil ca bloc
// pe lead-ul seller/landlord, cu stare (neînceput / finalizat + rezultat).

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/components/i18n/provider';
import { QualificationWizard } from '@/components/leads/qualification-wizard';
import { useQualification } from '@/lib/qualification-store';
import { formatDate } from '@/lib/format';
import type { Lead } from '@/lib/mock';

export function QualificationCard({ lead }: { lead: Lead }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const result = useQualification(lead.id);

  return (
    <Card variant="elevated" accentTop>
      <CardHeader className="flex flex-col gap-sp3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>{t('qualification.cardTitle')}</CardTitle>
          <CardDescription>{t('qualification.cardDesc')}</CardDescription>
        </div>
        {result ? (
          <Badge variant={result.verdict === 'yes' ? 'success' : 'critical'} size="sm">
            {t(`qualification.verdict.${result.verdict}`)}
          </Badge>
        ) : (
          <Badge variant="updated" size="sm">{t('qualification.notStarted')}</Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-sp3">
        {result ? (
          <>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-sp3 text-[13px]">
              <div className="rounded-md border border-border bg-navy-deep/40 p-sp2">
                <dt className="text-[11px] text-text-muted">{t('qualification.resultVerdict')}</dt>
                <dd className={result.verdict === 'yes' ? 'text-status-green' : 'text-status-red'}>
                  {t(`qualification.verdict.${result.verdict}`)}
                </dd>
              </div>
              <div className="rounded-md border border-border bg-navy-deep/40 p-sp2">
                <dt className="text-[11px] text-text-muted">{t('qualification.resultMinPrice')}</dt>
                <dd className="text-text-h">{result.minPrice ? `€${result.minPrice}` : '—'}</dd>
              </div>
              <div className="rounded-md border border-border bg-navy-deep/40 p-sp2">
                <dt className="text-[11px] text-text-muted">{t('qualification.resultDate')}</dt>
                <dd className="text-text-h">{formatDate(result.completedAt)}</dd>
              </div>
            </dl>
            {result.motivation && (
              <div className="text-[13px]">
                <span className="text-[11px] text-text-muted block">{t('qualification.resultMotivation')}</span>
                <p className="text-text-h italic">&ldquo;{result.motivation}&rdquo;</p>
              </div>
            )}
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>{t('qualification.redoCta')}</Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-[13px] text-text-secondary">{t('qualification.cardPurpose')}</p>
            <div>
              <Button onClick={() => setOpen(true)}>{t('qualification.cardStartCta')}</Button>
            </div>
          </>
        )}
      </CardContent>
      <QualificationWizard open={open} onClose={() => setOpen(false)} lead={lead} />
    </Card>
  );
}
