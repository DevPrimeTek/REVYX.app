// M0.S3 · T-M0.S3-02 · Mock data types · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-02

export type LeadSource = 'Meta' | 'OLX' | 'Google' | 'Referral' | 'Walk-in' | 'Website';
export type LeadStatus = 'HOT' | 'qualified' | 'warm' | 'nurturing';
export type LeadType = 'buyer' | 'seller';
export type LeadUrgency = 'low' | 'medium' | 'high';
export type DealStage = 'discovery' | 'qualified' | 'offer' | 'negotiation' | 'closing' | 'won';
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
  /** buyer = caută proprietate · seller = are proprietate de vândut */
  leadType: LeadType;
  /** Pentru seller — proprietatea pe care o vinde (din mock properties) */
  sellingPropertyId: string | null;
  /** Buyer preferences (extras peste budget/zonă/camere) */
  features: string[];
  urgency: LeadUrgency;
  budgetMin: number;     // EUR
  budgetMax: number;
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
  priceEur: number;
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
