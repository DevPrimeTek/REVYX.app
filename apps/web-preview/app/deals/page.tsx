'use client';

// M0.S3 · T-M0.S3-10 · J3 Deal pipeline drag-drop · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-10
//
// Drag-drop @dnd-kit landed at M0.S3. Click-to-advance ← / → buttons retained as
// keyboard / screen-reader a11y fallback (per ARCHITECT M0.S2 review note).

import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
            <span><Badge variant="success" size="xs">{t('deal.healthy')}</Badge> &nbsp;DHI ≥ 0.75</span>
            <span><Badge variant="warning" size="xs">{t('deal.review')}</Badge> &nbsp;0.55 ≤ DHI &lt; 0.75</span>
            <span><Badge variant="critical" size="xs">{t('deal.risk')}</Badge> &nbsp;DHI &lt; 0.55</span>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
