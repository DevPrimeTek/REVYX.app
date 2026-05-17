import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScorePill } from '@/components/ui/score-badge';

const agents = [
  { id: 'A-001', name: 'Andrei Caraman',   aps: 0.84, conv: 0.46, deals30d: 7 },
  { id: 'A-002', name: 'Doina Cebotari',   aps: 0.79, conv: 0.41, deals30d: 6 },
  { id: 'A-003', name: 'Sergiu Pîrlog',    aps: 0.71, conv: 0.38, deals30d: 5 },
  { id: 'A-004', name: 'Tatiana Movilă',   aps: 0.65, conv: 0.34, deals30d: 4 },
  { id: 'A-005', name: 'Valeria Postu',    aps: 0.62, conv: 0.30, deals30d: 3 },
];

const escalations = [
  { id: 'E-301', lead: 'Maria P.',  sla: 'T+SLA+30m', level: 2 },
  { id: 'E-302', lead: 'Ion C.',    sla: 'T+SLA',    level: 1 },
  { id: 'E-303', lead: 'Olga C.',   sla: 'T+SLA+2h', level: 3 },
];

export default function ManagerPage() {
  return (
    <>
      <SiteNav active="/manager" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">Modul 10 · Reports · Modul 2.12 · Escalations</p>
          <h1 className="text-[28px] mt-sp1">Manager Dashboard</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">
            🌐 Web only (DP-05). Acțiunile de reassignment + bulk override sunt audit-logged automat (BR-07).
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <Card variant="elevated" accentTop>
            <CardHeader>
              <p className="label-mono text-gold">APS</p>
              <CardTitle>Team avg</CardTitle>
              <CardDescription>5 agenți activi · 30 zile.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-[32px] text-gold">0.72</p>
              <p className="text-[12px] text-text-secondary mt-sp1">+0.04 vs perioada anterioară</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">Conversie</p>
              <CardTitle>Lead → Deal won</CardTitle>
              <CardDescription>BR-13 prevention rate ≥ 30%.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-[32px] text-text-h">38%</p>
              <p className="text-[12px] text-status-green mt-sp1">peste target</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="label-mono text-text-secondary">Escalări active</p>
              <CardTitle>3 pe queue</CardTitle>
              <CardDescription>BR-03 · 3 niveluri.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-[32px] text-status-amber">3</p>
              <p className="text-[12px] text-text-secondary mt-sp1">1× nivel 1 · 1× nivel 2 · 1× nivel 3</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>APS leaderboard</CardTitle>
            <CardDescription>
              APS_default = 0.65 pentru agenți cu &lt;5 deal-uri SAU &lt;30 zile (BR-11).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>ID</TH>
                  <TH>Agent</TH>
                  <TH>APS</TH>
                  <TH>Conversie</TH>
                  <TH>Deals 30d</TH>
                </TR>
              </THead>
              <TBody>
                {agents.map((a) => (
                  <TR key={a.id}>
                    <TD className="font-mono text-text-secondary">{a.id}</TD>
                    <TD>{a.name}</TD>
                    <TD><ScorePill label="APS" value={a.aps} /></TD>
                    <TD className="font-mono">{Math.round(a.conv * 100)}%</TD>
                    <TD className="font-mono">{a.deals30d}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Escalation queue</CardTitle>
            <CardDescription>3 niveluri (BR-03): T+SLA · T+SLA+30 min · T+SLA+2h.</CardDescription>
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
                      <Badge
                        variant={e.level === 1 ? 'warning' : e.level === 2 ? 'critical' : 'critical'}
                        size="xs"
                      >
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
