// Demo promotion · Feedback capture config.
// Marketing goal: fiecare tester care explorează demo-ul lasă feedback fără apel cu fondatorul.
//
// URL formular Tally — se setează în Vercel ca variabilă de mediu NEXT_PUBLIC_TALLY_FEEDBACK_URL
// (Project Settings → Environment Variables) DUPĂ ce formularul e creat, fără schimbare de cod.
// Fallback = placeholder vizibil, ca să fie evident dacă nu a fost setat încă.
// Întrebările formularului (gata de lipit în Tally) sunt în:
//   docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/FEEDBACK_FORM_TALLY.md
export const TALLY_FEEDBACK_URL =
  process.env.NEXT_PUBLIC_TALLY_FEEDBACK_URL ?? 'https://tally.so/r/REPLACE_ME';

/** Câte ecrane distincte trebuie să vadă testerul înainte să apară nudge-ul de feedback. */
export const NUDGE_AFTER_PAGES = 4;
