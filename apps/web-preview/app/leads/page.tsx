import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { LeadScoreBadge } from '@/components/ui/score-badge';
import { Badge } from '@/components/ui/badge';

const leads = [
  { id: 'L-0001', name: 'Maria Popescu',    ls: 0.82, source: 'Meta',   sla: '15m',  status: 'HOT' },
  { id: 'L-0002', name: 'Andrei Bodiu',     ls: 0.71, source: 'OLX',    sla: '2h',   status: 'calificat' },
  { id: 'L-0003', name: 'Ion Cojocaru',     ls: 0.64, source: 'Google', sla: '2h',   status: 'calificat' },
  { id: 'L-0004', name: 'Elena Rusu',       ls: 0.58, source: 'Meta',   sla: '24h',  status: 'warm' },
  { id: 'L-0005', name: 'Mihai Țurcanu',    ls: 0.41, source: 'OLX',    sla: '24h',  status: 'warm' },
  { id: 'L-0006', name: 'Olga Ciobanu',     ls: 0.32, source: 'Google', sla: '—',    status: 'nurturing' },
];

export default function LeadsPage() {
  return (
    <>
      <SiteNav active="/leads" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">Modul 2 · Lead Queue</p>
          <h1 className="text-[28px] mt-sp1">Queue lead-uri</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">
            BR-01 Lead Firewall: doar LS ≥ 0.60 + contact valid devin task-uri active. Lead-urile sub
            prag rămân în nurturing automat (BR-13).
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>6 lead-uri</CardTitle>
            <CardDescription>SLA: HOT 15m · Calificat 2h · Warm 24h.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>ID</TH>
                  <TH>Nume</TH>
                  <TH>Sursă</TH>
                  <TH>SLA</TH>
                  <TH>Lead Score</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {leads.map((l) => (
                  <TR key={l.id}>
                    <TD className="font-mono text-text-secondary">{l.id}</TD>
                    <TD>
                      <Link href={`/leads/${l.id}`} className="text-text-h hover:text-gold underline-offset-4 hover:underline">
                        {l.name}
                      </Link>
                    </TD>
                    <TD className="text-text-secondary">{l.source}</TD>
                    <TD className="font-mono">{l.sla}</TD>
                    <TD><LeadScoreBadge ls={l.ls} /></TD>
                    <TD>
                      {l.status === 'nurturing' ? (
                        <span className="text-text-muted text-[12px]">nurturing (auto)</span>
                      ) : (
                        <Badge variant={l.status === 'HOT' ? 'hot' : l.status === 'calificat' ? 'qualified' : 'warm'} size="xs">
                          {l.status}
                        </Badge>
                      )}
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
