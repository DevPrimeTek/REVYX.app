// M0.S3 · T-M0.S3-02 · Mock data types · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-02

export type LeadSource = 'Meta' | 'OLX' | 'Google' | 'Referral' | 'Walk-in' | 'Website';
export type LeadStatus = 'HOT' | 'qualified' | 'warm' | 'nurturing';
/** Regula 19 + Regula 20: 4 enum flat + helper transactionIntent() derivat (lib/transaction-intent.ts). */
export type LeadType = 'buyer' | 'seller' | 'tenant' | 'landlord';
/** Regula 20: helper derivat — sale (buyer/seller) sau rent (tenant/landlord). Calibration_profile pe scoring. */
export type TransactionIntent = 'sale' | 'rent';
/** Regula 20: latura logică — demand (buyer/tenant) sau supply (seller/landlord). */
export type LeadSide = 'demand' | 'supply';
export type LeadUrgency = 'low' | 'medium' | 'high';
export type DealStage = 'discovery' | 'qualified' | 'offer' | 'negotiation' | 'closing' | 'won';
export type PropertyKind = 'apartment' | 'house' | 'land' | 'commercial';
/** Regula 20: ce listare are proprietatea — vânzare, închiriere sau ambele. */
export type ListingType = 'sale' | 'rent' | 'both';

export type Agent = {
  id: string;
  name: string;
  aps: number;          // Agent Performance Score [0,1]
  trust: number;        // [0,1]
  activeTasks: number;  // 0..3 (BR-04)
  closedDeals30d: number;
  tenure: number;       // days since onboarding
};

export type Lead = {
  id: string;
  name: string;
  ls: number;            // Lead Score [0,1]
  status: LeadStatus;
  source: LeadSource;
  sla: string;           // formatted: "15m" | "2h" | "24h" | "—"
  agentId: string | null;
  /**
   * Regula 19+20: 4 tipuri de lead. buyer/tenant = demand side; seller/landlord = supply side.
   * - buyer    → caută proprietate de cumpărat (intent=sale)
   * - seller   → are proprietate de vândut (intent=sale)
   * - tenant   → caută proprietate de închiriat (intent=rent)
   * - landlord → are proprietate de dat în chirie (intent=rent)
   */
  leadType: LeadType;
  /** Pentru seller/landlord — proprietatea pe care o vinde sau o închiriază (din mock properties) */
  sellingPropertyId: string | null;
  /** Preferences pe care agentul le vede (buyer/tenant) sau pe care le promovează (seller/landlord). */
  features: string[];
  urgency: LeadUrgency;
  /**
   * Buget — semantica diferă în funcție de transactionIntent:
   * - sale (buyer/seller): preț total în EUR
   * - rent (tenant/landlord): chirie lunară în EUR/lună
   */
  budgetMin: number;
  budgetMax: number;
  /** Regula 20: pentru tenant — durata dorită a contractului de chirie (6/12/24 luni). */
  rentPeriodMonths: number | null;
  rooms: string;         // "1" | "2" | "3" | "3+"
  zone: string;
  createdAt: string;     // ISO YYYY-MM-DD
  gdprConsent: boolean;
  is: number;            // Interaction Strength
  needsReview: boolean;  // BR-05 re-matching flag
};

export type Property = {
  id: string;
  addr: string;
  city: string;
  zone: string;
  kind: PropertyKind;
  rooms: number;
  area: number;          // m²
  priceEur: number;      // sale price (EUR) — 0 if listingType === 'rent'
  /** Regula 20: chirie lunară (EUR/lună) — completat pentru listingType ∈ {'rent', 'both'}. */
  monthlyRentEur: number | null;
  /** Regula 20: tipul listării — vânzare, închiriere sau dual (same property listed pentru ambele). */
  listingType: ListingType;
  ps: number;            // Property Score [0,1]
  lf: number;            // Listing Freshness [0,1]
  daysOnMarket: number;
  ownerId: string;       // synthetic
  agentId: string;       // listing agent
};

export type Deal = {
  id: string;
  leadId: string;
  propertyId: string;
  agentId: string;
  stage: DealStage;
  dp: number;            // Deal Probability [0,1]
  dhi: number;           // Deal Health Index [0,1]
  expectedCloseDate: string | null;
  commissionEur: number;
  needsReview: boolean;
};
