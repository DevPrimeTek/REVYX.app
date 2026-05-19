'use client';

// M0.S6 · Dashboard restructured into clear blocks: tasks · urgent leads · today's list · performance.
// Acronyms removed from agent-facing UI per Senior PM directive (formulas stay in docs/BRD §7).

import Link from 'next/link';
import { useMemo } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeadPriorityBadge, MetricPill } from '@/components/ui/score-badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useT } from '@/components/i18n/provider';
import { leads, agents } from '@/lib/mock';

export default function DashboardPage() {
  const { t } = useT();

  const me = agents[0];
  const activeTasks = me.activeTasks;
  const freeSlots = Math.max(0, 3 - activeTasks);

  const hotLeads = useMemo(
    () => leads.filter((l) => l.status === 'HOT').sort((a, b) => b.ls - a.ls),
    []
  );
  const hotCount = hotLeads.length;

  const queueToday = useMemo(
    () =>
      [...leads]
        .filter((l) => l.status === 'HOT' || l.status === 'qualified')
        .sort((a, b) => b.ls - a.ls)
        .slice(0, 5),
    []
  );

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
      <SiteNav active="/dashboard" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">{t('dashboard.moduleLabel')}</p>
            <h1 className="text-[28px] mt-sp1">{t('dashboard.greeting')}</h1>
            <p className="text-[13px] text-text-secondary mt-sp1">
              {hotCount > 0
                ? t('dashboard.subtitleWithUrgent', { hot: hotCount })
                : t('dashboard.subtitleNoUrgent')}
            </p>
          </div>
          <div className="flex items-center gap-sp2">
            <Link href="/leads">
              <Button>{t('dashboard.openQueue')}</Button>
            </Link>
          </div>
        </header>

        {/* Block A — My tasks */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <Card variant="elevated" accentTop>
            <CardHeader>
              <p className="label-mono text-text-secondary">A</p>
              <div className="flex items-center gap-sp1">
                <CardTitle className="text-[16px]">{t('dashboard.blocks.tasksTitle')}</CardTitle>
                <InfoTooltip
                  label={t('dashboard.blocks.tasksTitle')}
                  body={t('dashboard.blocks.tasksDesc')}
                />
              </div>
              <CardDescription>{t('dashboard.blocks.tasksHint', { active: activeTasks })}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              <div className="flex items-center gap-1" aria-label="slots">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`flex-1 h-2 rounded ${
                      i < activeTasks ? 'bg-gold' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[12px] text-text-secondary">
                {freeSlots === 0
                  ? t('dashboard.blocks.tasksFull')
                  : t('dashboard.blocks.tasksAvailable', { free: freeSlots })}
              </p>
            </CardContent>
          </Card>

          {/* Block B — Urgent leads */}
          <Card variant="elevated" accentTop>
            <CardHeader>
              <p className="label-mono text-text-secondary">B</p>
              <div className="flex items-center gap-sp1">
                <CardTitle className="text-[16px]">{t('dashboard.blocks.urgentTitle')}</CardTitle>
                <InfoTooltip
                  label={t('dashboard.blocks.urgentTitle')}
                  body={t('dashboard.blocks.urgentDesc')}
                />
              </div>
              <CardDescription>{hotCount === 0 ? t('dashboard.blocks.urgentEmpty') : t('dashboard.blocks.urgentDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              <p className="text-[36px] font-display text-gold leading-none">{hotCount}</p>
              {hotLeads[0] && (
                <Link
                  href={`/leads/${hotLeads[0].id}`}
                  className="text-[13px] text-text-h hover:text-gold underline-offset-4 hover:underline"
                >
                  → {hotLeads[0].name}
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Block C — Performance */}
          <Card variant="elevated" accentTop>
            <CardHeader>
              <p className="label-mono text-text-secondary">C</p>
              <div className="flex items-center gap-sp1">
                <CardTitle className="text-[16px]">{t('dashboard.blocks.perfTitle')}</CardTitle>
                <InfoTooltip
                  label={t('dashboard.blocks.perfApsLabel')}
                  body={t('dashboard.blocks.perfApsHelp')}
                />
              </div>
              <CardDescription>{t('dashboard.blocks.perfDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              <MetricPill
                label={t('dashboard.blocks.perfApsLabel')}
                display={priorityDots(me.aps)}
                tone={priorityTone(me.aps)}
              />
              <MetricPill
                label={t('dashboard.blocks.perfClosedLabel')}
                display={`${me.closedDeals30d}`}
                tone={me.closedDeals30d >= 5 ? 'positive' : 'neutral'}
              />
              <MetricPill
                label={t('dashboard.blocks.perfTrustLabel')}
                display={priorityDots(me.trust)}
                tone={priorityTone(me.trust)}
              />
            </CardContent>
          </Card>
        </section>

        {/* Block D — Today's queue + decisions */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-sp3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-sp1">
                <CardTitle className="text-[16px]">{t('dashboard.blocks.todayTitle')}</CardTitle>
                <InfoTooltip
                  label={t('dashboard.blocks.todayTitle')}
                  body={t('dashboard.blocks.todayDesc')}
                />
              </div>
              <CardDescription>{t('dashboard.blocks.todayDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              {queueToday.map((l) => (
                <Link
                  key={l.id}
                  href={`/leads/${l.id}`}
                  className="flex items-center justify-between border border-border rounded-md px-sp3 py-sp2 hover:bg-navy-hover hover:border-border-light transition-colors duration-fast"
                >
                  <div className="min-w-0">
                    <p className="text-text-h truncate">{l.name}</p>
                    <p className="text-[12px] text-text-muted">{l.sla} · {l.source}</p>
                  </div>
                  <LeadPriorityBadge ls={l.ls} t={t} />
                </Link>
              ))}
              {queueToday.length === 0 && (
                <p className="text-text-muted text-[12px]">{t('dashboard.blocks.urgentEmpty')}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[16px]">{t('dashboard.decisions.title')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              {hotLeads[0] && (
                <Link href={`/leads/${hotLeads[0].id}`}>
                  <Button className="w-full justify-start" variant="primary">
                    📞 {t('dashboard.decisions.callLead')}
                  </Button>
                </Link>
              )}
              <Link href="/leads">
                <Button className="w-full justify-start" variant="secondary">
                  📋 {t('dashboard.decisions.openQueue')}
                </Button>
              </Link>
              <Link href="/deals">
                <Button className="w-full justify-start" variant="secondary">
                  📈 {t('dashboard.decisions.viewDeals')}
                </Button>
              </Link>
              <Link href="/properties/new">
                <Button className="w-full justify-start" variant="ghost">
                  + {t('dashboard.decisions.addProperty')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
