---
name: karpathy-guidelines
description: Behavioral guidelines to reduce common LLM coding mistakes. Use when writing, reviewing, or refactoring code to avoid overcomplication, make surgical changes, surface assumptions, and define verifiable success criteria.
license: MIT
---

# Karpathy Guidelines

> Sursă: https://github.com/multica-ai/andrej-karpathy-skills (MIT). Adaptat ca skill fundamental REVYX.
> Derivat din observațiile lui Andrej Karpathy despre greșelile frecvente ale LLM-urilor în scrierea de cod: modelele „fac presupuneri greșite în locul tău și merg mai departe cu ele" fără să ceară clarificări.

**Tradeoff:** aceste principii înclină spre prudență în detrimentul vitezei. Pentru sarcini triviale, folosește judecata.

## 1. Think Before Coding — Gândește înainte de a scrie cod

**Nu presupune. Nu ascunde confuzia. Expune trade-off-urile.**

Înainte de implementare:
- Enunță explicit presupunerile. Dacă ești nesigur, întreabă.
- Dacă există mai multe interpretări, prezintă-le — nu alege în tăcere.
- Dacă există o abordare mai simplă, spune. Contestă când e justificat.
- Dacă ceva e neclar, oprește-te. Numește ce te confuzează. Întreabă.

## 2. Simplicity First — Simplitatea întâi

**Minimul de cod care rezolvă problema. Nimic speculativ.**

- Niciun feature dincolo de ce s-a cerut.
- Nicio abstracție pentru cod folosit o singură dată.
- Nicio „flexibilitate" / „configurabilitate" necerută.
- Niciun error handling pentru scenarii imposibile.
- Dacă scrii 200 de linii și ar putea fi 50, rescrie.

Întreabă-te: „Ar spune un inginer senior că e prea complicat?" Dacă da, simplifică.

## 3. Surgical Changes — Modificări chirurgicale

**Atinge doar ce trebuie. Curăță doar mizeria ta.**

La editarea codului existent:
- Nu „îmbunătăți" cod/comentarii/formatare adiacente.
- Nu refactoriza ce nu e stricat.
- Respectă stilul existent, chiar dacă tu ai fi făcut altfel.
- Dacă observi dead code nelegat, menționează-l — nu-l șterge.

Când schimbările tale creează orfani:
- Elimină import-uri/variabile/funcții pe care **schimbările tale** le-au lăsat nefolosite.
- Nu elimina dead code preexistent decât dacă ți se cere.

Testul: fiecare linie schimbată trebuie să se lege direct de cererea utilizatorului.

## 4. Goal-Driven Execution — Execuție orientată pe obiectiv

**Definește criterii de succes. Buclează până la verificare.**

Transformă sarcinile în obiective verificabile:
- „Adaugă validare" → „Scrie teste pentru input invalid, apoi fă-le să treacă"
- „Repară bug-ul" → „Scrie un test care îl reproduce, apoi fă-l să treacă"
- „Refactorizează X" → „Asigură-te că testele trec înainte și după"

Pentru sarcini multi-pas, enunță un plan scurt:
```
1. [Pas] → verifică: [check]
2. [Pas] → verifică: [check]
3. [Pas] → verifică: [check]
```

Criteriile de succes puternice permit buclarea independentă. Criteriile slabe („fă-l să meargă") cer clarificări constante.

---

**Aceste principii funcționează dacă:** mai puține schimbări inutile în diff-uri, mai puține rescrieri din cauza supra-complicării, iar întrebările de clarificare vin înainte de implementare, nu după greșeli.

---

*Skill REVYX · sursă MIT multica-ai/andrej-karpathy-skills · CONFIDENȚIAL · Uz Intern*
