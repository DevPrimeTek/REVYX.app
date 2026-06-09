'use client';

// M0.S8.2 · Regula 20/21 · Selector direcție de lucru (Vânzare / Închiriere / Ambele).
// Demo: toggle global (localStorage) aplicat în toată platforma — vezi lib/workspace-store.ts.
// Producție (documentat Regula 20): model ierarhic companie → grup → agent.

import { useToast } from '@/components/ui/toast';
import { useT } from '@/components/i18n/provider';
import { useWorkspaceDirection, setWorkspaceDirection, type WorkspaceDirection } from '@/lib/workspace-store';
import { cn } from '@/lib/utils';

const OPTIONS: WorkspaceDirection[] = ['sale', 'rent', 'both'];

export function WorkspaceDirectionSelector({ scope }: { scope: 'agent' | 'agency' | 'group' }) {
  const { t } = useT();
  const { toast } = useToast();
  const direction = useWorkspaceDirection();

  function choose(d: WorkspaceDirection) {
    if (d === direction) return;
    setWorkspaceDirection(d);
    toast({ variant: 'success', title: t('workspace.savedToast', { dir: t(`workspace.option.${d}`) }) });
  }

  return (
    <div className="flex flex-col gap-sp3">
      <div>
        <p className="text-[13px] font-semibold text-text-h">{t('workspace.title')}</p>
        <p className="text-[12px] text-text-secondary mt-sp1">{t(`workspace.scopeDesc.${scope}`)}</p>
      </div>
      <div className="flex items-center flex-wrap gap-sp2">
        {OPTIONS.map((d) => {
          const selected = direction === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => choose(d)}
              aria-pressed={selected}
              className={cn(
                'h-9 px-sp4 rounded-md border text-[13px] font-medium transition-colors duration-fast cursor-pointer',
                selected
                  ? 'bg-gold text-navy-deep border-gold'
                  : 'border-border bg-navy-deep text-text-secondary hover:bg-navy-hover hover:text-text-h'
              )}
            >
              {t(`workspace.option.${d}`)}
            </button>
          );
        })}
      </div>
      <p className="text-[12px] text-text-secondary">
        {t('workspace.effectNote')}
      </p>
    </div>
  );
}
