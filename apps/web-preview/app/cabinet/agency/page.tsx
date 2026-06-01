'use client';

// M0.S6 · /cabinet/agency · agency-level cabinet (team + KPIs).

import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useT } from '@/components/i18n/provider';
import { agents, deals } from '@/lib/mock';
import { WorkspaceDirectionSelector } from '@/components/cabinet/workspace-direction-selector';

export default function CabinetAgencyPage() {
  const { t } = useT();
  const activeAgents = agents.filter((a) => a.activeTasks > 0 || a.closedDeals30d > 0);
  const closed30 = deals.filter((d) => d.stage === 'won').length;
  const volume30 = deals.filter((d) => d.stage === 'won').reduce((s, d) => s + d.commissionEur * 100, 0);
  const activeLeads = 87; // mock

  const KPIs = [
    { label: t('cabinet.agency.kpiClosed'), value: String(closed30), help: t('dashboard.blocks.perfClosedLabel') },
    { label: t('cabinet.agency.kpiVolume'), value: `€${volume30.toLocaleString('ro-MD')}`, help: t('cabinet.agency.kpiTitle') },
    { label: t('cabinet.agency.kpiAvgClose'), value: t('cabinet.agency.kpiAvgCloseValue'), help: t('cabinet.agency.kpiTitle') },
    { label: t('cabinet.agency.kpiActiveLeads'), value: String(activeLeads), help: t('lead.queueTitle') },
  ];

  return (
    <>
      <SiteNav active="/cabinet/agency" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-6xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">{t('cabinet.agency.moduleLabel')}</p>
          <h1 className="text-[28px] mt-sp1">{t('cabinet.agency.title')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">{t('cabinet.agency.subtitle')}</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-[16px]">{t('cabinetExtras.agency.introTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {t('cabinetExtras.agency.introBody')}
            </p>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('cabinet.agency.agencyDetailsTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-sp3 text-[13px]">
                <div>
                  <dt className="text-text-muted text-[12px]">{t('cabinet.agency.agencyNameLabel')}</dt>
                  <dd className="text-text-h">{t('cabinet.agency.agencyName')}</dd>
                </div>
                <div>
                  <dt className="text-text-muted text-[12px]">{t('cabinet.agency.agencyCodeLabel')}</dt>
                  <dd className="text-text-h font-mono">{t('cabinet.agency.agencyCode')}</dd>
                </div>
                <div>
                  <dt className="text-text-muted text-[12px]">{t('cabinet.agency.agencyAddressLabel')}</dt>
                  <dd className="text-text-h">{t('cabinet.agency.agencyAddress')}</dd>
                </div>
                <div>
                  <dt className="text-text-muted text-[12px]">{t('cabinet.agency.agencyContactLabel')}</dt>
                  <dd className="text-text-h">{t('cabinet.agency.agencyContact')}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card variant="elevated" accentTop>
            <CardHeader>
              <CardTitle className="text-[16px]">{t('cabinet.agency.teamTitle')}</CardTitle>
              <CardDescription>{t('cabinet.agency.teamHelp')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[28px] font-display text-gold leading-none">{activeAgents.length}</p>
              <p className="text-[12px] text-text-secondary mt-sp1">{t('cabinet.agency.teamMembersLabel')}</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-sp2">
              <CardTitle>{t('cabinet.agency.kpiTitle')}</CardTitle>
              <InfoTooltip label={t('cabinet.agency.kpiTitle')} body={t('cabinet.agency.subtitle')} />
            </div>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-sp3">
              {KPIs.map((k) => (
                <li key={k.label} className="border border-border rounded-md px-sp3 py-sp3 bg-navy-deep">
                  <p className="text-[11px] text-text-muted mb-sp1">{k.label}</p>
                  <p className="text-[20px] font-display text-text-h">{k.value}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('cabinet.agency.teamTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-sp1">
              {activeAgents.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-sp2 border border-border rounded-md px-sp3 py-sp2 text-[13px]"
                >
                  <div className="flex items-center gap-sp2">
                    <span className="font-mono text-text-muted text-[11px]">{a.id}</span>
                    <Link href="/cabinet/agent" className="text-text-h hover:text-gold underline-offset-4 hover:underline">
                      {a.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-sp2">
                    <Badge
                      variant={a.activeTasks >= 3 ? 'critical' : a.aps >= 0.80 ? 'success' : 'info'}
                      size="xs"
                    >
                      {a.activeTasks >= 3
                        ? t('leadDetail.agentStateBusy')
                        : a.aps >= 0.80
                        ? t('leadDetail.agentStateTop')
                        : a.activeTasks === 0
                        ? t('leadDetail.agentStateAvailable')
                        : t('leadDetail.agentStateGood')}
                    </Badge>
                    <span className="text-text-muted text-[11px] font-mono">{a.activeTasks}/3</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <WorkspaceDirectionSelector scope="agency" />
      </main>
    </>
  );
}
