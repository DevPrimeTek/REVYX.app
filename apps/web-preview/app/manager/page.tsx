'use client';

// M0.S3 · Manager dashboard wired to 8-agent mock + 100-lead aggregate · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-09 + T-M0.S3-13

import Link from 'next/link';
import { useMemo } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScorePill } from '@/components/ui/score-badge';
import { useT } from '@/components/i18n/provider';
import { agents, leads, deals } from '@/lib/mock';

export default function ManagerPage() {
  const { t } = useT();

  const sortedAgents = useMemo(() => [...agents].sort((a, b) => b.aps - a.aps), []);
  const teamAvgAps = useMemo(
    () => Math.round((agents.reduce((s, a) => s + a.aps, 0) / agents.length) * 100) / 100,
    []
  );
  const wonCount = deals.filter((d) => d.stage === 'won').length;
  const conversionPct = Math.round((wonCount / leads.length) * 1000) / 10;

  // Synthetic escalations: pick top-3 HOT leads still unassigned (rare due to firewall)
  // OR overdue qualified leads.
  const escalations = useMemo(
    () =>
      leads
        .filter((l) => l.status === 'HOT' || l.status === 'qualified')
        .slice(0, 3)
        .map((l, i) => ({
          id: `E-${String(300 + i + 1).padStart(3, '0')}`,
          lead: l.name,
          sla: i === 0 ? 'T+SLA' : i === 1 ? 'T+SLA+30m' : 'T+SLA+2h',
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
              <p className="label-mono text-gold">APS</p>
              <CardTitle>Team avg</CardTitle>
              <CardDescription>{agents.length} agenți · 30 zile.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-[32px] text-gold">{teamAvgAps.toFixed(2)}</p>
              <p className="text-[12px] text-text-secondary mt-sp1">+0.04 vs prev</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">Conversie</p>
              <CardTitle>Lead → Deal won</CardTitle>
              <CardDescription>BR-13 target ≥ 30%.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-[32px] text-text-h">{conversionPct.toFixed(1)}%</p>
              <p className={'text-[12px] mt-sp1 ' + (conversionPct >= 30 ? 'text-status-green' : 'text-status-amber')}>
                {wonCount} deal-uri Won · {leads.length} leads totali
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">{t('manager.escalations')}</p>
              <CardTitle>{escalations.length} {t('manager.escalations').toLowerCase()}</CardTitle>
              <CardDescription>BR-03 · 3 niveluri.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-[32px] text-status-amber">{escalations.length}</p>
              <p className="text-[12px] text-text-secondary mt-sp1">L1 · L2 · L3</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{t('manager.leaderboard')}</CardTitle>
            <CardDescription>
              APS_default = 0.65 pentru agenți cu &lt;5 deal-uri SAU &lt;30 zile (BR-11).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>ID</TH>
                  <TH>{t('common.name')}</TH>
                  <TH>APS</TH>
                  <TH>Trust</TH>
                  <TH>Slots</TH>
                  <TH>Deals 30d</TH>
                </TR>
              </THead>
              <TBody>
                {sortedAgents.map((a) => (
                  <TR key={a.id}>
                    <TD className="font-mono text-text-secondary">{a.id}</TD>
                    <TD>{a.name}</TD>
                    <TD><ScorePill label="APS" value={a.aps} /></TD>
                    <TD className="font-mono">{a.trust.toFixed(2)}</TD>
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
              <Button size="sm" variant="secondary">{t('manager.openEscalations')}</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>ID</TH>
                  <TH>Lead</TH>
                  <TH>SLA stage</TH>
                  <TH>Nivel</TH>
                </TR>
              </THead>
              <TBody>
                {escalations.map((e) => (
                  <TR key={e.id}>
                    <TD className="font-mono text-text-secondary">{e.id}</TD>
                    <TD>{e.lead}</TD>
                    <TD className="font-mono">{e.sla}</TD>
                    <TD>
                      <Badge variant={e.level === 1 ? 'warning' : 'critical'} size="xs">
                        L{e.level}
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
