// M0.S3 · T-M0.S3-02 · Mock data types · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-02

export type LeadSource = 'Meta' | 'OLX' | 'Google' | 'Referral' | 'Walk-in' | 'Website';

/** [MOLDOVA-SPECIFIC] Clasa fondului locativ — specifică pieței RM.
 * Reflectă realitatea imobiliară din Moldova: majoritate fond sovietic/post-sovietic. */
export type PropertyClass = 'soviet_era' | 'post_soviet' | 'new_build' | 'premium';

/** [MOLDOVA-SPECIFIC] Snapshot preferințe la un moment dat — capturează evoluția în timp.
 * ~90% din clienții RM modifică preferințele după primele vizionări. */
export type PreferenceSnapshot = {
  date: string;         // ISO YYYY-MM-DD
  budgetMax: number;
  zone: string;
  rooms: string;
  features: string[];
  changeNote: string;   // de ce s-a schimbat (ex: "După vizionare S-3001 — buget redus")
};
// P0-2 (ARCH_REVIEW F-ARCH-01): enums de domeniu partajate trăiesc în @revyx/core;
// re-exportate aici ca importurile existente din '@/lib/mock' să rămână valide.
import type { LeadStatus, LeadType, TransactionIntent, LeadSide, ListingType, DealStage } from '@revyx/core';
export type { LeadStatus, LeadType, TransactionIntent, LeadSide, ListingType, DealStage } from '@revyx/core';

export type LeadUrgency = 'low' | 'medium' | 'high';
export type PropertyKind = 'apartment' | 'house' | 'land' | 'commercial';

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
  /** [MOLDOVA-SPECIFIC] Buget confirmat față-în-față (vs budgetMin/budgetMax declarat la telefon).
   * NULL = nu a avut loc întâlnire față-în-față sau nu s-a confirmat încă. */
  confirmedBudgetMax: number | null;
  /** [MOLDOVA-SPECIFIC] Evoluția preferințelor în timp — ~90% din clienții RM modifică preferințele.
   * Array gol [] = fără modificări înregistrate. */
  preferenceHistory: PreferenceSnapshot[];
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
  /** [MOLDOVA-SPECIFIC] Clasa fondului locativ — specifică pieței RM.
   * Influențează criteriile de potrivire cu lead-urile și percepția valorii. */
  propertyClass: PropertyClass;
  /**
   * Regula 20: procentul de comision negociat de agent.
   * sale/both → % din priceEur (standard RM 2.0-3.0%).
   * rent → % din monthlyRentEur (100% = 1× chirie).
   * NULL = nesetat.
   */
  commissionPct: number | null;
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
