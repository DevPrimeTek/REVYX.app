# REVYX — web-landing

Mini-proiect separat în monorepo-ul `revyx.app`: **site-ul public de prezentare** al platformei REVYX, găzduit (temporar) pe `revyx.app`.

Rol: prezintă beneficiile platformei, trimite vizitatorii la **demo** (link), colectează **feedback** prin chestionar și înrolează agenți imobiliari în dezvoltarea platformei — cu bonus de **un an gratuit** după lansare pentru participanți.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Design tokens partajate din `design/tokens.json` (aceeași identitate navy + auriu ca restul REVYX)
- Bilingv **RO (implicit) / RU**, toggle client-side (localStorage)
- Formular feedback → **Supabase** prin route handler server-side `/api/feedback`

> Acest cod e o versiune funcțională, editabilă direct în repo — **independentă de Lovable**.
> `LOVABLE_PROMPT.md` conține promptul pentru a (re)genera / itera vizual în Lovable dacă vrei;
> orice ai construi în Lovable se poate porta aici, dar site-ul funcționează și fără el.

## Structură
```
apps/web-landing/
├── app/
│   ├── layout.tsx            # fonts, metadata SEO, providers
│   ├── page.tsx              # asamblează secțiunile
│   ├── globals.css           # brand tokens + utilitare
│   └── api/feedback/route.ts # insert Supabase (server-only service key)
├── components/
│   ├── sections/             # nav, hero, problem, what, benefits, how, demo, bonus, feedback-form, footer
│   └── ui/                   # logo, lang-toggle
├── lib/
│   ├── content.ts            # tot textul RO + RU (single source)
│   ├── i18n.tsx              # provider + hook limbă
│   └── config.ts             # DEMO_URL din env
├── supabase/schema.sql       # tabelul feedback + RLS + notă GDPR
├── LOVABLE_PROMPT.md         # prompt pentru Lovable
├── HOSTING.md                # deploy Vercel + domeniu revyx.app + Supabase
└── .env.example
```

## Rulare locală
```bash
npm install                      # din rădăcina repo-ului (npm workspaces)
npm run dev --workspace @revyx/web-landing   # → http://localhost:3001
```

## Variabile de mediu
Copiază `.env.example` în `.env.local` și completează (vezi `HOSTING.md`):
- `NEXT_PUBLIC_DEMO_URL` — linkul demo-ului live.
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — pentru stocarea răspunsurilor (server-only).

Fără Supabase configurat, formularul rămâne funcțional pentru probe, dar răspunsurile **nu se salvează** (răspuns `stored:false`, warning în log). Configurează Supabase înainte de a colecta date reale.

## Editare text
Tot copy-ul RO/RU e în `lib/content.ts`. Modifici acolo → se reflectă pe toată pagina în ambele limbi.
