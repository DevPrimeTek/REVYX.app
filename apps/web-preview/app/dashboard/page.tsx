'use client';

// M0.S3 · Dashboard wired to mock data + i18n · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-06 + T-M0.S3-13

import Link from 'next/link';
import { useMemo } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeadScoreBadge, ScorePill } from '@/components/ui/score-badge';
import { useT } from '@/components/i18n/provider';
import { leads, agents } from '@/lib/mock';

export default function DashboardPage() {
  const { t } = useT();

  const nbaList = useMemo(
    () =>
      [...leads]
        .filter((l) => l.status === 'HOT' || l.status === 'qualified')
        .sort((a, b) => b.ls - a.ls)
        .slice(0, 3)
        .map((l, i) => ({
          lead: l,
          score: Math.round((1.0 + l.ls * (1.0 - i * 0.15)) * 100) / 100,
          urgency: l.status === 'HOT' ? 'hot' : i === 0 ? 'warm' : 'info',
        })),
    []
  );

  const queueToday = useMemo(
    () =>
      [...leads]
        .filter((l) => l.status === 'HOT' || l.status === 'qualified')
        .sort((a, b) => b.ls - a.ls)
        .slice(0, 5),
    []
  );

  const hotCount = leads.filter((l) => l.status === 'HOT').length;
  const me = agents[0];

  return (
    <>
      <SiteNav active="/dashboard" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">{t('dashboard.moduleLabel')}</p>
            <h1 className="text-[28px] mt-sp1">{t('dashboard.greeting')}</h1>
            <p className="text-[13px] text-text-secondary mt-sp1">
              {t('dashboard.subtitle', { active: me.activeTasks, hot: hotCount })}
            </p>
          </div>
          <div className="flex items-center gap-sp2">
            <Badge variant="hot" size="sm">{t('dashboard.slaHot')}</Badge>
            <Link href="/leads">
              <Button>{t('dashboard.openQueue')}</Button>
            </Link>
          </div>
        </header>

        <section aria-labelledby="nba" className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <h2 id="nba" className="sr-only">{t('dashboard.nbaSection')}</h2>
          {nbaList.map((nba, i) => (
            <Card key={nba.lead.id} variant="elevated" accentTop>
              <CardHeader>
                <p className="label-mono text-text-secondary">NBA · {String(i + 1).padStart(2, '0')}</p>
                <CardTitle>{nba.lead.name}</CardTitle>
                <CardDescription>
                  {nba.lead.zone} · LS {nba.lead.ls.toFixed(2)} · {nba.lead.sla}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="font-mono text-[18px] text-gold">{nba.score.toFixed(2)}</span>
                <Badge variant={nba.urgency as 'hot' | 'warm' | 'info'}>{nba.urgency}</Badge>
              </CardContent>
            </Card>
          ))}
        </section>

        <section aria-labelledby="queue-preview" className="grid grid-cols-1 lg:grid-cols-2 gap-sp3">
          <Card>
            <CardHeader>
              <h2 id="queue-preview" className="text-[16px] text-text-h font-semibold">
                {t('dashboard.queueToday')}
              </h2>
              <CardDescription>{t('dashboard.queueTodayDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              {queueToday.map((l) => (
                <Link
                  key={l.id}
                  href={`/leads/${l.id}`}
                  className="flex items-center justify-between border border-border rounded-md px-sp3 py-sp2 hover:bg-navy-hover hover:border-border-light transition-colors duration-fast"
                >
                  <div>
                    <p className="text-text-h">{l.name}</p>
                    <p className="text-[12px] text-text-muted">{l.sla} · {l.source}</p>
                  </div>
                  <LeadScoreBadge ls={l.ls} />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-[16px] text-text-h font-semibold">{t('dashboard.myScores')}</h2>
              <CardDescription>{t('dashboard.myScoresDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-sp4">
              <ScorePill label="APS" value={me.aps} />
              <ScorePill label="Trust" value={me.trust} />
              <ScorePill label="Conv. 30d" value={Math.min(1, me.closedDeals30d / 10)} />
              <ScorePill label="Slots" value={me.activeTasks / 3} />
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
