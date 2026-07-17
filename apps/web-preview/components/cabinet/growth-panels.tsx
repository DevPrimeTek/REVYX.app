'use client';

// Val 4 (AGI §18.2 Goals + §18.5 Value Proposition + §18.6 Client Alumni) · 3 panouri pentru
// dezvoltarea agentului. VISUAL SKELETON (localStorage + mock). Structura avansată: entități
// agent_goals / client_alumni + actuals din cron + statistici reale APS.

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import {
  useAgentGrowth, setAgentGrowth,
  CATALOG, getActualValue, formatObjectiveValue,
  type AgentObjective,
} from '@/lib/agent-growth-store';
import { formatDate } from '@/lib/format';
import type { Agent } from '@/lib/mock';

function Progress({ value, target, tone }: { value: number; target: number; tone: string }) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div className="h-2 rounded-pill bg-border overflow-hidden">
      <div className={`h-full rounded-pill ${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** §18.2 — Obiectivele mele (catalog selectabil + target lunar + progres vs realizat). */
export function AgentGoalsPanel({ agent }: { agent: Agent }) {
  const { t } = useT();
  const { toast } = useToast();
  const g = useAgentGrowth(agent.id);
  const [showCatalog, setShowCatalog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const selectedIds = new Set(g.objectives.map((o) => o.id));
  const availableCatalog = CATALOG.filter((c) => !selectedIds.has(c.id));

  function addObjective(id: string) {
    const item = CATALOG.find((c) => c.id === id);
    if (!item) return;
    const newObj: AgentObjective = { id, target: item.defaultTarget };
    setAgentGrowth(agent.id, { ...g, objectives: [...g.objectives, newObj] });
    if (availableCatalog.length <= 1) setShowCatalog(false);
    toast({ variant: 'success', title: t('growth.goals.toastSaved') });
  }

  function removeObjective(id: string) {
    setAgentGrowth(agent.id, { ...g, objectives: g.objectives.filter((o) => o.id !== id) });
  }

  function startEdit(id: string, current: number) {
    setEditingId(id);
    setEditValue(String(current));
  }

  function saveEdit(id: string) {
    const updated = g.objectives.map((o) =>
      o.id === id ? { ...o, target: Number(editValue) || o.target } : o
    );
    setAgentGrowth(agent.id, { ...g, objectives: updated });
    setEditingId(null);
    toast({ variant: 'success', title: t('growth.goals.toastSaved') });
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-sp2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>{t('growth.goals.title')}</CardTitle>
          <CardDescription>{t('growth.goals.desc')}</CardDescription>
        </div>
        {availableCatalog.length > 0 && (
          <Button variant="secondary" size="sm" onClick={() => setShowCatalog((v) => !v)}>
            {showCatalog ? t('common.cancel') : t('growth.addObjectiveCta')}
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-sp3">
        {/* Catalog picker — inline expandable */}
        {showCatalog && (
          <div className="rounded-md border border-border bg-navy-deep/40 p-sp2 flex flex-col gap-sp1">
            <p className="text-[11px] text-text-muted mb-sp1">{t('growth.addObjectiveTitle')}</p>
            {availableCatalog.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => addObjective(item.id)}
                className="flex items-center justify-between text-left px-sp2 py-1.5 rounded hover:bg-navy-hover transition-colors duration-fast group"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] text-text-h group-hover:text-gold">{t(`growth.catalog.${item.id}`)}</span>
                  <p className="text-[11px] text-text-muted truncate">{t(`growth.catalog.${item.id}Desc`)}</p>
                </div>
                <span className="text-[11px] text-text-muted font-mono ml-sp3 flex-shrink-0">
                  {t('growth.targetLabel')}: {formatObjectiveValue(item.defaultTarget, item.unit)}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Active objectives */}
        {g.objectives.length === 0 && (
          <p className="text-[12px] text-text-muted">{t('growth.addObjectiveTitle')}</p>
        )}
        {g.objectives.map((obj) => {
          const item = CATALOG.find((c) => c.id === obj.id);
          if (!item) return null;
          const actual = getActualValue(obj.id, agent);
          const behind = actual < obj.target * 0.6;
          const done = actual >= obj.target;
          const tone = done ? 'bg-status-green' : behind ? 'bg-status-amber' : 'bg-gold';
          const isEditing = editingId === obj.id;

          return (
            <div key={obj.id} className="flex flex-col gap-sp1">
              <div className="flex items-center justify-between gap-sp1 flex-wrap">
                <span className="text-[13px] text-text-secondary">{t(`growth.catalog.${item.id}`)}</span>
                <div className="flex items-center gap-sp1 flex-shrink-0">
                  {isEditing ? (
                    <>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(obj.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="w-20 h-7 px-sp1 bg-navy-deep border border-gold rounded text-[12px] text-text-h focus-visible:outline-none"
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                      />
                      <button type="button" onClick={() => saveEdit(obj.id)} className="text-[11px] text-gold hover:text-gold-dark cursor-pointer">{t('common.save')}</button>
                      <button type="button" onClick={() => setEditingId(null)} className="text-[11px] text-text-muted hover:text-text-h cursor-pointer">{t('common.cancel')}</button>
                    </>
                  ) : (
                    <>
                      <span className="font-mono text-[12px] text-text-h">
                        {formatObjectiveValue(actual, item.unit)} / {formatObjectiveValue(obj.target, item.unit)}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit(obj.id, obj.target)}
                        className="text-[11px] text-text-muted hover:text-gold cursor-pointer"
                        aria-label={t('growth.editTarget')}
                      >
                        {t('growth.editTarget')}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeObjective(obj.id)}
                        className="text-[14px] text-text-muted hover:text-status-red cursor-pointer leading-none"
                        aria-label={t('growth.removeObjective')}
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              </div>
              <Progress value={actual} target={obj.target} tone={tone} />
              {behind && !isEditing && (
                <p className="text-[11px] text-status-amber">{t('growth.goals.behindHint')}</p>
              )}
            </div>
          );
        })}

        <p className="text-[10px] text-text-muted border-t border-border pt-sp2">{t('growth.skeletonNote')}</p>
      </CardContent>
    </Card>
  );
}

/** §18.5 — Propunerea mea de valoare (bullet-uri + statistici). */
export function ValuePropositionPanel({ agent }: { agent: Agent }) {
  const { t } = useT();
  const { toast } = useToast();
  const g = useAgentGrowth(agent.id);
  const [draft, setDraft] = useState('');

  function addBullet() {
    const v = draft.trim();
    if (!v || g.valueBullets.length >= 5 || g.valueBullets.includes(v)) return;
    setAgentGrowth(agent.id, { ...g, valueBullets: [...g.valueBullets, v] });
    setDraft('');
    toast({ variant: 'success', title: t('growth.value.toastSaved') });
  }
  function removeBullet(b: string) {
    setAgentGrowth(agent.id, { ...g, valueBullets: g.valueBullets.filter((x) => x !== b) });
  }

  // Statistici (mock derivat).
  const avgDays = 30 + (agent.closedDeals30d % 12);
  const acceptance = 65 + (agent.closedDeals30d % 20);
  const satisfaction = (4.5 + (agent.trust % 0.5)).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('growth.value.title')}</CardTitle>
        <CardDescription>{t('growth.value.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-sp3">
        <ul className="flex flex-col gap-sp1">
          {g.valueBullets.map((b) => (
            <li key={b} className="flex items-start gap-sp2 text-[13px] text-text-h">
              <span className="text-gold mt-0.5">•</span>
              <span className="flex-1">{b}</span>
              <button type="button" onClick={() => removeBullet(b)} className="text-text-muted hover:text-status-red cursor-pointer text-[14px] leading-none" aria-label="remove">×</button>
            </li>
          ))}
        </ul>
        {g.valueBullets.length < 5 && (
          <div className="flex gap-sp1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBullet(); } }}
              placeholder={t('growth.value.placeholder')}
              className="flex-1 min-w-0 h-9 px-sp2 bg-navy-deep border border-border rounded-md text-[12px] text-text-h focus-visible:outline-none focus-visible:border-gold"
            />
            <Button size="sm" variant="secondary" onClick={addBullet}>+ {t('growth.addCta')}</Button>
          </div>
        )}
        <div className="grid grid-cols-3 gap-sp2 pt-sp2 border-t border-border">
          {[
            { label: t('growth.value.avgDays'), value: `${avgDays} ${t('growth.value.daysUnit')}` },
            { label: t('growth.value.acceptance'), value: `${acceptance}%` },
            { label: t('growth.value.satisfaction'), value: `${satisfaction}/5` },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[16px] font-display text-gold leading-none">{s.value}</p>
              <p className="text-[10px] text-text-muted mt-sp1">{s.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/** §18.6 — Clienții anteriori (alumni + referrals). Mock. */
export function AlumniPanel({ agent }: { agent: Agent }) {
  const { t } = useT();
  const names = ['Andrei P.', 'Maria C.', 'Ion R.', 'Elena V.'];
  const alumni = names.slice(0, 3 + (agent.closedDeals30d % 2)).map((name, i) => ({
    name,
    date: `2024-${String(3 + i).padStart(2, '0')}-15`,
    referred: i % 2 === 0,
  }));
  const referrals = alumni.filter((a) => a.referred).length;
  const returnRate = Math.round((referrals / alumni.length) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('growth.alumni.title')}</CardTitle>
        <CardDescription>{t('growth.alumni.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-sp3">
        <div className="grid grid-cols-3 gap-sp2">
          {[
            { label: t('growth.alumni.total'), value: String(alumni.length) },
            { label: t('growth.alumni.referrals'), value: String(referrals) },
            { label: t('growth.alumni.returnRate'), value: `${returnRate}%` },
          ].map((s) => (
            <div key={s.label} className="text-center rounded-md border border-border bg-navy-deep/40 p-sp2">
              <p className="text-[18px] font-display text-gold leading-none">{s.value}</p>
              <p className="text-[10px] text-text-muted mt-sp1">{s.label}</p>
            </div>
          ))}
        </div>
        <ul className="flex flex-col gap-sp1">
          {alumni.map((a) => (
            <li key={a.name} className="flex items-center justify-between gap-sp2 text-[13px] border border-border rounded-md px-sp2 py-sp1">
              <div>
                <span className="text-text-h">{a.name}</span>
                <span className="text-text-muted text-[11px] ml-sp2">{formatDate(a.date)}</span>
              </div>
              {a.referred && <Badge variant="success" size="xs">{t('growth.alumni.referredBadge')}</Badge>}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
