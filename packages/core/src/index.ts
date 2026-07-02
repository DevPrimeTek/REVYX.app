// @revyx/core · P0 convergence foundation (ARCH_REVIEW F-ARCH-01, P0-2)
// Single source for domain enums + pure intent helpers shared between the demo
// (apps/web-preview) and the API (apps/api, adopted at M1.S3).
// Nominal alignment with Drizzle columns: leads.status / leads.lead_type (M1.S3
// transaction_profile FK) / tasks.status + tasks.task_type (0012_tasks.sql) /
// deals.stage (0010_deals.sql) / properties listing fields (Regula 20).

export type { LeadStatus, LeadType, TransactionIntent, LeadSide, ListingType, DealStage, TaskType, TaskStatus } from './enums';
export {
  transactionIntent,
  leadSide,
  isDemandSide,
  isSupplySide,
  isListingMatchForLead,
  leadTypeI18nKey,
  intentI18nKey,
} from './transaction-intent';
