'use client';

// M0.S8 · Deal detail — combină offer chain + closure wizard + showings + match reasoning.

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useT } from '@/components/i18n/provider';
import { OfferChain } from '@/components/offers/offer-chain';
import { ClosureWizard } from '@/components/deals/closure-wizard';
import { ShowingList } from '@/components/showings/showing-list';
import { ShowingModal } from '@/components/showings/showing-modal';
import { MatchReasoning } from '@/components/leads/match-reasoning';
import { agents, dealsById, leadsById, propertiesById } from '@/lib/mock';
import { useShowings } from '@/lib/showing-store';

type Params = { params: { id: string } };

export default function DealDetailPage({ params }: Params) {
  const { t, locale } = useT();
  const deal = dealsById.get(params.id);
  const showings = useShowings();
  const [showOpen, setShowOpen] = useState(false);

  const lead = deal ? leadsById.get(deal.leadId) : undefined;
  const property = deal ? propertiesById.get(deal.propertyId) : undefined;
  const me = agents[0];
  const dealShowings = useMemo(
    () => (deal ? showings.filter((s) => s.leadId === deal.leadId && s.propertyId === deal.propertyId) : []),
    [showings, deal],
  );

  if (!deal || !lead || !property) {
    return (
      <>
        <SiteNav active="/deals" />
        <main id="main" className="px-sp4 py-sp8 max-w-3xl mx-auto text-center">
          <p className="label-mono text-gold">404</p>
          <h1 className="text-[28px] mt-sp2">Tranzacția {params.id} nu există.</h1>
          <p className="text-text-secondary mt-sp2">
            <Link href="/deals" className="text-gold hover:underline">← {t('deal.title')}</Link>
          </p>
        </main>
      </>
    );
  }

  const stageVariant: Record<typeof deal.stage, 'info' | 'success' | 'warning'> = {
    discovery: 'info',
    qualified: 'info',
    offer: 'warning',
    negotiation: 'warning',
    closing: 'success',
    won: 'success',
  };

  return (
    <>
      <SiteNav active="/deals" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-6xl mx-auto flex flex-col gap-sp4">
        <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary">
          <Link href="/deals" className="hover:text-text-h">{t('deal.title')}</Link>
          <span className="mx-sp1 text-text-muted">/</span>
          <span className="text-text-h font-mono">{deal.id}</span>
        </nav>

        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div className="min-w-0">
            <p className="label-mono text-gold">{t('deal.moduleLabel')}</p>
            <h1 className="text-[28px] mt-sp1">
              {lead.name}
              <span className="text-text-muted text-[18px]"> · {property.addr}</span>
            </h1>
            <div className="flex items-center gap-sp2 mt-sp2">
              <Badge variant={stageVariant[deal.stage]} size="sm">
                {t(`deal.stages.${deal.stage}`)}
              </Badge>
              <span className="text-[12px] text-text-secondary">
                {t('deal.cardCommissionLabel')}: <span className="text-gold font-mono">€{deal.commissionEur.toLocaleString('ro-MD')}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-sp2 flex-wrap">
            <Button variant="secondary" onClick={() => setShowOpen(true)}>
              {t('showing.addCta')}
            </Button>
            <Link href={`/leads/${lead.id}`}>
              <Button variant="ghost">{t('dealDetail.openLead')}</Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('dealDetail.offerSection')}</CardTitle>
              <CardDescription>{t('dealDetail.offerSectionDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <OfferChain dealId={deal.id} currentAgentName={me.name} />
            </CardContent>
          </Card>
          <div className="flex flex-col gap-sp3">
            <MatchReasoning lead={lead} property={property} />
            <Card>
              <CardHeader>
                <CardTitle>{t('dealDetail.partiesTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-sp2 text-[12px]">
                <div>
                  <p className="text-text-muted">{t('dealDetail.buyerLabel')}</p>
                  <Link href={`/leads/${lead.id}`} className="text-text-h hover:text-gold">{lead.name}</Link>
                </div>
                <div>
                  <p className="text-text-muted">{t('dealDetail.propertyLabel')}</p>
                  <Link href={`/properties/${property.id}`} className="text-text-h hover:text-gold">{property.addr}</Link>
                </div>
                <div>
                  <p className="text-text-muted">{t('dealDetail.agentLabel')}</p>
                  <p className="text-text-h">{me.name}</p>
                </div>
                <div>
                  <p className="text-text-muted">{t('dealDetail.notaryLabel')}</p>
                  <Link href="/notary" className="text-text-h hover:text-gold">{t('dealDetail.openNotary')}</Link>
                </div>
                <div>
                  <p className="text-text-muted">{t('dealDetail.clientPortalLabel')}</p>
                  <Link href={`/client?dealId=${deal.id}`} className="text-text-h hover:text-gold">
                    {t('dealDetail.openClientPortal')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {(deal.stage === 'closing' || deal.stage === 'won' || deal.stage === 'negotiation') && (
          <ClosureWizard deal={deal} />
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t('dealDetail.showingsTitle')}</CardTitle>
            <CardDescription>{t('dealDetail.showingsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ShowingList showings={dealShowings} locale={locale} />
          </CardContent>
        </Card>
      </main>

      <ShowingModal
        open={showOpen}
        onClose={() => setShowOpen(false)}
        leadId={lead.id}
        propertyId={property.id}
        agentId={me.id}
      />
    </>
  );
}
