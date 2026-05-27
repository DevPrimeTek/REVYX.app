'use client';

// M0.S6 · /properties/[id] · property detail with photo gallery + video + public link.

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useT } from '@/components/i18n/provider';
import { properties, agents, leadsById } from '@/lib/mock';
import { freshnessLabel, freshnessTone } from '@/lib/freshness';
import { ShowingModal } from '@/components/showings/showing-modal';
import { PropertyBenefitsPanel } from '@/components/properties/benefits-panel';

type Params = { params: { id: string } };

// Synthetic gallery: pure SVG placeholders so we don't ship binary assets.
function GalleryPlaceholder({ index, kind }: { index: number; kind: string }) {
  const hueRotate = (index * 47) % 360;
  return (
    <div
      role="img"
      aria-label={`Galerie placeholder ${kind} #${index + 1}`}
      className="aspect-[16/10] rounded-md border border-border bg-navy-deep relative overflow-hidden"
      style={{
        background:
          `linear-gradient(135deg, hsl(${hueRotate}, 30%, 14%) 0%, hsl(${(hueRotate + 30) % 360}, 35%, 22%) 100%)`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-text-muted text-[11px] font-mono uppercase tracking-wider">
        photo {index + 1}
      </div>
    </div>
  );
}

export default function PropertyDetailPage({ params }: Params) {
  const { t } = useT();
  const property = useMemo(() => properties.find((p) => p.id === params.id) ?? null, [params.id]);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showingOpen, setShowingOpen] = useState(false);
  const sampleLead = Array.from(leadsById.values()).find((l) => l.agentId === agents[0].id) ?? Array.from(leadsById.values())[0];

  if (!property) {
    return (
      <>
        <SiteNav active="/properties" />
        <main id="main" className="px-sp4 py-sp8 max-w-3xl mx-auto text-center">
          <p className="label-mono text-gold">404</p>
          <h1 className="text-[28px] mt-sp2">Proprietate {params.id} inexistentă.</h1>
          <p className="text-text-secondary mt-sp2">
            <Link href="/properties" className="text-gold hover:underline">← {t('property.detail.breadcrumb')}</Link>
          </p>
        </main>
      </>
    );
  }

  const agent = agents.find((a) => a.id === property.agentId) ?? agents[0];
  const photoCount = 6; // synthetic
  const ageState = freshnessLabel(property.daysOnMarket, t);
  const ageTone = freshnessTone(property.daysOnMarket);
  const publicLink = `https://demo.revyx.app/p/${property.id.toLowerCase()}`;

  return (
    <>
      <SiteNav active="/properties" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary">
          <Link href="/properties" className="hover:text-text-h">{t('property.detail.breadcrumb')}</Link>
          <span className="mx-sp1 text-text-muted">/</span>
          <span className="text-text-h font-mono">{property.id}</span>
        </nav>

        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">{t('property.moduleLabel')}</p>
            <h1 className="text-[26px] mt-sp1">{property.addr}</h1>
            <p className="text-[13px] text-text-secondary mt-sp1">
              {t(`property.kind${property.kind[0].toUpperCase()}${property.kind.slice(1)}`)} · {property.city} · {property.zone}
            </p>
          </div>
          <div className="flex items-center gap-sp2 flex-wrap">
            <Badge variant={ageTone} size="sm">{ageState.label}</Badge>
            <InfoTooltip label={ageState.label} body={ageState.desc} />
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <div className="lg:col-span-2 flex flex-col gap-sp3">
            <Card>
              <CardHeader>
                <CardTitle>{t('property.detail.gallery')}</CardTitle>
                <CardDescription>{photoCount} foto</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-sp2">
                <GalleryPlaceholder index={activePhoto} kind={property.kind} />
                <div className="flex gap-sp2 overflow-x-auto">
                  {Array.from({ length: photoCount }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActivePhoto(i)}
                      aria-label={`Foto ${i + 1}`}
                      aria-pressed={activePhoto === i}
                      className={`flex-shrink-0 w-20 aspect-[16/10] rounded border-2 overflow-hidden cursor-pointer transition-colors duration-fast ${
                        activePhoto === i ? 'border-gold' : 'border-border hover:border-border-light'
                      }`}
                    >
                      <GalleryPlaceholder index={i} kind={property.kind} />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('property.detail.videoTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-md border border-border bg-navy-deep flex flex-col items-center justify-center gap-sp2">
                  <div
                    aria-hidden
                    className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center"
                  >
                    <span className="text-gold text-[18px]">▶</span>
                  </div>
                  <p className="text-text-muted text-[12px] font-mono">demo · tur video placeholder</p>
                </div>
              </CardContent>
            </Card>

            <PropertyBenefitsPanel property={property} />

            <Card>
              <CardHeader>
                <CardTitle>{t('property.detail.specsTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-sp3 text-[13px]">
                  <div>
                    <dt className="text-text-muted text-[12px]">{t('property.detail.addressLabel')}</dt>
                    <dd className="text-text-h">{property.addr}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted text-[12px]">{t('property.detail.cityLabel')}</dt>
                    <dd className="text-text-h">{property.city}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted text-[12px]">{t('property.detail.zoneLabel')}</dt>
                    <dd className="text-text-h">{property.zone}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted text-[12px]">{t('property.detail.areaLabel')}</dt>
                    <dd className="text-text-h">{property.area} m²</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted text-[12px]">{t('property.detail.roomsLabel')}</dt>
                    <dd className="text-text-h">{property.rooms || '—'}</dd>
                  </div>
                  {property.priceEur > 0 && (
                    <div>
                      <dt className="text-text-muted text-[12px]">{t('property.detail.priceLabel')}</dt>
                      <dd className="text-text-h font-semibold">€{property.priceEur.toLocaleString('ro-MD')}</dd>
                    </div>
                  )}
                  {property.monthlyRentEur && property.monthlyRentEur > 0 && (
                    <div>
                      <dt className="text-text-muted text-[12px]">{t('property.detail.monthlyRentLabel')}</dt>
                      <dd className="text-text-h font-semibold">
                        €{property.monthlyRentEur.toLocaleString('ro-MD')}
                        <span className="text-text-secondary text-[12px] ml-1">/{t('landlord.month')}</span>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-text-muted text-[12px] inline-flex items-center gap-1">
                      {t('property.detail.listingTypeLabel')}
                      {property.listingType === 'both' && (
                        <InfoTooltip
                          label={t('property.listingType.both')}
                          body={t('property.listingType.bothHelp')}
                        />
                      )}
                    </dt>
                    <dd>
                      <Badge
                        variant={property.listingType === 'sale' ? 'info' : property.listingType === 'rent' ? 'success' : 'warning'}
                        size="xs"
                      >
                        {t(`property.listingType.${property.listingType}`)}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text-muted text-[12px]">{t('property.detail.agentLabel')}</dt>
                    <dd className="text-text-h">{agent.name}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted text-[12px]">{t('property.detail.addedLabel')}</dt>
                    <dd className="text-text-h">{property.daysOnMarket} zile</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          <aside className="flex flex-col gap-sp3">
            <Card variant="elevated" accentTop>
              <CardHeader>
                <CardTitle className="text-[16px]">{t('property.detail.linkTitle')}</CardTitle>
                <CardDescription>{t('property.detail.linkDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-sp2">
                <code className="block font-mono text-[11px] text-gold bg-navy-deep border border-border rounded-md px-sp2 py-sp2 break-all">
                  {publicLink}
                </code>
                <a
                  href={publicLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-9 items-center justify-center px-sp3 rounded-md border border-border-light text-[13px] text-text-h hover:bg-navy-hover transition-colors duration-fast"
                >
                  {t('property.detail.openLink')} ↗
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-sp1">
                  <CardTitle className="text-[16px]">{t('property.detail.interestTitle')}</CardTitle>
                  <InfoTooltip
                    label={t('property.detail.interestTitle')}
                    body={t('property.detail.interestDesc')}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[28px] font-display text-gold leading-none">{8 + (property.daysOnMarket % 7)}</p>
                <p className="text-[12px] text-text-secondary mt-sp1">clienți · ultimele 7 zile</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[16px]">{t('property.detail.actionsTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-sp2">
                <Button variant="primary" onClick={() => setShowingOpen(true)}>
                  {t('property.detail.scheduleCta')}
                </Button>
                <a
                  href={publicLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-10 items-center justify-center px-sp3 rounded-md bg-transparent text-text-h border border-border-light text-[14px] hover:bg-navy-hover transition-colors"
                >
                  {t('property.detail.shareCta')}
                </a>
                <Button variant="ghost">{t('property.detail.editCta')}</Button>
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>

      <ShowingModal
        open={showingOpen}
        onClose={() => setShowingOpen(false)}
        leadId={sampleLead.id}
        propertyId={property.id}
        agentId={agents[0].id}
      />
    </>
  );
}
