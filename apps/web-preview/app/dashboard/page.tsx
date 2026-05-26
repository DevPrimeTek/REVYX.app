'use client';

// M0.S9 · Dashboard rework — per PM feedback:
//   - Block A "Sarcinele mele active" eliminat (informația apare deja în /tasks + /sidebar tasks)
//   - Row 1: Lead-uri urgente (stânga) + Performanță (cu rank badge + stele) + Decisii rapide (dreapta)
//   - Row 2: Programul de azi (ToDo real)
//   - Row 3: Sugestii lead-uri

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useT } from '@/components/i18n/provider';
import { TaskList } from '@/components/tasks/task-list';
import { TaskModal } from '@/components/tasks/task-modal';
import { LeadSuggestions } from '@/components/tasks/lead-suggestions';
import { AgentRankBadge, PerformanceStars } from '@/components/agents/rank-badge';
import { leads, agents } from '@/lib/mock';

export default function DashboardPage() {
  const { t } = useT();
  const me = agents[0];
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const hotLeads = useMemo(
    () => leads.filter((l) => l.status === 'HOT').sort((a, b) => b.ls - a.ls),
    [],
  );
  const hotCount = hotLeads.length;

  const suggestionLeads = useMemo(
    () =>
      [...leads]
        .filter((l) => l.status === 'HOT' || l.status === 'qualified')
        .sort((a, b) => b.ls - a.ls)
        .slice(0, 3),
    [],
  );

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
            <AgentRankBadge agent={me} size="sm" />
            <Link href="/leads">
              <Button>{t('dashboard.openQueue')}</Button>
            </Link>
          </div>
        </header>

        {/* Row 1: B · Lead-uri urgente (stânga) · C · Performanță · Decizii rapide (dreapta) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <Card variant="elevated" accentTop>
            <CardHeader>
              <p className="label-mono text-text-secondary">A</p>
              <div className="flex items-center gap-sp1">
                <CardTitle className="text-[16px]">{t('dashboard.blocks.urgentTitle')}</CardTitle>
                <InfoTooltip
                  label={t('dashboard.blocks.urgentTitle')}
                  body={t('dashboard.blocks.urgentDesc')}
                />
              </div>
              <CardDescription>
                {hotCount === 0 ? t('dashboard.blocks.urgentEmpty') : t('dashboard.blocks.urgentDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              <Link
                href="/leads?priority=urgent"
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
              >
                <p className="text-[48px] font-display text-gold leading-none hover:underline underline-offset-4">
                  {hotCount}
                </p>
                <p className="text-[12px] text-text-secondary mt-sp1">
                  {t('dashboard.blocks.urgentDesc')}
                </p>
              </Link>
              {hotLeads.slice(0, 3).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="text-[13px] text-text-h hover:text-gold underline-offset-4 hover:underline truncate"
                >
                  → {lead.name}
                  <span className="text-text-muted text-[11px] ml-sp1">
                    ({t(`leadType.${lead.leadType}`)})
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card variant="elevated" accentTop>
            <CardHeader>
              <p className="label-mono text-text-secondary">B</p>
              <div className="flex items-center gap-sp1">
                <CardTitle className="text-[16px]">{t('dashboard.blocks.perfTitle')}</CardTitle>
                <InfoTooltip
                  label={t('dashboard.blocks.perfTitle')}
                  body={t('dashboard.blocks.perfHelp')}
                />
              </div>
              <CardDescription>{t('dashboard.blocks.perfDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp3">
              {/* Rank badge dominant */}
              <div className="flex items-center justify-between gap-sp2">
                <AgentRankBadge agent={me} size="sm" />
                <PerformanceStars value={me.aps} />
              </div>

              {/* Performance breakdown */}
              <div className="flex flex-col gap-sp2 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">{t('dashboard.blocks.perfClosedLabel')}</span>
                  <span className="text-text-h font-semibold">{me.closedDeals30d}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">{t('dashboard.blocks.perfTrustLabel')}</span>
                  <PerformanceStars value={me.trust} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">{t('dashboard.blocks.perfTenure')}</span>
                  <span className="text-text-h">{me.tenure} {t('dashboard.blocks.days')}</span>
                </div>
              </div>

              <Link
                href="/cabinet/agent"
                className="text-[12px] text-gold hover:underline underline-offset-4 mt-sp1"
              >
                {t('dashboard.blocks.perfOpenCabinet')} →
              </Link>
            </CardContent>
          </Card>

          {/* Quick decisions — promoted into the top row per PM feedback */}
          <Card variant="elevated" accentTop>
            <CardHeader>
              <p className="label-mono text-text-secondary">C</p>
              <CardTitle className="text-[16px]">{t('dashboard.decisions.title')}</CardTitle>
              <CardDescription>{t('dashboard.decisions.desc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              {hotLeads[0] && (
                <Link href={`/leads/${hotLeads[0].id}`}>
                  <Button className="w-full justify-center" variant="primary">
                    📞 {t('dashboard.decisions.callLead')}
                  </Button>
                </Link>
              )}
              <Link href="/leads">
                <Button className="w-full justify-center" variant="secondary">
                  📋 {t('dashboard.decisions.openQueue')}
                </Button>
              </Link>
              <Link href="/deals">
                <Button className="w-full justify-center" variant="secondary">
                  📈 {t('dashboard.decisions.viewDeals')}
                </Button>
              </Link>
              <Link href="/properties/new">
                <Button className="w-full justify-center" variant="ghost">
                  + {t('dashboard.decisions.addProperty')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Row 2: Programul de azi (real, interactive) */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-sp2">
            <div>
              <div className="flex items-center gap-sp1">
                <CardTitle className="text-[16px]">
                  {t('dashboard.blocks.tasksTodayTitle')}
                </CardTitle>
                <InfoTooltip
                  label={t('dashboard.blocks.tasksTodayTitle')}
                  body={t('dashboard.blocks.tasksTodayDesc')}
                />
              </div>
              <CardDescription>{t('dashboard.blocks.tasksTodayDesc')}</CardDescription>
            </div>
            <div className="flex items-center gap-sp2">
              <Button size="sm" variant="secondary" onClick={() => setTaskModalOpen(true)}>
                {t('task.addCta')}
              </Button>
              <Link href="/tasks">
                <Button size="sm" variant="ghost">
                  {t('dashboard.blocks.openTasksPage')} →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <TaskList agentId={me.id} filter="today" maxRows={5} />
          </CardContent>
        </Card>

        {/* Row 3: Sugestii lead-uri */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-sp1">
              <CardTitle className="text-[16px]">
                {t('dashboard.blocks.suggestionsTitle')}
              </CardTitle>
              <InfoTooltip
                label={t('dashboard.blocks.suggestionsTitle')}
                body={t('dashboard.blocks.suggestionsDesc')}
              />
            </div>
            <CardDescription>{t('dashboard.blocks.suggestionsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-sp3">
            {suggestionLeads.map((lead) => (
              <div key={lead.id} className="flex flex-col gap-sp2">
                <div className="flex items-center justify-between gap-sp2 flex-wrap">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="text-text-h hover:text-gold underline-offset-4 hover:underline"
                  >
                    <span className="font-mono text-text-muted text-[11px] mr-sp2">
                      {lead.id}
                    </span>
                    {lead.name}
                    <span className="text-text-muted text-[11px] ml-sp2">
                      · {t(`leadType.${lead.leadType}`)}
                    </span>
                  </Link>
                  <span className="text-[12px] text-text-secondary">{lead.zone}</span>
                </div>
                <LeadSuggestions lead={lead} agentId={me.id} compact />
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <TaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} agentId={me.id} />
    </>
  );
}
