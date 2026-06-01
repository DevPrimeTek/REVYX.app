'use client';

// M0.S8.4 · Kanban card — Creative Director + Senior UI/UX directive (5 zone explicite).
// Zone 1 (header): ID stânga + Stare tranzacție dreapta (single line; status text whitespace-nowrap).
// Zone 2 (identity): nume client (bold) / adresă completă (wrap max 2 linii — afișare integrală) / oraș · zonă.
// Zone 3 (money): linia 1 = preț (alb, mare); linia 2 = chip gold `pct% · €sumă` (comision).
//   Fără etichete text Cost/Comision — culoarea + formatul comunică sensul; layout-ul rămâne
//   universal în RO/RU/EN (eliminat collision RU "Цена:" / "Комиссия:" + valori lungi).
// Zone 4 (agent): doar numele agentului (fără avatar, compact).
// Zone 5 (action): tip tranzacție (dot intent + Vânzare/Chirie) stânga + buton Detalii dreapta.
// Status (Z1) folosește `title` (tooltip browser) pentru text complet la overflow.
// Culoarea de stage trăiește DOAR pe headerul coloanei.

import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { deals as seedDeals, stageOrder, leadsById, properties, agents } from '@/lib/mock';
import type { Deal, DealStage } from '@/lib/mock';
import { transactionIntent } from '@/lib/transaction-intent';

export type IntentFilter = 'all' | 'sale' | 'rent';

// Per-stage accent — trăiește DOAR pe headerul coloanei (dot + bar + drop ring).
const STAGE_COLOR: Record<DealStage, { dot: string; bar: string; ring: string }> = {
  discovery:    { dot: 'bg-status-blue',  bar: 'bg-status-blue/40',  ring: 'ring-status-blue/30' },
  qualified:    { dot: 'bg-lead-qualified', bar: 'bg-lead-qualified/40', ring: 'ring-lead-qualified/30' },
  offer:        { dot: 'bg-status-amber', bar: 'bg-status-amber/40', ring: 'ring-status-amber/30' },
  negotiation:  { dot: 'bg-gold',         bar: 'bg-gold/40',         ring: 'ring-gold/30' },
  closing:      { dot: 'bg-status-green', bar: 'bg-status-green/40', ring: 'ring-status-green/30' },
  won:          { dot: 'bg-status-green', bar: 'bg-status-green/60', ring: 'ring-status-green/40' },
};

// Health dot color (sănătate deal) — semantic, nu legat de stage.
const HEALTH_DOT: Record<'healthy' | 'review' | 'risk', string> = {
  healthy: 'bg-status-green',
  review: 'bg-status-amber',
  risk: 'bg-status-red',
};

function healthBucket(dhi: number): 'healthy' | 'review' | 'risk' {
  if (dhi > 0.75) return 'healthy';
  if (dhi > 0.55) return 'review';
  return 'risk';
}

function DealCard({
  deal,
  isDragOverlay = false,
}: {
  deal: Deal;
  isDragOverlay?: boolean;
}) {
  const { t } = useT();
  const lead = leadsById.get(deal.leadId);
  const property = properties.find((p) => p.id === deal.propertyId);
  const agent = agents.find((a) => a.id === deal.agentId);
  const intent = lead ? transactionIntent(lead.leadType) : 'sale';
  const isRent = intent === 'rent';

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: deal.id,
    data: { stage: deal.stage },
  });

  const health = healthBucket(deal.dhi);

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      {...(isDragOverlay ? {} : attributes)}
      {...(isDragOverlay ? {} : listeners)}
      tabIndex={isDragOverlay ? undefined : 0}
      role={isDragOverlay ? undefined : 'button'}
      aria-label={isDragOverlay ? undefined : `${t('deal.dragHint')}: ${lead?.name ?? deal.id}`}
      className={
        'group rounded-lg border bg-navy-card shadow-sm transition-opacity select-none border-border ' +
        (isDragging && !isDragOverlay ? 'opacity-30 ' : '') +
        (isDragOverlay
          ? 'rotate-1 shadow-2xl ring-2 ring-gold/70 cursor-grabbing '
          : 'cursor-grab active:cursor-grabbing hover:border-border-light focus-visible:border-gold focus-visible:outline-none ')
      }
    >
      {/* ── Zona 1 — ID + Stare tranzacție (cu title pentru tooltip browser la overflow) ── */}
      <div className="px-sp2 pt-sp2 pb-1.5 flex items-center justify-between gap-sp2 min-w-0">
        <span className="label-mono text-[10px] text-text-muted flex-shrink-0">{deal.id}</span>
        <span
          className="inline-flex items-center gap-1 text-[11px] text-text-secondary min-w-0"
          title={t(`deal.healthLabels.${health}`)}
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${HEALTH_DOT[health]}`} aria-hidden />
          <span className="truncate">{t(`deal.healthLabels.${health}`)}</span>
        </span>
      </div>

      <div className="h-px bg-border mx-sp2" />

      {/* ── Zona 2 — identity: client / adresă deplină (max 2 linii) / regiune ── */}
      <div className="px-sp2 py-1.5 min-w-0">
        <p className="text-[14px] text-text-h font-semibold leading-tight truncate">
          {lead?.name ?? deal.leadId}
        </p>
        {property && (
          <>
            <p className="text-[12px] text-text-secondary leading-snug mt-0.5 break-words line-clamp-2">
              {property.addr}
            </p>
            <p className="text-[11px] text-text-muted truncate mt-0.5">
              {property.city} · {property.zone}
            </p>
          </>
        )}
        {!property && (
          <p className="text-[12px] text-text-secondary truncate mt-0.5">{deal.propertyId}</p>
        )}
      </div>

      <div className="h-px bg-border mx-sp2" />

      {/* ── Zona 3 — money: Cost (linia 1) + Comision (linia 2) ── */}
      <div className="px-sp2 py-1.5 flex flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-sp2 min-w-0">
          <span className="text-[11px] text-text-muted flex-shrink-0">{t('deal.costLabel')}</span>
          <span className="text-[13px] text-text-h font-mono font-semibold whitespace-nowrap truncate">
            €{((isRent ? property?.monthlyRentEur : property?.priceEur) ?? 0).toLocaleString('ro-MD')}
            {isRent && <span className="text-text-muted text-[10px] font-sans"> {t('deal.perMonth')}</span>}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-sp2 min-w-0">
          <span className="text-[11px] text-text-muted flex-shrink-0">{t('deal.commissionLabel')}</span>
          <span className="text-[12px] text-gold font-mono whitespace-nowrap truncate">
            {property?.commissionPct ?? (isRent ? 100 : 2.5)}% · €{deal.commissionEur.toLocaleString('ro-MD')}
          </span>
        </div>
      </div>

      <div className="h-px bg-border mx-sp2" />

      {/* ── Zona 4 — agent: label "Agent" + spațiu mic + nume bold ── */}
      <div className="px-sp2 py-1.5 min-w-0">
        <p className="text-[12px] truncate flex items-center gap-1.5">
          <span className="text-text-muted flex-shrink-0">{t('deal.agentLabel')}</span>
          <span className="text-text-h font-semibold truncate">{agent?.name ?? deal.agentId}</span>
        </p>
      </div>

      {/* ── Zona 5 — tip tranzacție + buton detalii (un singur rând, fără wrap) ── */}
      {!isDragOverlay && (
        <>
          <div className="h-px bg-border mx-sp2" />
          <div className="px-sp2 py-1.5 flex items-center justify-between gap-x-sp2 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[12px] text-text-h font-medium min-w-0">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isRent ? 'bg-status-green' : 'bg-status-blue'}`} aria-hidden />
              <span className="truncate">{t(`deal.intentShort.${intent}`)}</span>
            </span>
            <a
              href={`/deals/${deal.id}`}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="inline-flex items-center text-[11px] text-gold hover:text-gold-light border border-gold/40 hover:border-gold rounded-md px-sp2 py-0.5 transition-colors whitespace-nowrap flex-shrink-0"
            >
              {t('deal.detailsLink')} →
            </a>
          </div>
        </>
      )}
    </div>
  );
}

function StageColumn({
  stage,
  label,
  description,
  deals,
  children,
}: {
  stage: DealStage;
  label: string;
  description: string;
  deals: Deal[];
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: `col-${stage}`, data: { stage } });
  const { t } = useT();
  const c = STAGE_COLOR[stage];
  return (
    <div
      ref={setNodeRef}
      className={
        'flex flex-col gap-sp2 min-h-[320px] rounded-lg border transition-all duration-fast ' +
        (isOver
          ? `bg-gold/5 ring-2 ${c.ring} border-gold/40`
          : 'bg-navy-deep/60 border-border')
      }
    >
      <header className="flex items-center justify-between px-sp3 py-sp2 border-b border-border bg-navy-card/60 rounded-t-lg">
        <div className="flex items-center gap-sp2">
          <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} aria-hidden />
          <h2 className="text-[13px] font-semibold text-text-h">{label}</h2>
          <InfoTooltip label={label} body={description} />
        </div>
        <span className="font-mono text-[12px] text-text-muted bg-navy-deep border border-border rounded-full px-sp2 py-0.5">
          {deals.length}
        </span>
      </header>
      <div className="flex flex-col gap-sp2 px-sp2 pb-sp3">
        {children}
        {isOver && deals.length === 0 && (
          <p className="text-center text-[11px] text-text-muted py-sp3 font-mono uppercase">
            {t('deal.dropHere')}
          </p>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({ intentFilter = 'all' }: { intentFilter?: IntentFilter } = {}) {
  const { t } = useT();
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([...seedDeals]);
  const [confirmDeal, setConfirmDeal] = useState<Deal | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  // Regula 20: filtru intent — separare sale vs rent pipeline (tab toggle local).
  // Regula 20/21: workspace direction (global) îngustează suplimentar — vezi DealsPage.
  const visibleDeals = useMemo(
    () => deals.filter((d) => {
      if (intentFilter === 'all') return true;
      const lead = leadsById.get(d.leadId);
      if (!lead) return false;
      return transactionIntent(lead.leadType) === intentFilter;
    }),
    [deals, intentFilter],
  );

  const dealsByStage = useMemo(() => {
    const map: Record<DealStage, Deal[]> = {
      discovery: [], qualified: [], offer: [], negotiation: [], closing: [], won: [],
    };
    visibleDeals.forEach((d) => map[d.stage].push(d));
    return map;
  }, [visibleDeals]);

  const activeDeal = activeId ? deals.find((d) => d.id === activeId) ?? null : null;

  function moveDeal(dealId: string, targetStage: DealStage) {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stage === targetStage) return;
    if (targetStage === 'won') {
      setConfirmDeal(deal);
      return;
    }
    setDeals((cur) => cur.map((d) => (d.id === dealId ? { ...d, stage: targetStage } : d)));
    toast({
      variant: 'info',
      title: t('deal.toastMoved', { id: dealId, stage: t(`deal.stages.${targetStage}`) }),
      description: t('deal.toastMovedDesc'),
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
      title: t('deal.toastWon', { id }),
      description: t('deal.toastWonDesc'),
      duration: 5500,
    });
  }

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }
  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const dealId = String(e.active.id);
    const overData = e.over?.data.current as { stage?: DealStage } | undefined;
    if (overData?.stage) moveDeal(dealId, overData.stage);
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <section
          aria-label={t('deal.title')}
          className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-sp3"
        >
          {stageOrder.map((s) => (
            <StageColumn
              key={s}
              stage={s}
              label={t(`deal.stages.${s}`)}
              description={t(`deal.stageDescriptions.${s}`)}
              deals={dealsByStage[s]}
            >
              {dealsByStage[s].map((d) => (
                <DealCard key={d.id} deal={d} />
              ))}
            </StageColumn>
          ))}
        </section>
        <DragOverlay>{activeDeal ? <DealCard deal={activeDeal} isDragOverlay /> : null}</DragOverlay>
      </DndContext>

      <Modal
        open={Boolean(confirmDeal)}
        onClose={() => setConfirmDeal(null)}
        title={confirmDeal ? t('deal.confirmTitle', { id: confirmDeal.id }) : ''}
        description={t('deal.confirmDesc')}
        size="md"
      >
        {confirmDeal && (
          <>
            <div className="bg-navy-deep border border-border rounded-md px-sp3 py-sp2 flex flex-col gap-sp1 text-[13px]">
              <span className="text-text-h">
                {leadsById.get(confirmDeal.leadId)?.name ?? confirmDeal.leadId}
              </span>
              <span className="text-text-muted text-[11px]">
                {properties.find((p) => p.id === confirmDeal.propertyId)?.addr ?? confirmDeal.propertyId}
              </span>
              <span className="text-text-muted text-[11px]">
                {t(`deal.stages.${confirmDeal.stage}`)} · €{confirmDeal.commissionEur.toLocaleString('ro-MD')}
              </span>
            </div>
            <div className="flex items-center justify-end gap-sp2 mt-sp4 pt-sp3 border-t border-border">
              <Button variant="ghost" onClick={() => setConfirmDeal(null)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={confirmWon}>{t('common.confirm')}</Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
