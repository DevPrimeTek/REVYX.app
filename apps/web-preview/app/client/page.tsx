'use client';

// M0.S8 · /client · portal client (buyer/seller) — vede statusul tranzacției lui simplificat.
// În demo, alegem un deal "în notariat" și un deal "câștigat" pentru a arăta ambele situații.

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { deals, leadsById, propertiesById, agents } from '@/lib/mock';
import { useClosure } from '@/lib/closure-store';
import { useShowings } from '@/lib/showing-store';

function fmtDate(iso: string | null, locale: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'ro-RO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function ClientPortalInner() {
  const { t, locale } = useT();
  const { toast } = useToast();
  const sp = useSearchParams();
  const dealIdParam = sp?.get('dealId');

  // Client cabinet always shows a deal in closing/won or negotiation as the "my deal" perspective.
  const myDeal = useMemo(() => {
    if (dealIdParam) {
      const d = deals.find((x) => x.id === dealIdParam);
      if (d) return d;
    }
    return (
      deals.find((d) => d.stage === 'closing') ??
      deals.find((d) => d.stage === 'negotiation') ??
      deals[0]
    );
  }, [dealIdParam]);

  const lead = leadsById.get(myDeal.leadId);
  const property = propertiesById.get(myDeal.propertyId);
  const closure = useClosure(myDeal.id);
  const showings = useShowings().filter(
    (s) => s.leadId === myDeal.leadId && s.propertyId === myDeal.propertyId,
  );

  const [signing, setSigning] = useState(false);

  function eSign() {
    setSigning(true);
    setTimeout(() => {
      toast({
        variant: 'success',
        title: t('client.toastSigned'),
        description: t('client.toastSignedDesc'),
      });
      setSigning(false);
    }, 1200);
  }

  if (!lead || !property) {
    return (
      <main className="px-sp4 py-sp8 max-w-3xl mx-auto text-center">
        <p className="text-text-muted">{t('client.noActiveDeal')}</p>
      </main>
    );
  }

  const milestones = [
    {
      key: 'lead',
      title: t('client.timeline.lead'),
      desc: t('client.timeline.leadDesc'),
      done: true,
    },
    {
      key: 'showing',
      title: t('client.timeline.showing'),
      desc: t('client.timeline.showingDesc'),
      done: showings.some((s) => s.status === 'ATTENDED'),
    },
    {
      key: 'offer',
      title: t('client.timeline.offer'),
      desc: t('client.timeline.offerDesc'),
      done: ['negotiation', 'closing', 'won'].includes(myDeal.stage),
    },
    {
      key: 'closing',
      title: t('client.timeline.closing'),
      desc: t('client.timeline.closingDesc'),
      done: ['closing', 'won'].includes(myDeal.stage),
    },
    {
      key: 'notary',
      title: t('client.timeline.notary'),
      desc: t('client.timeline.notaryDesc'),
      done: closure.notarizedAt !== null,
    },
    {
      key: 'cadastre',
      title: t('client.timeline.cadastre'),
      desc: t('client.timeline.cadastreDesc'),
      done: closure.cadastreRegisteredAt !== null,
    },
  ];

  return (
    <main id="main" className="min-h-screen bg-navy-deep text-text-h">
      <header className="border-b border-border bg-navy-card px-sp4 py-sp3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-sp3">
          <div className="flex items-center gap-sp2">
            <Link href="/" className="font-display text-[22px] tracking-wide text-gold">
              REVYX
            </Link>
            <span className="badge-mono text-text-muted hidden md:inline">{t('client.portalBadge')}</span>
          </div>
          <p className="text-[12px] text-text-secondary">
            {t('client.welcome', { name: lead.name })}
          </p>
        </div>
      </header>

      <div className="px-sp4 py-sp4 lg:px-sp6 max-w-5xl mx-auto flex flex-col gap-sp4">
        <div>
          <p className="label-mono text-gold">{t('client.moduleLabel')}</p>
          <h1 className="text-[28px] mt-sp1">{t('client.title')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">{t('client.subtitle')}</p>
        </div>

        <Card variant="elevated" accentTop>
          <CardHeader>
            <CardTitle>{property.addr}</CardTitle>
            <CardDescription>
              {property.city}, {property.zone} · {property.area} m² · {property.rooms} {t('property.rooms')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-sp3 text-[13px]">
              <div>
                <p className="text-text-muted text-[11px]">{t('client.priceLabel')}</p>
                <p className="text-gold text-[22px] font-display">€{property.priceEur.toLocaleString('ro-MD')}</p>
              </div>
              <div>
                <p className="text-text-muted text-[11px]">{t('client.agentLabel')}</p>
                <p className="text-text-h">{agents[0].name}</p>
                <p className="text-text-muted text-[11px]">{agents[0].name.toLowerCase().replace(' ', '.')}@revyx.app</p>
              </div>
              <div>
                <p className="text-text-muted text-[11px]">{t('client.statusLabel')}</p>
                <Badge variant={myDeal.stage === 'won' ? 'success' : 'info'} size="sm">
                  {t(`deal.stages.${myDeal.stage}`)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('client.timelineTitle')}</CardTitle>
            <CardDescription>{t('client.timelineDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col">
              {milestones.map((m, i) => {
                const last = i === milestones.length - 1;
                return (
                  <li key={m.key} className="relative flex gap-sp3">
                    <div className="flex flex-col items-center">
                      <span
                        className={
                          'h-7 w-7 rounded-full border flex items-center justify-center text-[12px] font-mono shrink-0 ' +
                          (m.done
                            ? 'bg-status-green/20 border-status-green text-status-green'
                            : 'bg-navy-deep border-border text-text-muted')
                        }
                        aria-hidden
                      >
                        {m.done ? '✓' : i + 1}
                      </span>
                      {!last && (
                        <span
                          className={'w-px flex-1 my-sp1 ' + (m.done ? 'bg-status-green/60' : 'bg-border')}
                        />
                      )}
                    </div>
                    <div className={'flex-1 pb-sp4 ' + (last ? 'pb-0' : '')}>
                      <p className={'text-[13px] font-semibold ' + (m.done ? 'text-text-h' : 'text-text-secondary')}>
                        {m.title}
                      </p>
                      <p className="text-[12px] text-text-muted">{m.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        {showings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('client.showingsTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-sp2 text-[13px]">
                {showings.map((s) => (
                  <li key={s.id} className="border border-border rounded-md px-sp3 py-sp2 bg-navy-deep">
                    <p className="text-text-h">{fmtDate(s.scheduledAt, locale)}</p>
                    <p className="text-text-muted text-[12px]">
                      {t(`showing.status.${s.status}`)} · {s.durationMin} {t('showing.minutes')}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {closure.phase === 'NOTARY_SCHEDULED' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('client.signActTitle')}</CardTitle>
              <CardDescription>{t('client.signActDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              <p className="text-[13px] text-text-secondary">
                {closure.notaryName} · {fmtDate(closure.notaryScheduledAt, locale)}
              </p>
              <Button onClick={eSign} loading={signing} className="self-start">
                {t('client.signCta')}
              </Button>
              <p className="text-[11px] text-text-muted">{t('client.signNotice')}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t('client.gdprTitle')}</CardTitle>
            <CardDescription>{t('client.gdprDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-sp2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                toast({ variant: 'info', title: t('client.toastDsr'), description: t('client.toastDsrDesc') })
              }
              className="self-start"
            >
              {t('client.dsrExport')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                toast({
                  variant: 'warning',
                  title: t('client.toastErase'),
                  description: t('client.toastEraseDesc'),
                })
              }
              className="self-start"
            >
              {t('client.requestErasure')}
            </Button>
          </CardContent>
        </Card>

        <p className="text-[11px] text-text-muted text-center">
          REVYX · {t('client.footerNotice')}
        </p>
      </div>
    </main>
  );
}

export default function ClientPortalPage() {
  return (
    <Suspense fallback={null}>
      <ClientPortalInner />
    </Suspense>
  );
}
