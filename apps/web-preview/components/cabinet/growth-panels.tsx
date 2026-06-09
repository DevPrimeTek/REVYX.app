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
import { useAgentGrowth, setAgentGrowth } from '@/lib/agent-growth-store';
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

/** §18.2 — Obiectivele mele (target lunar + progres vs realizat). */
export function AgentGoalsPanel({ agent }: { agent: Agent }) {
  const { t } = useT();
  const { toast } = useToast();
  const g = useAgentGrowth(agent.id);
  const [editing, setEditing] = useState(false);
  const [deals, setDeals] = useState(String(g.targetDeals));
  const [commission, setCommission] = useState(String(g.targetCommissionEur));

  // Realizat (mock din datele agentului).
  const actualDeals = agent.closedDeals30d;
  const actualCommission = agent.closedDeals30d * 7000;
  const behind = actualDeals < g.targetDeals * 0.6;

  function save() {
    setAgentGrowth(agent.id, { ...g, targetDeals: Number(deals) || 0, targetCommissionEur: Number(commission) || 0 });
    setEditing(false);
    toast({ variant: 'success', title: t('growth.goals.toastSaved') });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-sp2">
        <div>
          <CardTitle>{t('growth.goals.title')}</CardTitle>
          <CardDescription>{t('growth.goals.desc')}</CardDescription>
        </div>
        {!editing && <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>{t('growth.editCta')}</Button>}
      </CardHeader>
      <CardContent className="flex flex-col gap-sp3">
        {editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sp3">
            <label className="flex flex-col gap-sp1 text-[12px] text-text-secondary">
              {t('growth.goals.targetDeals')}
              <input type="number" value={deals} onChange={(e) => setDeals(e.target.value)} className="h-9 px-sp2 bg-navy-deep border border-border rounded-md text-text-h focus-visible:outline-none focus-visible:border-gold" />
            </label>
            <label className="flex flex-col gap-sp1 text-[12px] text-text-secondary">
              {t('growth.goals.targetCommission')}
              <input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} className="h-9 px-sp2 bg-navy-deep border border-border rounded-md text-text-h focus-visible:outline-none focus-visible:border-gold" />
            </label>
            <div className="sm:col-span-2 flex justify-end gap-sp2">
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>{t('common.cancel')}</Button>
              <Button size="sm" onClick={save}>{t('common.save')}</Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <div className="flex justify-between text-[13px] mb-sp1">
                <span className="text-text-secondary">{t('growth.goals.dealsProgress')}</span>
                <span className="text-text-h font-medium">{actualDeals} / {g.targetDeals}</span>
              </div>
              <Progress value={actualDeals} target={g.targetDeals} tone={behind ? 'bg-status-amber' : 'bg-status-green'} />
            </div>
            <div>
              <div className="flex justify-between text-[13px] mb-sp1">
                <span className="text-text-secondary">{t('growth.goals.commissionProgress')}</span>
                <span className="text-text-h font-medium">€{actualCommission.toLocaleString('ro-MD')} / €{g.targetCommissionEur.toLocaleString('ro-MD')}</span>
              </div>
              <Progress value={actualCommission} target={g.targetCommissionEur} tone="bg-gold" />
            </div>
            {behind && (
              <div className="rounded-md bg-status-amber/10 border border-status-amber/30 px-sp2 py-sp1 text-[11px] text-status-amber">
                {t('growth.goals.behindHint')}
              </div>
            )}
          </>
        )}
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
