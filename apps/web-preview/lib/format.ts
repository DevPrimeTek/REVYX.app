// Formatare valori pentru afișare — citibile, nu format de bază de date.

const DATE_FMT = new Intl.DateTimeFormat('ro-MD', { day: 'numeric', month: 'long', year: 'numeric' });

/** ISO (YYYY-MM-DD sau ISO complet) → „11 mai 2026". Gol/invalid → '—'. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso);
  if (Number.isNaN(d.getTime())) return '—';
  return DATE_FMT.format(d);
}
