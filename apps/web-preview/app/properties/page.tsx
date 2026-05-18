'use client';

// M0.S3 · T-M0.S3-04 · Property portfolio wired to 50 mock properties · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-04 + T-M0.S3-06

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScorePill } from '@/components/ui/score-badge';
import { useT } from '@/components/i18n/provider';
import { properties } from '@/lib/mock';
import type { PropertyKind } from '@/lib/mock';

type KindFilter = 'all' | PropertyKind;
const kinds: KindFilter[] = ['all', 'apartment', 'house', 'land', 'commercial'];

function kindLabelKey(k: PropertyKind): string {
  return k === 'apartment'
    ? 'property.kindApartment'
    : k === 'house'
    ? 'property.kindHouse'
    : k === 'land'
    ? 'property.kindLand'
    : 'property.kindCommercial';
}

export default function PropertiesPage() {
  const { t } = useT();
  const [kind, setKind] = useState<KindFilter>('all');

  const list = useMemo(
    () => properties.filter((p) => (kind === 'all' ? true : p.kind === kind)).slice(0, 36),
    [kind]
  );

  return (
    <>
      <SiteNav active="/properties" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">{t('property.moduleLabel')}</p>
            <h1 className="text-[28px] mt-sp1">{t('property.portfolioTitle')}</h1>
            <p className="text-[13px] text-text-secondary mt-sp1">{t('property.portfolioSubtitle')}</p>
          </div>
          <Link href="/properties/new">
            <Button>{t('property.addCta')}</Button>
          </Link>
        </header>

        <div
          role="tablist"
          aria-label={t('common.filter')}
          className="flex items-center gap-1 rounded-md border border-border p-1 bg-navy-deep self-start flex-wrap"
        >
          {kinds.map((k) => (
            <button
              key={k}
              role="tab"
              type="button"
              aria-selected={kind === k}
              onClick={() => setKind(k)}
              className={
                'px-sp2 py-1 text-[11px] rounded font-mono uppercase tracking-wider transition-colors duration-fast ' +
                (kind === k
                  ? 'bg-gold/10 text-gold'
                  : 'text-text-secondary hover:bg-navy-hover hover:text-text-h')
              }
            >
              {k === 'all' ? t('property.filterAll') : t(kindLabelKey(k))}
            </button>
          ))}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-sp3">
          {list.map((p) => (
            <Card key={p.id} variant="elevated" accentTop className="focus-within:border-gold">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <p className="label-mono text-text-secondary">{p.id}</p>
                  <span className="label-mono text-text-muted">{t(kindLabelKey(p.kind))}</span>
                </div>
                <CardTitle className="text-[15px]">{p.addr}</CardTitle>
                <CardDescription>
                  {p.city} · {p.zone}
                  {p.rooms > 0 ? ` · ${p.rooms} ${t('property.rooms')}` : ''} · {p.area} m² · €
                  {p.priceEur.toLocaleString('ro-MD')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex gap-sp3">
                  <ScorePill label="PS" value={p.ps} />
                  <ScorePill label="LF" value={p.lf} />
                </div>
                <Badge variant={p.lf > 0.75 ? 'success' : p.lf > 0.5 ? 'warning' : 'critical'}>
                  {p.lf > 0.75 ? t('property.fresh') : p.lf > 0.5 ? t('property.aging') : t('property.stale')}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </section>
        <p className="text-[11px] text-text-muted font-mono text-center">
          {list.length} / {properties.length}
        </p>
      </main>
    </>
  );
}
