'use client';

// M0.S2 + M0.S3 · J1 Lead detail wired to 100-lead mock · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S2/M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-04 + T-M0.S3-13

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LeadScoreBadge, ScorePill } from '@/components/ui/score-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { formatScore } from '@/lib/utils';
import { agents, leadsById, properties } from '@/lib/mock';

type Params = { params: { id: string } };

export default function LeadDetailPage({ params }: Params) {
  const router = useRouter();
  const { t } = useT();
  const { toast } = useToast();
  const lead = leadsById.get(params.id);

  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0].id);
  const baseLs = lead?.ls ?? 0.30;
  const [ls, setLs] = useState(baseLs);
  const [recomputing, setRecomputing] = useState(false);

  // Top-3 property matches: highest PS, slight LS coupling.
  const matches = useMemo(
    () => [...properties].sort((a, b) => b.ps - a.ps).slice(0, 3),
    []
  );

  function recomputeScore() {
    if (recomputing) return;
    setRecomputing(true);
    const target = Math.min(0.95, baseLs + 0.03 + Math.random() * 0.04);
    const steps = 18;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setLs((cur) => cur + (target - cur) / Math.max(1, steps - i));
      if (i >= steps) {
        clearInterval(id);
        setLs(target);
        setRecomputing(false);
        toast({
          variant: 'success',
          title: t('leadDetail.toastRecompute', { score: formatScore(target) }),
          description: t('leadDetail.toastRecomputeDesc'),
        });
      }
    }, 40);
  }

  function confirmAssign() {
    const agent = agents.find((a) => a.id === selectedAgent);
    setAssignOpen(false);
    toast({
      variant: 'success',
      title: t('leadDetail.toastAssign', { id: params.id, name: agent?.name ?? selectedAgent }),
      description: t('leadDetail.toastAssignDesc'),
      duration: 5000,
    });
    setTimeout(() => router.push('/dashboard'), 600);
  }

  if (!lead) {
    return (
      <>
        <SiteNav active="/leads" />
        <main id="main" className="px-sp4 py-sp8 max-w-3xl mx-auto text-center">
          <p className="label-mono text-gold">404</p>
          <h1 className="text-[28px] mt-sp2">Lead {params.id} inexistent.</h1>
          <p className="text-text-secondary mt-sp2">
            <Link href="/leads" className="text-gold hover:underline">← {t('leadDetail.breadcrumbQueue')}</Link>
          </p>
        </main>
      </>
    );
  }

  const agentSlotState = (a: typeof agents[number]) => {
    if (a.activeTasks >= 3) return 'busy';
    if (a.aps >= 0.80) return 'top';
    if (a.activeTasks === 0) return 'available';
    return 'good';
  };

  return (
    <>
      <SiteNav active="/leads" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary">
          <Link href="/leads" className="hover:text-text-h focus-visible:text-gold rounded-sm">
            {t('leadDetail.breadcrumbQueue')}
          </Link>
          <span className="mx-sp1 text-text-muted">/</span>
          <span className="text-text-h font-mono">{params.id}</span>
        </nav>

        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">{t('leadDetail.moduleLabel')}</p>
            <h1 className="text-[28px] mt-sp1">{lead.name}</h1>
            <div className="flex items-center gap-sp2 mt-sp2">
              <LeadScoreBadge ls={ls} />
              {lead.needsReview && <Badge variant="updated">{t('leadDetail.matchNeedsReview')}</Badge>}
              {recomputing && <Badge variant="info" size="xs">{t('leadDetail.recomputing')}</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-sp2 flex-wrap">
            <Button variant="ghost" onClick={recomputeScore} disabled={recomputing}>
              {t('leadDetail.recompute')}
            </Button>
            <Button variant="secondary">{t('leadDetail.whatsapp')}</Button>
            <Button onClick={() => setAssignOpen(true)}>{t('leadDetail.assignAgent')}</Button>
          </div>
        </header>

        {lead.needsReview && (
          <div
            className="bg-status-amber/10 border border-status-amber/30 rounded-lg px-sp3 py-sp2 text-[13px] text-text-h"
            dangerouslySetInnerHTML={{ __html: t('leadDetail.rematchBanner') }}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('leadDetail.title')}</CardTitle>
              <CardDescription>{t('leadDetail.gdprNote')} · {lead.createdAt}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-sp3 text-[13px]">
                <div>
                  <dt className="label-mono text-text-muted">{t('leadDetail.source')}</dt>
                  <dd className="text-text-h">{lead.source}</dd>
                </div>
                <div>
                  <dt className="label-mono text-text-muted">{t('leadDetail.budget')}</dt>
                  <dd className="text-text-h">
                    €{lead.budgetMin.toLocaleString('ro-MD')} – €{lead.budgetMax.toLocaleString('ro-MD')}
                  </dd>
                </div>
                <div>
                  <dt className="label-mono text-text-muted">{t('leadDetail.zone')}</dt>
                  <dd className="text-text-h">{lead.zone}</dd>
                </div>
                <div>
                  <dt className="label-mono text-text-muted">{t('leadDetail.rooms')}</dt>
                  <dd className="text-text-h">{lead.rooms}</dd>
                </div>
              </dl>

              <div className="mt-sp4 flex flex-wrap gap-sp3">
                <ScorePill label="LS" value={ls} />
                <ScorePill label="IS" value={lead.is} />
                <ScorePill label="Trust" value={0.71} />
                <ScorePill label="DP" value={Math.round((ls * 0.8) * 100) / 100} />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" accentTop>
            <CardHeader>
              <p className="label-mono text-gold">{t('leadDetail.matchModule')}</p>
              <CardTitle>{t('leadDetail.matchTitle')}</CardTitle>
              <CardDescription>{t('leadDetail.matchSubtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              {matches.map((p) => (
                <Link
                  key={p.id}
                  href="/properties"
                  className="flex items-start justify-between border border-border rounded-md px-sp2 py-sp2 transition-all duration-fast hover:border-gold/60 hover:bg-navy-hover hover:-translate-y-0.5 focus-visible:border-gold focus-visible:outline-none"
                >
                  <div>
                    <p className="font-mono text-[11px] text-text-secondary">{p.id}</p>
                    <p className="text-text-h text-[13px]">{p.addr}</p>
                  </div>
                  <span className="font-mono text-gold">{p.ps.toFixed(2)}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title={t('leadDetail.assignModalTitle', { id: params.id })}
        description={t('leadDetail.assignModalDesc')}
        size="md"
      >
        <fieldset className="flex flex-col gap-sp2">
          <legend className="sr-only">{t('leadDetail.assignAgent')}</legend>
          {agents.map((a) => {
            const state = agentSlotState(a);
            const disabled = state === 'busy';
            const checked = selectedAgent === a.id;
            return (
              <label
                key={a.id}
                className={
                  'flex items-center justify-between gap-sp3 border rounded-md px-sp3 py-sp2 transition-all cursor-pointer ' +
                  (disabled
                    ? 'border-border opacity-50 cursor-not-allowed'
                    : checked
                    ? 'border-gold bg-navy-hover'
                    : 'border-border hover:border-border-light hover:bg-navy-hover')
                }
              >
                <span className="flex items-center gap-sp2 min-w-0">
                  <input
                    type="radio"
                    name="agent"
                    value={a.id}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => setSelectedAgent(a.id)}
                    className="accent-gold"
                  />
                  <span className="flex flex-col">
                    <span className="text-text-h text-[13px]">{a.name}</span>
                    <span className="text-text-muted text-[11px] font-mono">
                      {a.id} · APS {formatScore(a.aps)} · {a.activeTasks}/3
                    </span>
                  </span>
                </span>
                <Badge
                  variant={
                    state === 'top'
                      ? 'success'
                      : state === 'good'
                      ? 'info'
                      : state === 'available'
                      ? 'updated'
                      : 'critical'
                  }
                  size="xs"
                >
                  {state === 'top'
                    ? t('leadDetail.agentStateTop')
                    : state === 'good'
                    ? t('leadDetail.agentStateGood')
                    : state === 'available'
                    ? t('leadDetail.agentStateAvailable')
                    : t('leadDetail.agentStateBusy')}
                </Badge>
              </label>
            );
          })}
        </fieldset>

        <div className="flex items-center justify-end gap-sp2 mt-sp4 pt-sp3 border-t border-border">
          <Button variant="ghost" onClick={() => setAssignOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={confirmAssign}>{t('common.confirm')}</Button>
        </div>
      </Modal>
    </>
  );
}
