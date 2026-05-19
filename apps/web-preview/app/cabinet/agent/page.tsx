'use client';

// M0.S6 · /cabinet/agent · personal cabinet for the logged-in agent.

import { useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { MetricPill } from '@/components/ui/score-badge';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { agents, deals } from '@/lib/mock';
import { cn } from '@/lib/utils';

type Tab = 'summary' | 'history' | 'preferences' | 'documents';

export default function CabinetAgentPage() {
  const { t } = useT();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('summary');
  const me = agents[0];
  const myDealsClosed = deals.filter((d) => d.agentId === me.id && d.stage === 'won');

  function priorityTone(v: number): 'positive' | 'neutral' | 'warning' {
    if (v >= 0.75) return 'positive';
    if (v >= 0.55) return 'neutral';
    return 'warning';
  }
  function priorityDisplay(label: string, v: number): string {
    if (v >= 0.75) return t('lead.priorityLabel.hot') + ` · ${label}`;
    if (v >= 0.55) return t('lead.priorityLabel.qualified') + ` · ${label}`;
    return t('lead.priorityLabel.warm') + ` · ${label}`;
  }

  return (
    <>
      <SiteNav active="/cabinet/agent" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-6xl mx-auto flex flex-col gap-sp4">
        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">{t('cabinet.agent.moduleLabel')}</p>
            <h1 className="text-[28px] mt-sp1">{t('cabinet.agent.title')}</h1>
            <p className="text-[13px] text-text-secondary mt-sp1">{t('cabinet.agent.subtitle')}</p>
          </div>
          <div className="flex items-center gap-sp2">
            <Badge variant="info" size="xs">{me.id}</Badge>
          </div>
        </header>

        <nav
          role="tablist"
          aria-label={t('cabinet.agent.title')}
          className="flex items-center gap-1 rounded-md border border-border p-1 bg-navy-deep self-start flex-wrap"
        >
          {(['summary', 'history', 'preferences', 'documents'] as Tab[]).map((k) => (
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
                    <dd className="text-text-h">{Math.round(me.tenure / 30)} {t('cabinet.agent.tabs.summary') === 'Sumar' ? 'luni' : 'мес.'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card variant="elevated" accentTop>
              <CardHeader>
                <div className="flex items-center gap-sp1">
                  <CardTitle className="text-[16px]">{t('cabinet.agent.performanceTitle')}</CardTitle>
                  <InfoTooltip label={t('cabinet.agent.performanceTitle')} body={t('cabinet.agent.performanceHelp')} />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-sp2">
                <MetricPill
                  label={t('dashboard.blocks.perfApsLabel')}
                  display={priorityDisplay('●●●', me.aps)}
                  tone={priorityTone(me.aps)}
                />
                <MetricPill
                  label={t('dashboard.blocks.perfTrustLabel')}
                  display={priorityDisplay('●●●', me.trust)}
                  tone={priorityTone(me.trust)}
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
                      <span className="font-mono text-gold">€{d.commissionEur.toLocaleString('ro-MD')}</span>
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
      </main>
    </>
  );
}
