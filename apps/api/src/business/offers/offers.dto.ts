import { z } from 'zod';

const OFFERED_BY = ['buyer', 'agent_on_behalf_buyer', 'seller', 'agent_on_behalf_seller'] as const;
const CURRENCY = ['EUR', 'MDL', 'USD'] as const;
const FX_SOURCE = ['BNM', 'ECB', 'MANUAL'] as const;
// Note: full lifecycle STATUS handled by service / DB CHECK; controllers expose only the
// response-side subset via respondOfferSchema.

export const createOfferSchema = z.object({
  dealId: z.string().uuid(),
  offeredBy: z.enum(OFFERED_BY),
  amount: z.number().positive(),
  currency: z.enum(CURRENCY),
  amountEurSnapshot: z.number().positive(),
  fxRateToEur: z.number().positive(),
  fxRateSource: z.enum(FX_SOURCE),
  validUntil: z.coerce.date().optional(),
  counterToOfferId: z.string().uuid().optional(),
  chainRound: z.number().int().min(1).default(1),
  notes: z.string().max(2048).optional(),
});
export type CreateOfferInput = z.infer<typeof createOfferSchema>;

export const respondOfferSchema = z.object({
  status: z.enum(['accepted', 'rejected', 'withdrawn', 'countered']),
  respondedFxRateToEur: z.number().positive().optional(),
  withdrawReason: z.string().max(256).optional(),
  expectedVersion: z.number().int().positive(),
});
export type RespondOfferInput = z.infer<typeof respondOfferSchema>;

export const listOffersQuerySchema = z.object({
  dealId: z.string().uuid(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ListOffersQuery = z.infer<typeof listOffersQuerySchema>;
