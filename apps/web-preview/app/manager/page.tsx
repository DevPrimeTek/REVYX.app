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
          window: i === 0 ? '15 min' : i === 1 ? '45 min' : '2 ore 15 min',
          levelLabel: i === 0 ? 'Atenție' : i === 1 ? 'Urgent' : 'Critic',
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
              <CardTitle>Media echipei</CardTitle>
              <CardDescription>{agents.length} agenți · 30 zile.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-[32px] text-gold">{priorityDots(teamAvgAps)}</p>
              <p className="text-[12px] text-status-green mt-sp1">↑ în creștere față de perioada precedentă</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">Conversie</p>
              <CardTitle>Lead → Tranzacție câștigată</CardTitle>
              <CardDescription>Țintă recomandată: peste 30%.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-[32px] text-text-h">{conversionPct.toFixed(1)}%</p>
              <p
                className={
                  'text-[12px] mt-sp1 ' +
                  (conversionPct >= 30 ? 'text-status-green' : 'text-status-amber')
                }
              >
                {wonCount} tranzacții câștigate · {leads.length} lead-uri totali
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">{t('manager.escalations')}</p>
              <CardTitle>{escalations.length} lead-uri întârziate</CardTitle>
              <CardDescription>Necesită intervenție manager.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-[32px] text-status-amber">{escalations.length}</p>
              <p className="text-[12px] text-text-secondary mt-sp1">Sortat după durata depășirii</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{t('manager.leaderboard')}</CardTitle>
            <CardDescription>
              Agenții cu mai puțin de 5 tranzacții sau sub 30 zile primesc scor standard până se acumulează istoric suficient.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>Cod</TH>
                  <TH>{t('common.name')}</TH>
                  <TH>
                    <span className="inline-flex items-center gap-sp1">
                      Scor performanță
                      <InfoTooltip
                        label={t('dashboard.blocks.perfApsLabel')}
                        body={t('dashboard.blocks.perfApsHelp')}
                      />
                    </span>
                  </TH>
                  <TH>
                    <span className="inline-flex items-center gap-sp1">
                      Încredere clienți
                      <InfoTooltip
                        label="Încredere clienți"
                        body="Cât de constant răspunde și își ține promisiunile agentul față de clienți."
                      />
                    </span>
                  </TH>
                  <TH>
                    <span className="inline-flex items-center gap-sp1">
                      Sarcini active
                      <InfoTooltip
                        label="Sarcini active"
                        body="Câte sarcini are agentul în lucru chiar acum. Maximum 3 simultan."
                      />
                    </span>
                  </TH>
                  <TH>Tranzacții · 30 zile</TH>
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
                  <TH>Cod</TH>
                  <TH>Lead</TH>
                  <TH>Întârziat cu</TH>
                  <TH>Nivel</TH>
                </TR>
              </THead>
              <TBody>
                {escalations.map((e) => (
                  <TR key={e.id}>
                    <TD className="font-mono text-text-secondary">{e.id}</TD>
                    <TD>{e.lead}</TD>
                    <TD className="font-mono">{e.window}</TD>
                    <TD>
                      <Badge variant={e.level === 1 ? 'warning' : 'critical'} size="xs">
                        {e.levelLabel}
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
