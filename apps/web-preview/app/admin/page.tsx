'use client';

// M0.S3 · Admin overview + RBAC matrix + tenants · 🌐 Web only (DP-05)
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-08 + T-M0.S3-13

import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/components/i18n/provider';

const roles = [
  { code: 'agent',        web: true, mobile: true  },
  { code: 'senior_agent', web: true, mobile: true  },
  { code: 'team_lead',    web: true, mobile: 'ro'  },
  { code: 'manager',      web: true, mobile: 'ro'  },
  { code: 'admin',        web: true, mobile: false },
] as const;

const tenants = [
  { id: 'T-001', name: 'Imobiliare Chișinău SRL',  plan: 'Pro',        agents: 12, status: 'active' },
  { id: 'T-002', name: 'Casa Mea Real Estate',     plan: 'Enterprise', agents: 24, status: 'active' },
  { id: 'T-003', name: 'Premier Properties Moldova', plan: 'Pro',      agents: 8,  status: 'trial' },
  { id: 'T-004', name: 'Domus Agent SRL',          plan: 'Starter',    agents: 4,  status: 'paused' },
];

export default function AdminPage() {
  const { t } = useT();

  return (
    <>
      <SiteNav active="/admin" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <div className="flex items-center gap-sp2">
            <p className="label-mono text-gold">{t('admin.moduleLabel')}</p>
            <Badge variant="critical" size="xs">{t('admin.webOnly')}</Badge>
          </div>
          <h1 className="text-[28px] mt-sp1">{t('admin.title')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">{t('admin.subtitle')}</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          {[
            { title: t('admin.cardUsersTitle'), desc: t('admin.cardUsersDesc'), count: t('admin.cardUsersCount', { count: '24' }) },
            { title: t('admin.cardAuditTitle'), desc: t('admin.cardAuditDesc'), count: t('admin.cardAuditCount', { count: '108.4k' }) },
            { title: t('admin.cardBrandingTitle'), desc: t('admin.cardBrandingDesc'), count: t('admin.cardBrandingCount', { count: '2' }) },
          ].map((card) => (
            <Card key={card.title} variant="elevated" accentTop>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-[20px] text-gold">{card.count}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.tenants')}</CardTitle>
            <CardDescription>{t('admin.tenantsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>{t('admin.colId')}</TH>
                  <TH>{t('common.name')}</TH>
                  <TH>{t('admin.colPlan')}</TH>
                  <TH>{t('admin.colAgents')}</TH>
                  <TH>{t('common.status')}</TH>
                </TR>
              </THead>
              <TBody>
                {tenants.map((tn) => (
                  <TR key={tn.id}>
                    <TD className="font-mono text-text-secondary">{tn.id}</TD>
                    <TD>{tn.name}</TD>
                    <TD className="text-text-secondary">{tn.plan}</TD>
                    <TD className="font-mono">{tn.agents}</TD>
                    <TD>
                      <Badge
                        variant={tn.status === 'active' ? 'success' : tn.status === 'trial' ? 'info' : 'warning'}
                        size="xs"
                      >
                        {t(`admin.tenantStatus.${tn.status}`)}
                      </Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.rbac')}</CardTitle>
            <CardDescription>{t('admin.rbacDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>{t('admin.colCode')}</TH>
                  <TH>{t('admin.colRole')}</TH>
                  <TH>{t('admin.colWeb')}</TH>
                  <TH>{t('admin.colMobile')}</TH>
                  <TH>{t('admin.colNote')}</TH>
                </TR>
              </THead>
              <TBody>
                {roles.map((r) => (
                  <TR key={r.code}>
                    <TD className="font-mono text-text-secondary">{r.code}</TD>
                    <TD>{t(`admin.role.${r.code}`)}</TD>
                    <TD>
                      <Badge variant="success" size="xs">{t('admin.accessTag')}</Badge>
                    </TD>
                    <TD>
                      {r.mobile === true && <Badge variant="success" size="xs">{t('admin.accessTag')}</Badge>}
                      {r.mobile === 'ro' && <Badge variant="warning" size="xs">{t('admin.readOnlyTag')}</Badge>}
                      {r.mobile === false && <Badge variant="critical" size="xs">⛔ {t('admin.noAccessTag')}</Badge>}
                    </TD>
                    <TD className="text-[12px] text-text-secondary">{t(`admin.roleNote.${r.code}`)}</TD>
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
