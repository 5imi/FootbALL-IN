# Sistemul de Arbitraj, Corupția și Meciurile Aranjate („Blaturile”)

Acest document stabilește arhitectura completă pentru **profilul arbitrilor, deciziile controversate, cumpărarea arbitrilor (mituirea prin fondul negru) și înțelegerile între două echipe pentru un rezultat de egalitate („Biscotto” / Blatul convenabil)**, alături de riscurile judiciare și sancțiunile federale.

---

## 1. Filosofia de Design: „Latura Întunecată a Fotbalului”

În istoria fotbalului (de la scandalurile *Calciopoli* din Italia, la mafia pariurilor din fotbalul est-european sau înțelegerile tacite de tip *Biscotto* de la turneele finale), fotbalul nu a fost întotdeauna doar o bătălie curată a tacticilor.

> [!CAUTION]
> **Mecanica Risc Maxim vs. Câștig Imediat (High-Stakes Underworld)**:
> Orice tentativă de corupere a jocului aduce un avantaj imediat pe tabelă, dar introduce un risc seismic pentru existența clubului. Dacă ești prins de Comisia de Etică și Integritate, sancțiunile variază de la amenzi colosale și depunctări masive (-9 până la -15 puncte), până la **retrogradarea administrativă directă în divizia inferioară**.

---

## 2. Profilul și Atributele Arbitrului

Fiecare arbitru desemnat la o partidă are un set de parametri care dictează felul în care împarte dreptatea pe teren:

```
                           ┌──────────────────────────────┐
                           │           ARBITRUL           │
                           └──────────────┬───────────────┘
                                          │
       ┌──────────────────────────┼──────────────────────────┐
       ▼                          ▼                          ▼
┌──────────────┐           ┌──────────────┐           ┌──────────────┐
│  SEVERITATE  │           │ INTEGRITATE  │           │   PRESIUNE   │
│  (0 - 100)   │           │  (0 - 100)   │           │ GAZDE / VAR  │
│  Toleranță   │           │  Rezistență  │           │  Influența   │
│  la faulturi │           │  la mită     │           │  publicului  │
└──────────────┘           └──────────────┘           └──────────────┘
```

### Atributele Arbitrului:
1. **Severitatea (Strictness: 1 - 100)**:
   * Cu cât este mai mare, cu atât penalizează mai dur orice agresivitate a jucătorilor (Formula: $Agresivitate \le 100 - Severitate$).
2. **Integritatea Morală (Moral Integrity: 1 - 100)**:
   * **Integritate 90-100 (Incoruptibil)**: Refuză categoric orice tentativă de mituire și raportează imediat tentativa la Federație (denunț penal automat).
   * **Integritate 40-70 (Șovăielnic)**: Poate fi convins doar cu sume uriașe dacă patronul are conexiuni.
   * **Integritate sub 30 („Vulnerabil / Cumpărabil”)**: Deschis la stimulente financiare sau protocol special.
3. **Vulnerabilitatea la Presiunea Tribunelor (Home Bias: 1 - 100)**:
   * Tendința umană de a acorda 5-10% mai multe decizii favorabile echipei gazdă când stadionul are 50.000+ fani gălăgioși.
4. **Acuratețea Deciziilor (Accuracy: 1 - 100)**:
   * Șansa de a greși neintenționat faze la limită (ofsaturi milimetrice, hențuri nesancționate).

---

## 3. Mituirea Arbitrului (The Corrupt Referee / Match-Buying)

Patronul sau președintele clubului poate accesa o secțiune confidențială („Fondul de Protocol / Operațiuni Secrete”) pentru a încerca cumpărarea arbitrului desemnat.

```
       [ Patronul Clubului ] ──(Bani Negri: €50k - €200k)──> [ Arbitrul Vulnerabil ]
                                                                       │
                               ┌───────────────────────────────────────┴───────────────────┐
                               ▼                                                           ▼
                     [ Misiune Reușită ]                                           [ Faptă Deconspirată ]
            • Penalty inventat în minutul 85                               • Stenograme apărute în presă
            • Gol anulat eronat adversarului                               • Arbitrul denunță tentativa
            • Roșu acordat ușor rivalilor                                  • -9 puncte & retrogradare forțată
```

### 3.1. Costul și Procedura
* Suma cerută depinde de calibrul meciului (un meci de baraj sau derby costă mult mai mult decât o etapă obișnuită) și de salariul arbitrului.
* Banii sunt retrași din balanța clubului sub etichete mascate contabile: *„Onorariu servicii de consultanță juridică”*, *„Cheltuieli excepționale de protocol”* sau *„Comision intermediar nedeclarat”*.

### 3.2. Efectele în Simularea Meciului (In-Match Script)
Dacă mita este acceptată (`isBribed = true`), motorul de meci declanșează evenimente viciate:
1. **Penalty-ul Cadou**: La primul contact în careul advers, arbitrul dictează penalty chiar dacă intervenția a fost curată pe minge.
2. **Fluierat într-o Singură Direcție**: Jucătorii tăi pot juca cu agresivitate 100% fără a primi cartonașe, în timp ce adversarii sunt sancționați cu galben la fiecare intrare.
3. **Anularea Golului Advers**: La golul egalizator al adversarului în minutul 90, arbitrul semnalizează un fault inexistent în atac sau ignoră semnalul VAR.

### 3.3. Risc și Consecințe Judiciare
* La fiecare meci mituit, rulează un algoritm de investigație:
  $$\text{Risc Deconspirare} = (100 - \text{Integritate Arbitru}) \times 0.2 + \text{Diferență Evidentă de Decizii} + \text{Presiunea Presei}$$
* **Consecințe la Deconspirare**:
  1. Anularea victoriei și acordarea de meci pierdut la masa verde (`0-3`).
  2. Deducerea a **9 până la 15 puncte** din clasament.
  3. Amendă record de 5x valoarea mitei.
  4. La recidivă: **Retrogradarea forțată a echipei în eșalonul inferior**.

---

## 4. Înțelegerea între Două Echipe pentru Egal („Blatul” / „Biscotto”)

Un alt fenomen clasic în fotbal este înțelegerea reciproc avantajoasă între două cluburi:
* În penultima sau ultima etapă a campionatului, un rezultat de egalitate (ex: 0-0 sau 1-1) salvează ambele echipe de la retrogradare sau califică ambele formații mai departe, în dauna unei a treia echipe rivale.

### 4.1. Mecanismul Diplomatic Secret
* Dacă ambele cluburi au patroni sau manageri dispuși la compromis, se poate activa pactul de non-agresiune (`PactOfNonAggression = true`).
* Nicio echipă nu plătește bani celeilalte; moneda de schimb este **siguranța punctului împărțit frățește**.

### 4.2. Desfășurarea Meciului „Aranjat” în Live Text Ticker
Când un meci este aranjat pentru egal, comportamentul dinamic al jucătorilor se modifică radical:
* **Pasivitate Totală**: Posesie sterilă între fundași și portar; duelurile fizice tind spre zero.
* **Lipsa Cartonașelor**: Ambele echipe joacă cu agresivitate minimă ($0-10\%$), conservându-și forțele (oboseala/fitness-ul scade doar cu 1-2%).
* **Șuturi la Alibi**: Șuturi anemice de la 35 de metri trimise direct în peluză sau pase degajate în aut.
* Comentariul Live Text va reflecta această mascaradă:
  * *„Min 74: Publicul începe să fluiere copios! Fundașii plimbă mingea nestingheriți de la unii la alții fără ca atacanții adverși să facă pressing.”*
  * *„Min 88: Un meci anost fără niciun șut periculos pe poartă. Se pare că ambele tabere sunt extrem de mulțumite cu acest 0-0.”*

### 4.3. Riscul de Trădare și Scandal Public
1. **Trădarea din Teren (The Rogue Player)**:
   * Dacă pe teren se află un fotbalist străin, proaspăt transferat, cu personalitate `AMBITIOUS` sau `PROFESSIONAL` și care nu a fost informat de blat, el poate scăpa singur pe contraatac și să înscrie în minutul 89! Se naște un haos total în teren și pe bănci.
2. **Ancheta pentru Lipsă de Combativitate**:
   * Dacă meciul are sub 2 șuturi pe poartă și a fost evident aranjat, Federația poate suspenda drepturile TV pentru ambele cluburi pentru 3 meciuri și să deschidă o anchetă de integritate.

---

## 5. Structura Datelor (Prisma Schema) & Algoritmul Matematic

### 5.1. Extensie Schema Prisma
```prisma
// Model pentru Arbitri
model Referee {
  id               Int       @id @default(autoincrement())
  firstName        String
  lastName         String
  strictness       Int       @default(50) // 1-100 (Severitate)
  integrity        Int       @default(80) // 1-100 (Rezistență la corupție)
  homeBias         Int       @default(15) // 0-100 (Favorizare gazde din instinct)
  experience       Int       @default(50) // Nivel experiență meciuri grele

  matchesOfficiated Match[]
}

// Extensie pentru modelul Match
model MatchCorruption {
  id                 Int       @id @default(autoincrement())
  matchId            Int       @unique
  isRefereeBribed    Boolean   @default(false)
  bribingTeamId      Int?
  bribeAmount        Decimal?  @db.Decimal(12, 2)
  
  isBiscottoAgreed   Boolean   @default(false) // Blat de egalitate
  
  isDiscovered       Boolean   @default(false)
  investigationScore Float     @default(0.0)
  penaltyApplied     String?   // 'POINTS_DEDUCTION', 'RELEGATION', 'FINE'
}
```

### 5.2. Algoritmul Matematic de Viciere și Investigație
```typescript
interface CorruptionDecision {
  accepted: boolean;
  refusedAndReported: boolean;
  adjustedCallFavor: number; // Modificator pe decizii cheie (-50 la +50)
}

function evaluateBribeAttempt(
  referee: Referee,
  bribeAmount: number,
  matchImportanceMultiplier: number
): CorruptionDecision {
  // Integritatea mare respinge mita aproape cert
  const bribeStrength = bribeAmount / (10000 * matchImportanceMultiplier);
  const temptationRoll = (Math.random() * 100) + bribeStrength;

  if (temptationRoll > referee.integrity + 30) {
    // Mita este acceptată
    return {
      accepted: true,
      refusedAndReported: false,
      adjustedCallFavor: 35 // Arbitrul va ajuta masiv echipa plătitoare
    };
  } else if (referee.integrity >= 85 && Math.random() < 0.40) {
    // Arbitrul este un om de onoare și denunță tentativa la comisie
    return {
      accepted: false,
      refusedAndReported: true,
      adjustedCallFavor: -20 // Se răzbună pe teren fluierând strict
    };
  }

  // Refuz diplomatic fără denunț
  return {
    accepted: false,
    refusedAndReported: false,
    adjustedCallFavor: 0
  };
}
```

---

## 6. Rezumat pentru Manager

* **Integritatea plătește pe termen lung.** Un club construit pe baze solide, cu academie și antrenamente bune, nu depinde de arbitri.
* **Dacă alegi calea corupției, mergi pe muchie de cuțit.** Poți câștiga un trofeu nemeritat astăzi, dar riști să pierzi tot ce ai construit în fața comisiei de disciplină mâine.
