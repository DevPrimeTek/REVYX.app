'use client';

// M0.S2 + M0.S3 · J4 Manager escalation queue · 🌐 Web only (DP-05)
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-13
// Platform Matrix: §3 Modul 2.12 — escalation overrides Web-only per DP-05.

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { agents as mockAgents, leads as mockLeads } from '@/lib/mock';

type Escalation = {
  id: string;
  lead: string;
  leadId: string;
  agent: string;
  ls: number;
  sla: string;
  level: 1 | 2 | 3;
  age: string;
};

const slaStages = ['T+SLA', 'T+SLA+30m', 'T+SLA+2h'] as const;
const ages = ['12 min', '47 min', '2h 18min', '38 min', '6 min', '2h 41min'];

function makeInitial(): Escalation[] {
  const top = mockLeads
    .filter((l) => l.status === 'HOT' || l.status === 'qualified')
    .slice(0, 6);
  return top.map((l, i) => {
    const ag = mockAgents[(i + 2) % mockAgents.length];
    const level = ((i % 3) + 1) as 1 | 2 | 3;
    return {
      id: `E-${String(300 + i + 1).padStart(3, '0')}`,
      lead: `${l.name} (${l.id})`,
      leadId: l.id,
      agent: ag.name.split(' ').slice(0, 2).join(' '),
      ls: l.ls,
      sla: slaStages[(level - 1) as 0 | 1 | 2],
      level,
      age: ages[i % ages.length],
    };
  });
}

function buildReassignTargets(formatLoad: (tasks: number) => string) {
  return mockAgents.slice(0, 4).map((a) => ({
    id: a.id,
    name: a.name,
    load: formatLoad(a.activeTasks),
    aps: a.aps,
  }));
}

export default function EscalationsPage() {
  const { toast } = useToast();
  const { t } = useT();
  const initial = useMemo(() => makeInitial(), []);
  const [items, setItems] = useState<Escalation[]>(initial);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reassignOpen, setReassignOpen] = useState(false);
  const reassignTargets = useMemo(
    () => buildReassignTargets((tasks) => t('escalations.agentLoad', { tasks: String(tasks) })),
    [t]
  );
  const [target, setTarget] = useState<string>(reassignTargets[0]?.id ?? 'A-001');

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
      toast({ variant: 'warning', title: t('escalations.modalSelectFirst') });
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
      title: t('escalations.toastSuccess', { count: String(count), agent: agent?.name ?? target }),
      description: t('escalations.toastSuccessDesc', { count: String(count), ids: ids.join(', ') }),
      duration: 6000,
    });
  }

  return (
    <>
      <SiteNav active="/manager" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <nav aria-label="Breadcrumb" className="text-[12px] text-text-secondary">
          <Link href="/manager" className="hover:text-text-h">{t('escalations.breadcrumb')}</Link>
          <span className="mx-sp1 text-text-muted">/</span>
          <span className="text-text-h">{t('manager.escalations')}</span>
        </nav>

        <header className="flex items-start justify-between gap-sp3 flex-wrap">
          <div>
            <div className="flex items-center gap-sp2">
              <p className="label-mono text-gold">{t('escalations.moduleLabel')}</p>
              <Badge variant="critical" size="xs">{t('escalations.webOnly')}</Badge>
            </div>
            <h1 className="text-[28px] mt-sp1">{t('escalations.title')}</h1>
            <p className="text-[13px] text-text-secondary mt-sp1">
              {t('escalations.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-sp2 flex-wrap">
            <Badge variant="info" size="sm">{t('escalations.activeBadge', { count: String(items.length) })}</Badge>
            <Button onClick={openReassign} disabled={selected.size === 0}>
              {t('escalations.bulkReassign', { count: String(selected.size) })}
            </Button>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>{t('escalations.queueTitle')}</CardTitle>
            <CardDescription>
              {t('escalations.queueDesc')}
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
                        aria-label={t('escalations.selectAll')}
                        className="accent-gold"
                        checked={allChecked}
                        ref={(el) => {
                          if (el) el.indeterminate = someChecked;
                        }}
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="px-sp3 py-sp2">{t('escalations.colId')}</th>
                    <th className="px-sp3 py-sp2">{t('escalations.colLead')}</th>
                    <th className="px-sp3 py-sp2">{t('escalations.colAgent')}</th>
                    <th className="px-sp3 py-sp2">{t('escalations.colSlaStage')}</th>
                    <th className="px-sp3 py-sp2">{t('escalations.colAge')}</th>
                    <th className="px-sp3 py-sp2">{t('escalations.colLevel')}</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:nth-child(odd)]:bg-navy [&_tr:nth-child(even)]:bg-navy-mid">
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-sp3 py-sp8 text-center text-text-muted">
                        {t('escalations.empty')}
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
                            aria-label={t('escalations.selectOne', { id: e.id })}
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
        title={t('escalations.modalTitle', { count: String(selected.size) })}
        description={t('escalations.modalDesc')}
        size="md"
      >
        <p className="text-[12px] text-text-secondary">{t('escalations.modalItems')}</p>
        <ul className="mt-sp1 mb-sp3 text-[12px] font-mono text-text-h flex flex-wrap gap-sp1">
          {selectedItems.map((i) => (
            <li key={i.id} className="bg-navy-deep border border-border rounded-md px-sp2 py-1">
              {i.id}
            </li>
          ))}
        </ul>

        <fieldset className="flex flex-col gap-sp2">
          <legend className="label-mono text-text-secondary mb-sp1">{t('escalations.modalReassignTo')}</legend>
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
                      {t('escalations.agentMeta', { id: a.id, aps: a.aps.toFixed(2), load: a.load })}
                    </span>
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>

        <div className="flex items-center justify-end gap-sp2 mt-sp4 pt-sp3 border-t border-border">
          <Button variant="ghost" onClick={() => setReassignOpen(false)}>
            {t('escalations.modalCancel')}
          </Button>
          <Button onClick={confirmReassign}>{t('escalations.modalConfirm')}</Button>
        </div>
      </Modal>
    </>
  );
}
