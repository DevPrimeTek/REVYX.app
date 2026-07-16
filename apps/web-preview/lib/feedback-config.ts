// Demo promotion · Feedback capture config.
// Marketing goal: fiecare tester care explorează demo-ul lasă feedback fără apel cu fondatorul.
//
// Formularul de feedback este NATIV (în stilul demo-ului) și trimite răspunsurile către
// ruta API `/api/feedback`, care le scrie într-o bază de date Supabase (Postgres).
// Setup bazei de date + variabilele de mediu: docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/FEEDBACK_DB_SETUP.md

/** Câte ecrane distincte trebuie să vadă testerul înainte să apară nudge-ul de feedback. */
export const NUDGE_AFTER_PAGES = 4;

/** Scala de rating folosită în formular (claritate / utilitate / intenție de pilot). */
export const RATING_SCALE = [1, 2, 3, 4, 5] as const;

/** Opțiunile de rol (segment ICP). Cheile se traduc prin i18n `feedback.roleOptions.*`. */
export const ROLE_OPTIONS = [
  'independent',
  'broker',
  'network_agent',
  'manager',
  'other',
] as const;

export type FeedbackRole = (typeof ROLE_OPTIONS)[number];
