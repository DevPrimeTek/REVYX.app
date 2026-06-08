'use client';

// Val 1 (AGI §18.3) · „Cum fac asta?" — ghid de execuție inline pentru o sugestie/task.
// VISUAL SKELETON: conținut din lib/mock/execution-guides.ts. Structura avansată (M1.S4):
// ghiduri editabile per tenant + variabile completate din context real + tracking acces.

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useT } from '@/components/i18n/provider';
import { guideFor } from '@/lib/mock/execution-guides';
import { taskTypeLabelKey } from '@/lib/mock/suggestions';
import type { TaskType } from '@/lib/mock/tasks';
import type { Lead } from '@/lib/mock';

export function GuideDrawer({
  open,
  onClose,
  taskType,
  lead,
}: {
  open: boolean;
  onClose: () => void;
  taskType: TaskType | null;
  lead: Lead;
}) {
  const { t } = useT();
  if (!taskType) return null;

  const guide = guideFor(taskType, lead.leadType);
  const actionLabel = t(taskTypeLabelKey(taskType));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('guide.title', { action: actionLabel })}
      description={guide.goal}
      size="lg"
    >
      <div className="flex flex-col gap-sp4">
        {/* Pașii concreți */}
        <section>
          <h3 className="text-[12px] uppercase tracking-wide text-text-muted mb-sp2">{t('guide.stepsLabel')}</h3>
          <ol className="flex flex-col gap-sp2">
            {guide.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-sp2">
                <span className="font-display text-gold text-[16px] leading-none w-5 flex-shrink-0">{i + 1}</span>
                <span className="text-[13px] text-text-h">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Obiecții (ex: apel vânzători) */}
        {guide.objections && guide.objections.length > 0 && (
          <section>
            <h3 className="text-[12px] uppercase tracking-wide text-text-muted mb-sp2">{t('guide.objectionsLabel')}</h3>
            <ul className="flex flex-col gap-sp2">
              {guide.objections.map((o, i) => (
                <li key={i} className="border border-border rounded-md px-sp3 py-sp2 bg-navy-deep/50">
                  <p className="text-[12px] text-status-amber">{o.says}</p>
                  <p className="text-[13px] text-text-h mt-sp1">{o.reply}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tip de timing / ton */}
        {guide.tip && (
          <p className="text-[12px] text-text-secondary italic border-l-2 border-gold/40 pl-sp2">{guide.tip}</p>
        )}

        <div className="flex items-center justify-end pt-sp2 border-t border-border">
          <Button onClick={onClose}>{t('guide.closeCta')}</Button>
        </div>
      </div>
    </Modal>
  );
}
