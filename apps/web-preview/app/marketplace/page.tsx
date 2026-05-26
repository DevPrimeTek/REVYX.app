'use client';

// M0.S8 · /marketplace · listează profiluri cumpărători publice (PII mascată) — flux invers căutării.

import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useT } from '@/components/i18n/provider';
import { BuyerCard } from '@/components/marketplace/buyer-card';
import { ContactRequestModal } from '@/components/marketplace/contact-request-modal';
import { agents, buyerProfiles, type BuyerProfile, type PropertyKind } from '@/lib/mock';
import { useGrants } from '@/lib/marketplace-store';

type Filter = 'all' | PropertyKind;

export default function MarketplacePage() {
  const { t } = useT();
  const grants = useGrants();
  const [filter, setFilter] = useState<Filter>('all');
  const [active, setActive] = useState<BuyerProfile | null>(null);
  const me = agents[0];

  const profiles = useMemo(() => {
    return filter === 'all' ? buyerProfiles : buyerProfiles.filter((p) => p.propertyKind === filter);
  }, [filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('marketplace.filterAll') },
    { key: 'apartment', label: t('property.kindApartment') },
    { key: 'house', label: t('property.kindHouse') },
    { key: 'land', label: t('property.kindLand') },
    { key: 'commercial', label: t('property.kindCommercial') },
  ];

  function grantFor(buyerProfileId: string) {
    const g = grants.find((g) => g.buyerProfileId === buyerProfileId && g.agentId === me.id);
    return g?.status ?? null;
  }

  return (
    <>
      <SiteNav active="/marketplace" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">{t('marketplace.moduleLabel')}</p>
          <h1 className="text-[28px] mt-sp1">{t('marketplace.title')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1 max-w-3xl">{t('marketplace.subtitle')}</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>{t('marketplace.howTitle')}</CardTitle>
            <CardDescription>{t('marketplace.howDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-sp2 text-[12px] text-text-secondary">
              <li className="border border-border rounded-md p-sp2">
                <p className="text-gold text-[11px] label-mono">1</p>
                <p className="text-text-h font-semibold mt-sp1">{t('marketplace.step1Title')}</p>
                <p className="mt-sp1">{t('marketplace.step1Desc')}</p>
              </li>
              <li className="border border-border rounded-md p-sp2">
                <p className="text-gold text-[11px] label-mono">2</p>
                <p className="text-text-h font-semibold mt-sp1">{t('marketplace.step2Title')}</p>
                <p className="mt-sp1">{t('marketplace.step2Desc')}</p>
              </li>
              <li className="border border-border rounded-md p-sp2">
                <p className="text-gold text-[11px] label-mono">3</p>
                <p className="text-text-h font-semibold mt-sp1">{t('marketplace.step3Title')}</p>
                <p className="mt-sp1">{t('marketplace.step3Desc')}</p>
              </li>
            </ol>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-sp1">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={
                'h-9 px-sp3 rounded-md text-[12px] border transition-all cursor-pointer ' +
                (filter === f.key
                  ? 'bg-gold/20 border-gold text-gold'
                  : 'bg-navy-deep border-border text-text-secondary hover:border-border-light')
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sp3">
          {profiles.map((p) => (
            <BuyerCard
              key={p.id}
              profile={p}
              grantStatus={grantFor(p.id)}
              onRequestContact={() => setActive(p)}
            />
          ))}
        </div>
      </main>

      {active && (
        <ContactRequestModal
          open
          onClose={() => setActive(null)}
          profile={active}
          agentId={me.id}
        />
      )}
    </>
  );
}
