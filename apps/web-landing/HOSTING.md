# Hosting & domeniu — web-landing

Obiectiv: cost **zero**, deploy **din GitHub**, comod de operat, cu domeniul **revyx.app**
gestionat **fără a preda domeniul direct către Vercel** (rămâne la DNS-ul tău / Cloudflare;
Vercel primește doar traficul prin înregistrări DNS).

## 1. Deploy pe Vercel (free) din GitHub

1. Push branch-ul cu `apps/web-landing` pe GitHub (deja în monorepo).
2. În Vercel: **Add New → Project → Import** repo-ul `devprimetek/revyx.app`.
3. La configurare:
   - **Root Directory**: `apps/web-landing`
   - **Framework Preset**: Next.js (auto-detectat)
   - **Build Command** / **Output**: implicite Next.js.
4. **Environment Variables** (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_DEMO_URL` = linkul demo-ului live
   - `SUPABASE_URL` = `https://<proiect>.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = service role key (Supabase → Project Settings → API)
5. Deploy. Primești un URL `*.vercel.app` funcțional imediat.

> Demo-ul (`apps/web-preview`) este un proiect Vercel separat, cu Root Directory-ul lui.
> Recomandare de rute: `revyx.app` = acest site de prezentare · `demo.revyx.app` = demo-ul aplicației.

## 2. Domeniul revyx.app — fără a-l muta „în" Vercel

Ideea: **NU** delegi nameserver-ele domeniului către Vercel și **NU** cumperi/muți domeniul în Vercel.
Ții controlul DNS la Cloudflare (recomandat, gratuit) sau la registrarul actual, și doar
**adaugi înregistrări** care trimit traficul spre Vercel. TLS-ul e emis automat de Vercel.

### Pași
1. În Vercel → Project → **Settings → Domains → Add** → `revyx.app` (și opțional `www.revyx.app`).
   Vercel îți arată exact ce înregistrări DNS să adaugi. **NU** alege „Use Vercel Nameservers".
2. La providerul tău DNS (Cloudflare / registrar), adaugă:
   - **Apex `revyx.app`** → înregistrare **A** către `76.76.21.21`
     *(sau înregistrarea exactă pe care ți-o afișează Vercel — poate varia).*
   - **`www`** → înregistrare **CNAME** către `cname.vercel-dns.com`
   - **`demo`** (pentru demo) → **CNAME** către `cname.vercel-dns.com`, atașat la proiectul demo.
3. Dacă folosești **Cloudflare**: pune înregistrările pe **DNS only** (nor gri, nu portocaliu)
   la prima validare, ca Vercel să emită certificatul; apoi poți reactiva proxy-ul dacă vrei.
4. Așteaptă propagarea (minute–zeci de minute). Vercel emite automat certificatul TLS.

### De ce așa
- Domeniul rămâne la tine / Cloudflare — schimbi hostingul oricând fără să muți domeniul.
- Poți muta DNS-ul între providere fără a atinge Vercel.
- Cost zero (Vercel free tier + Cloudflare free + domeniu la registrarul tău).

## 3. Supabase (stocare feedback) — free tier

1. Creează un proiect pe [supabase.com](https://supabase.com) (plan Free).
2. Rulează `supabase/schema.sql` în **SQL Editor** (creează tabelul `feedback` + RLS).
3. Copiază din **Project Settings → API**:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**secret, server-only** — nu-l pune în `NEXT_PUBLIC_*`).
4. Setează-le în Vercel (pas 1.4) și în `.env.local` pentru dev.

Export listă bonus (participanți cu consimțământ):
```sql
select email, name, role, city, created_at
from public.feedback
where consent = true
order by created_at desc;
```

## Cost total
Vercel Free + Cloudflare Free + Supabase Free = **0 €/lună** pentru volumele de start.
Singurul cost recurent posibil este înregistrarea domeniului `revyx.app` la registrar.
