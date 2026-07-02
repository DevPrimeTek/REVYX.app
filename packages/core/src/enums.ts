// Domain enums — Regula 19 + Regula 20 (segregare buyer/seller și sale/rent).

export type LeadStatus = 'HOT' | 'qualified' | 'warm' | 'nurturing';

/** Regula 19 + Regula 20: 4 enum flat + helper transactionIntent() derivat. */
export type LeadType = 'buyer' | 'seller' | 'tenant' | 'landlord';

/** Regula 20: derivat — sale (buyer/seller) sau rent (tenant/landlord). Calibration profile pe scoring. */
export type TransactionIntent = 'sale' | 'rent';

/** Regula 20: latura logică — demand (buyer/tenant) sau supply (seller/landlord). */
export type LeadSide = 'demand' | 'supply';

/** Regula 20: ce listare are proprietatea — vânzare, închiriere sau ambele. */
export type ListingType = 'sale' | 'rent' | 'both';

export type DealStage = 'discovery' | 'qualified' | 'offer' | 'negotiation' | 'closing' | 'won';

/** task_type enum — TECH_SPEC_REVYX_nba-engine_v1.0.0.md §4.1. */
export type TaskType =
  | 'first_contact'
  | 'follow_up'
  | 'schedule_showing'
  | 'send_property'
  | 'request_documents'
  | 'draft_offer'
  | 'close_deal'
  | 'review_no_show'
  | 'custom';

/** Task lifecycle — BRD §5 Pilon 04 + 0012_tasks.sql. */
export type TaskStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'SNOOZED' | 'CANCELLED';
