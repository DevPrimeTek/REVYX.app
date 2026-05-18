'use client';

// M0.S3 · T-M0.S3-10 · @dnd-kit kanban with click-to-advance a11y fallback · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-10
//
// Drag-drop is implemented with @dnd-kit/core only (no sortable list reorder within
// a column, just stage transitions between columns). Keyboard sensor + click-to-advance
// buttons remain as full a11y fallback per ARCHITECT M0.S2 review.

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ScorePill } from '@/components/ui/score-badge';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { deals as seedDeals, stageOrder } from '@/lib/mock';
import type { Deal, DealStage } from '@/lib/mock';

function DealCard({
  deal,
  onForward,
  onBack,
  onCloseWon,
  isDragOverlay = false,
}: {
  deal: Deal;
  onForward?: () => void;
  onBack?: () => void;
  onCloseWon?: () => void;
  isDragOverlay?: boolean;
}) {
  const { t } = useT();
  const idx = stageOrder.indexOf(deal.stage);
  const canBack = idx > 0 && deal.stage !== 'won';
  const canFwd = idx < stageOrder.length - 1;
  const isClosing = deal.stage === 'closing';

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: deal.id,
    data: { stage: deal.stage },
  });

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      className={
        'transition-opacity ' +
        (isDragging && !isDragOverlay ? 'opacity-30' : '') +
        (isDragOverlay ? ' rotate-1 shadow-2xl ring-2 ring-gold/60 rounded-lg' : '')
      }
    >
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between gap-sp1">
            <p className="label-mono text-text-secondary">{deal.id}</p>
            {!isDragOverlay && (
              <button
                {...attributes}
                {...listeners}
                type="button"
                aria-label={`Drag ${deal.id}`}
                className="text-text-muted hover:text-gold cursor-grab active:cursor-grabbing text-[14px] leading-none px-1 focus-visible:outline-none focus-visible:text-gold"
              >
                ⋮⋮
              </button>
            )}
          </div>
          <CardTitle className="text-[13px]">L:{deal.leadId} → P:{deal.propertyId}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-sp2">
          <div className="flex items-center justify-between">
            <div className="flex gap-sp2">
              <ScorePill label="DP" value={deal.dp} />
              <ScorePill label="DHI" value={deal.dhi} />
            </div>
            <Badge
              variant={deal.dhi > 0.75 ? 'success' : deal.dhi > 0.55 ? 'warning' : 'critical'}
              size="xs"
            >
              {deal.dhi > 0.75 ? t('deal.healthy') : deal.dhi > 0.55 ? t('deal.review') : t('deal.risk')}
            </Badge>
          </div>
          {!isDragOverlay && (
            <div className="flex items-center gap-1 pt-sp1 border-t border-border">
              <Button
                size="sm"
                variant="ghost"
                onClick={onBack}
                disabled={!canBack}
                aria-label={`${t('deal.moveBack')} ${deal.id}`}
              >
                {t('deal.moveBack')}
              </Button>
              {isClosing ? (
                <Button size="sm" variant="primary" onClick={onCloseWon} className="flex-1">
                  {t('deal.closeWon')}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant={canFwd ? 'secondary' : 'ghost'}
                  onClick={onForward}
                  disabled={!canFwd}
                  className="flex-1"
                  aria-label={`${t('deal.moveForward')} ${deal.id}`}
                >
                  {deal.stage === 'won' ? t('deal.wonBadge') : t('deal.moveForward')}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StageColumn({
  stage,
  label,
  deals,
  children,
}: {
  stage: DealStage;
  label: string;
  deals: Deal[];
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: `col-${stage}`, data: { stage } });
  const { t } = useT();
  return (
    <div
      ref={setNodeRef}
      className={
        'flex flex-col gap-sp2 min-h-[280px] rounded-md transition-colors duration-fast ' +
        (isOver ? 'bg-gold/5 ring-2 ring-gold/40' : '')
      }
    >
      <header className="flex items-center justify-between px-sp2 py-sp1 bg-navy-card border border-border rounded-md">
        <h2 className="label-mono text-gold">{label}</h2>
        <span className="font-mono text-[11px] text-text-secondary">{deals.length}</span>
      </header>
      <div className="flex flex-col gap-sp2 px-1 pb-sp2">
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

  function move(deal: Deal, dir: 1 | -1) {
    const idx = stageOrder.indexOf(deal.stage);
    const next = stageOrder[idx + dir];
    if (!next) return;
    moveDeal(deal.id, next);
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
          className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-sp2"
        >
          {stageOrder.map((s) => (
            <StageColumn key={s} stage={s} label={t(`deal.stages.${s}`)} deals={dealsByStage[s]}>
              {dealsByStage[s].map((d) => (
                <DealCard
                  key={d.id}
                  deal={d}
                  onForward={() => move(d, 1)}
                  onBack={() => move(d, -1)}
                  onCloseWon={() => setConfirmDeal(d)}
                />
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
              <span className="text-text-h">{confirmDeal.id} · L:{confirmDeal.leadId} → P:{confirmDeal.propertyId}</span>
              <span className="text-text-muted text-[11px] font-mono">
                {t(`deal.stages.${confirmDeal.stage}`)} · DP {confirmDeal.dp.toFixed(2)} · DHI {confirmDeal.dhi.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-end gap-sp2 mt-sp4 pt-sp3 border-t border-border">
              <Button variant="ghost" onClick={() => setConfirmDeal(null)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={confirmWon}>{t('common.confirm')} Won</Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
