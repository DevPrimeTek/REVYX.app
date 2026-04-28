# REVYX — Brand Configuration
<!-- brand-configs/revyx.md · v1.0.0 · 2025-04 -->

## Changelog
| Versiune | Data | Autor | Note |
|---|---|---|---|
| 1.0.0 | 2025-04 | Senior PM | Configurație inițială din BrandBook v2.2 + Spec v1.1 |

---

## 1. Identitate

| Atribut | Valoare |
|---|---|
| **Produs** | REVYX |
| **Tip** | Agent Operating System (AOS) — nu un CRM clasic |
| **Companie** | ITPRO SYSTEM SRL |
| **Tagline** | Real Estate Execution Intelligence |
| **Piața primară** | Republica Moldova |
| **Limbă principală docs** | Română |
| **Limbi secundare** | Rusă (comunicare locală) · Engleză (GitHub / tech docs) |
| **An** | 2025 |
| **Confidențialitate** | Uz intern · Confidențial |

---

## 2. Culori

### 2.1 Paletă primară

| Token | Hex | Rol |
|---|---|---|
| `--navy` | `#0C1428` | **Fundal primar** — baza întregii UI |
| `--navy-deep` | `#080E1C` | Fundal cel mai adânc: cover, dropdowns |
| `--navy-mid` | `#111D35` | Carduri, panouri |
| `--navy-card` | `#152038` | Carduri elevate |
| `--navy-hover` | `#1A2844` | State hover |
| `--gold` | `#C9870A` | **Accent primar** — CTA, headere, highlights |
| `--gold-light` | `#E6A020` | Accent gold deschis |
| `--gold-bright` | `#F5B830` | Gold luminoasă (efecte) |
| `--gold-dark` | `#8A5C06` | Gold închisă (gradient start) |

### 2.2 Borduri

| Token | Hex | Utilizare |
|---|---|---|
| `--border` | `#1E2E48` | Borduri standard |
| `--border-light` | `#263A58` | Borduri hover/focus |
| `--gold-border` | `#C9870A38` | Borduri gold (38 = opacity 22%) |
| `--gold-pale` | `#C9870A14` | Background gold slab (14 = opacity 8%) |

### 2.3 Text (calibrat pe fundal navy)

| Token | Hex | Rol |
|---|---|---|
| `--text-h` / `--t1` | `#F0F4FA` | Headere pe navy |
| `--text-primary` / `--t2` | `#D8E2F0` | Corp text primar |
| `--text-sec` / `--t3` | `#8FA8CC` | Etichete secundare |
| `--text-muted` / `--t4` | `#4A6280` | Text dezactivat / muted |
| `--white` | `#FFFFFF` | Alb pur |

### 2.4 Status

| Token | Hex | Semantic |
|---|---|---|
| `--green` | `#0FBA7F` | Succes · Deal sănătos · AC passed |
| `--amber` | `#E8950A` | Atenție · Review necesar |
| `--red` | `#E03030` | Eroare · Deal în pericol · Critic |
| `--blue` | `#3B82F6` | Info · Acțiune sistem AI |

### 2.5 Paletă actori workflow

| Actor | Culoare | Token |
|---|---|---|
| 🏠 Proprietar / Vânzător | `#F59E0B` | `--sel` |
| 🤝 Agent Imobiliar | `#C9870A` | `--agt` |
| 🤖 Sistem REVYX AI | `#3B82F6` | `--ai` |
| 👤 Client / Cumpărător | `#10B981` | `--buy` |
| 👔 Manager Agenție | `#EC4899` | `--mgr` |
| 🏦 Bancă / Finanțator | `#8B5CF6` | `--bnk` |
| ⚖️ Notar | `#EF4444` | `--not` |
| 📱 Platforme & Social | `#FF6B35` | `--soc` |

---

## 3. Tipografie

| Rol | Font | Greutăți | Utilizare |
|---|---|---|---|
| **Display / Heading** | Bebas Neue | 400 | Titluri mari, cifre mari, secțiuni principale |
| **Body / UI** | Montserrat | 300 · 400 · 600 · 700 · 800 · 900 | Text general, butoane, carduri |
| **Code / Mono** | JetBrains Mono | 400 · 500 | ID-uri, scoruri, token-uri, date tehnice, badge-uri |

### 3.1 Scale tipografică indicativă

| Nivel | Font | Size | Utilizare |
|---|---|---|---|
| Cover Title | Bebas Neue | `clamp(64px, 10vw, 130px)` | Titlul principal pagină |
| Cover Sub | Bebas Neue | `clamp(18px, 3vw, 28px)` | Subtitlu cover |
| Section Title | Bebas Neue | `clamp(44px, 6vw, 80px)` | Headere de secțiune |
| Body text | Montserrat | 14px / lh 1.7 | Text standard |
| Label mono | JetBrains Mono | 10px / ls .25em | Etichete, categorii |
| Badge mono | JetBrains Mono | 9px / ls .15em | Badge-uri, chip-uri |

---

## 4. Spațiere & Grid

```
Grid base: 8px
Spațiere:
  sp1  =  8px   sp5  = 40px   sp10 =  80px
  sp2  = 16px   sp6  = 48px   sp12 =  96px
  sp3  = 24px   sp8  = 64px   sp16 = 128px
  sp4  = 32px

Border-radius:
  r-sm = 4px    r-md = 8px    r-lg = 14px    r-xl = 20px
  badge / pill = 100px (fully rounded)
```

---

## 5. Componente UI cheie

### 5.1 Cards
- Background: `--navy-card` (#152038)
- Border: 1px solid `--border`
- Accent line top: 2px gradient gold (`--gold-dark` → `--gold` → `--gold-light`)
- Hover: `translateY(-2px)` + border-color → `--border-light`

### 5.2 Formula Cards
- Background: `--navy-card`
- Accent line top: 2px gradient gold
- ID: JetBrains Mono 10px, gold, uppercase, ls .2em
- Expresie: JetBrains Mono, `clamp(13px, 2vw, 16px)`, `--text-h`
- Note: JetBrains Mono 11px, `--text-sec`

### 5.3 Note Boxes (Alert Boxes)
- Amber: bg `rgba(232,149,10,.08)` · border `rgba(232,149,10,.22)`
- Red/Critic: bg `rgba(224,48,48,.08)` · border `rgba(224,48,48,.22)`
- Green: bg `rgba(15,186,127,.08)` · border `rgba(15,186,127,.22)`
- Blue/Info: bg `rgba(59,130,246,.08)` · border `rgba(59,130,246,.22)`

### 5.4 Badges
- `.badge-new` — green border/bg — pentru formule noi
- `.badge-updated` — gold border/bg — pentru formule actualizate
- `.badge-critical` — red border/bg — pentru elemente critice
- Severitate: `CRITIC` (red) · `RIDICAT` (amber) · `MEDIU` (blue/muted)

### 5.5 Tabele
- Header: `--navy-card` bg, `--gold` text
- Rânduri: alternare `--navy` / `--navy-mid`
- Celule speciale: `td-gold` · `td-green` · `td-red` · `td-amber` · `td-muted`

### 5.6 Cover / Hero
- Background: radial gradient gold glow pe navy-deep
- Grid overlay: linii `--border` la 80px, opacity .18
- Mask: radial gradient pentru fade

### 5.7 Nav (fixed)
- Height: 56px
- Background: `rgba(8,14,28,.97)` + backdrop-filter blur(20px)
- Border-bottom: 1px solid `--border`

### 5.8 Lead Temperature
- 4 niveluri cu coduri vizuale distincte:
  - Rece (LS < 0.40): `--blue`
  - Warm (0.40–0.60): `--sel` (amber)
  - Calificat (0.60–0.75): `--gold`
  - HOT (≥ 0.75): `--red` cu animație pulsantă

---

## 6. Logo & Brand Assets

| Regulă | Detaliu |
|---|---|
| Fundal obligatoriu | Navy (`#0C1428`) sau Navy Mid |
| Fișier | PNG original, fără modificări |
| Proporții | Menținute întotdeauna |
| Spațiu exclusiv | Respectat pe toate laturile |
| Dimensiune minimă | 32px digital / 8mm print |
| Interdicție | Niciun overlay, modificare sau fundal non-navy |

---

## 7. Ton & Voce

| Dimensiune | Specificație |
|---|---|
| **Ton general** | Profesional · precis · executiv |
| **Limbaj** | Tehnic-business în română; fără jargon inutil |
| **Documentație** | Markdown cu header brand + versionare semantică |
| **Versioning** | `vMAJOR.MINOR.PATCH` — semantic versioning |
| **Marcaj modificări** | `★` = nou sau actualizat față de versiunea anterioară |
| **Confidențialitate** | Toate documentele marcate "CONFIDENȚIAL · Uz Intern" |
| **Copyright** | © 2025 REVYX · All Rights Reserved |

---

## 8. Structura documentelor (sistem skilluri)

```
Orchestrator: DOC_MASTER
├── SKILL_BRD      → Business Requirements Document
├── SKILL_PRD      → Product Requirements Document
├── SKILL_TECH_SPEC → Technical Specification
├── SKILL_WORKFLOW  → Workflow & Process Maps
└── brand-configs/
    └── revyx.md   ← acest fișier
```

### Header standard pentru orice document REVYX

```markdown
# [TITLU DOCUMENT]
<!-- [filename] · v[MAJOR.MINOR.PATCH] · [DATA-ISO] -->
<!-- CONFIDENȚIAL · Uz Intern · © 2025 REVYX -->

## Changelog
| Versiune | Data | Autor | Note |
|---|---|---|---|
| x.y.z | YYYY-MM | Autor | Descriere modificare |
```

---

## 9. Stack tehnic de referință

| Layer | Tehnologie |
|---|---|
| Auth | Supabase Auth sau Auth0 · JWT RS256 |
| Database | PostgreSQL + pgvector |
| Cache | Redis |
| Mesagerie | WhatsApp Business API (templates pre-aprobate Meta) |
| Lead Intake | Webhooks Meta / Google / OLX (HMAC-SHA256 verified) |
| AI embeddings | pgvector HNSW (Phase 3) |
| Timezone | UTC+2 (Chișinău, Moldova) |
| Currency default | EUR (+ MDL, USD) |

---

*brand-configs/revyx.md · v1.0.0 · REVYX — Real Estate Execution Intelligence · © 2025 REVYX*
