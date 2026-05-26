'use client';

// M0.S8 · Closure wizard — 6 fază pentru deal-uri în notariat/câștigat.
// Phases: STARTED → AVANS_PAID → FINANCING → NOTARY_SCHEDULED → NOTARIZED → CADASTRE_REGISTERED.

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Stepper, type Step } from '@/components/ui/stepper';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useClosure, useClosureActions } from '@/lib/closure-store';
import type { ClosurePhase, Deal } from '@/lib/mock';

const PHASE_ORDER: ClosurePhase[] = [
  'STARTED',
  'AVANS_PAID',
  'FINANCING',
  'NOTARY_SCHEDULED',
  'NOTARIZED',
  'CADASTRE_REGISTERED',
];

function phaseStatus(current: ClosurePhase, target: ClosurePhase): Step['status'] {
  const cur = PHASE_ORDER.indexOf(current);
  const tgt = PHASE_ORDER.indexOf(target);
  if (cur === -1) return 'todo';
  if (tgt < cur) return 'done';
  if (tgt === cur) return 'active';
  return 'todo';
}

function fmtDate(iso: string | null, locale: string): string {
  if (!iso) return '—';
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

export function ClosureWizard({ deal }: { deal: Deal }) {
  const { t, locale } = useT();
  const { toast } = useToast();
  const c = useClosure(deal.id);
  const { patch, advance } = useClosureActions();

  // Local form state for each phase input.
  const [avansEur, setAvansEur] = useState<number>(c.avansEur ?? Math.round(deal.commissionEur * 0.5));
  const [financingBank, setFinancingBank] = useState<string>(c.financingBank ?? 'Moldindconbank');
  const [notaryName, setNotaryName] = useState<string>(c.notaryName ?? 'Notar public Doina Bordea');
  const [notaryDate, setNotaryDate] = useState<string>(
    c.notaryScheduledAt ? c.notaryScheduledAt.slice(0, 10) : '',
  );
  const [notaryAct, setNotaryAct] = useState<string>(c.notaryActNumber ?? '');
  const [cadastreReg, setCadastreReg] = useState<string>(c.cadastreRegNumber ?? '');
  const [npsScore, setNpsScore] = useState<number>(c.npsScore ?? 0);
  const [npsComment, setNpsComment] = useState<string>(c.npsComment ?? '');

  function markAvansPaid() {
    patch(deal.id, {
      phase: 'AVANS_PAID',
      avansEur,
      avansPaidAt: new Date().toISOString(),
    });
    toast({ variant: 'success', title: t('closure.toastAvans') });
  }
  function markFinancing(status: 'APPROVED' | 'REJECTED' | 'PENDING') {
    if (status === 'APPROVED') {
      patch(deal.id, { phase: 'FINANCING', financingStatus: status, financingBank });
      toast({ variant: 'success', title: t('closure.toastFinancingOk') });
    } else if (status === 'PENDING') {
      patch(deal.id, { financingStatus: status, financingBank });
      toast({ variant: 'info', title: t('closure.toastFinancingPending') });
    } else {
      patch(deal.id, { financingStatus: status });
      toast({ variant: 'warning', title: t('closure.toastFinancingNo') });
    }
  }
  function scheduleNotary() {
    if (!notaryDate) {
      toast({ variant: 'warning', title: t('closure.toastNeedDate') });
      return;
    }
    patch(deal.id, {
      phase: 'NOTARY_SCHEDULED',
      notaryName,
      notaryScheduledAt: new Date(`${notaryDate}T11:00:00`).toISOString(),
    });
    toast({ variant: 'success', title: t('closure.toastNotaryScheduled') });
  }
  function signNotary() {
    if (!notaryAct.trim()) {
      toast({ variant: 'warning', title: t('closure.toastNeedActNo') });
      return;
    }
    patch(deal.id, {
      phase: 'NOTARIZED',
      notaryActNumber: notaryAct,
      notarizedAt: new Date().toISOString(),
    });
    toast({ variant: 'success', title: t('closure.toastNotarized') });
  }
  function registerCadastre() {
    if (!cadastreReg.trim()) {
      toast({ variant: 'warning', title: t('closure.toastNeedCadNo') });
      return;
    }
    patch(deal.id, {
      phase: 'CADASTRE_REGISTERED',
      cadastreRegNumber: cadastreReg,
      cadastreRegisteredAt: new Date().toISOString(),
    });
    toast({
      variant: 'success',
      title: t('closure.toastCadastre'),
      description: t('closure.toastCadastreDesc'),
    });
  }
  function submitNps() {
    patch(deal.id, {
      npsScore,
      npsComment,
      npsSubmittedAt: new Date().toISOString(),
    });
    toast({ variant: 'success', title: t('closure.toastNps') });
  }
  function startClosure() {
    advance(deal.id, 'STARTED');
    toast({ variant: 'info', title: t('closure.toastStarted') });
  }

  const steps: Step[] = [
    {
      id: 'started',
      label: t('closure.phase.started'),
      description: t('closure.phaseDesc.started'),
      status: phaseStatus(c.phase, 'STARTED'),
      content:
        c.phase === 'NOT_STARTED' ? (
          <Button size="sm" onClick={startClosure}>
            {t('closure.startCta')}
          </Button>
        ) : (
          <p className="text-[12px] text-text-muted">{t('closure.startedDone')}</p>
        ),
    },
    {
      id: 'avans',
      label: t('closure.phase.avans'),
      description: t('closure.phaseDesc.avans'),
      status: phaseStatus(c.phase, 'AVANS_PAID'),
      content:
        c.phase === 'STARTED' ? (
          <div className="flex items-end gap-sp2 flex-wrap">
            <Input
              type="number"
              label={t('closure.avansLabel')}
              value={avansEur}
              onChange={(e) => setAvansEur(Number(e.target.value) || 0)}
              className="w-32"
              min={0}
            />
            <Button size="sm" onClick={markAvansPaid}>
              {t('closure.markAvansPaid')}
            </Button>
          </div>
        ) : c.avansPaidAt ? (
          <p className="text-[12px] text-text-secondary">
            {t('closure.avansDone', {
              amount: `€${(c.avansEur ?? 0).toLocaleString('ro-MD')}`,
              when: fmtDate(c.avansPaidAt, locale),
            })}
          </p>
        ) : null,
    },
    {
      id: 'financing',
      label: t('closure.phase.financing'),
      description: t('closure.phaseDesc.financing'),
      status: phaseStatus(c.phase, 'FINANCING'),
      content:
        c.phase === 'AVANS_PAID' ? (
          <div className="flex flex-col gap-sp2">
            <Input
              label={t('closure.financingBankLabel')}
              value={financingBank}
              onChange={(e) => setFinancingBank(e.target.value)}
              hint={t('closure.financingBankHint')}
            />
            <div className="flex items-center gap-sp2 flex-wrap">
              <Button size="sm" onClick={() => markFinancing('APPROVED')}>
                {t('closure.financingApprove')}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => markFinancing('PENDING')}>
                {t('closure.financingPending')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => markFinancing('REJECTED')}>
                {t('closure.financingReject')}
              </Button>
            </div>
          </div>
        ) : c.financingStatus !== 'NONE' ? (
          <p className="text-[12px] text-text-secondary">
            {c.financingBank} · <Badge
              variant={c.financingStatus === 'APPROVED' ? 'success' : c.financingStatus === 'PENDING' ? 'info' : 'critical'}
              size="xs"
            >{t(`closure.financingStatus.${c.financingStatus}`)}</Badge>
          </p>
        ) : null,
    },
    {
      id: 'notary',
      label: t('closure.phase.notaryScheduled'),
      description: t('closure.phaseDesc.notaryScheduled'),
      status: phaseStatus(c.phase, 'NOTARY_SCHEDULED'),
      content:
        c.phase === 'FINANCING' ? (
          <div className="flex flex-col gap-sp2 sm:flex-row sm:items-end">
            <Input
              label={t('closure.notaryNameLabel')}
              value={notaryName}
              onChange={(e) => setNotaryName(e.target.value)}
              className="flex-1"
            />
            <Input
              type="date"
              label={t('closure.notaryDateLabel')}
              value={notaryDate}
              onChange={(e) => setNotaryDate(e.target.value)}
            />
            <Button size="sm" onClick={scheduleNotary}>
              {t('closure.notaryScheduleCta')}
            </Button>
          </div>
        ) : c.notaryName ? (
          <p className="text-[12px] text-text-secondary">
            {c.notaryName} · {fmtDate(c.notaryScheduledAt, locale)}
          </p>
        ) : null,
    },
    {
      id: 'notarized',
      label: t('closure.phase.notarized'),
      description: t('closure.phaseDesc.notarized'),
      status: phaseStatus(c.phase, 'NOTARIZED'),
      content:
        c.phase === 'NOTARY_SCHEDULED' ? (
          <div className="flex items-end gap-sp2 flex-wrap">
            <Input
              label={t('closure.actNumberLabel')}
              value={notaryAct}
              onChange={(e) => setNotaryAct(e.target.value)}
              placeholder="NA-2026-04217"
              className="w-48"
            />
            <Button size="sm" onClick={signNotary}>
              {t('closure.signCta')}
            </Button>
          </div>
        ) : c.notaryActNumber ? (
          <p className="text-[12px] text-text-secondary">
            {t('closure.actSigned', {
              actNo: c.notaryActNumber,
              when: fmtDate(c.notarizedAt, locale),
            })}
          </p>
        ) : null,
    },
    {
      id: 'cadastre',
      label: t('closure.phase.cadastre'),
      description: t('closure.phaseDesc.cadastre'),
      status: phaseStatus(c.phase, 'CADASTRE_REGISTERED'),
      content:
        c.phase === 'NOTARIZED' ? (
          <div className="flex items-end gap-sp2 flex-wrap">
            <Input
              label={t('closure.cadastreLabel')}
              value={cadastreReg}
              onChange={(e) => setCadastreReg(e.target.value)}
              placeholder="CR-9384-2026"
              className="w-48"
            />
            <Button size="sm" onClick={registerCadastre}>
              {t('closure.registerCta')}
            </Button>
          </div>
        ) : c.cadastreRegNumber ? (
          <p className="text-[12px] text-text-secondary">
            {t('closure.cadastreDone', {
              regNo: c.cadastreRegNumber,
              when: fmtDate(c.cadastreRegisteredAt, locale),
            })}
          </p>
        ) : null,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('closure.wizardTitle')}</CardTitle>
        <CardDescription>{t('closure.wizardDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Stepper steps={steps} />

        {c.phase === 'CADASTRE_REGISTERED' && (
          <section className="mt-sp4 border-t border-border pt-sp3">
            <h4 className="text-[14px] font-semibold text-text-h">{t('closure.npsTitle')}</h4>
            <p className="text-[12px] text-text-secondary mt-sp1">{t('closure.npsDesc')}</p>
            {c.npsScore !== null ? (
              <div className="mt-sp2 border border-status-green/30 bg-status-green/10 rounded-md px-sp3 py-sp2">
                <p className="text-[12px] text-text-h">
                  {t('closure.npsSubmitted', { score: c.npsScore })}
                </p>
                {c.npsComment && (
                  <p className="text-[12px] text-text-secondary italic mt-sp1">&ldquo;{c.npsComment}&rdquo;</p>
                )}
              </div>
            ) : (
              <div className="mt-sp2 flex flex-col gap-sp2">
                <div className="flex items-center gap-sp1 flex-wrap">
                  {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNpsScore(n)}
                      aria-pressed={npsScore === n}
                      className={
                        'h-9 w-9 rounded-md border text-[12px] transition-all cursor-pointer ' +
                        (npsScore === n
                          ? 'bg-gold/20 border-gold text-gold'
                          : 'bg-navy-deep border-border text-text-muted hover:border-border-light')
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <textarea
                  value={npsComment}
                  onChange={(e) => setNpsComment(e.target.value)}
                  rows={2}
                  placeholder={t('closure.npsCommentPlaceholder')}
                  className="w-full px-sp2 py-sp2 rounded-md bg-navy-deep border border-border text-[13px] text-text-h focus:border-gold focus:outline-none resize-y"
                />
                <Button size="sm" onClick={submitNps} className="self-start">
                  {t('closure.npsSubmit')}
                </Button>
              </div>
            )}
          </section>
        )}
      </CardContent>
    </Card>
  );
}
