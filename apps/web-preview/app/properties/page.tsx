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
import type { PropertyKind, ListingType } from '@/lib/mock';
import { freshnessLabel, freshnessTone } from '@/lib/freshness';
import { cn } from '@/lib/utils';

type KindFilter = 'all' | PropertyKind;
const kinds: KindFilter[] = ['all', 'apartment', 'house', 'land', 'commercial'];

// Regula 20: filter listing type (sale / rent / both).
type ListingFilter = 'all' | ListingType;
const listingFilters: ListingFilter[] = ['all', 'sale', 'rent', 'both'];

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
  const [listing, setListing] = useState<ListingFilter>('all');

  const list = useMemo(
    () => properties
      .filter((p) => (kind === 'all' ? true : p.kind === kind))
      .filter((p) => {
        if (listing === 'all') return true;
        if (listing === 'both') return p.listingType === 'both';
        // sale tab include both; rent tab include both.
        return p.listingType === listing || p.listingType === 'both';
      })
      .slice(0, 36),
    [kind, listing]
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

        <div className="flex items-center gap-sp2 flex-wrap">
          {/* Regula 20: filter listingType (sale / rent / both) */}
          <div
            role="tablist"
            aria-label={t('property.listingTypeFilterLabel')}
            className="flex items-center gap-1 rounded-md border border-border-light p-1 bg-navy-deep flex-wrap"
          >
            {listingFilters.map((lt) => {
              const isAll = lt === 'all';
              const selected = listing === lt;
              return (
                <button
                  key={lt}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => setListing(lt)}
                  className={cn(
                    'px-sp3 py-1 text-[12px] rounded transition-colors duration-fast',
                    selected
                      ? isAll
                        ? 'bg-gold text-navy-deep font-semibold'
                        : 'bg-gold/10 text-gold'
                      : 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
                  )}
                >
                  {lt === 'all' ? t('common.all') : t(`property.listingType.${lt}`)}
                </button>
              );
            })}
          </div>
        </div>

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
                      <span className="inline-flex items-center gap-1">
                        <Badge
                          variant={p.listingType === 'sale' ? 'info' : p.listingType === 'rent' ? 'success' : 'warning'}
                          size="xs"
                        >
                          {t(`property.listingType.${p.listingType}`)}
                        </Badge>
                        {p.listingType === 'both' && (
                          <InfoTooltip
                            label={t('property.listingType.both')}
                            body={t('property.listingType.bothHelp')}
                          />
                        )}
                        <span className="label-mono text-text-muted">{t(kindLabelKey(p.kind))}</span>
                      </span>
                    </div>
                    <CardTitle className="text-[15px]">{p.addr}</CardTitle>
                    <CardDescription>
                      {p.city} · {p.zone}
                      {p.rooms > 0 ? ` · ${p.rooms} ${t('property.rooms')}` : ''} · {p.area} m²
                      {p.priceEur > 0 && <> · €{p.priceEur.toLocaleString('ro-MD')}</>}
                      {p.monthlyRentEur && p.monthlyRentEur > 0 && (
                        <> · €{p.monthlyRentEur.toLocaleString('ro-MD')}/{t('landlord.month')}</>
                      )}
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
