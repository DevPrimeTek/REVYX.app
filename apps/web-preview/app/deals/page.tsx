'use client';

// M0.S8 · /deals · pipeline kanban cu tab toggle pe transactionIntent (sale | rent | all).
// Regula 20: tranzacțiile au workflow diferit per profile — sale folosește notariat,
// rent folosește contract chirie (vezi /notary tab Contracte chirie).

import { useEffect, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { KanbanBoard, type IntentFilter } from '@/components/deals/kanban-board';
import { useT } from '@/components/i18n/provider';
import { useWorkspaceDirection } from '@/lib/workspace-store';
import { cn } from '@/lib/utils';

const ALL_TABS: IntentFilter[] = ['all', 'sale', 'rent'];

export default function DealsPage() {
  const { t } = useT();
  const direction = useWorkspaceDirection();
  const [intent, setIntent] = useState<IntentFilter>('all');

  // Regula 20/21: când direcția workspace e sale/rent, forțăm intent-ul și ascundem tab-urile irelevante.
  const tabs: IntentFilter[] = direction === 'both' ? ALL_TABS : [direction];
  useEffect(() => {
    if (direction !== 'both') setIntent(direction);
    else setIntent('all');
  }, [direction]);

  return (
    <>
      <SiteNav active="/deals" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-[1600px] mx-auto flex flex-col gap-sp4">
        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">{t('deal.moduleLabel')}</p>
            <h1 className="text-[28px] mt-sp1">{t('deal.title')}</h1>
            <p className="text-[13px] text-text-secondary mt-sp1">
              {intent === 'all'
                ? t('deal.subtitle')
                : intent === 'sale'
                ? t('deal.subtitleSale')
                : t('deal.subtitleRent')}
            </p>
          </div>
          {/* Tab toggle: Toate / Vânzare / Închiriere (ascuns când direcția workspace e fixă) */}
          {direction === 'both' && (
          <div
            role="tablist"
            aria-label={t('deal.intentFilterLabel')}
            className="inline-flex items-center gap-sp1 rounded-md border border-border-light p-1 bg-navy-deep"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                type="button"
                aria-selected={intent === tab}
                onClick={() => setIntent(tab)}
                className={cn(
                  'px-sp3 py-1.5 text-[12px] rounded transition-colors duration-fast',
                  intent === tab
                    ? tab === 'all'
                      ? 'bg-gold text-navy-deep font-semibold'
                      : 'bg-gold/10 text-gold'
                    : 'text-text-secondary hover:bg-navy-hover hover:text-text-h',
                )}
              >
                {tab === 'all' ? t('common.all') : t(`transactionIntent.${tab}`)}
              </button>
            ))}
          </div>
          )}
          {direction !== 'both' && (
            <Badge variant={direction === 'rent' ? 'success' : 'info'} size="sm">
              {t('workspace.activeBadge', { dir: t(`transactionIntent.${direction}`) })}
            </Badge>
          )}
        </header>

        {intent === 'rent' && (
          <div className="bg-status-green/10 border border-status-green/30 rounded-lg px-sp3 py-sp2 text-[13px] text-text-h">
            {t('deal.rentBanner')}
          </div>
        )}

        <KanbanBoard intentFilter={intent} />

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
