'use client';

// M0.S2 · T-M0.S2-04 · J4 Manager escalation queue · 🌐 Web only (DP-05)
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S2)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md §3.2
// Platform Matrix: §3 Modul 2.12 — escalation overrides Web-only per DP-05.

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

type Escalation = {
  id: string;
  lead: string;
  agent: string;
  ls: number;
  sla: string;
  level: 1 | 2 | 3;
  age: string;
};

const initial: Escalation[] = [
  { id: 'E-301', lead: 'Maria Popescu (L-0001)',  agent: 'Andrei C.', ls: 0.82, sla: 'T+SLA+30m', level: 2, age: '47 min'  },
  { id: 'E-302', lead: 'Ion Cojocaru (L-0003)',   agent: 'Doina C.',  ls: 0.64, sla: 'T+SLA',    level: 1, age: '12 min'   },
  { id: 'E-303', lead: 'Olga Ciobanu (L-0006)',   agent: 'Sergiu P.', ls: 0.71, sla: 'T+SLA+2h', level: 3, age: '2h 18min' },
  { id: 'E-304', lead: 'Andrei Bodiu (L-0002)',   agent: 'Sergiu P.', ls: 0.71, sla: 'T+SLA+30m', level: 2, age: '38 min'  },
  { id: 'E-305', lead: 'Elena Rusu (L-0004)',     agent: 'Tatiana M.',ls: 0.58, sla: 'T+SLA',    level: 1, age: '6 min'    },
  { id: 'E-306', lead: 'Mihai Țurcanu (L-0005)',  agent: 'Sergiu P.', ls: 0.61, sla: 'T+SLA+2h', level: 3, age: '2h 41min' },
];

const reassignTargets = [
  { id: 'A-001', name: 'Andrei Caraman',  load: '2/3 active',  aps: 0.84 },
  { id: 'A-002', name: 'Doina Cebotari',  load: '1/3 active',  aps: 0.79 },
  { id: 'A-004', name: 'Tatiana Movilă',  load: '0/3 active',  aps: 0.65 },
  { id: 'A-005', name: 'Valeria Postu',   load: '1/3 active',  aps: 0.62 },
];

export default function EscalationsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Escalation[]>(initial);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reassignOpen, setReassignOpen] = useState(false);
  const [target, setTarget] = useState<string>('A-001');

  const allChecked = items.length > 0 && selected.size === items.length;
  const someChecked = selected.size > 0 && !allChecked;

  const selectedItems = useMemo(
    () => items.filter((i) => selected.has(i.id)),
    [items, selected]
  );

  function toggle(id: string) {
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(items.map((i) => i.id)));
  }

  function openReassign() {
    if (selected.size === 0) {
      toast({ variant: 'warning', title: 'Selectează cel puțin un lead.' });
      return;
    }
    setReassignOpen(true);
  }

  function confirmReassign() {
    const agent = reassignTargets.find((a) => a.id === target);
    const count = selectedItems.length;
    const ids = selectedItems.map((i) => i.id);
    setReassignOpen(false);
    setItems((cur) => cur.filter((i) => !selected.has(i.id)));
    setSelected(new Set());
    toast({
      variant: 'success',
      title: `${count} escalări reasignate către ${agent?.name ?? target}`,
      description: `Audit-log: ${count} × ESCALATION_REASSIGNED scris (BR-07). IDs: ${ids.join(', ')}.`,
      duration: 6000,
    });
  }

  return (
    <>
      <SiteNav active="/manager" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary">
          <Link href="/manager" className="hover:text-text-h">Manager</Link>
          <span className="mx-sp1 text-text-muted">/</span>
          <span className="text-text-h">Escalări</span>
        </nav>

        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <div className="flex items-center gap-sp2">
              <p className="label-mono text-gold">Modul 2.12 · Escalations</p>
              <Badge variant="critical" size="xs">Web only · DP-05</Badge>
            </div>
            <h1 className="text-[28px] mt-sp1">Coadă escalări active</h1>
            <p className="text-[13px] text-text-secondary mt-sp1">
              BR-03 protocolul de escalare 3 niveluri: T+SLA · T+SLA+30min · T+SLA+2h. Bulk reassign emite
              <span className="font-mono text-gold"> ESCALATION_REASSIGNED</span> per item în audit-log.
            </p>
          </div>
          <div className="flex items-center gap-sp2">
            <Badge variant="info" size="sm">{items.length} active</Badge>
            <Button onClick={openReassign} disabled={selected.size === 0}>
              Bulk reassign ({selected.size})
            </Button>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Queue</CardTitle>
            <CardDescription>
              Selectează checkbox-uri (sau header pentru toate) → apasă &quot;Bulk reassign&quot;. Manager
              override = audit-logged automat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-[13px] text-text-primary">
                <thead className="bg-navy-card text-gold text-[11px] uppercase tracking-label">
                  <tr>
                    <th className="px-sp3 py-sp2 w-10">
                      <input
                        type="checkbox"
                        aria-label="Selectează toate escalările"
                        className="accent-gold"
                        checked={allChecked}
                        ref={(el) => {
                          if (el) el.indeterminate = someChecked;
                        }}
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="px-sp3 py-sp2">ID</th>
                    <th className="px-sp3 py-sp2">Lead</th>
                    <th className="px-sp3 py-sp2">Agent curent</th>
                    <th className="px-sp3 py-sp2">SLA stage</th>
                    <th className="px-sp3 py-sp2">Vârsta</th>
                    <th className="px-sp3 py-sp2">Nivel</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:nth-child(odd)]:bg-navy [&_tr:nth-child(even)]:bg-navy-mid">
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-sp3 py-sp8 text-center text-text-muted">
                        Nicio escalare activă. ✓ Toate lead-urile sunt în SLA.
                      </td>
                    </tr>
                  )}
                  {items.map((e) => {
                    const isChecked = selected.has(e.id);
                    return (
                      <tr
                        key={e.id}
                        className={
                          'border-b border-border last:border-0 hover:bg-navy-hover transition-colors duration-fast ' +
                          (isChecked ? 'bg-navy-hover/60' : '')
                        }
                      >
                        <td className="px-sp3 py-sp2 align-middle">
                          <input
                            type="checkbox"
                            aria-label={`Selectează ${e.id}`}
                            className="accent-gold"
                            checked={isChecked}
                            onChange={() => toggle(e.id)}
                          />
                        </td>
                        <td className="px-sp3 py-sp2 font-mono text-text-secondary align-middle">{e.id}</td>
                        <td className="px-sp3 py-sp2 align-middle">{e.lead}</td>
                        <td className="px-sp3 py-sp2 text-text-secondary align-middle">{e.agent}</td>
                        <td className="px-sp3 py-sp2 font-mono align-middle">{e.sla}</td>
                        <td className="px-sp3 py-sp2 font-mono text-status-amber align-middle">{e.age}</td>
                        <td className="px-sp3 py-sp2 align-middle">
                          <Badge variant={e.level >= 2 ? 'critical' : 'warning'} size="xs">
                            L{e.level}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Modal
        open={reassignOpen}
        onClose={() => setReassignOpen(false)}
        title={`Bulk reassign — ${selected.size} escalări`}
        description="Acțiune audit-logged (BR-07). Notificare automată WhatsApp template T3 spre agentul-țintă."
        size="md"
      >
        <p className="text-[12px] text-text-secondary">Items selectate:</p>
        <ul className="mt-sp1 mb-sp3 text-[12px] font-mono text-text-h flex flex-wrap gap-sp1">
          {selectedItems.map((i) => (
            <li key={i.id} className="bg-navy-deep border border-border rounded-md px-sp2 py-1">
              {i.id}
            </li>
          ))}
        </ul>

        <fieldset className="flex flex-col gap-sp2">
          <legend className="label-mono text-text-secondary mb-sp1">Reasignează către</legend>
          {reassignTargets.map((a) => {
            const checked = target === a.id;
            return (
              <label
                key={a.id}
                className={
                  'flex items-center justify-between gap-sp3 border rounded-md px-sp3 py-sp2 cursor-pointer transition-all ' +
                  (checked
                    ? 'border-gold bg-navy-hover'
                    : 'border-border hover:border-border-light hover:bg-navy-hover')
                }
              >
                <span className="flex items-center gap-sp2">
                  <input
                    type="radio"
                    name="target-agent"
                    value={a.id}
                    checked={checked}
                    onChange={() => setTarget(a.id)}
                    className="accent-gold"
                  />
                  <span>
                    <span className="text-text-h text-[13px] block">{a.name}</span>
                    <span className="text-text-muted text-[11px] font-mono">
                      {a.id} · APS {a.aps.toFixed(2)} · {a.load}
                    </span>
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>

        <div className="flex items-center justify-end gap-sp2 mt-sp4 pt-sp3 border-t border-border">
          <Button variant="ghost" onClick={() => setReassignOpen(false)}>
            Renunță
          </Button>
          <Button onClick={confirmReassign}>Confirmă reassign</Button>
        </div>
      </Modal>
    </>
  );
}
