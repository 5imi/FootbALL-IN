# Sistemul de Scouting, Perioada de Probe (Trials) și Echilibrul Motorului de Simulare

Acest document stabilește specificațiile complete pentru **atributele scouterului, propunerea jucătorilor pentru teste/probe și transfer, riscul de reușită sau eșec (Hit vs. Flop)** și **mecanismele matematice de echilibru ale motorului de meci** menite să prevină diferențele nerealiste de scor între echipe.

---

## 1. Atributele și Profilul Scouterului (The Human Scout)

Scouterul nu este un script mecanic care dezvăluie atributele exacte ca într-o bază de date brută. El este un specialist uman cu propriile calități, limitări și prejudecăți fotbalistice.

```
                           ┌──────────────────────────────┐
                           │          SCOUTERUL           │
                           └──────────────┬───────────────┘
                                          │
       ┌──────────────────────────┼──────────────────────────┐
       ▼                          ▼                          ▼
┌──────────────┐           ┌──────────────┐           ┌──────────────┐
│     JPA      │           │     JPP      │           │  PSIHOLOGIE  │
│  Apreciere   │           │  Apreciere   │           │  Evaluare    │
│  Abilitate   │           │  Potențial   │           │  Caracter &  │
│   Curentă    │           │    Viitor    │           │  Vicii Lot   │
└──────────────┘           └──────────────┘           └──────────────┘
```

### Atributele de Bază ale Scouterului (1 - 100):
1. **JPA (Judging Player Ability - Apreciere Abilitate Curentă)**:
   * Capacitatea de a evalua corect calitatea imediată a unui fotbalist.
2. **JPP (Judging Player Potential - Apreciere Potențial Viitor)**:
   * Ochiul format pentru a distinge dacă un tânăr de 17 ani are stofă de campion mondial sau este doar un jucător dezvoltat fizic devreme.
3. **Evaluare Psihologică (Psychological Profiling / Character Assessment)**:
   * Capacitatea de a detecta trăsături ascunse de caracter: profesionalism, lene, vulnerabilitate la stres sau tentații extrasportive.
4. **Rețeaua de Relații & Rază de Acoperire (Scouting Network / Range)**:
   * Nivelul de deschidere regională (Local, Național, Continental, Global).

### Marja de Eroare pe Raport:
Cu cât atributele scouterului sunt mai mici, cu atât marja de eroare pe raportul trimis managerului este mai mare:

| Nivel Calitate Scout | Marjă Eroare Evaluare Calitate | Risc de Evaluare Falsă a Caracterului | Calitatea Recomandărilor |
| :---: | :---: | :---: | :--- |
| **Amator (20 - 45%)** | $\pm 18 - 25\%$ | 55% șanse să rateze defecte majore | Recomandă adesea jucători plafonați ca mari talente |
| **Modest (46 - 65%)** | $\pm 10 - 17\%$ | 35% | Rapoarte utile, dar necesită confirmare |
| **Experimentat (66 - 84%)** | $\pm 5 - 9\%$ | 15% | Estimări fidele ale valorii de piață și talentului |
| **Elită Mondială (85 - 99%)** | $\pm 1 - 4\%$ | sub 5% | Precizie chirurgicală; descoperă „perle ascunse” |

---

## 2. Pârghiile de Recomandare ale Scouterului

Când scouterul finalizează o misiune sau găsește un jucător promițător, el oferă managerului trei opțiuni strategice:

### 2.1. Perioada de Probe (The Trial System - 7 sau 14 Zile)
* În loc să riște sume mari pe un transfer necunoscut, managerul poate chema fotbalistul în **Probe la Club**:
  * **Cost**: Zero taxă de transfer; se plătește doar o diurnă simbolică de cazare și masă (€250 - €500 / săptămână).
  * **Integrare**: Jucătorul în probe poate fi folosit în **meciuri amicale** și la antrenamentele echipei.
  * **Revelarea Adevărului**: După fiecare zi petrecută la club, ceața de pe atributele sale se risipește cu câte 15-20%, oferind managerului imaginea reală 100% înainte de a semna un contract oficial.
  * **Riscul de Refuz**: Jucătorii vedetă sau cu cotă mare vor refuza cu indignare să vină în probe; mecanica este dedicată liberilor de contract, tinerilor și fotbaliștilor din ligi inferioare.

### 2.2. Recomandare Directă de Transfer
* Scouterul întocmește o fișă completă cu prețul estimat cerut de clubul vânzător, pretențiile salariale probabile și clauzele contractuale recomandate.

### 2.3. Înrolare în Academia de Tineret (Youth Intake Scouting)
* Identificarea tinerilor de 15-16 ani din fotbalul de amatori pentru a fi aduși în academie sub incidența *Triunghiului Echilibrului* (Educație - Familie - Antrenament).

---

## 3. Fenomenul „Hit vs. Flop”: De ce pot Eșua Jucătorii Promițători?

În fotbalul real, nu orice transfer scump sau jucător lăudat confirmă (exemple celebre: Hazard la Real Madrid, Coutinho la Barcelona sau numeroase „tinere speranțe” dispărute). 
În joc, chiar dacă un fotbalist are calități fizice evidente, succesul său depinde de factori contextuali:

```
                            [ JUCĂTOR TRANSFERAT ]
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
       [ SUCCES / HIT ]                              [ EȘEC / FLOP ]
   • Adaptare rapidă la stil                     • Dor de casă (Homesickness)
   • Conexiune cu vestiarul                      • Suficiență după contract mare
   • Formă constantă în meci                     • Blocaj mental sub presiune
```

### Cauzele Principale ale unui „Flop”:
1. **Sindromul Contractului Mare (The Complacency Trap)**:
   * Unii jucători (cu personalitate `TEMPERAMENTAL` sau `REBEL_BAD_BOY`) își pierd motivația imediat ce primesc un contract pe 3-4 sezoane cu salariu substanțial. Randamentul la antrenament scade cu 20%.
2. **Probleme de Adaptare și Dor de Casă (Homesickness)**:
   * Jucătorii tineri transferați din altă țară pot suferi de izolare culturală și lingvistică. Moralul scade continuu timp de 1-2 luni dacă nu există compatrioți în lot sau un psiholog care să-i sprijine.
3. **Presiunea Tricoului (Expectation Weight)**:
   * Dacă un atacant tânăr este cumpărat pe o sumă record și primește numărul 9 sau 10, iar în primele 3 etape nu marchează, intră într-o spirală a lipsei de încredere (debuff temporar de -15% la finalizare).
4. **Eroarea de Scouting (Scout Hallucination)**:
   * Dacă scouterul tău a fost modest (JPA 45%), este foarte posibil ca el să fi evaluat fotbalistul pe baza a două meciuri excepționale dintr-un sezon mediocru, inducând managerul în eroare.

---

## 4. Echilibrul Motorului de Simulare (Anti-Snowball & Game Balance)

Un principiu esențial al proiectului este: **Jocul nu trebuie să permită acumularea de avantaje uriașe, nerealiste între echipe.**
În fotbalul european adevărat, Real Madrid, Manchester City sau Bayern München se împiedică periodic de formații mici, iar scorurile de maidan (10-0, 15-0) sunt practic inexistente între cluburi profesioniste.

### 4.1. Legea Randamentelor Descrescătoare (Diminishing Returns)
Diferența de randament între calitățile fotbaliștilor este calibrată matematic printr-o funcție logaritmică, nu liniară:
* Trecerea de la **Calitate 50 la Calitate 70** oferă un salt masiv de eficiență pe teren (+40%).
* Trecerea de la **Calitate 80 la Calitate 90** oferă un salt de doar +10%.
* Trecerea de la **Calitate 90 la Calitate 98** aduce doar o rafinare fină (+4%), făcând ca o echipă de „galactici” să poată fi ținută în șah de o echipă compactă și bine așezată tactic de 75-80.

### 4.2. Mecanica Autocenzurii Meciului (Underdog Tenacity & Park-the-Bus)
Când o echipă mai slabă joacă împotriva unui gigant:
1. **Densitatea Defensivă Automată**:
   * Când este dominată teritorial, echipa mai mică își strânge liniile în propriul careu de 16 metri. Spațiile de pătrundere pentru vedete scad cu până la 60%.
2. **Frustrarea Echipei Favorite (Frustration Factor)**:
   * Dacă gigantul nu marchează în primele 30-40 de minute, fotbaliștii săi devin nervoși, recurg la șuturi disperate de la distanță mare și neglijează replierea.
3. **Contraatacul Ucigaș (The Smash and Grab)**:
   * La un singur corner sau degajare lungă, atacantul underdog-ului are o șansă curată de gol. 
4. **Curba Distribuției Scourilor (Real-World Match Score Curve)**:
   * Motorul este calibrat pentru distribuții reale de scor:
     * **Victorie strânsă (1-0, 2-1, 2-0)**: ~65% din meciuri.
     * **Egalitate (0-0, 1-1, 2-2)**: ~23% din meciuri.
     * **Diferență medie (3-0, 3-1, 4-1)**: ~10% din meciuri.
     * **Scor sever (5-0, 6-1)**: ~1.9% din meciuri (doar când o echipă are 2 cartonașe roșii sau portar accidentat).
     * **Scoruri absurde (peste 7 goluri diferență)**: **0.1% hard-capped**.

---

## 5. Structura Datelor (Prisma Schema) & Algoritmul de Raportare

### 5.1. Extensie Schema Prisma
```prisma
// Model pentru Membrii Staff-ului de Scouting
model Scout {
  id                      Int           @id @default(autoincrement())
  teamId                  Int
  team                    Team          @relation(fields: [teamId], references: [id])
  name                    String
  
  // Atribute de Scouting (1-100)
  judgingAbility          Int           @default(50)  // JPA
  judgingPotential        Int           @default(50)  // JPP
  psychologicalAssessment Int           @default(50)  // Detectare caracter / vicii
  scoutingRange           ScoutingRange @default(NATIONAL)
  
  // Stare curentă
  isOnAssignment          Boolean       @default(false)
  currentAssignment       String?
  reportsGenerated        ScoutReport[]

  createdAt               DateTime      @default(now())
  updatedAt               DateTime      @updatedAt
}

enum ScoutingRange {
  LOCAL
  NATIONAL
  CONTINENTAL
  GLOBAL
}

// Raport de Scouting generat pentru un jucător
model ScoutReport {
  id                    Int       @id @default(autoincrement())
  scoutId               Int
  scout                 Scout     @relation(fields: [scoutId], references: [id])
  playerId              Int
  player                Player    @relation(fields: [playerId], references: [id])

  // Evaluări raportate (afectate de marja de eroare a scouterului)
  perceivedQuality      Int       // Calitatea pe care o VEDE scouterul (poate diferi de cea reală)
  perceivedPotential    Int       // Potențialul estimat
  characterSummary      String    // Raport textual despre caracter
  recommendationType    String    // 'TRIAL_RECOMMENDED', 'DIRECT_BUY', 'REJECT'
  errorMargin           Int       // Valoarea erorii ascunse (ex: +7 puncte supraestimat)

  createdAt             DateTime  @default(now())
}

// Sistemul de Probe (Trials)
model PlayerTrial {
  id              Int       @id @default(autoincrement())
  teamId          Int
  team            Team      @relation(fields: [teamId], references: [id])
  playerId        Int
  player          Player    @relation(fields: [playerId], references: [id])
  daysRemaining   Int       @default(14)
  attributesKnown Int       @default(20) // Procentaj de atribute dezvăluite (crește zilnic)
  status          String    @default("ACTIVE") // 'ACTIVE', 'SIGNED', 'RELEASED'
}
```

### 5.2. Algoritmul Matematic de Generare a Raportului cu Marjă de Eroare
```typescript
interface GeneratedReport {
  perceivedQuality: number;
  perceivedPotential: number;
  detectedPersonality: string;
  recommendation: 'TRIAL' | 'DIRECT_BUY' | 'REJECT';
}

function generateScoutReport(scout: Scout, player: Player): GeneratedReport {
  // 1. Calculul marjei maxime de eroare pe baza JPA și JPP
  // JPA 100 -> marja max 2; JPA 20 -> marja max 25
  const maxAbilityError = Math.round((100 - scout.judgingAbility) * 0.25);
  const maxPotentialError = Math.round((100 - scout.judgingPotential) * 0.30);

  // 2. Aplicarea distribuției aleatorii a erorii (gauss sau uniform restrâns)
  const abilityError = Math.round((Math.random() * (maxAbilityError * 2)) - maxAbilityError);
  const potentialError = Math.round((Math.random() * (maxPotentialError * 2)) - maxPotentialError);

  const perceivedQuality = Math.min(99, Math.max(1, player.overallQuality + abilityError));
  const perceivedPotential = Math.min(99, Math.max(perceivedQuality, player.potential + potentialError));

  // 3. Evaluarea psihologică a caracterului
  const psychologyCheck = Math.random() * 100;
  let detectedPersonality = player.personality;

  // Dacă scouterul e slab la psihologie, poate cataloga greșit un rebel drept profesionist
  if (psychologyCheck > scout.psychologicalAssessment) {
    detectedPersonality = 'APARE_DE_INCREDERE_DAR_NESIGUR';
  }

  // 4. Stabilirea recomandării
  let recommendation: 'TRIAL' | 'DIRECT_BUY' | 'REJECT' = 'REJECT';
  if (perceivedQuality >= 75 || perceivedPotential >= 85) {
    recommendation = (scout.judgingAbility > 80) ? 'DIRECT_BUY' : 'TRIAL';
  } else if (perceivedQuality >= 65 || perceivedPotential >= 75) {
    recommendation = 'TRIAL';
  }

  return {
    perceivedQuality,
    perceivedPotential,
    detectedPersonality,
    recommendation
  };
}
```

---

## 6. Rezumat pentru Manager

1. **Nu crede orbește orice raport.** Dacă ai un scouter de divizii inferioare cu JPA 40%, recomandările lui „de aur” pot fi doar iluzii costisitoare.
2. **Folosește Perioada de Probe (Trials).** Este cel mai sigur instrument financiar pentru a testa un jucător misterios înainte de a-i oferi un salariu mare.
3. **Păstrează modestia în fața echipelor mici.** Niciun meci nu este câștigat dinainte. O tactică arogantă te poate costa puncte prețioase împotriva unui adversar dârz care se apără pe două linii.
