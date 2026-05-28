'use client';

// M0.S8.2 · Regula 20/21 · Selector direcție de lucru (Vânzare / Închiriere / Ambele).
// Demo: toggle global (localStorage) aplicat în toată platforma — vezi lib/workspace-store.ts.
// Producție (documentat Regula 20): model ierarhic companie → grup → agent.

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-sp1">
          <CardTitle>{t('workspace.title')}</CardTitle>
          <InfoTooltip label={t('workspace.title')} body={t('workspace.help')} />
        </div>
        <CardDescription>{t(`workspace.scopeDesc.${scope}`)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-sp3">
        <fieldset className="flex flex-wrap gap-sp2">
          <legend className="sr-only">{t('workspace.title')}</legend>
          {OPTIONS.map((d) => {
            const selected = direction === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => choose(d)}
                aria-pressed={selected}
                className={cn(
                  'flex flex-col items-start gap-1 rounded-md border-2 px-sp3 py-sp2 transition-all cursor-pointer min-w-[170px]',
                  selected
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border bg-navy-deep text-text-secondary hover:border-border-light',
                )}
              >
                <span className="text-[13px] font-semibold">{t(`workspace.option.${d}`)}</span>
                <span className="text-[11px] text-text-muted">{t(`workspace.optionHelp.${d}`)}</span>
              </button>
            );
          })}
        </fieldset>
        <p className="text-[12px] text-text-secondary bg-navy-deep border border-border rounded-md px-sp3 py-sp2">
          {t('workspace.effectNote')}
        </p>
        <p className="text-[11px] text-text-muted">{t('workspace.prodNote')}</p>
      </CardContent>
    </Card>
  );
}
