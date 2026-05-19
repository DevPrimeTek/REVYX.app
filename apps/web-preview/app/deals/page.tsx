'use client';

// M0.S6 · /deals · pipeline kanban + plain-language legend (no formula leak).

import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { KanbanBoard } from '@/components/deals/kanban-board';
import { useT } from '@/components/i18n/provider';

export default function DealsPage() {
  const { t } = useT();

  return (
    <>
      <SiteNav active="/deals" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-[1600px] mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">{t('deal.moduleLabel')}</p>
          <h1 className="text-[28px] mt-sp1">{t('deal.title')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">{t('deal.subtitle')}</p>
        </header>

        <KanbanBoard />

        <Card>
          <CardHeader>
            <CardTitle>{t('deal.legendTitle')}</CardTitle>
            <CardDescription>{t('deal.legendSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-sp4 text-[12px] text-text-secondary">
            <span className="inline-flex items-center gap-sp2">
              <Badge variant="success" size="xs">{t('deal.healthLabels.healthy')}</Badge>
              <InfoTooltip
                label={t('deal.healthLabels.healthy')}
                body={t('deal.healthHelp.healthy')}
              />
            </span>
            <span className="inline-flex items-center gap-sp2">
              <Badge variant="warning" size="xs">{t('deal.healthLabels.review')}</Badge>
              <InfoTooltip
                label={t('deal.healthLabels.review')}
                body={t('deal.healthHelp.review')}
              />
            </span>
            <span className="inline-flex items-center gap-sp2">
              <Badge variant="critical" size="xs">{t('deal.healthLabels.risk')}</Badge>
              <InfoTooltip
                label={t('deal.healthLabels.risk')}
                body={t('deal.healthHelp.risk')}
              />
            </span>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
