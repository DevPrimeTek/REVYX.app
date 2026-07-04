'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function FeedbackForm() {
  const { t, locale } = useI18n();
  const f = t.feedback;
  const [status, setStatus] = useState<Status>('idle');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const email = String(data.get('email') || '').trim();
    const consent = data.get('consent') === 'on';
    if (!email || !consent) {
      setStatus('error');
      setMsg(f.required);
      return;
    }

    setStatus('sending');
    setMsg('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name') || null,
          email,
          role: data.get('role') || null,
          city: data.get('city') || null,
          volume: data.get('volume') || null,
          pain: data.get('pain') || null,
          wish: data.get('wish') || null,
          consent,
          pilot: data.get('pilot') === 'on',
          locale,
        }),
      });
      if (!res.ok) throw new Error('bad response');
      setStatus('success');
      setMsg(f.success);
      form.reset();
    } catch {
      setStatus('error');
      setMsg(f.error);
    }
  }

  if (status === 'success') {
    return (
      <section id="feedback" className="container-x py-sp10">
        <div className="card mx-auto max-w-xl border-l-2 border-l-status-green text-center">
          <CheckCircle2 size={40} className="mx-auto text-status-green" />
          <p className="mt-sp2 text-lg font-semibold text-text-h">{msg}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="feedback" className="container-x py-sp10">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow text-center">{f.eyebrow}</p>
        <h2 className="mt-sp2 text-center text-[clamp(26px,3.5vw,40px)] leading-tight">
          {f.title}
        </h2>
        <p className="mx-auto mt-sp2 max-w-lg text-center text-sm text-text-secondary">{f.body}</p>

        <form onSubmit={onSubmit} className="card mt-sp5 grid gap-sp3">
          <div className="grid gap-sp3 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="name">
                {f.name}
              </label>
              <input id="name" name="name" className="field" autoComplete="name" />
            </div>
            <div>
              <label className="field-label" htmlFor="email">
                {f.email} *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="field"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="grid gap-sp3 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="role">
                {f.role}
              </label>
              <select id="role" name="role" className="field" defaultValue="">
                <option value="" disabled>
                  —
                </option>
                {f.roleOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="city">
                {f.city}
              </label>
              <input id="city" name="city" className="field" />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="volume">
              {f.volume}
            </label>
            <select id="volume" name="volume" className="field" defaultValue="">
              <option value="" disabled>
                —
              </option>
              {f.volumeOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="pain">
              {f.pain}
            </label>
            <textarea id="pain" name="pain" rows={2} className="field" placeholder={f.painPlaceholder} />
          </div>

          <div>
            <label className="field-label" htmlFor="wish">
              {f.wish}
            </label>
            <textarea id="wish" name="wish" rows={2} className="field" placeholder={f.wishPlaceholder} />
          </div>

          <label className="flex items-start gap-sp2 text-sm text-text-secondary">
            <input type="checkbox" name="consent" required className="mt-1 accent-gold" />
            <span>{f.consent} *</span>
          </label>
          <label className="flex items-start gap-sp2 text-sm text-text-secondary">
            <input type="checkbox" name="pilot" className="mt-1 accent-gold" />
            <span>{f.pilot}</span>
          </label>

          {status === 'error' && msg && (
            <p className="text-sm text-status-red" role="alert">
              {msg}
            </p>
          )}

          <button type="submit" className="btn-gold text-base" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <Loader2 size={18} className="animate-spin" /> {f.sending}
              </>
            ) : (
              f.submit
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
