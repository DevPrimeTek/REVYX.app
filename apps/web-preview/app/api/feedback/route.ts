// Demo promotion · Feedback API route.
// Primește răspunsul formularului nativ și îl scrie în Supabase (Postgres) prin REST (PostgREST).
// Cheia service role e citită DOAR pe server (nu NEXT_PUBLIC) → nu ajunge niciodată în browser.
// Setup DB + env: docs/marketing/DEMO_PROMOTION_KIT_REVYX_v1.0.0/FEEDBACK_DB_SETUP.md

import { NextResponse } from 'next/server';
import { parseFeedbackPayload } from '@/lib/feedback-payload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const payload = parseFeedbackPayload(await req.json().catch(() => null));
  if (!payload) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    // DB neconfigurat încă (env var lipsă) — răspuns clar, fără a expune detalii.
    return NextResponse.json({ error: 'storage_not_configured' }, { status: 503 });
  }

  const row = {
    role: payload.role,
    city: payload.city,
    clarity: payload.clarity,
    utility: payload.utility,
    pilot_intent: payload.pilotIntent,
    liked: payload.liked,
    missing: payload.missing,
    contact: payload.contact,
    locale: payload.locale,
  };

  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/feedback`, {
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
      const detail = await res.text().catch(() => '');
      console.error('feedback insert failed', res.status, detail);
      return NextResponse.json({ error: 'storage_error' }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('feedback insert exception', err);
    return NextResponse.json({ error: 'storage_error' }, { status: 502 });
  }
}
