# Prompt Lovable — Site de prezentare REVYX

> Copiază tot textul dintre liniile `--- START ---` și `--- END ---` și lipește-l ca prim mesaj în Lovable (lovable.dev).
> După generare: conectează proiectul la GitHub (Lovable → GitHub) și deploy pe Vercel (vezi `HOSTING.md`).
> Codul din acest repo (`apps/web-landing`) este deja o versiune funcțională echivalentă — Lovable e opțional, pentru iterație vizuală rapidă.

**Placeholder de completat înainte de a lipi:**
- `{{DEMO_URL}}` → linkul demo-ului live (ex: `https://demo.revyx.app`).

---

--- START ---

Construiește un site de prezentare (landing page) de o singură pagină, modern și profesional, pentru **REVYX** — un instrument de lucru pentru agenții imobiliari din Republica Moldova. Publicul țintă: agenți imobiliari și brokeri care au nevoie de un instrument bun. Obiectivul site-ului: să prezinte beneficiile clar, să trimită oamenii spre demo, să colecteze feedback prin chestionar și să înroleze cât mai mulți agenți în dezvoltarea platformei.

## Stack tehnic (obligatoriu)
- React + TypeScript + Vite + Tailwind CSS + shadcn/ui (stack-ul implicit Lovable).
- Cod curat, componentizat pe secțiuni, ușor de editat manual după export pe GitHub.
- Fără dependențe grele inutile. Icoane: lucide-react.
- Responsive complet (mobil, tabletă, desktop). Accesibil (contrast bun, focus vizibil, navigare la tastatură).

## Limbi
- Bilingv **Română (implicit) + Rusă**, cu un toggle RO / RU în bara de sus.
- Textul se schimbă instant la apăsarea toggle-ului (fără reîncărcare). Salvează alegerea în localStorage.
- Nu folosi termeni tehnici/acronime interne în interfață — doar limbaj de beneficii, clar pentru un agent.

## Identitate vizuală (brand REVYX — respectă exact)
- Temă întunecată, elegantă, „premium fintech".
- Culori:
  - Fundal principal navy: `#0C1428`; fundal mai adânc: `#080E1C`; carduri: `#152038`; hover carduri: `#1A2844`.
  - Accent auriu (CTA, accente, titluri-cheie): `#C9870A`, variantă deschisă `#E6A020`, luminoasă `#F5B830`.
  - Borduri: `#1E2E48` (standard), `#263A58` (hover).
  - Text: titluri `#F0F4FA`, corp `#D8E2F0`, secundar `#8FA8CC`, muted `#849AB8`.
  - Status: verde `#0FBA7F`, amber `#E8950A`, roșu `#F26565`, albastru `#60A5FA`.
- Tipografie (Google Fonts):
  - Titluri / cifre mari: **Bebas Neue** (tracking lejer, litere mari).
  - Text și UI: **Montserrat** (greutăți 300/400/600/700/800).
  - Etichete mici tehnice / mono: **JetBrains Mono** (uppercase, letter-spacing mărit).
- Logo text: „REV" alb + „YX" auriu, Bebas Neue.
- Detalii: fundal cu un radial-gradient auriu subtil în colț; carduri cu bordură fină; hover pe elemente interactive = ridicare ușoară `translateY(-2px)` + bordură mai deschisă. Elementele statice NU reacționează la hover.

## Structura paginii (secțiuni, în ordine)

1. **Bară de sus (sticky)**: logo REVYX stânga; în mijloc linkuri ancoră (Beneficii, Bonus, Participă); dreapta toggle RO/RU + buton auriu „Încearcă demo" care deschide `{{DEMO_URL}}` în filă nouă.

2. **Hero**: un badge mic („Instrument de lucru pentru agentul imobiliar"); titlu mare pe două linii — „Nu un CRM." (alb) + „Sistemul tău de execuție zilnică." (auriu); subtitlu care explică că REVYX îți spune pe cine să suni acum, ce proprietate se potrivește fiecărui client și în ce stadiu e fiecare tranzacție, ca să nu mai pierzi afaceri; două butoane: „Încearcă demo-ul live" (auriu, → `{{DEMO_URL}}`, filă nouă) și „Participă la dezvoltare" (secundar, → ancoră formular). Sub ele, o linie mono discretă: „Construit pentru piața din Republica Moldova · Vânzare și chirie".

3. **Problema**: titlu „Munca bună se pierde în haos, nu din lipsă de clienți"; 3 carduri cu durerile agentului: (a) lead-uri care se răcesc pentru că nu ai răspuns la timp; (b) nu mai știi ce proprietate se potrivea cu ce client; (c) tranzacțiile stau pe loc și nu vezi ce urmează / ce risc apare.

4. **Ce este REVYX**: două coloane. Stânga: titlu „Un Agent Operating System, nu încă o agendă" + paragraf care spune că REVYX organizează munca zilnică de la primul contact până la semnarea la notar, preia rutina și te lasă să vorbești cu oamenii și să închizi afaceri. Dreapta: card-citat cu bordură aurie în stânga: „Un CRM stochează contacte. REVYX îți spune ce să faci cu ele — pas cu pas."

5. **Beneficii** (grilă de 6 carduri, fiecare cu o icoană aurie): 
   - „Nu mai pierzi lead-uri" — fiecare cerere nouă e prioritizată automat și primești alertă înainte să se răcească.
   - „Îți spune ce să faci acum" — vezi următorii pași recomandați pentru fiecare client (sună, programează vizionare, cere documente).
   - „Potriviri client ↔ proprietate" — top proprietăți potrivite pentru fiecare cumpărător și clienți compatibili pentru fiecare proprietate.
   - „Tranzacții clare, de la A la Z" — flux vizual al fiecărei afaceri: stadiu, cine urmează, risc, comision.
   - „Vânzare și chirie, împreună" — acoperă și vânzările, și închirierile, cu comisioane și documente diferite, în același loc.
   - „Cabinet pentru tine și echipă" — agent, agenție sau grup, fiecare cu cabinetul lui: performanță, istoric, clienți, obiective.

6. **Cum funcționează**: 3 pași numerotați (01, 02, 03) cu cifre mari Bebas Neue aurii: „Intră clientul" → „Sistemul îți dă direcția" → „Închizi afacerea".

7. **Bandă Demo** (card mare, evidențiat, cu glow auriu): titlu „Testează demo-ul live — fără cont, fără instalare"; text scurt (3 minute, exact cum îl folosește un agent); buton auriu mare „Deschide demo-ul" → `{{DEMO_URL}}` în filă nouă; notă mică: „Se deschide într-o filă nouă. Date demonstrative, fără informații reale de clienți."

8. **Program de pionierat / Bonus** (secțiune proeminentă): badge auriu cu icoană cadou „Program de pionierat"; titlu „Ajută-ne să construim instrumentul potrivit — primești un an gratuit"; paragraf: căutăm agenți care lucrează zilnic pe teren, feedback-ul lor intră direct în dezvoltare, iar participanții primesc un an de acces gratuit după lansare. Listă cu bife verzi: (1) un an gratuit după lansare pentru participanți; (2) influență reală asupra funcțiilor; (3) acces prioritar la pilot. Buton „Vreau să particip" → ancoră formular.

9. **Formular de feedback / participare** (secțiunea `#feedback`, centrată, într-un card): titlu „Spune-ne cum lucrezi — durează 2 minute"; subtitlu că răspunsurile arată ce să construim și că e nevoie de un email valid pentru rezervarea anului gratuit. Câmpuri:
   - Nume (opțional, text).
   - Email (obligatoriu, tip email).
   - Rol (select): Agent independent / Broker sau proprietar de agenție / Manager de rețea / Altul.
   - Orașul sau zona în care lucrezi (text).
   - Câți clienți noi ai într-o lună, în medie (select): Sub 10 / 10–30 / 30–60 / Peste 60.
   - Care e cea mai mare bătaie de cap în munca ta zilnică (textarea).
   - Ce te-ar face să folosești REVYX în fiecare zi (textarea).
   - Checkbox obligatoriu (consimțământ GDPR): „Sunt de acord ca REVYX să-mi păstreze datele pentru a mă contacta despre platformă și bonusul de un an."
   - Checkbox opțional: „Vreau să fiu contactat pentru a testa platforma în pilot."
   - Buton „Trimite și rezervă anul gratuit".
   La succes: înlocuiește formularul cu un mesaj de confirmare cu bifă verde: „Mulțumim! Ți-am înregistrat răspunsul și anul gratuit. Te contactăm în curând."
   Validare: email valid + consimțământ bifat obligatoriu, altfel mesaj de eroare.

10. **Footer**: logo REVYX + tagline mono „Real Estate Execution Intelligence"; „Platformă în dezvoltare · Republica Moldova"; „© 2026 ITPRO SYSTEM SRL. Toate drepturile rezervate."

## Backend formular — Supabase (integrarea nativă Lovable)
- Activează integrarea Supabase din Lovable.
- Creează un tabel `feedback` cu coloanele: `id` (uuid, PK, default gen_random_uuid()), `created_at` (timestamptz, default now()), `name` (text), `email` (text, not null), `role` (text), `city` (text), `monthly_volume` (text), `pain` (text), `wish` (text), `consent` (bool, not null), `pilot_interest` (bool, not null default false), `locale` (text, default 'ro').
- La submit, salvează un rând în `feedback`. Activează Row Level Security și permite doar inserarea (insert) din formular; nu expune citirea publică.
- Nu stoca nimic dacă `consent` nu e bifat.

## Traducerea RU
Oferă versiunea rusă pentru toate textele de mai sus (aceleași secțiuni). Titlurile-cheie: hero „Не CRM. / Ваша система ежедневной работы."; bonus „Помогите создать правильный инструмент — получите год бесплатно"; formular „Расскажите, как вы работаете — 2 минуты". Traducerile trebuie să fie naturale, nu literale.

## Rezultat așteptat
Un site de prezentare complet, responsive, bilingv RO/RU, cu identitatea vizuală REVYX (navy + auriu), linkuri către demo, secțiune de bonus și formular de feedback conectat la Supabase. Cod componentizat pe secțiuni, pregătit pentru export pe GitHub și deploy pe Vercel.

--- END ---
