// M0.S6 · Listing freshness UI bucketing.
//
// The numeric freshness curve stays in the backend (BRD §7). Here we only
// translate "days on market" into a user-friendly bucket + tone for badges.

import type { BadgeProps } from '@/components/ui/badge';

export type FreshnessState = { key: 'new' | 'refresh' | 'old'; label: string; desc: string };

export function freshnessLabel(daysOnMarket: number, t: (key: string) => string): FreshnessState {
  if (daysOnMarket <= 30) {
    return { key: 'new', label: t('property.stateNew'), desc: t('property.stateNewDesc') };
  }
  if (daysOnMarket <= 60) {
    return { key: 'refresh', label: t('property.stateRefresh'), desc: t('property.stateRefreshDesc') };
  }
  return { key: 'old', label: t('property.stateOld'), desc: t('property.stateOldDesc') };
}

export function freshnessTone(daysOnMarket: number): NonNullable<BadgeProps['variant']> {
  if (daysOnMarket <= 30) return 'success';
  if (daysOnMarket <= 60) return 'warning';
  return 'critical';
}
