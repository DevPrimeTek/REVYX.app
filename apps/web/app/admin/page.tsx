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
  { code: 'agent',        label: 'Agent',        web: true, mobile: true,  note: 'Operațional in-field + Web' },
  { code: 'senior_agent', label: 'Senior Agent', web: true, mobile: true,  note: 'Agent + override propriu' },
  { code: 'team_lead',    label: 'Team Lead',    web: true, mobile: 'ro',  note: 'Mobile read-only' },
  { code: 'manager',      label: 'Manager',      web: true, mobile: 'ro',  note: 'Mobile read-only · escalări = Web' },
  { code: 'admin',        label: 'Admin',        web: true, mobile: false, note: 'DP-05 · Web only' },
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
            <Badge variant="critical" size="xs">Web only · DP-05</Badge>
          </div>
          <h1 className="text-[28px] mt-sp1">{t('admin.title')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">{t('admin.subtitle')}</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          {[
            { title: 'Users & RBAC', desc: 'Invită, suspendă, schimbă roluri.', count: '24 active' },
            { title: 'Audit log',    desc: 'Append-only · CSV export.',        count: '108.4k events' },
            { title: 'Branding',     desc: 'White-label preview (Enterprise).', count: '2 tenanți' },
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
            <CardDescription>Multi-tenant overview · Starter / Pro / Enterprise plans.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>ID</TH>
                  <TH>{t('common.name')}</TH>
                  <TH>Plan</TH>
                  <TH>Agenți</TH>
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
                        {tn.status}
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
            <CardTitle>{t('admin.rbac')} (preview)</CardTitle>
            <CardDescription>5 roluri core (BRD §10.1). Roluri custom Phase 5 la M1.S6.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>Cod</TH>
                  <TH>Rol</TH>
                  <TH>🌐 Web</TH>
                  <TH>📱 Mobile</TH>
                  <TH>Note</TH>
                </TR>
              </THead>
              <TBody>
                {roles.map((r) => (
                  <TR key={r.code}>
                    <TD className="font-mono text-text-secondary">{r.code}</TD>
                    <TD>{r.label}</TD>
                    <TD>
                      <Badge variant="success" size="xs">access</Badge>
                    </TD>
                    <TD>
                      {r.mobile === true && <Badge variant="success" size="xs">access</Badge>}
                      {r.mobile === 'ro' && <Badge variant="warning" size="xs">read-only</Badge>}
                      {r.mobile === false && <Badge variant="critical" size="xs">⛔ DP-05</Badge>}
                    </TD>
                    <TD className="text-[12px] text-text-secondary">{r.note}</TD>
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
