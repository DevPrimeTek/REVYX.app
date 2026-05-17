'use client';

// M0.S2 · T-M0.S2-03 · J3 Deal pipeline → close-won · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S2)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.1.md §3.2
// Note: drag-drop @dnd-kit deferred to M0.S3 (T-M0.S3-10); M0.S2 uses
// keyboard-accessible click-to-advance/back buttons per a11y review.

import { useMemo, useState } from 'react';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ScorePill } from '@/components/ui/score-badge';
import { useToast } from '@/components/ui/toast';

type StageKey = 'discovery' | 'qualified' | 'offer' | 'negotiation' | 'closing' | 'won';

const stageOrder: { key: StageKey; label: string }[] = [
  { key: 'discovery',   label: 'Discovery' },
  { key: 'qualified',   label: 'Calificat' },
  { key: 'offer',       label: 'Ofertă' },
  { key: 'negotiation', label: 'Negociere' },
  { key: 'closing',     label: 'Notariat' },
  { key: 'won',         label: 'Won' },
];

type Deal = { id: string; name: string; dp: number; dhi: number; stage: StageKey };

const initialDeals: Deal[] = [
  { id: 'D-1001', name: 'Maria P. · P-2041', dp: 0.42, dhi: 0.71, stage: 'discovery' },
  { id: 'D-1002', name: 'Andrei B. · P-2008', dp: 0.48, dhi: 0.65, stage: 'qualified' },
  { id: 'D-1003', name: 'Ion C. · P-1992',   dp: 0.58, dhi: 0.69, stage: 'offer' },
  { id: 'D-1004', name: 'Elena R. · P-2041', dp: 0.51, dhi: 0.62, stage: 'offer' },
  { id: 'D-1005', name: 'Mihai T. · P-2008', dp: 0.71, dhi: 0.78, stage: 'negotiation' },
  { id: 'D-1006', name: 'Olga C. · P-1978',  dp: 0.85, dhi: 0.84, stage: 'closing' },
  { id: 'D-0995', name: 'Vitalie B. · P-1942', dp: 1.0, dhi: 0.91, stage: 'won' },
];

export default function DealsPage() {
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [confirmDeal, setConfirmDeal] = useState<Deal | null>(null);

  const dealsByStage = useMemo(() => {
    const map: Record<StageKey, Deal[]> = {
      discovery: [], qualified: [], offer: [], negotiation: [], closing: [], won: [],
    };
    deals.forEach((d) => map[d.stage].push(d));
    return map;
  }, [deals]);

  function move(deal: Deal, dir: 1 | -1) {
    const idx = stageOrder.findIndex((s) => s.key === deal.stage);
    const next = stageOrder[idx + dir];
    if (!next) return;
    if (next.key === 'won') {
      setConfirmDeal(deal);
      return;
    }
    setDeals((cur) => cur.map((d) => (d.id === deal.id ? { ...d, stage: next.key } : d)));
    toast({
      variant: 'info',
      title: `${deal.id} mutat → ${next.label}`,
      description: `DP recalculat. Eveniment DEAL_STAGE_CHANGED audit-logged (BR-07).`,
    });
  }

  function confirmWon() {
    if (!confirmDeal) return;
    const id = confirmDeal.id;
    setDeals((cur) =>
      cur.map((d) => (d.id === id ? { ...d, stage: 'won', dp: 1.0, dhi: Math.max(d.dhi, 0.9) } : d))
    );
    setConfirmDeal(null);
    toast({
      variant: 'success',
      title: `Felicitări! ${id} închis ca Won 🎉`,
      description: 'APS agent recalculat + comision generat. Eveniment DEAL_WON scris în audit-log.',
      duration: 5500,
    });
  }

  return (
    <>
      <SiteNav active="/deals" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-7xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">Modul 5 · Deal Pipeline</p>
          <h1 className="text-[28px] mt-sp1">Pipeline kanban</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">
            6 stages · DP (Deal Probability) și DHI (Deal Health Index) sub fiecare card. Folosește
            butoanele ← / → de pe fiecare card pentru a avansa stage-ul (drag-drop @dnd-kit livrabil
            la M0.S3 — aceste butoane rămân ca a11y fallback).
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-sp2">
          {stageOrder.map((s) => (
            <div key={s.key} className="flex flex-col gap-sp2 min-h-[280px]">
              <header className="flex items-center justify-between px-sp2 py-sp1 bg-navy-card border border-border rounded-md">
                <h2 className="label-mono text-gold">{s.label}</h2>
                <span className="font-mono text-[11px] text-text-secondary">
                  {dealsByStage[s.key].length}
                </span>
              </header>
              <div className="flex flex-col gap-sp2">
                {dealsByStage[s.key].map((d) => {
                  const idx = stageOrder.findIndex((st) => st.key === d.stage);
                  const canBack = idx > 0 && d.stage !== 'won';
                  const canFwd = idx < stageOrder.length - 1;
                  const isClosing = d.stage === 'closing';
                  return (
                    <Card key={d.id} variant="elevated">
                      <CardHeader>
                        <p className="label-mono text-text-secondary">{d.id}</p>
                        <CardTitle className="text-[14px]">{d.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-sp2">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-sp2">
                            <ScorePill label="DP" value={d.dp} />
                            <ScorePill label="DHI" value={d.dhi} />
                          </div>
                          <Badge
                            variant={d.dhi > 0.75 ? 'success' : d.dhi > 0.55 ? 'warning' : 'critical'}
                            size="xs"
                          >
                            {d.dhi > 0.75 ? 'healthy' : d.dhi > 0.55 ? 'review' : 'risk'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 pt-sp1 border-t border-border">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => move(d, -1)}
                            disabled={!canBack}
                            aria-label={`Mută ${d.id} înapoi`}
                          >
                            ←
                          </Button>
                          {isClosing ? (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => setConfirmDeal(d)}
                              className="flex-1"
                            >
                              Close won
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant={canFwd ? 'secondary' : 'ghost'}
                              onClick={() => move(d, 1)}
                              disabled={!canFwd}
                              className="flex-1"
                              aria-label={`Avansează ${d.id}`}
                            >
                              {d.stage === 'won' ? 'Won ✓' : 'Avansează →'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Legendă DHI</CardTitle>
            <CardDescription>TF default 0.70 (BR-10) când expected_close_date e necunoscut.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-sp4 text-[12px] text-text-secondary">
            <span><Badge variant="success" size="xs">healthy</Badge> &nbsp;DHI ≥ 0.75</span>
            <span><Badge variant="warning" size="xs">review</Badge> &nbsp;0.55 ≤ DHI &lt; 0.75</span>
            <span><Badge variant="critical" size="xs">risk</Badge> &nbsp;DHI &lt; 0.55</span>
          </CardContent>
        </Card>
      </main>

      <Modal
        open={Boolean(confirmDeal)}
        onClose={() => setConfirmDeal(null)}
        title={confirmDeal ? `Confirmă închidere Won — ${confirmDeal.id}` : ''}
        description="Acțiune ireversibilă în pipeline (rollback necesită override manager). Va emite DEAL_WON + COMMISSION_GENERATED."
        size="md"
      >
        {confirmDeal && (
          <>
            <div className="bg-navy-deep border border-border rounded-md px-sp3 py-sp2 flex flex-col gap-sp1 text-[13px]">
              <span className="text-text-h">{confirmDeal.name}</span>
              <span className="text-text-muted text-[11px] font-mono">
                Stage curent: Notariat · DP {confirmDeal.dp.toFixed(2)} · DHI {confirmDeal.dhi.toFixed(2)}
              </span>
            </div>
            <ul className="mt-sp3 text-[12px] text-text-secondary flex flex-col gap-sp1">
              <li>· APS agent recalculat (BR-11 default 0.65 → boost cu deal Won).</li>
              <li>· Comision înregistrat (Modul 9 · billing).</li>
              <li>· Notificare manager + tenant admin (Slack + email).</li>
              <li>· Lead asociat marcat <code className="text-gold">converted</code>.</li>
            </ul>
            <div className="flex items-center justify-end gap-sp2 mt-sp4 pt-sp3 border-t border-border">
              <Button variant="ghost" onClick={() => setConfirmDeal(null)}>
                Anulează
              </Button>
              <Button onClick={confirmWon}>Confirmă Won</Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
