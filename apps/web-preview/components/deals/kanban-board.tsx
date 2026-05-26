'use client';

// M0.S6 · Kanban board redesign:
//  - Full-card drag (no separate handle, no advance/back buttons per Senior PM directive).
//  - Per-stage column color + thicker delimiter so the pipeline reads instantly.
//  - Cards show Client name + Property address + health label (no DP / DHI / cryptic IDs).
//  - Keyboard accessibility kept via dnd-kit KeyboardSensor.

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

// Per-stage accent (header + card border). Stays within brand tokens.
const STAGE_COLOR: Record<DealStage, { dot: string; bar: string; ring: string }> = {
  discovery:    { dot: 'bg-status-blue',  bar: 'bg-status-blue/40',  ring: 'ring-status-blue/30' },
  qualified:    { dot: 'bg-lead-qualified', bar: 'bg-lead-qualified/40', ring: 'ring-lead-qualified/30' },
  offer:        { dot: 'bg-status-amber', bar: 'bg-status-amber/40', ring: 'ring-status-amber/30' },
  negotiation:  { dot: 'bg-gold',         bar: 'bg-gold/40',         ring: 'ring-gold/30' },
  closing:      { dot: 'bg-status-green', bar: 'bg-status-green/40', ring: 'ring-status-green/30' },
  won:          { dot: 'bg-status-green', bar: 'bg-status-green/60', ring: 'ring-status-green/40' },
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

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: deal.id,
    data: { stage: deal.stage },
  });

  const health = healthBucket(deal.dhi);
  const healthVariant =
    health === 'healthy' ? 'success' : health === 'review' ? 'warning' : 'critical';
  const stageColor = STAGE_COLOR[deal.stage];

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      {...(isDragOverlay ? {} : attributes)}
      {...(isDragOverlay ? {} : listeners)}
      tabIndex={isDragOverlay ? undefined : 0}
      role={isDragOverlay ? undefined : 'button'}
      aria-label={isDragOverlay ? undefined : `${t('deal.dragHint')}: ${deal.id}`}
      className={
        'group rounded-lg border bg-navy-card shadow-md transition-opacity select-none ' +
        (isDragging && !isDragOverlay ? 'opacity-30 ' : '') +
        (isDragOverlay
          ? 'rotate-1 shadow-2xl ring-2 ring-gold/70 cursor-grabbing '
          : 'cursor-grab active:cursor-grabbing hover:border-border-light focus-visible:border-gold focus-visible:outline-none ') +
        'border-border'
      }
    >
      {/* stage colour bar */}
      <div className={`h-1 ${stageColor.bar} rounded-t-lg`} />
      <div className="px-sp3 py-sp2 flex flex-col gap-sp2">
        <div className="flex items-center justify-between">
          <span className="label-mono text-text-secondary">{deal.id}</span>
          <Badge variant={healthVariant} size="xs">
            {t(`deal.healthLabels.${health}`)}
          </Badge>
        </div>

        <dl className="flex flex-col gap-sp1 text-[12px]">
          <div className="flex items-baseline gap-sp1">
            <dt className="text-text-muted w-[60px] flex-shrink-0">{t('deal.cardLeadLabel')}</dt>
            <dd className="text-text-h truncate">{lead?.name ?? deal.leadId}</dd>
          </div>
          <div className="flex items-baseline gap-sp1">
            <dt className="text-text-muted w-[60px] flex-shrink-0">{t('deal.cardPropertyLabel')}</dt>
            <dd className="text-text-h truncate">{property?.addr ?? deal.propertyId}</dd>
          </div>
        </dl>

        <div className="flex items-center justify-between pt-sp1 border-t border-border">
          <span className="text-[11px] text-text-muted">{agent?.name ?? deal.agentId}</span>
          <span className="text-[12px] text-gold font-mono">€{deal.commissionEur.toLocaleString('ro-MD')}</span>
        </div>
        {!isDragOverlay && (
          <a
            href={`/deals/${deal.id}`}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="text-[11px] text-text-muted hover:text-gold inline-flex items-center gap-1 cursor-pointer self-start"
          >
            {t('common.open')} →
          </a>
        )}
      </div>
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

export function KanbanBoard() {
  const { t } = useT();
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([...seedDeals]);
  const [confirmDeal, setConfirmDeal] = useState<Deal | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const dealsByStage = useMemo(() => {
    const map: Record<DealStage, Deal[]> = {
      discovery: [], qualified: [], offer: [], negotiation: [], closing: [], won: [],
    };
    deals.forEach((d) => map[d.stage].push(d));
    return map;
  }, [deals]);

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
