'use client';

// M0.S7 · /cabinet/agent · personal cabinet — avatar + bio + specialty + stats + contact.

import { useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AgentGoalsPanel, ValuePropositionPanel, AlumniPanel } from '@/components/cabinet/growth-panels';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { MetricPill } from '@/components/ui/score-badge';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { agents, deals } from '@/lib/mock';
import { AgentRankBadge } from '@/components/agents/rank-badge';
import { WorkspaceDirectionSelector } from '@/components/cabinet/workspace-direction-selector';
import { cn } from '@/lib/utils';

type Tab = 'summary' | 'growth' | 'history' | 'preferences' | 'documents';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function CabinetAgentPage() {
  const { t } = useT();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('summary');
  const me = agents[0];
  const myDealsClosed = deals.filter((d) => d.agentId === me.id && d.stage === 'won');

  // Mock-only enrichment fields. M1.S5 will source these from apps/api/users (extended schema).
  const specialty = ['Centru', 'Botanica', 'Apartament', 'Casă'];
  const ratingValue = 4.8;
  const ratingReviews = 32;
  const lifetimeDeals = myDealsClosed.length + 47;

  function priorityTone(v: number): 'positive' | 'neutral' | 'warning' {
    if (v >= 0.75) return 'positive';
    if (v >= 0.55) return 'neutral';
    return 'warning';
  }
  function priorityDots(v: number): string {
    if (v >= 0.75) return '●●●';
    if (v >= 0.55) return '●●○';
    if (v >= 0.35) return '●○○';
    return '○○○';
  }

  return (
    <>
      <SiteNav active="/cabinet/agent" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-6xl mx-auto flex flex-col gap-sp4">
        {/* Hero card: avatar + name + bio + contact CTAs */}
        <Card variant="elevated" accentTop>
          <CardContent className="pt-sp4 flex flex-col md:flex-row gap-sp4 items-start">
            <div
              role="img"
              aria-label={t('cabinetExtras.agent.bioTitle')}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0"
            >
              <span className="font-display text-[36px] text-navy-deep">{initials(me.name)}</span>
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-sp2">
              <div>
                <p className="label-mono text-gold">{t('cabinet.agent.moduleLabel')}</p>
                <div className="flex items-center gap-sp2 mt-sp1 flex-wrap">
                  <h1 className="text-[28px]">{me.name}</h1>
                  <AgentRankBadge agent={me} size="sm" />
                </div>
                <p className="text-[13px] text-text-secondary mt-sp1">
                  {me.id} · {Math.round(me.tenure / 30)} {t('cabinet.agent.tabs.summary') === 'Sumar' ? 'luni de echipă' : 'мес. в команде'}
                </p>
              </div>
              <p className="text-[13px] text-text-secondary">{t('cabinetExtras.agent.bioPlaceholder')}</p>
              <div className="flex flex-wrap items-center gap-sp2">
                <Button size="sm">{t('cabinetExtras.agent.callCta')}</Button>
                <Button size="sm" variant="secondary">{t('cabinetExtras.agent.messageCta')}</Button>
                <Button size="sm" variant="ghost">{t('cabinetExtras.agent.shareProfileCta')}</Button>
              </div>
            </div>
            <div className="flex flex-col gap-sp2 text-right items-end">
              <div className="flex items-center gap-sp1">
                <span className="font-display text-[24px] text-gold">{ratingValue}</span>
                <span className="text-[14px] text-text-muted">/ 5</span>
                <InfoTooltip label={t('cabinetExtras.agent.ratingTitle')} body={t('cabinetExtras.agent.ratingHelp')} />
              </div>
              <p className="text-[11px] text-text-muted">{t('cabinetExtras.agent.ratingReviews', { n: ratingReviews })}</p>
              <div className="text-right mt-sp2">
                <p className="font-display text-[24px] text-text-h">{lifetimeDeals}</p>
                <div className="inline-flex items-center gap-sp1">
                  <p className="text-[11px] text-text-muted">{t('cabinetExtras.agent.lifetimeTitle')}</p>
                  <InfoTooltip label={t('cabinetExtras.agent.lifetimeTitle')} body={t('cabinetExtras.agent.lifetimeHelp')} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialty tags */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-sp1">
              <CardTitle className="text-[16px]">{t('cabinetExtras.agent.specialtyTitle')}</CardTitle>
              <InfoTooltip
                label={t('cabinetExtras.agent.specialtyTitle')}
                body={t('cabinetExtras.agent.specialtyHelp')}
              />
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-sp2">
            {specialty.map((s) => (
              <Badge key={s} variant="info" size="sm">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <nav
          role="tablist"
          aria-label={t('cabinet.agent.title')}
          className="flex items-center gap-1 rounded-md border border-border p-1 bg-navy-deep self-start flex-wrap"
        >
          {(['summary', 'growth', 'history', 'preferences', 'documents'] as Tab[]).map((k) => (
            <button
              key={k}
              role="tab"
              type="button"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={cn(
                'px-sp3 py-1 text-[12px] rounded transition-colors duration-fast',
                tab === k
                  ? 'bg-gold/10 text-gold'
                  : 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
              )}
            >
              {t(`cabinet.agent.tabs.${k}`)}
            </button>
          ))}
        </nav>

        {tab === 'summary' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t('cabinet.agent.personalTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-sp3 text-[13px]">
                  <div>
                    <dt className="text-text-muted text-[12px]">{t('cabinet.agent.fullName')}</dt>
                    <dd className="text-text-h">{me.name}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted text-[12px]">{t('cabinet.agent.email')}</dt>
                    <dd className="text-text-h">a.caraman@revyx.demo</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted text-[12px]">{t('cabinet.agent.phone')}</dt>
                    <dd className="text-text-h">+373 68 123 456</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted text-[12px]">{t('cabinet.agent.languagesLabel')}</dt>
                    <dd className="text-text-h">RO · RU · EN</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted text-[12px]">{t('cabinet.agent.agentSinceLabel')}</dt>
                    <dd className="text-text-h">2024-05-15</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card variant="elevated" accentTop>
              <CardHeader>
                <div className="flex items-center gap-sp1">
                  <CardTitle className="text-[16px]">{t('cabinet.agent.performanceTitle')}</CardTitle>
                  <InfoTooltip
                    label={t('cabinet.agent.performanceTitle')}
                    body={t('cabinet.agent.performanceHelp')}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-sp2">
                <MetricPill
                  label={t('dashboard.blocks.perfApsLabel')}
                  display={priorityDots(me.aps)}
                  tone={priorityTone(me.aps)}
                />
                <MetricPill
                  label={t('dashboard.blocks.perfTrustLabel')}
                  display={priorityDots(me.trust)}
                  tone={priorityTone(me.trust)}
                />
                {/* ★ AGI Layer — PKI (Promise Keeping Index) BRD §18.1 */}
                <MetricPill
                  label={t('cabinet.agent.pkiLabel')}
                  display={priorityDots(0.82)}
                  tone={priorityTone(0.82)}
                />
                <MetricPill
                  label={t('dashboard.blocks.perfClosedLabel')}
                  display={String(me.closedDeals30d)}
                  tone={me.closedDeals30d >= 5 ? 'positive' : 'neutral'}
                />
                <MetricPill
                  label={t('dashboard.blocks.perfSlotsLabel')}
                  display={`${me.activeTasks} / 3`}
                  tone={me.activeTasks >= 3 ? 'warning' : 'positive'}
                />
              </CardContent>
            </Card>
          </section>
        )}

        {/* ★ Val 4 AGI §18.2/§18.5/§18.6 — dezvoltarea agentului */}
        {tab === 'growth' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-sp3">
            <AgentGoalsPanel agent={me} />
            <ValuePropositionPanel agent={me} />
            <div className="lg:col-span-2">
              <AlumniPanel agent={me} />
            </div>
          </section>
        )}

        {tab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('cabinet.agent.historyTitle')}</CardTitle>
              <CardDescription>{myDealsClosed.length}</CardDescription>
            </CardHeader>
            <CardContent>
              {myDealsClosed.length === 0 ? (
                <p className="text-text-muted text-[12px]">{t('cabinet.agent.historyEmpty')}</p>
              ) : (
                <ul className="flex flex-col gap-sp1 text-[13px]">
                  {myDealsClosed.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center justify-between border border-border rounded-md px-sp3 py-sp2"
                    >
                      <span className="text-text-h">
                        <span className="font-mono text-text-secondary text-[11px] mr-sp1">{d.id}</span>
                        {t(`deal.stages.${d.stage}`)}
                      </span>
                      <span className="font-mono text-gold">
                        €{d.commissionEur.toLocaleString('ro-MD')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {tab === 'preferences' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('cabinet.agent.preferencesTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-sp3"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast({ variant: 'success', title: t('settings.saveOk') });
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-sp3">
                  <Input
                    name="outOfOffice"
                    type="date"
                    label={t('cabinet.agent.outOfOfficeLabel')}
                    hint={t('cabinet.agent.outOfOfficeHelp')}
                  />
                  <Input
                    name="calendarSync"
                    placeholder="user@gmail.com"
                    label={t('cabinet.agent.calendarSyncLabel')}
                    hint={t('cabinet.agent.calendarSyncHelp')}
                  />
                </div>
                <div className="flex items-center justify-end gap-sp2 pt-sp2 border-t border-border">
                  <Button type="submit">{t('cabinet.agent.savePreferences')}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {tab === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('cabinet.agent.tabs.documents')}</CardTitle>
              <CardDescription>—</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-muted text-[12px]">{t('cabinet.agent.historyEmpty')}</p>
            </CardContent>
          </Card>
        )}

        {/* ★ AGI Layer — Obiective lunare (agent_goals entity BRD §18.2) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-sp1">
              <CardTitle className="text-[16px]">{t('cabinet.agent.goalsTitle')}</CardTitle>
              <InfoTooltip label={t('cabinet.agent.goalsTitle')} body={t('cabinet.agent.goalsHelp')} />
            </div>
            <CardDescription className="text-[11px]">{t('cabinet.agent.goalsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-sp3">
              {/* Tranzacții */}
              <div className="flex flex-col gap-sp1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-text-secondary">{t('cabinet.agent.goalDeals')}</span>
                  <span className="font-mono text-gold">{me.closedDeals30d} / 5</span>
                </div>
                <div className="h-1.5 rounded-full bg-navy-hover overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{ width: `${Math.min(100, (me.closedDeals30d / 5) * 100)}%` }}
                  />
                </div>
              </div>
              {/* APS target */}
              <div className="flex flex-col gap-sp1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-text-secondary">{t('cabinet.agent.goalAps')}</span>
                  <span className="font-mono text-gold">{priorityDots(me.aps)} / ●●●</span>
                </div>
                <div className="h-1.5 rounded-full bg-navy-hover overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{ width: `${Math.min(100, me.aps * 100)}%` }}
                  />
                </div>
              </div>
              {/* Comision estimat */}
              <div className="flex flex-col gap-sp1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-text-secondary">{t('cabinet.agent.goalCommission')}</span>
                  <span className="font-mono text-gold">
                    €{(me.closedDeals30d * 1200).toLocaleString('ro-MD')} / €6.000
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-navy-hover overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{ width: `${Math.min(100, (me.closedDeals30d * 1200 / 6000) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <WorkspaceDirectionSelector scope="agent" />
      </main>
    </>
  );
}
