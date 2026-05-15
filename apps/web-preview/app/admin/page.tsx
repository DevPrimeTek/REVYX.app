import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const roles = [
  { code: 'agent',         label: 'Agent',          web: true,  mobile: true,  note: 'Operațional in-field + Web' },
  { code: 'senior_agent',  label: 'Senior Agent',   web: true,  mobile: true,  note: 'Agent + override propriu' },
  { code: 'team_lead',     label: 'Team Lead',      web: true,  mobile: 'ro',  note: 'Mobile read-only' },
  { code: 'manager',       label: 'Manager',        web: true,  mobile: 'ro',  note: 'Mobile read-only · escalări = Web' },
  { code: 'admin',         label: 'Admin',          web: true,  mobile: false, note: 'DP-05 · Web only' },
];

export default function AdminPage() {
  return (
    <>
      <SiteNav active="/admin" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <div className="flex items-center gap-sp2">
            <p className="label-mono text-gold">Modul 11 · Admin</p>
            <Badge variant="critical" size="xs">Web only · DP-05</Badge>
          </div>
          <h1 className="text-[28px] mt-sp1">Admin panel</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">
            Per PLATFORM_MATRIX §12, modulul Admin este 🌐 Web exclusive (DP-05). Mobile nu expune RBAC
            management, audit log viewer, feature flags, branding sau billing.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          {[
            { title: 'Users & RBAC', desc: 'Invită, suspendă, schimbă roluri.', count: '24 active' },
            { title: 'Audit log',    desc: 'Append-only · CSV export.',        count: '108,4k events' },
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
            <CardTitle>RBAC matrix (preview)</CardTitle>
            <CardDescription>5 roluri core (BRD §10.1). Roluri custom Phase 5 sunt vizibile la M1.S6.</CardDescription>
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
                      {r.mobile === 'ro'  && <Badge variant="warning" size="xs">read-only</Badge>}
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
