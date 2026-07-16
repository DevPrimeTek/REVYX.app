// Demo promotion · Forma răspunsului de feedback (partajată client ↔ API route).
// Validare minimă, fără dependențe — rulează și pe client (înainte de submit) și pe server (în route).

import { ROLE_OPTIONS, type FeedbackRole } from './feedback-config';

export type FeedbackPayload = {
  role: FeedbackRole;
  city: string | null;
  clarity: number; // 1..5
  utility: number; // 1..5
  pilotIntent: number; // 1..5
  liked: string | null;
  missing: string | null;
  contact: string | null;
  locale: string; // 'ro' | 'ru' | 'en'
};

function isRating(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 5;
}

function cleanStr(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const trimmed = v.trim().slice(0, max);
  return trimmed.length > 0 ? trimmed : null;
}

/** Validează + normalizează un body necunoscut. Întoarce payload curat sau null dacă invalid. */
export function parseFeedbackPayload(input: unknown): FeedbackPayload | null {
  if (!input || typeof input !== 'object') return null;
  const o = input as Record<string, unknown>;

  if (!ROLE_OPTIONS.includes(o.role as FeedbackRole)) return null;
  if (!isRating(o.clarity) || !isRating(o.utility) || !isRating(o.pilotIntent)) return null;

  const locale = o.locale === 'ru' || o.locale === 'en' ? o.locale : 'ro';

  return {
    role: o.role as FeedbackRole,
    city: cleanStr(o.city, 80),
    clarity: o.clarity as number,
    utility: o.utility as number,
    pilotIntent: o.pilotIntent as number,
    liked: cleanStr(o.liked, 2000),
    missing: cleanStr(o.missing, 2000),
    contact: cleanStr(o.contact, 160),
    locale,
  };
}
