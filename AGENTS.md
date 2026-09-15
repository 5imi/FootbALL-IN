# AGENTS.md — Directive Obligatorii pentru Agenții AI (SoccerManager Clone)

Acest document stabilește regulile fundamentale, principiile de cercetare și standardele de dezvoltare de software pentru toți agenții AI (Antigravity, Gemini CLI, Claude, Copilot) care contribuie la repository-ul **SoccerManager Clone**.

Fiecare agent care preia sarcini în acest proiect este **OBLIGAT** să citească, să respecte și să aplice directivele de mai jos.

---

## 🚫 1. Regula de Aur Git & Controlul Versiunilor

Înainte de orice operațiune Git (`git add`, `git commit`, `git push`), **ESTE STRICT INTERZIS** să se includă sau să se trimită pe GitHub:
1. **Foldere interne de AI / Asistent**: `.agents/`, `.artifacts/`, `.gemini/`
2. **Foldere și fișiere de IDE**: `.idea/`, `.vscode/`, `*.iml`, `local.properties`
3. **Dependențe, cache și build artifacts**: `node_modules/`, `.next/`, `dist/`, `build/`, `bin/`, `obj/`, `__pycache__/`, `*.pyc`
4. **Fișiere de secrete**: `.env`, `.env.local`, `.env.production`

### Verificare Obligatorie:
* Verificați întotdeauna `git status` înainte de comitere.
* Dacă un fișier intern a fost urmărit accidental de Git:
  ```bash
  git rm -r --cached .agents .artifacts .idea .vscode .gemini node_modules .next
  ```
* Asigurați-vă că `.gitignore` este actualizat și conține toate aceste excluderi.

### 🚀 Directivă Automată: Commit & GitHub Push după Fiecare Implementare Majoră:
* **Fiecare implementare majoră, mecanică nouă sau pas semnificativ finalizat și verificat (build fără erori + teste rulate) TREBUIE URMĂT IMEDIAT de `git commit` și `git push` pe GitHub.**
* Asistentul AI are obligația să realizeze automat `git add` (excluzând fișierele interzise), `git commit` și `git push origin <branch>`.
* **Standard Mesaj Commit**: În descrierea/corpul commit-ului se va include întotdeauna mențiunea:
  ```
  feat/fix: <titlu modificare>
  
  [proiect in dezvoltare]
  ```
* Utilizatorul nu trebuie să mai reamintească sau să ceară manual push-ul pe GitHub.

---



## 🔬 2. Reguli de Analiză și Cercetare (Research First)

1. **Consultarea Documentației din `doc/`**:
   * Înainte de a proiecta sau coda orice funcționalitate nouă, agentul are obligația să consulte manualele din folderul `doc/` (`manual_complet_mecanici.md`, `game_economy_design.md`, `spinfo_formulas.md`, `fotbal_european_si_reguli_reale.md`).
2. **Fără Presupuneri (Zero Guesswork)**:
   * Matematica jocului nu se inventează "după ureche". Toate cotele (proporțiile stadionului 33% / 1% / 0.2%, penalizările de fitness, formula de arbitraj $Agresivitate \le 100 - Severitate$) trebuie respectate cu strictețe conform formulelor stabilite.
3. **Toată Documentația se Scrie Exclusiv în `.md`**:
   * Orice studiu nou, analiză de mecanică sau plan tehnic va fi redactat exclusiv în format Markdown în folderul `doc/` și indexat în `doc/README.md`.
4. **Regula Documentării Universale („Documentează Tot — Orice Idee Bună sau Rea”)**:
   * **Orice idee, mecanică, sugestie sau ipoteză (bună sau rea)** apărută în discuții, planificare sau dezvoltare **TREBUIE DOCUMENTATĂ IMEDIAT** în fișiere `.md` în folderul `doc/`.
   * **Proactivitate absolută**: Asistentul AI nu va mai aștepta să i se reamintească sau să i se ceară expres acest lucru. Memoria tehnică și creativă a proiectului trebuie să fie completă și actualizată continuu.
   * Exemple de concepte documentate obligatoriu: balansul antrenamentelor, riscuri/recompense, mecanica ruletei (+10/-10), scouting și probe (trials), corupția și arbitrajul, războiul psihologic, dramele din viața reală, cadrul matematic anti-scoruri astronomice și jurnalul continuu de descoperiri bune/rele (vezi `doc/balans_antrenament_si_ruleta_simularii.md`, `doc/arbitraj_si_mecanica_coruptiei.md`, `doc/razboi_psihologic_presa_si_secrete_fotbal.md`, `doc/enciclopedie_situatii_reale_si_drame_fotbal.md`, `doc/balans_matematic_si_anti_scoruri_astronomice.md`, `doc/jurnal_descoperiri_si_idei_dezvoltare.md` și `doc/dezvoltare_juniori_si_triunghiul_echilibrului.md`).

---

## ⚽ 3. Filosofia de Gameplay: "Fair-Play & Dopamine"

1. **Zero Pay-to-Win (P2W)**:
   * Este strict interzisă introducerea oricărei mecanici prin care banii reali pot cumpăra avantaje competitive pe teren (fără jetoane de energie plătite, fără boost-uri instant plătite).
   * Singurele monetizări acceptate în viziunea jocului sunt exclusiv **cosmetice** (steme de club, design-uri de echipamente, teme de stadion).
2. **Determinism și Integritate (Anti-Cheat)**:
   * Motorul de meci (Match Engine) trebuie să fie **100% determinist** pe baza unui `seed` numeric, a calității jucătorilor și a tacticilor alese. Două simulări cu aceleași intrări trebuie să genereze exact același meci.
   * Toate calculele critice se execută **exclusiv pe server (backend)**. Clientul web este doar o interfață de afișare.
3. **Bucle Pozitive de Recompensă (Dopamine Loops)**:
   * Fiecare acțiune importantă a utilizatorului (antrenament reușit, victorie, extindere stadion, promovare junior) trebuie însoțită de feedback vizual clar (badge-uri, animații, sunete specifice).

---

## 💻 4. Standarde de Arhitectură & Codare

### Tehnologii de Bază:
* **Frontend**: Next.js (React), Vanilla CSS / Tailwind cu sistem de design coerent.
* **Backend / API**: Node.js / Python (FastAPI).
* **Bază de Date**: PostgreSQL cu tranzacții stricte ACID (esențial pentru transferuri și registrul financiar).
* **Job Scheduler (Cron)**: BullMQ / Redis pentru execuția etapei zilnice la ora 04:00 CET și a amicalelor.

### Principii de Cod:
1. **Modularitate Stricta (Directiva Anti-Monobloc)**:
   * **ESTE STRICT INTERZISĂ** crearea de fișiere gigantice („monobloc”) care acumulează mai multe responsabilități (Single Responsibility Principle).
   * **Limita de Dimensiune**: Niciun fișier sursă nu trebuie să depășească **250–350 de linii de cod**. Când un fișier se apropie de această limită, este obligatorie decuplarea lui în module separate specializate:
     * Generatorul RNG determinist $\rightarrow$ `rng.ts`
     * Calculul formulelor și ratingurilor $\rightarrow$ `ratings.ts`
     * Mecanicile de arbitraj, corupție & anchetă $\rightarrow$ `corruption.ts`
     * Baza de texte narative & comentarii $\rightarrow$ `commentary/` (cu fișiere separate pentru selecția jucătorilor, comentarii ambientale, evenimente speciale)
     * Orchestratorul central $\rightarrow$ conține strict bucla de simulare, delegând calculele și generările către module.
   * **Extensibilitate prin Submodule**: Orice funcționalitate nouă (sistem de transferuri, prognoză meteo, academie de juniori, rapoarte medicale) se va dezvolta într-un folder/modul dedicat, cu exporturi clare (`index.ts`).
2. **Separarea Straturilor (Layers)**:
   * `engine/`: Logica pură a meciului, fără dependențe externe sau I/O (input: 2 echipe $\rightarrow$ output: timeline evenimente meci).
   * `economy/`: Calculul biletelor, salariilor, sponsorilor și taxei de transfer de 15%.
   * `api/`: Endpoint-uri REST securizate cu validare strictă a tipurilor de date (Zod / Pydantic).
3. **Integritate Financiară (Double-Entry Bookkeeping)**:
   * Banii clubului nu se modifică printr-un simplu `balance += x`. Fiecare operațiune financiară trebuie să aibă o intrare corespunzătoare în tabela `finances_ledger` (auditare completă a tranzacțiilor).
4. **Teste Automate Obligatorii**:
   * Orice modificare adusă formulelor de meci sau economiei trebuie validată prin teste unitare (ex: testarea proporției de accidentări, testarea simulării cu 10.000 meciuri pentru echilibrul golurilor).

---

## 🎨 5. Standarde de Design și UI/UX (Consistența Temei Vizuale)

1. **Regula de Aur a Temei Unificate (Aceeași Temă peste Tot)**:
   * **TOATE paginile, tab-urile, ferestrele modale și componentele din aplicație TREBUIE să păstreze cu strictețe ACEEAȘI TEMĂ VIZUALĂ**.
   * Este strict interzisă abaterea stilistică de la o pagină la alta (fără stiluri hibride sau culori la întâmplare).
   * **Baza Temei Vizuale**: Un stil modern, elegant și curat Dark Mode (`bg-slate-950` fundal principal, `bg-slate-900` carduri/tabele, borduri discrete `slate-800` sau `border-blue-900/40`, accente albastre SoccerProject `#2563eb` / `#3b82f6`, text `text-slate-200` și `text-white`).

2. **Design Curat, Compact & Fără Spațiu Irosit (Modelul SP)**:
   * Paginile funcționale (Antrenament, Baza Sportivă/Stadion, Personal/Staff, Lot jucători, Transferuri) trebuie să fie **compacte, condensate și aerisite**, exact conform modelului SoccerProject.
   * **Fără elemente vizuale masive inutile**: Nu se adaugă acordeoane voluminoase sau mini-carduri interne care ocupă spațiu vertical inutil pe paginile tabelare.
   * Informația trebuie să fie densă, clară și rapid accesibilă dintr-o privire.

3. **Coduri de Culoare Standardizate pentru Poziții**:
   * Toate componentele vor folosi exact aceleași coduri de culori consacrate pentru insigne:
     * **Portari (`GK`)**: Portocaliu cărămiziu (`bg-[#d35400] text-white`)
     * **Fundași (`LB`, `CB`, `SW`, `RB`)**: Galben-muștar / Kaki (`bg-[#d4ac0d] text-slate-950 font-bold`)
     * **Mijlocași (`LM`, `CM`, `RM`)**: Verde (`bg-[#27ae60] text-white`)
     * **Atacanți (`LF`, `CF`, `RF`)**: Albastru (`bg-[#2980b9] text-white`)

4. **Sistem Unitar de Bare și Plafonate (Atribute SP)**:
   * Bare de atribute în dezvoltare: Albastru (`bg-blue-500` / `#3b82f6`).
   * **Atribute Plafonate Genetic (`maxCap` atins)**: Bară **ROȘIE** (`bg-rose-500` / `#ef4444`, text roșu și etichetă `(Plafonat 🔒)`), conform regulii SoccerProject.
   * În selecțiile de antrenament și tabele, atributele plafonate sunt evidențiate cu roșu pentru a ghida decizia managerului.

5. **Interacțiune Unitară Jucători & Modalul SP**:
   * Numele oricărui jucător dintr-un tabel este întotdeauna un link albastru interactiv (`text-blue-400 hover:text-blue-300 hover:underline cursor-pointer`).
   * La apăsarea pe nume, se deschide întotdeauna **Fereastra Modală Detaliată SP** (`PlayerDetailsModal`), conținând toate datele biometrice, istoricul, barele și atributele.
   * Această abordare menține paginile principale curate și compacte, fără duplicate.

6. **Stil Unitar pentru Butoane, Formulare & Notificări**:
   * Butoanele principale (`Automatic`, `Salvează`, etc.) folosesc stilul clasic compact cu hover discret și feedback la apăsare (`active:translate-y-0.5`).
   * Notificările de succes la salvare sunt afișate prin bannere toast verzi (`bg-emerald-950/80 border border-emerald-500/50 text-emerald-200`).
   * Toate meniurile drop-down (`<select>`) au fundal întunecat (`bg-slate-950 border border-slate-700 text-slate-200`).

7. **Meciul Live Text & Timeline Interactiv**:
   * Simularea meciului se afișează ca **Live Text Ticker** (text comentat dinamic minut cu minut) însoțit de un **Timeline vizual al evenimentelor** (0' - 90', cu icoane pentru goluri, cartonașe, bare și intervenții VAR).
   * Fără încărcare inutilă de canvas sau fizică 2D. Experiența este ultra-rapidă, curată și captivantă.

---

## 📌 6. Checklist Înainte de Finalizarea Oricărei Sarcini

- [ ] Am respectat formulele din `doc/`?
- [ ] Codul este testat și nu generează erori în consolă?
- [ ] Nu au fost adăugate fișiere din `.gitignore` în staging?
- [ ] Am actualizat documentația `.md` dacă s-a modificat vreo regulă sau schemă?
- [ ] Am documentat în `.md` orice idee (bună sau rea), discuție sau mecanică propusă (fără a aștepta remindere)?
