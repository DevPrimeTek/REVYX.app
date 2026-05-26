'use client';

// M0.S8 · /notary · workspace pentru notar — vede tranzacții programate, semnează acte, înregistrează la cadastru.

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { buildSeedNotaryActs } from '@/lib/mock';
import { useClosure, useClosureActions } from '@/lib/closure-store';
import type { NotaryAct } from '@/lib/mock';

function fmtDate(iso: string | null, locale: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'ro-RO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function NotaryActRow({ act, locale }: { act: NotaryAct; locale: string }) {
  const { t } = useT();
  const { toast } = useToast();
  const closure = useClosure(act.dealId);
  const { patch } = useClosureActions();
  const [actNo, setActNo] = useState<string>(closure.notaryActNumber ?? act.actNumber ?? '');
  const [cadNo, setCadNo] = useState<string>(closure.cadastreRegNumber ?? act.cadastreRegNumber ?? '');

  const isSigned = closure.notarizedAt !== null || act.signedAt !== null;
  const isRegistered = closure.cadastreRegisteredAt !== null || act.cadastreRegNumber !== null;

  function sign() {
    if (!actNo.trim()) {
      toast({ variant: 'warning', title: t('notary.toastNeedNo') });
      return;
    }
    patch(act.dealId, {
      phase: 'NOTARIZED',
      notaryActNumber: actNo,
      notarizedAt: new Date().toISOString(),
    });
    toast({ variant: 'success', title: t('notary.toastSigned') });
  }

  function register() {
    if (!cadNo.trim()) {
      toast({ variant: 'warning', title: t('notary.toastNeedCadNo') });
      return;
    }
    patch(act.dealId, {
      phase: 'CADASTRE_REGISTERED',
      cadastreRegNumber: cadNo,
      cadastreRegisteredAt: new Date().toISOString(),
    });
    toast({ variant: 'success', title: t('notary.toastRegistered') });
  }

  return (
    <li className="border border-border rounded-md bg-navy-deep px-sp3 py-sp3 flex flex-col gap-sp2">
      <div className="flex items-start justify-between gap-sp2 flex-wrap">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-text-muted">
            {act.id} · <Link href={`/deals/${act.dealId}`} className="hover:text-gold">{act.dealId}</Link>
          </p>
          <p className="text-[15px] text-text-h font-semibold mt-sp1">{act.propertyAddr}</p>
          <p className="text-[12px] text-text-secondary mt-sp1">
            {t('notary.parties', { buyer: act.buyerName, seller: act.sellerName })}
          </p>
          <p className="text-[12px] text-text-secondary">
            {t('notary.scheduledAt')}: <span className="text-text-h">{fmtDate(act.scheduledAt, locale)}</span>
          </p>
          <p className="text-[12px] text-text-muted">€{act.amountEur.toLocaleString('ro-MD')}</p>
        </div>
        <Badge
          variant={isRegistered ? 'success' : isSigned ? 'info' : 'warning'}
          size="sm"
        >
          {isRegistered
            ? t('notary.statusRegistered')
            : isSigned
            ? t('notary.statusSigned')
            : t('notary.statusScheduled')}
        </Badge>
      </div>

      {!isSigned && (
        <div className="flex items-end gap-sp2 flex-wrap border-t border-border pt-sp2">
          <Input
            label={t('notary.actNoLabel')}
            value={actNo}
            onChange={(e) => setActNo(e.target.value)}
            placeholder="NA-2026-04217"
            className="w-48"
          />
          <Button size="sm" onClick={sign}>{t('notary.signCta')}</Button>
        </div>
      )}

      {isSigned && !isRegistered && (
        <div className="flex items-end gap-sp2 flex-wrap border-t border-border pt-sp2">
          <p className="text-[12px] text-text-secondary basis-full">
            {t('notary.actNoLabel')}: <span className="font-mono text-text-h">{actNo || act.actNumber}</span>
          </p>
          <Input
            label={t('notary.cadastreLabel')}
            value={cadNo}
            onChange={(e) => setCadNo(e.target.value)}
            placeholder="CR-9384-2026"
            className="w-48"
          />
          <Button size="sm" onClick={register}>{t('notary.registerCta')}</Button>
        </div>
      )}

      {isRegistered && (
        <div className="border-t border-border pt-sp2 flex flex-wrap gap-sp4 text-[12px]">
          <span>
            {t('notary.actNoLabel')}: <span className="font-mono text-text-h">{actNo || act.actNumber}</span>
          </span>
          <span>
            {t('notary.cadastreLabel')}: <span className="font-mono text-text-h">{cadNo || act.cadastreRegNumber}</span>
          </span>
        </div>
      )}
    </li>
  );
}

export default function NotaryPage() {
  const { t, locale } = useT();
  const acts = useMemo(() => buildSeedNotaryActs(), []);

  const scheduled = acts.filter((a) => !a.signedAt);
  const completed = acts.filter((a) => a.signedAt);

  return (
    <>
      <SiteNav active="/notary" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-5xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">{t('notary.moduleLabel')}</p>
          <h1 className="text-[28px] mt-sp1">{t('notary.title')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">{t('notary.subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-sp3">
          <Card>
            <CardHeader><CardTitle>{t('notary.kpiPending')}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-[32px] font-display text-gold">{scheduled.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('notary.kpiCompleted')}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-[32px] font-display text-gold">{completed.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('notary.kpiVolume')}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-[32px] font-display text-gold">
                €{(completed.reduce((s, a) => s + a.amountEur, 0) / 1000).toFixed(0)}k
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('notary.scheduledTitle')}</CardTitle>
            <CardDescription>{t('notary.scheduledDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {scheduled.length === 0 ? (
              <p className="text-text-muted text-[12px]">{t('notary.emptyScheduled')}</p>
            ) : (
              <ul className="flex flex-col gap-sp2">
                {scheduled.map((a) => (
                  <NotaryActRow key={a.id} act={a} locale={locale} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('notary.completedTitle')}</CardTitle>
            <CardDescription>{t('notary.completedDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-sp2">
              {completed.map((a) => (
                <NotaryActRow key={a.id} act={a} locale={locale} />
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
