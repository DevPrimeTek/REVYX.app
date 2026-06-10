'use client';

// DEMO ONLY · BR-32 · Comutator tip cont + rol pentru a demonstra regulile stricte de editare
// a registry-ului de parteneri. În producție derivă din JWT/RBAC — vezi lib/account-store.ts.

import { useAccount, setAccount, type AccountType, type Role } from '@/lib/account-store';
import { useT } from '@/components/i18n/provider';
import { cn } from '@/lib/utils';

const TYPES: AccountType[] = ['agency', 'individual'];
const AGENCY_ROLES: Role[] = ['agent', 'team_lead', 'manager'];

export function AccountSwitcher() {
  const { t } = useT();
  const account = useAccount();

  return (
    <div className="rounded-md border border-dashed border-gold/40 bg-gold/5 px-sp3 py-sp2 flex flex-col gap-sp2">
      <p className="label-mono text-[10px] text-gold">{t('partners.demoSwitcher')}</p>
      <div className="flex flex-wrap items-center gap-sp3">
        <div className="flex items-center gap-sp1">
          <span className="text-[11px] text-text-muted">{t('partners.accountType')}:</span>
          {TYPES.map((ty) => (
            <button
              key={ty}
              type="button"
              onClick={() => setAccount({ type: ty, role: ty === 'individual' ? 'agent' : account.role })}
              aria-pressed={account.type === ty}
              className={cn(
                'h-7 px-sp2 rounded border text-[11px] transition-colors duration-fast cursor-pointer',
                account.type === ty
                  ? 'bg-gold text-navy-deep border-gold font-semibold'
                  : 'border-border bg-navy-deep text-text-secondary hover:text-text-h',
              )}
            >
              {t(`partners.type.${ty}`)}
            </button>
          ))}
        </div>
        {account.type === 'agency' && (
          <div className="flex items-center gap-sp1">
            <span className="text-[11px] text-text-muted">{t('partners.role')}:</span>
            {AGENCY_ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setAccount({ ...account, role: r })}
                aria-pressed={account.role === r}
                className={cn(
                  'h-7 px-sp2 rounded border text-[11px] transition-colors duration-fast cursor-pointer',
                  account.role === r
                    ? 'bg-gold/20 border-gold text-gold font-semibold'
                    : 'border-border bg-navy-deep text-text-secondary hover:text-text-h',
                )}
              >
                {t(`partners.roleName.${r}`)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
