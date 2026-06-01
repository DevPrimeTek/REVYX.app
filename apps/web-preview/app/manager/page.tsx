'use client';

// M0.S7 · Manager dashboard — friendly labels (no acronyms, no formula leak).

import Link from 'next/link';
import { useMemo } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { MetricPill } from '@/components/ui/score-badge';
import { useT } from '@/components/i18n/provider';
import { agents, leads, deals } from '@/lib/mock';

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

export default function ManagerPage() {
  const { t } = useT();

  const sortedAgents = useMemo(() => [...agents].sort((a, b) => b.aps - a.aps), []);
  const teamAvgAps = useMemo(
    () => agents.reduce((s, a) => s + a.aps, 0) / agents.length,
    []
  );
  const wonCount = deals.filter((d) => d.stage === 'won').length;
  const conversionPct = Math.round((wonCount / leads.length) * 1000) / 10;

  const escalations = useMemo(
    () =>
      leads
        .filter((l) => l.status === 'HOT' || l.status === 'qualified')
        .slice(0, 3)
        .map((l, i) => ({
          id: `E-${String(300 + i + 1).padStart(3, '0')}`,
          lead: l.name,
          windowKey: (['w1', 'w2', 'w3'] as const)[i],
          levelKey: (['attention', 'urgent', 'critical'] as const)[i],
          level: (i + 1) as 1 | 2 | 3,
        })),
    []
  );

  return (
    <>
      <SiteNav active="/manager" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">{t('manager.moduleLabel')}</p>
          <h1 className="text-[28px] mt-sp1">{t('manager.title')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">{t('manager.subtitle')}</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <Card variant="elevated" accentTop>
            <CardHeader>
              <div className="flex items-center gap-sp1">
                <p className="label-mono text-gold">{t('dashboard.blocks.perfApsLabel')}</p>
                <InfoTooltip
                  label={t('dashboard.blocks.perfApsLabel')}
                  body={t('dashboard.blocks.perfApsHelp')}
                />
              </div>
              <CardTitle>{t('manager.kpiTeamAvgTitle')}</CardTitle>
              <CardDescription>{t('manager.kpiTeamAvgDesc', { count: String(agents.length) })}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-[32px] text-gold">{priorityDots(teamAvgAps)}</p>
              <p className="text-[12px] text-status-green mt-sp1">{t('manager.kpiTeamAvgTrend')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">{t('manager.kpiConversionLabel')}</p>
              <CardTitle>{t('manager.kpiConversionTitle')}</CardTitle>
              <CardDescription>{t('manager.kpiConversionDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-[32px] text-text-h">{conversionPct.toFixed(1)}%</p>
              <p
                className={
                  'text-[12px] mt-sp1 ' +
                  (conversionPct >= 30 ? 'text-status-green' : 'text-status-amber')
                }
              >
                {t('manager.kpiConversionFootnote', { won: String(wonCount), total: String(leads.length) })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">{t('manager.escalations')}</p>
              <CardTitle>{t('manager.kpiEscDelayed', { count: String(escalations.length) })}</CardTitle>
              <CardDescription>{t('manager.kpiEscDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-[32px] text-status-amber">{escalations.length}</p>
              <p className="text-[12px] text-text-secondary mt-sp1">{t('manager.kpiEscSort')}</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{t('manager.leaderboard')}</CardTitle>
            <CardDescription>{t('manager.leaderboardDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>{t('manager.colCode')}</TH>
                  <TH>{t('common.name')}</TH>
                  <TH>
                    <span className="inline-flex items-center gap-sp1">
                      {t('manager.colPerf')}
                      <InfoTooltip
                        label={t('dashboard.blocks.perfApsLabel')}
                        body={t('dashboard.blocks.perfApsHelp')}
                      />
                    </span>
                  </TH>
                  <TH>
                    <span className="inline-flex items-center gap-sp1">
                      {t('manager.colTrust')}
                      <InfoTooltip
                        label={t('manager.colTrust')}
                        body={t('manager.colTrustHelp')}
                      />
                    </span>
                  </TH>
                  <TH>
                    <span className="inline-flex items-center gap-sp1">
                      {t('manager.colActiveTasks')}
                      <InfoTooltip
                        label={t('manager.colActiveTasks')}
                        body={t('manager.colActiveTasksHelp')}
                      />
                    </span>
                  </TH>
                  <TH>{t('manager.colDeals30d')}</TH>
                </TR>
              </THead>
              <TBody>
                {sortedAgents.map((a) => (
                  <TR key={a.id}>
                    <TD className="font-mono text-text-secondary">{a.id}</TD>
                    <TD>{a.name}</TD>
                    <TD>
                      <MetricPill label="" display={priorityDots(a.aps)} tone={priorityTone(a.aps)} />
                    </TD>
                    <TD>
                      <MetricPill label="" display={priorityDots(a.trust)} tone={priorityTone(a.trust)} />
                    </TD>
                    <TD className="font-mono">{a.activeTasks}/3</TD>
                    <TD className="font-mono">{a.closedDeals30d}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-sp2">
            <div>
              <CardTitle>{t('manager.escalationsTitle')}</CardTitle>
              <CardDescription>{t('manager.escalationsSubtitle')}</CardDescription>
            </div>
            <Link href="/manager/escalations">
              <Button size="sm" variant="secondary">
                {t('manager.openEscalations')}
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>{t('manager.colCode')}</TH>
                  <TH>{t('manager.colLead')}</TH>
                  <TH>{t('manager.colDelayedBy')}</TH>
                  <TH>{t('manager.colLevel')}</TH>
                </TR>
              </THead>
              <TBody>
                {escalations.map((e) => (
                  <TR key={e.id}>
                    <TD className="font-mono text-text-secondary">{e.id}</TD>
                    <TD>{e.lead}</TD>
                    <TD className="font-mono">{t(`manager.windows.${e.windowKey}`)}</TD>
                    <TD>
                      <Badge variant={e.level === 1 ? 'warning' : 'critical'} size="xs">
                        {t(`manager.levelLabels.${e.levelKey}`)}
                      </Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
