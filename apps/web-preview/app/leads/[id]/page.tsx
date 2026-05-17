'use client';

// M0.S2 · T-M0.S2-01 · J1 Lead intake → Score → Assign · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S2)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md §3.2

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LeadScoreBadge, ScorePill } from '@/components/ui/score-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { formatScore } from '@/lib/utils';

const baseLs = 0.82;

const agents = [
  { id: 'A-001', name: 'Andrei Caraman',   aps: 0.84, slots: '2/3 active', match: 'top' },
  { id: 'A-002', name: 'Doina Cebotari',   aps: 0.79, slots: '1/3 active', match: 'good' },
  { id: 'A-003', name: 'Sergiu Pîrlog',    aps: 0.71, slots: '3/3 full',   match: 'busy' },
  { id: 'A-004', name: 'Tatiana Movilă',   aps: 0.65, slots: '0/3 active', match: 'available' },
];

type Params = { params: { id: string } };

export default function LeadDetailPage({ params }: Params) {
  const router = useRouter();
  const { toast } = useToast();
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('A-001');
  const [ls, setLs] = useState(baseLs);
  const [recomputing, setRecomputing] = useState(false);

  function recomputeScore() {
    if (recomputing) return;
    setRecomputing(true);
    const target = Math.min(0.95, baseLs + 0.03 + Math.random() * 0.04);
    const steps = 18;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setLs((cur) => cur + (target - cur) / Math.max(1, steps - i));
      if (i >= steps) {
        clearInterval(id);
        setLs(target);
        setRecomputing(false);
        toast({
          variant: 'success',
          title: `Lead Score recomputat → ${formatScore(target)}`,
          description: 'Signal-uri proaspete: interacțiune WhatsApp + match P-2041 actualizat.',
        });
      }
    }, 40);
  }

  function confirmAssign() {
    const agent = agents.find((a) => a.id === selectedAgent);
    setAssignOpen(false);
    toast({
      variant: 'success',
      title: `Lead ${params.id} asignat lui ${agent?.name ?? selectedAgent}`,
      description: 'Task adăugat în queue. Audit-log eveniment LEAD_ASSIGNED scris (BR-07).',
      duration: 5000,
    });
    setTimeout(() => router.push('/dashboard'), 600);
  }

  return (
    <>
      <SiteNav active="/leads" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary">
          <Link href="/leads" className="hover:text-text-h focus-visible:text-gold rounded-sm">
            Queue
          </Link>
          <span className="mx-sp1 text-text-muted">/</span>
          <span className="text-text-h font-mono">{params.id}</span>
        </nav>

        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <p className="label-mono text-gold">Modul 2 · Lead Detail</p>
            <h1 className="text-[28px] mt-sp1">Maria Popescu</h1>
            <div className="flex items-center gap-sp2 mt-sp2">
              <LeadScoreBadge ls={ls} />
              <Badge variant="updated">Match needs review</Badge>
              {recomputing && <Badge variant="info" size="xs">recomputing…</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-sp2 flex-wrap">
            <Button variant="ghost" onClick={recomputeScore} disabled={recomputing}>
              Recalculează LS
            </Button>
            <Button variant="secondary">WhatsApp</Button>
            <Button onClick={() => setAssignOpen(true)}>Asignează agent</Button>
          </div>
        </header>

        <div className="bg-status-amber/10 border border-status-amber/30 rounded-lg px-sp3 py-sp2 text-[13px] text-text-h">
          <strong className="text-status-amber">Re-matching:</strong> proprietatea P-2041 a fost actualizată — match-urile au
          fost re-evaluate. Deal-ul existent NU se anulează automat (BR-05).
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-sp3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Detalii lead</CardTitle>
              <CardDescription>GDPR consent capturat 2026-05-12 14:21 (BRD §9.4).</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-sp3 text-[13px]">
                <div>
                  <dt className="label-mono text-text-muted">Sursă</dt>
                  <dd className="text-text-h">Meta Lead Ads · Campania &quot;Apartament 2 cam Centru&quot;</dd>
                </div>
                <div>
                  <dt className="label-mono text-text-muted">Buget</dt>
                  <dd className="text-text-h">€55,000 – €75,000</dd>
                </div>
                <div>
                  <dt className="label-mono text-text-muted">Zonă preferată</dt>
                  <dd className="text-text-h">Chișinău · Centru, Botanica</dd>
                </div>
                <div>
                  <dt className="label-mono text-text-muted">Camere</dt>
                  <dd className="text-text-h">2 – 3</dd>
                </div>
              </dl>

              <div className="mt-sp4 flex flex-wrap gap-sp3">
                <ScorePill label="LS" value={ls} />
                <ScorePill label="IS" value={0.54} />
                <ScorePill label="Trust" value={0.71} />
                <ScorePill label="DP" value={0.66} />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" accentTop>
            <CardHeader>
              <p className="label-mono text-gold">Modul 4 · Match suggestions</p>
              <CardTitle>Top 3 proprietăți</CardTitle>
              <CardDescription>PS+LS+IS combined (match v1).</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-sp2">
              {[
                { id: 'P-2041', addr: 'Str. București 14, ap. 23', score: 0.84 },
                { id: 'P-2008', addr: 'Str. Mihai Eminescu 7, ap. 5', score: 0.76 },
                { id: 'P-1992', addr: 'Bd. Ștefan cel Mare 91, ap. 12', score: 0.71 },
              ].map((p) => (
                <Link
                  key={p.id}
                  href="/properties"
                  className="flex items-start justify-between border border-border rounded-md px-sp2 py-sp2 transition-all duration-fast hover:border-gold/60 hover:bg-navy-hover hover:-translate-y-0.5 focus-visible:border-gold focus-visible:outline-none"
                >
                  <div>
                    <p className="font-mono text-[11px] text-text-secondary">{p.id}</p>
                    <p className="text-text-h text-[13px]">{p.addr}</p>
                  </div>
                  <span className="font-mono text-gold">{p.score.toFixed(2)}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title={`Asignează lead ${params.id}`}
        description="Agent selectat va primi task activ (BR-04: max 3/agent). Eveniment LEAD_ASSIGNED audit-logged."
        size="md"
      >
        <fieldset className="flex flex-col gap-sp2">
          <legend className="sr-only">Lista agenților disponibili</legend>
          {agents.map((a) => {
            const disabled = a.match === 'busy';
            const checked = selectedAgent === a.id;
            return (
              <label
                key={a.id}
                className={
                  'flex items-center justify-between gap-sp3 border rounded-md px-sp3 py-sp2 transition-all cursor-pointer ' +
                  (disabled
                    ? 'border-border opacity-50 cursor-not-allowed'
                    : checked
                    ? 'border-gold bg-navy-hover'
                    : 'border-border hover:border-border-light hover:bg-navy-hover')
                }
              >
                <span className="flex items-center gap-sp2 min-w-0">
                  <input
                    type="radio"
                    name="agent"
                    value={a.id}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => setSelectedAgent(a.id)}
                    className="accent-gold"
                  />
                  <span className="flex flex-col">
                    <span className="text-text-h text-[13px]">{a.name}</span>
                    <span className="text-text-muted text-[11px] font-mono">
                      {a.id} · APS {formatScore(a.aps)} · {a.slots}
                    </span>
                  </span>
                </span>
                <Badge
                  variant={
                    a.match === 'top'
                      ? 'success'
                      : a.match === 'good'
                      ? 'info'
                      : a.match === 'available'
                      ? 'updated'
                      : 'critical'
                  }
                  size="xs"
                >
                  {a.match}
                </Badge>
              </label>
            );
          })}
        </fieldset>

        <div className="flex items-center justify-end gap-sp2 mt-sp4 pt-sp3 border-t border-border">
          <Button variant="ghost" onClick={() => setAssignOpen(false)}>
            Renunță
          </Button>
          <Button onClick={confirmAssign}>Confirmă asignare</Button>
        </div>
      </Modal>
    </>
  );
}
