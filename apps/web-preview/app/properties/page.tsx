'use client';

// M0.S6 · Properties portfolio · cards link to /properties/[id] · friendly freshness labels.

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useT } from '@/components/i18n/provider';
import { properties } from '@/lib/mock';
import type { PropertyKind } from '@/lib/mock';
import { freshnessLabel, freshnessTone } from '@/lib/freshness';
import { cn } from '@/lib/utils';

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
          className="flex items-center gap-1 rounded-md border border-border-light p-1 bg-navy-deep self-start flex-wrap"
        >
          {kinds.map((k) => {
            const isAll = k === 'all';
            const selected = kind === k;
            return (
              <button
                key={k}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setKind(k)}
                className={cn(
                  'px-sp3 py-1 text-[12px] rounded transition-colors duration-fast',
                  selected
                    ? isAll
                      ? 'bg-gold text-navy-deep font-semibold'
                      : 'bg-gold/10 text-gold'
                    : 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
                )}
              >
                {k === 'all' ? t('property.filterAll') : t(kindLabelKey(k))}
              </button>
            );
          })}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-sp3">
          {list.map((p) => {
            const fresh = freshnessLabel(p.daysOnMarket, t);
            return (
              <Link
                key={p.id}
                href={`/properties/${p.id}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
              >
                <Card variant="elevated" accentTop interactive className="h-full focus-within:border-gold">
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
                    <div className="inline-flex items-center gap-sp1">
                      <Badge variant={freshnessTone(p.daysOnMarket)} size="sm">
                        {fresh.label}
                      </Badge>
                      <InfoTooltip label={fresh.label} body={fresh.desc} />
                    </div>
                    <span className="text-[12px] text-gold hover:underline">
                      {t('property.viewDetails')} →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>
        <p className="text-[11px] text-text-muted text-center">
          {list.length} / {properties.length}
        </p>
      </main>
    </>
  );
}
