// M0.S8 · Regula 20 · Helper "Hybrid" 4 enum flat + intent derivat.
// P0-2 (ARCH_REVIEW F-ARCH-01): implementarea trăiește în @revyx/core (sursă unică
// pentru demo + backend M1.S3+); re-export ca importurile '@/lib/transaction-intent'
// existente să rămână valide.

export {
  transactionIntent,
  leadSide,
  isDemandSide,
  isSupplySide,
  isListingMatchForLead,
  leadTypeI18nKey,
  intentI18nKey,
} from '@revyx/core';
