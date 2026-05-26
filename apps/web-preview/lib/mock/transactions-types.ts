// M0.S8 · Types for transactional workflows (showing/offer/closure/marketplace/notary/gdpr).
// Demo-only. Backend M1.S3+ already has scaffolded tables — these mirror them at the
// shape level (without the heavy fields).

export type ShowingStatus =
  | 'SCHEDULED'
  | 'REMINDED'
  | 'ATTENDED'
  | 'NO_SHOW'
  | 'CANCELLED';

export interface Showing {
  id: string;
  leadId: string;
  propertyId: string;
  agentId: string;
  scheduledAt: string; // ISO datetime
  durationMin: number;
  status: ShowingStatus;
  notes: string;
  feedbackScore: number | null; // 1..5
  feedbackBody: string | null;
  cancelReason: string | null;
  createdAt: string;
}

export type OfferStatus = 'PENDING' | 'COUNTER' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
export type OfferSide = 'buyer' | 'seller';

export interface Offer {
  id: string;
  dealId: string;
  parentId: string | null; // chain T07
  side: OfferSide;
  amountEur: number;
  conditions: string;
  status: OfferStatus;
  expiresAt: string | null;
  createdAt: string;
  createdByName: string; // who issued
  needsManagerApproval: boolean;
}

export type ClosurePhase =
  | 'NOT_STARTED'
  | 'STARTED'
  | 'AVANS_PAID'
  | 'FINANCING'
  | 'NOTARY_SCHEDULED'
  | 'NOTARIZED'
  | 'CADASTRE_REGISTERED';

export interface ClosureState {
  dealId: string;
  phase: ClosurePhase;
  avansEur: number | null;
  avansPaidAt: string | null;
  financingStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  financingBank: string | null;
  notaryName: string | null;
  notaryScheduledAt: string | null;
  notaryActNumber: string | null;
  notarizedAt: string | null;
  cadastreRegNumber: string | null;
  cadastreRegisteredAt: string | null;
  npsScore: number | null;
  npsComment: string | null;
  npsSubmittedAt: string | null;
  updatedAt: string;
}

export type BuyerProfileTier = 'FREE' | 'PRO' | 'PREMIUM';
export type BuyerProfileStatus = 'DRAFT' | 'PENDING_PAYMENT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED';
export type GrantStatus = 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED';

export interface BuyerProfile {
  id: string; // BUY-XXXX
  city: string;
  zone: string;
  propertyKind: 'apartment' | 'house' | 'land' | 'commercial';
  rooms: string;
  budgetMin: number;
  budgetMax: number;
  urgency: 'low' | 'medium' | 'high';
  features: string[]; // e.g. balcon, parcare, lift
  tier: BuyerProfileTier;
  status: BuyerProfileStatus;
  publishedAt: string;
  expiresAt: string;
  // PII (always masked in marketplace listing):
  maskedName: string;       // "M. P****"
  maskedPhone: string;      // "+373 7** *** 432"
  // Only revealed to agents with APPROVED grant:
  fullName: string;
  phone: string;
  email: string;
}

export interface ContactGrant {
  id: string;
  buyerProfileId: string;
  agentId: string;
  message: string;
  status: GrantStatus;
  requestedAt: string;
  decidedAt: string | null;
}

export type NotaryActStatus =
  | 'REQUESTED'      // agent has requested booking
  | 'SCHEDULED'      // notary confirmed date
  | 'DRAFTING'       // notary preparing act
  | 'SIGNED'         // all parties signed
  | 'REGISTERED'     // cadastre registered
  | 'CANCELLED';

export interface NotaryAct {
  id: string;
  dealId: string;
  notaryName: string;
  scheduledAt: string | null;
  signedAt: string | null;
  actNumber: string | null;
  cadastreRegNumber: string | null;
  status: NotaryActStatus;
  buyerName: string;
  sellerName: string;
  propertyAddr: string;
  amountEur: number;
}

export interface GdprConsent {
  leadId: string;
  baseConsent: boolean;       // contact for this transaction
  marketingConsent: boolean;  // promo emails / WhatsApp templates
  publicConsent: boolean;     // visible in buyer marketplace
  capturedAt: string;
  capturedSource: 'agent_form' | 'webhook_intake' | 'public_form';
  // GDPR Art. 17 erasure request:
  erasureRequestedAt: string | null;
  erasureCompletedAt: string | null;
}
