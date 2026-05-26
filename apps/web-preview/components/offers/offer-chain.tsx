'use client';

// M0.S8 · Offer chain — timeline of offers + counter-offers per deal.

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useOffers, useOfferActions } from '@/lib/offer-store';
import { OfferModal } from './offer-modal';
import type { Offer, OfferSide } from '@/lib/mock';

function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function sideLabel(side: OfferSide, t: (k: string) => string): string {
  return side === 'buyer' ? t('offer.side.buyer') : t('offer.side.seller');
}

function statusVariant(s: Offer['status']): 'success' | 'info' | 'warning' | 'critical' {
  switch (s) {
    case 'ACCEPTED':
      return 'success';
    case 'PENDING':
      return 'info';
    case 'COUNTER':
      return 'warning';
    case 'REJECTED':
    case 'EXPIRED':
      return 'critical';
  }
}

export function OfferChain({
  dealId,
  currentAgentName,
}: {
  dealId: string;
  currentAgentName: string;
}) {
  const { t, locale } = useT();
  const { toast } = useToast();
  const allOffers = useOffers();
  const { setStatus } = useOfferActions();
  const [modalParent, setModalParent] = useState<{ id: string | null; side: OfferSide } | null>(null);

  const offers = useMemo(
    () =>
      allOffers
        .filter((o) => o.dealId === dealId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [allOffers, dealId],
  );

  const lastOffer = offers[offers.length - 1] ?? null;
  const canRespond = lastOffer && lastOffer.status === 'PENDING';

  function accept(id: string) {
    setStatus(id, 'ACCEPTED');
    toast({
      variant: 'success',
      title: t('offer.toastAccepted'),
      description: t('offer.toastAcceptedDesc'),
    });
  }
  function reject(id: string) {
    setStatus(id, 'REJECTED');
    toast({ variant: 'info', title: t('offer.toastRejected') });
  }

  if (offers.length === 0) {
    return (
      <div className="flex flex-col gap-sp2 items-start">
        <p className="text-text-muted text-[12px]">{t('offer.emptyChain')}</p>
        <Button
          size="sm"
          onClick={() => setModalParent({ id: null, side: 'buyer' })}
        >
          {t('offer.firstOfferCta')}
        </Button>
        {modalParent && (
          <OfferModal
            open
            onClose={() => setModalParent(null)}
            dealId={dealId}
            parentId={modalParent.id}
            side={modalParent.side}
            currentAgentName={currentAgentName}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sp3">
      <ol className="flex flex-col gap-sp2">
        {offers.map((o, idx) => {
          const last = idx === offers.length - 1;
          return (
            <li
              key={o.id}
              className={
                'border rounded-md px-sp3 py-sp2 flex flex-col gap-sp2 sm:flex-row sm:items-start sm:justify-between ' +
                (last ? 'border-gold bg-navy-hover' : 'border-border bg-navy-deep')
              }
            >
              <div className="flex flex-col gap-sp1 min-w-0">
                <div className="flex items-center gap-sp2 flex-wrap">
                  <span className="font-mono text-[11px] text-text-muted">{o.id}</span>
                  <Badge variant={o.side === 'buyer' ? 'info' : 'updated'} size="xs">
                    {sideLabel(o.side, t)}
                  </Badge>
                  <Badge variant={statusVariant(o.status)} size="xs">
                    {t(`offer.status.${o.status}`)}
                  </Badge>
                  {o.needsManagerApproval && (
                    <Badge variant="warning" size="xs">
                      {t('offer.needsManager')}
                    </Badge>
                  )}
                </div>
                <p className="text-[18px] font-display text-gold">
                  €{o.amountEur.toLocaleString('ro-MD')}
                </p>
                <p className="text-[12px] text-text-secondary">{o.conditions}</p>
                <p className="text-[11px] text-text-muted">
                  {t('offer.metaLine', {
                    author: o.createdByName,
                    date: formatDate(o.createdAt, locale),
                  })}
                </p>
              </div>
              {last && o.status === 'PENDING' && (
                <div className="flex items-center gap-sp1 flex-wrap">
                  <Button size="sm" onClick={() => accept(o.id)}>
                    {t('offer.accept')}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setModalParent({
                        id: o.id,
                        side: o.side === 'buyer' ? 'seller' : 'buyer',
                      })
                    }
                  >
                    {t('offer.counter')}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => reject(o.id)}>
                    {t('offer.reject')}
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {!canRespond && lastOffer?.status === 'ACCEPTED' && (
        <div className="border border-status-green/30 bg-status-green/10 rounded-md px-sp3 py-sp2 text-[12px] text-text-h">
          {t('offer.acceptedBanner')}
        </div>
      )}

      {modalParent && (
        <OfferModal
          open
          onClose={() => setModalParent(null)}
          dealId={dealId}
          parentId={modalParent.id}
          side={modalParent.side}
          currentAgentName={currentAgentName}
        />
      )}
    </div>
  );
}
