'use client';

// M0.S6 · Agent profile · friendly labels only.

import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MetricPill } from '@/components/ui/score-badge';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useT } from '@/components/i18n/provider';
import { agents, deals, leads } from '@/lib/mock';

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

export default function ProfilePage() {
  const { t } = useT();
  const me = agents[0];
  const myDeals = deals.filter((d) => d.agentId === me.id);
  const myLeads = leads.filter((l) => l.agentId === me.id);

  const apsHistory = [0.62, 0.66, 0.70, 0.73, 0.78, me.aps];

  return (
    <>
      <SiteNav active="/profile" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">{t('profile.moduleLabel')}</p>
          <h1 className="text-[28px] mt-sp1">{me.name}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">
            {me.id} · {t('profile.tenure')} {t('profile.tenureMonths', { count: String(Math.round(me.tenure / 30)) })} · {t('profile.subtitle')}
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-sp3">
          <Card variant="elevated" accentTop>
            <CardHeader>
              <div className="flex items-center gap-sp1">
                <p className="label-mono text-text-secondary">{t('dashboard.blocks.perfApsLabel')}</p>
                <InfoTooltip
                  label={t('dashboard.blocks.perfApsLabel')}
                  body={t('dashboard.blocks.perfApsHelp')}
                />
              </div>
              <CardTitle className="font-display">{priorityDots(me.aps)}</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricPill label="" display={priorityDots(me.aps)} tone={priorityTone(me.aps)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">{t('profile.trust')}</p>
              <CardTitle className="font-display">{priorityDots(me.trust)}</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricPill label="" display={priorityDots(me.trust)} tone={priorityTone(me.trust)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">{t('profile.activeTasks')}</p>
              <CardTitle>{me.activeTasks}/3</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[12px] text-text-secondary">{t('dashboard.blocks.tasksDesc')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">{t('profile.closed30d')}</p>
              <CardTitle>{me.closedDeals30d}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="success" size="xs">{t('profile.badgeAbove5')}</Badge>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.blocks.perfApsLabel')} {t('profile.chartTitleSuffix')}</CardTitle>
            <CardDescription>{t('dashboard.blocks.perfDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-sp2 h-[120px]">
              {apsHistory.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-sp1 flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-gold-dark to-gold rounded-t"
                    style={{ height: `${v * 100}px` }}
                    aria-label={t('profile.chartMonthAria', { month: String(i + 1), dots: priorityDots(v) })}
                  />
                  <span className="text-[10px] text-text-muted">{priorityDots(v)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-sp3">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.assignedLeadsTitle')}</CardTitle>
              <CardDescription>{t('profile.assignedLeadsDesc', { count: String(myLeads.length) })}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-sp1 text-[13px]">
                {myLeads.slice(0, 6).map((l) => (
                  <li key={l.id} className="flex items-center justify-between border border-border rounded-md px-sp2 py-sp1">
                    <span>
                      <span className="font-mono text-text-secondary text-[11px]">{l.id}</span>{' '}
                      <span className="text-text-h">{l.name}</span>
                    </span>
                    <span className="text-text-secondary text-[11px]">{l.zone}</span>
                  </li>
                ))}
                {myLeads.length === 0 && (
                  <li className="text-text-muted text-[12px]">{t('profile.assignedLeadsEmpty')}</li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('profile.activeDealsTitle')}</CardTitle>
              <CardDescription>{t('profile.activeDealsDesc', { count: String(myDeals.length) })}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-sp1 text-[13px]">
                {myDeals.slice(0, 6).map((d) => (
                  <li key={d.id} className="flex items-center justify-between border border-border rounded-md px-sp2 py-sp1">
                    <span>
                      <span className="font-mono text-text-secondary text-[11px]">{d.id}</span>{' '}
                      <span className="text-text-h">{t(`deal.stages.${d.stage}`)}</span>
                    </span>
                    <span className="text-gold text-[12px] font-mono">€{d.commissionEur.toLocaleString('ro-MD')}</span>
                  </li>
                ))}
                {myDeals.length === 0 && (
                  <li className="text-text-muted text-[12px]">{t('profile.activeDealsEmpty')}</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
