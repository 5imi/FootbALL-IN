# Balansul Antrenamentului, Mecanica „Ruletei” și Managementul Riscului

Acest document descrie în detaliu arhitectura de joc pentru **sistemul de antrenament, fluctuația ascunsă de performanță (mecanica „Ruletei” +10 / -10), impactul caracterului jucătorului, rolul staff-ului auxiliar și echilibrul dinamic** pe care managerul uman trebuie să îl stăpânească.

---

## 1. Filosofia de Design: „Echilibru Dinamic vs. Ruletă Tactică”

În fotbalul real, nicio echipă nu poate performa la capacitate maximă 365 de zile pe an. Dacă un antrenor forțează jucătorii cu antrenamente spartane, va obține rezultate explozive pe termen scurt, însă va plăti prețul prin accidentări musculare, uzură psihologică și căderi bruște de formă. Invers, un regim prea lejer protejează lotul, dar duce la suficiență, pierderea ritmului de joc și eșec în fața echipelor motivate.

**În SoccerManager Clone, antrenamentul nu este o simplă apăsare de buton liniară.** 
Este un **sistem viu de risc și recompensă**, unde managerul:
1. Poate alege calea sigură (creștere constantă, risc minim).
2. Poate forța limitele „ca la ruletă” (creșteri masive sau cădere bruscă de performanță).
3. Trebuie să citească semnalele transmise de jucători și staff prin interfață, navigând printre parametri ascunși ce fluctuează de la o zi la alta și de la o oră la alta.

```
       [ Regim Ușor ] ───────> [ Risc Minim ] ───────> [ Creștere Lentă / Stagnare ]
              │
       [ Echilibru Optim ] ──> [ Progres Constant ] ──> [ Formă Stabilă + Sănătate ]
              │
       [ Regim Extrem ] ─────> [ „Ruletă” (+10/-10) ] ─> [ Risc Accidentare / Burnout ]
```

---

## 2. Nivelele de Intensitate ale Antrenamentului

Managerul poate configura intensitatea antrenamentului la nivel de echipă sau individual pentru fiecare jucător:

| Nivel Intensitate | Consum Fitness Zilnic | Risc Accidentare | Rata de Creștere Atribute | Risc de Stres / Burnout | Efect de Meci (Weekend/Etapă) |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **1. Regenerare (Recovery)** | -2% | 0.5% (neglijabil) | 10% din ritmul normal | 0% (reduce stresul acumulat) | Jucător proaspăt, fitness 100%, dar poate avea lipsă de ritm |
| **2. Ușor (Light)** | -5% | 2% | 50% din ritmul normal | 2% | Condiție fizică excelentă, risc mic de accidentare |
| **3. Moderat / Echilibrat (Standard)** | -10% | 5% | 100% (ritm etalon) | 8% | Balansul sănătos între dezvoltare și prospețime competițională |
| **4. Intensiv (Hard Work)** | -18% | 14% | 180% | 25% | Creșteri rapide de atribute; necesită rotație frecventă a lotului |
| **5. Extrem / Overload (The Roulette Mode)** | -28% | 32% | 280% | 55% | **Mecanica Ruletă activă**: posibilitate de explozie (+10) sau colaps (-10) |

---

## 3. Mecanica „Ruletei”: Fluctuația Ascunsă (+10 / -10)

### 3.1. Ce este Ruleta de Performanță?
Când un jucător este supus la un regim intensiv sau extrem, ori când managerul îl forțează să joace titular meci de meci fără pauză, motorul jocului activează **Fluctuația Ruletă**.
* **Bonusul de Grație (+10)**: Jucătorul depășește oboseala printr-un aflux de adrenalină, atingând o „stare de flux”. În meci, randamentul său pe linie (Line Rating) sau la atributele cheie crește temporar cu până la **+10 puncte**. Devine de neoprit, câștigă dueluri improbabile și trage echipa după el.
* **Căderea Bruscă (-10)**: Corpul și psihicul cedează. Fără ca jucătorul să fie neapărat accidentat grav, el devine „fantomă pe teren”: reflexe întârziate, pase greșite neforțate, viteză de reacție prăbușită cu **-10 puncte**. Dacă e forțat în continuare, riscul de accidentare gravă devine iminent.

### 3.2. Parametrii Ascunși Fluctuanți (Ceasul Biologic & Ritmul Circadian)
Pentru a evita ca managerii să calculeze totul algoritmic ca într-un tabel Excel rigid, jocul folosește parametri ascunși care își schimbă valoarea subtil:
* **Fluctuație orară (`biorhythm_hour_delta`)**: O variație minoră de $\pm 2-3\%$ pe parcursul celor 24 de ore, reflectând bioritmul și odihna.
* **Fluctuație zilnică (`daily_wellness_seed`)**: În fiecare noapte la recalcularea de server (04:00 CET), fiecare fotbalist primește o variație a stării de bine (-5% până la +5%), determinată de calitatea somnului, mici tensiuni musculare sau evenimente personale.
* Managerul **nu vede valoarea numerică exactă**, ci o deduce din raportul asistentului medical sau din iconițele de stare din lot.

### 3.3. Rolul Caracterului și Personalității Jucătorului
Reacția la antrenamentul intensiv este direct proporțională cu atributele de personalitate ale jucătorului:

```prisma
enum PersonalityTrait {
  PROFESSIONAL      // Muncește exemplar; suportă regim greu fără să cedeze psihic
  AMBITIOUS         // Își dorește gloria; acceptă ruleta, obține mai des bonusul +10
  TEMPERAMENTAL     // Imprevizibil; poate oferi un meci de geniu (+10) sau un dezastru (-10)
  REBEL_BAD_BOY     // Urăște antrenamentele grele; dacă e forțat, petrece în club noaptea
  FRAGILE_ANXIOUS   // Se sperie de eșec și presiune; clachează rapid la stres intens (-10)
  NATURAL_LEADER    // Ridică moralul colegilor de linie chiar și când antrenamentul e dur
}
```

* **Jucătorul Profesionist**: La antrenament intensiv, șansa de cădere bruscă scade de la 30% la 8%. El comunică din timp când simte jenă musculară.
* **Jucătorul Rebel / Petrecăreț**: Dacă antrenamentul este prea dur, moralul îi scade brusc. În loc de odihnă, alege să refuleze în viața de noapte, activând evenimente de tip „Nopți nedormite / Mahmur”.
* **Jucătorul Fragil / Anxios**: În meciuri cu miză mare și oboseală acumulată, probabilitatea de a cădea în debuff-ul de -10 este dublă, necesitând intervenția obligatorie a psihologului clubului.

---

## 4. Balansul Gestionat de Manager: Indicatori UI & Semnale Subtile

Pentru a asigura o experiență de joc captivantă și modernă, **interfața nu afișează formule matematice brute**, ci oferă instrumente de diagnoză vizuală (feedback uman și profesional):

### 4.1. Indicatorii de Monitorizare din Lot (Dashboard)
1. **Bara de Fitness & Energie Reziduală (0 - 100%)**:
   * `Verde (90-100%)`: Odihnit, optim pentru meci.
   * `Galben (75-89%)`: Ușoară oboseală; poate juca, dar riscă scădere de turație în repriza a doua.
   * `Portocaliu (60-74%)`: Zona de pericol; dacă începe titular, riscul de accidentare crește de 3 ori.
   * `Roșu (<60%)`: Epuizare critică; interzis la antrenament intensiv.
2. **Indicatorul de Stres & Risc Psihologic (Burnout Barometer)**:
   * Măsoară presiunea psihologică acumulată. Un nivel mare de stres crește șansa ca ruleta să pice pe **-10**.
3. **Raportul Medical Zilnic (The Medical Briefing)**:
   * Medicul clubului trimite alerte textuale:
     * *„[Popescu] arată o ușoară încărcare la aductori. Recomandăm o zi de regenerare.”*
     * *„[Ionescu] este într-o formă fizică strălucitoare. Se simte puternic și vrea mai mult efort.”*

### 4.2. Arta Deciziei: Când Forțezi și Când Menajezi?
* **Meciul de Rutină (ex: meci acasă împotriva unei echipe bot / retrogradabile)**:
  * Managerul inteligent reduce intensitatea la „Ușor/Regenerare”, odihnește 3-4 titulari cheie și oferă minute tinerilor din academie.
* **Derby-ul de Titlu sau Finala de Cupă**:
  * Managerul poate alege să „arunce zarurile”: setează pregătire specială de meci, cere 110% de la titulari și acceptă riscul unei căderi fizice în săptămâna următoare pentru a obține trofeul acum.

---

## 5. Rolul Staff-ului Tehnic și Medical în Menținerea Balansului

Echilibrul clubului este menținut de profesioniștii din jurul terenului. Fiecare angajat are un impact direct asupra formulelor:

```
                      ┌─────────────────────────────────────────┐
                      │             MANAGERUL UMAN              │
                      │  (Setează intensitatea & asumă riscul)  │
                      └────────────────────┬────────────────────┘
                                           │
         ┌───────────────────┬─────────────┴───────┬───────────────────┐
         ▼                   ▼                     ▼                   ▼
  ┌─────────────┐     ┌─────────────┐       ┌─────────────┐     ┌─────────────┐
  │   MEDIC     │     │   MASEUR    │       │  PSIHOLOG   │     │ ÎNGRIJITOR  │
  │ Previne &   │     │ Accelerează │       │ Blochează   │     │ Reglează    │
  │ tratează    │     │ recuperarea │       │ căderile    │     │ calitatea   │
  │ leziunile   │     │ de fitness  │       │ mentale -10 │     │ gazonului   │
  └─────────────┘     └─────────────┘       └─────────────┘     └─────────────┘
```

### 5.1. Medicul Clubului (The Doctor)
* **Funcție**: Tratează accidentările și reduce zilele de spitalizare.
* **Impact pe Balans**: Un medic de calitate 90%+ poate reduce durata unei rupturi musculare de la 21 de zile la 9 zile.
* **Dilema Infiltrațiilor (Injections / Cortisone Shot)**:
  * Dacă un jucător vedetă are o entorsă minoră înainte de finală, medicul îi poate face o infiltrație pentru a juca fără durere.
  * **Riscul**: Dacă ia un nou contact dur în acea zonă, riscă o recidivă gravă care îl scoate din circuit pentru 3-4 luni.

### 5.2. Maseurul (The Masseur / Physio)
* **Funcție**: Restabilește fitness-ul între etape.
* **Impact pe Balans**: Maseurul de top recuperează +14% fitness pe noapte față de doar +6% fără maseur.
* **Capcana Relaxării Excesive**: Dacă masajul este prea intens chiar în dimineața meciului, jucătorul poate intra pe teren lipsit de tonusul muscular exploziv, având nevoie de 15 minute pentru a intra în ritm.

### 5.3. Psihologul Sportiv (The Sports Psychologist)
* **Funcție**: Controlează stresul, previne colapsul moralului și ajută la gestionarea presiunii.
* **Impact pe Balans**: Psihologul este **tamponul principal împotriva căderii de -10 a Ruletei**. El transformă stresul distructiv în motivație competitivă.
* **Limitare**: Nu poate rezolva problemele de caracter ale jucătorilor rebeli dacă aceștia refuză ședințele de consiliere.

### 5.4. Îngrijitorul de Gazon (Groundsman)
* **Funcție**: Calitatea suprafeței de joc.
* **Impact pe Balans**:
  * Un gazon prost, plin de denivelări sau îmbibat cu apă crește cu 40% riscul accidentărilor articulare pentru ambele echipe.
  * Un gazon hibrid de ultimă generație reduce uzura musculară a jucătorilor rapizi.

### 5.5. Cursurile de Perfecționare ale Staff-ului (Staff Licenses)
* Managerul poate trimite membrii de staff la cursuri pentru a le crește calitatea (ex: de la Licența B la Licența A și Pro).
* **Compromisul Strategic**: Cursul durează între 7 și 14 zile, perioadă în care specialistul **nu este prezent la club**. Dacă medicul este la curs și lotul efectuează antrenamente intensive, orice accidentare suferită în acea săptămână va fi tratată precar de ajutoare neexperimentate.

---

## 6. Factorii de Mediu și Situațiile Neașteptate din Timpul Simulării

Simularea meciului nu se desfășoară într-un laborator vidat, ci este influențată de elemente naturale și umane neprevăzute:

### 6.1. Vremea Extremă și Dinamica Gazonului
* **Ploaie Torențială & Formare de Mlaștină**:
  * Dacă în minutul 60 ploaia toarnă cu găleata și terenul devine greu, echipele cu joc de pase scurte (Tiki-Taka) suferă o penalizare de până la -25% la acuratețea paselor.
  * Echipele atletice, cu jucători rezistenți fizic și stil „Kick & Rush” sau pase lungi pe atacanți puternici, preiau inițiativa și pot întoarce meciul chiar dacă adversarul era superior tehnic.
* **Căldură Sufocantă (>34°C)**:
  * Consumul de Stamina se dublează; echipele fără bancă solidă primesc goluri pe final de partidă.

### 6.2. Momente Emoționale Speciale (Boost sau Distragere)
* **Familia și Copiii pe Stadion**: O vizită surpriză a apropiaților oferă fotbalistului o dorință acută de a impresiona, crescând efortul în dueluri (Work Rate +20%).
* **Vedeta / Legenda Clubului pe Jumbotron**: Când camera stadionului proiectează o legendă aplaudând din tribună, întreaga echipă capătă un impuls de moral, dar tinerii pot deveni precipitați.
* **Idolizarea Fanilor**: Când peluza scandează continuu numele unui jucător, acesta nu mai simte oboseala, însă riscă să execute acțiuni individuale exagerate.

---

## 7. Arhitectura Tehnică & Structura Bazei de Date (Prisma Schema)

Pentru a susține aceste mecanici, schema de date include atributele de antrenament, starea psihologică și istoricul recent:

```prisma
// Extensie pentru modelul Player
model Player {
  id                    Int               @id @default(autoincrement())
  name                  String
  teamId                Int?
  team                  Team?             @relation(fields: [teamId], references: [id])

  // Atribute de bază (0-100)
  pace                  Int               @default(50)
  shooting              Int               @default(50)
  passing               Int               @default(50)
  defending             Int               @default(50)
  physical              Int               @default(50)

  // Stare dinamică și psihologică
  fitness               Int               @default(100)  // 0 - 100%
  morale                Int               @default(80)   // 0 - 100%
  stressLevel           Int               @default(10)   // 0 - 100% (burnout indicator)
  personality           PersonalityTrait  @default(PROFESSIONAL)

  // Configurație Antrenament
  trainingIntensity     TrainingIntensity @default(MODERATE)
  trainingFocus         TrainingFocus     @default(BALANCED)
  trainingProgress      Float             @default(0.0)  // acumulator spre următorul punct de atribut

  // Mecanica Ruletei & Parametri Ascunși
  dailyWellnessSeed     Float             @default(0.0)  // -5.0 până la +5.0 (resetat zilnic)
  rouletteModifier      Int               @default(0)    // -10, 0, +10 calculat în ziua meciului
  isInjured             Boolean           @default(false)
  injuryDaysRemaining   Int               @default(0)
  injuryType            String?

  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt
}

enum PersonalityTrait {
  PROFESSIONAL
  AMBITIOUS
  TEMPERAMENTAL
  REBEL_BAD_BOY
  FRAGILE_ANXIOUS
  NATURAL_LEADER
}

enum TrainingIntensity {
  RECOVERY
  LIGHT
  MODERATE
  INTENSIVE
  OVERLOAD_ROULETTE
}

enum TrainingFocus {
  BALANCED
  PACE
  SHOOTING
  PASSING
  DEFENDING
  PHYSICAL
}
```

---

## 8. Algoritmul Matematic de Calcul (Pseudocod Server)

Următorul pseudocod ilustrează rularea zilnică a ciclului de antrenament și calcularea fluctuației de tip ruletă:

```typescript
interface TrainingResult {
  fitnessDelta: number;
  stressDelta: number;
  statGain: number;
  injuryOccurred: boolean;
  rouletteDelta: number; // -10, 0, +10
}

function processDailyTraining(player: Player, staff: TeamStaff): TrainingResult {
  // 1. Coeficienți în funcție de intensitate
  const intensityMap = {
    RECOVERY:          { fitCost: 2,  stressCost: -10, gainBase: 0.1, injRisk: 0.005 },
    LIGHT:             { fitCost: 5,  stressCost: -2,  gainBase: 0.5, injRisk: 0.02 },
    MODERATE:          { fitCost: 10, stressCost: 5,   gainBase: 1.0, injRisk: 0.05 },
    INTENSIVE:         { fitCost: 18, stressCost: 15,  gainBase: 1.8, injRisk: 0.14 },
    OVERLOAD_ROULETTE: { fitCost: 28, stressCost: 30,  gainBase: 2.8, injRisk: 0.32 },
  };

  const cfg = intensityMap[player.trainingIntensity];

  // 2. Modificatori din personalitate
  let personalityStressMod = 1.0;
  let personalityRiskMod = 1.0;

  if (player.personality === 'PROFESSIONAL') {
    personalityStressMod = 0.7;
    personalityRiskMod = 0.8;
  } else if (player.personality === 'FRAGILE_ANXIOUS') {
    personalityStressMod = 1.5;
  } else if (player.personality === 'REBEL_BAD_BOY') {
    personalityStressMod = 1.3;
  }

  // 3. Atenuarea prin Staff
  const physioMitigation = staff.masseurOnDuty ? (staff.masseurSkill / 100) * 8 : 0;
  const psychMitigation = staff.psychologistOnDuty ? (staff.psychologistSkill / 100) * 12 : 0;
  const doctorSafetyBonus = staff.doctorOnDuty ? (staff.doctorSkill / 100) * 0.4 : 0;

  // 4. Calculul Ruletei (+10 / -10) la intensități mari
  let rouletteOutcome = 0;
  if (player.trainingIntensity === 'OVERLOAD_ROULETTE' || (player.trainingIntensity === 'INTENSIVE' && player.fitness < 70)) {
    const roll = Math.random() * 100;
    const stressPenaltyChance = (player.stressLevel * 0.4) - psychMitigation;

    if (roll < (15 + (player.personality === 'AMBITIOUS' ? 10 : 0))) {
      // Lovitura norocoasă: Stare de grație
      rouletteOutcome = 10;
    } else if (roll > (85 - stressPenaltyChance)) {
      // Căderea de performanță
      rouletteOutcome = -10;
    }
  }

  // 5. Testul de accidentare
  const finalInjuryRisk = Math.max(0.005, (cfg.injRisk * personalityRiskMod) - doctorSafetyBonus);
  const injuryOccurred = Math.random() < finalInjuryRisk;

  return {
    fitnessDelta: -(cfg.fitCost - physioMitigation),
    stressDelta: Math.max(0, (cfg.stressCost * personalityStressMod) - psychMitigation),
    statGain: cfg.gainBase,
    injuryOccurred,
    rouletteDelta: rouletteOutcome,
  };
}
```

---

## 9. Rezumat și Mesaj pentru Managerul Jucător

* **Nu există o singură rețetă de succes.** Managerul care riscă și folosește ruleta antrenamentului intensiv poate câștiga un meci uriaș împotriva unui colos, dar își poate distruge sezonul în următoarele trei etape dacă își supraîncarcă fotbaliștii.
* **Privește dincolo de numere.** Urmărește personalitatea fiecărui tânăr, ascultă recomandările medicului și psihologului și adaptează tactica la condițiile de pe teren.
* **Controlul este în mâinile tale.** Jocul oferă libertatea de a forța sau de a construi pe termen lung; fiecare decizie aduce o consecință palpabilă pe tabela de marcaj.
