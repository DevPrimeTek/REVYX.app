'use client';

// M0.S6 · /cabinet/group · group-level cabinet.

import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useT } from '@/components/i18n/provider';
import { agents, deals } from '@/lib/mock';
import { WorkspaceDirectionSelector } from '@/components/cabinet/workspace-direction-selector';

export default function CabinetGroupPage() {
  const { t } = useT();
  const groupMembers = agents.slice(0, 5);
  const groupClosed = deals.filter((d) => d.stage === 'won' && groupMembers.some((a) => a.id === d.agentId)).length;
  const mySharePct = Math.round((deals.filter((d) => d.stage === 'won' && d.agentId === agents[0].id).length / Math.max(1, groupClosed)) * 100);

  // Top 3 by APS within the group
  const top3 = [...groupMembers].sort((a, b) => b.aps - a.aps).slice(0, 3);

  return (
    <>
      <SiteNav active="/cabinet/group" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-6xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">{t('cabinet.group.moduleLabel')}</p>
          <h1 className="text-[28px] mt-sp1">{t('cabinet.group.title')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">{t('cabinet.group.subtitle')}</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-[16px]">{t('cabinetExtras.group.introTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {t('cabinetExtras.group.introBody')}
            </p>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <Card>
            <CardHeader>
              <CardTitle className="text-[16px]">{t('cabinet.group.groupNameLabel')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-h text-[15px]">{t('cabinet.group.groupName')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[16px]">{t('cabinet.group.managerLabel')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-h text-[15px]">{t('cabinet.group.managerName')}</p>
              <p className="text-text-muted text-[12px] font-mono mt-sp1">{t('cabinet.group.managerCode')}</p>
            </CardContent>
          </Card>

          <Card variant="elevated" accentTop>
            <CardHeader>
              <div className="flex items-center gap-sp1">
                <CardTitle className="text-[16px]">{t('cabinet.group.shareLabel')}</CardTitle>
                <InfoTooltip label={t('cabinet.group.shareLabel')} body={t('cabinet.group.shareHelp')} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[28px] font-display text-gold leading-none">{mySharePct}%</p>
              <p className="text-[12px] text-text-secondary mt-sp1">{t('cabinet.group.shareFootnote', { count: String(groupClosed) })}</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{t('cabinet.group.leaderboardTitle')}</CardTitle>
            <CardDescription>{t('cabinet.group.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-sp2">
              {top3.map((a, i) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between border border-border rounded-md px-sp3 py-sp2 text-[13px] bg-navy-deep"
                >
                  <span className="flex items-center gap-sp2">
                    <span className="font-display text-gold text-[18px] w-6 text-center">{i + 1}</span>
                    <span className="text-text-h">{a.name}</span>
                    <span className="font-mono text-text-muted text-[11px]">{a.id}</span>
                  </span>
                  <Badge variant={a.aps >= 0.80 ? 'success' : 'info'} size="xs">
                    {a.aps >= 0.80 ? t('leadDetail.agentStateTop') : t('leadDetail.agentStateGood')}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('cabinet.group.membersTitle')}</CardTitle>
            <CardDescription>{groupMembers.length} {t('cabinet.group.totalLabel')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-sp1">
              {groupMembers.map((a) => (
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
                  <span className="text-text-muted text-[11px] font-mono">{a.activeTasks}/3</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <WorkspaceDirectionSelector scope="group" />
      </main>
    </>
  );
}
