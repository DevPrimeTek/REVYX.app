// M0.S8 · Regula 20 · Helper "Hybrid" 4 enum flat + intent derivat.
// Arhitectură: type-agnostic core + calibration profiles (sale / rent).
// Backend citește același pattern via FK transaction_profile_id pe LEAD/DEAL (M1.S3).

import type { LeadType, TransactionIntent, LeadSide, ListingType } from './enums';

/** Derivă intent (sale | rent) dintr-un leadType. Sale pentru buyer/seller, rent pentru tenant/landlord. */
export function transactionIntent(leadType: LeadType): TransactionIntent {
  return leadType === 'tenant' || leadType === 'landlord' ? 'rent' : 'sale';
}

/** Derivă latura (demand | supply). buyer + tenant = demand; seller + landlord = supply. */
export function leadSide(leadType: LeadType): LeadSide {
  return leadType === 'buyer' || leadType === 'tenant' ? 'demand' : 'supply';
}

export function isDemandSide(leadType: LeadType): boolean {
  return leadSide(leadType) === 'demand';
}

export function isSupplySide(leadType: LeadType): boolean {
  return leadSide(leadType) === 'supply';
}

/** Property matchable pentru un lead? Verifică intent compatibility (rent ↔ rent | both; sale ↔ sale | both). */
export function isListingMatchForLead(lead: { leadType: LeadType }, listingType: ListingType): boolean {
  const intent = transactionIntent(lead.leadType);
  if (listingType === 'both') return true;
  return intent === listingType;
}

/** i18n key pentru tipul de lead (cumpărător/vânzător/chiriaș/proprietar). */
export function leadTypeI18nKey(leadType: LeadType): string {
  return `leadType.${leadType}`;
}

/** i18n key pentru intent (vânzare / chirie). */
export function intentI18nKey(leadType: LeadType): string {
  return `transactionIntent.${transactionIntent(leadType)}`;
}
