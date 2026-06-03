// M0.S3 · T-M0.S3-02..05 · Mock data barrel · 🌐 Web only
// M0.S8 extends with transactional workflows (showings, offers, closure, buyer marketplace, notary).

export type {
  Lead, LeadSource, LeadStatus, LeadType, LeadUrgency, LeadSide,
  TransactionIntent, ListingType,
  Property, PropertyKind, PropertyClass, Deal, DealStage, Agent,
} from './types';
export type {
  Showing,
  ShowingStatus,
  Offer,
  OfferSide,
  OfferStatus,
  ClosurePhase,
  ClosureState,
  BuyerProfile,
  BuyerProfileTier,
  BuyerProfileStatus,
  ContactGrant,
  GrantStatus,
  NotaryAct,
  NotaryActStatus,
  LeaseAgreement,
  LeaseAgreementStatus,
  GdprConsent,
} from './transactions-types';

export { agents } from './agents';
export { leads, leadsById, leadsByStatus } from './leads';
export { properties, propertiesById } from './properties';
export { deals, dealsById, stageOrder } from './deals';
export { buyerProfiles, buyerProfilesById } from './buyer-profiles';
export { buildSeedShowings } from './showings';
export { buildSeedOffers } from './offers';
export { buildSeedClosureStates } from './closure-states';
export { buildSeedNotaryActs } from './notary-acts';
export { buildSeedLeaseAgreements } from './lease-agreements';
