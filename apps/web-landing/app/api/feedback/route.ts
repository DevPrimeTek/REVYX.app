import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface Payload {
  name?: string | null;
  email?: string;
  role?: string | null;
  market?: string | null;
  city?: string | null;
  volume?: string | null;
  ratingLeads?: string | null;
  ratingNba?: string | null;
  ratingMatch?: string | null;
  ratingDeals?: string | null;
  ratingDaily?: string | null;
  pain?: string | null;
  blockers?: string | null;
  aiConcern?: string | null;
  paymentBand?: string | null;
  recommend?: boolean;
  consent?: boolean;
  pilot?: boolean;
  locale?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toRating(value: string | null | undefined): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || !body.consent) {
    return NextResponse.json({ ok: false, error: 'invalid_input' }, { status: 400 });
  }

  const row = {
    name: body.name?.toString().slice(0, 200) || null,
    email,
    role: body.role?.toString().slice(0, 100) || null,
    market: body.market?.toString().slice(0, 40) || null,
    city: body.city?.toString().slice(0, 120) || null,
    monthly_volume: body.volume?.toString().slice(0, 40) || null,
    rating_leads: toRating(body.ratingLeads),
    rating_nba: toRating(body.ratingNba),
    rating_match: toRating(body.ratingMatch),
    rating_deals: toRating(body.ratingDeals),
    rating_daily: toRating(body.ratingDaily),
    pain: body.pain?.toString().slice(0, 2000) || null,
    blockers: body.blockers?.toString().slice(0, 2000) || null,
    ai_concern: body.aiConcern?.toString().slice(0, 2000) || null,
    payment_band: body.paymentBand?.toString().slice(0, 60) || null,
    recommend: !!body.recommend,
    consent: true,
    pilot_interest: !!body.pilot,
    locale: body.locale === 'ru' ? 'ru' : 'ro',
  };

  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Graceful degradation: before Supabase is wired, keep the form usable
  // (page is demoable) but do not silently pretend to persist in prod.
  if (!url || !key) {
    console.warn('[feedback] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — response not stored.');
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const res = await fetch(`${url}/rest/v1/feedback`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error('[feedback] supabase insert failed', res.status, detail);
      return NextResponse.json({ ok: false, error: 'store_failed' }, { status: 502 });
    }
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error('[feedback] supabase request error', err);
    return NextResponse.json({ ok: false, error: 'store_error' }, { status: 502 });
  }
}
