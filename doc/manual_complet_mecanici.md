# Manualul Complet al Mecanicilor & Regulamentului (SoccerManager Clone)

Acest document reprezintă sinteza completă a tuturor mecanismelor de joc extrase prin reverse-engineering din **SoccerProject** și calculatorul avansat **SPINFO-Tool**. Toate formulele, constantele și regulile descrise aici vor fi transpuse în logica de backend (PostgreSQL + Node.js / Python API) a jocului nostru.

---

## 1. Structura Lotului & Pozițiile Jucătorilor

### Pozițiile de Joc (11 Roluri de Teren):
1. **GK** – Goalkeeper (Portar)
2. **CB** – Center Back (Fundaș Central)
3. **LB / RB** – Left / Right Back (Fundaș Lateral Stânga / Dreapta)
4. **LWB / RWB** – Left / Right Wing Back (Fundaș de Bandă Ofensiv)
5. **CM** – Center Midfielder (Mijlocaș Central)
6. **LM / RM** – Left / Right Midfielder (Mijlocaș Lateral Stânga / Dreapta)
7. **CAM** – Central Attacking Midfielder (Mijlocaș Ofensiv Central)
8. **CF** – Center Forward (Atacant Central)
9. **LF / RF** – Left / Right Forward (Atacant Lateral / Extremă Stânga / Dreapta)

### Atributele Jucătorilor:
* **Stare Fizică & Psihică**:
  * **Fitness (Condiție Fizică %)**: Scade cu 4% - 12% per meci jucat. Sub 80% fitness, randamentul scade dramatic, iar probabilitatea de accidentare devine exponențială. Se reface zilnic în funcție de calitatea Maseurului și atributul Stamina.
  * **Formă (Form %)**: Fluctuează în funcție de meciurile jucate și antrenament (0-100%).
  * **Moral (Morale %)**: Influențează salariul pretins la reînnoire și randamentul pe teren.
  * **Experiență (Experience %)**: Crește cu fiecare meci oficial jucat. Esențială pentru rolul de căpitan.
  * **Global Rating (Rating Sintetic %)**: Media ponderată a calității jucătorului.
* **Atribute Tehnice Specifice**:
  * Jucători de câmp: Viteză, Șut, Pasă, Joc cu capul, Taclu, Poziționare, Rezistență (Stamina).
  * Portari: Reflexe, Agilitate, Prindere (Handling), Degajare, Curaj.

---

## 2. Sistemul Tactic & Motorul de Meci (Match Engine)

### Formații Tactice Suportate:
* Echilibrate: `4-4-2`, `4-3-3`, `3-5-2`
* Ofensive: `3-4-3`, `3-3-4`
* Defensive: `4-5-1`, `5-3-2`, `5-4-1`

### Stiluri de Joc (Tactics) & Sinergii:
1. **Passing Game (Pase Scurte)**: Sinergie maximă cu formațiile cu mijloc numeros (`4-5-1`, `3-5-2`, `4-4-2`).
2. **Wing Play (Atac pe Aripi)**: Sinergie maximă cu extreme ofensive (`4-3-3`, `3-4-3`).
3. **Kick and Rush (Mingea Lungă)**: Folosit pentru atac direct către atacanți masivi (`CF`).
4. **Defensive / Counter-Attack**: Sinergie cu formațiile cu 5 fundași (`5-3-2`, `5-4-1`) împotriva echipelor superioare calitativ.

### Instrucțiuni Individuale (Individual Orders):
Fiecare jucător de câmp poate primi unul dintre cele 3 ordine:
* **Ofensiv (`+`)**: Jucătorul împinge ratingul spre linia din față (ex: un fundaș lateral oferă puncte la mijloc, un mijlocaș oferă puncte la atac).
* **Normal (`=`)**: Distribuție standard conform rolului natural.
* **Defensiv (`-`)**: Jucătorul se retrage pentru a ajuta linia din spate (ex: un mijlocaș ajută apărarea).

### Formula de Aur a Agresivității & Arbitrajului:
Fiecare meci este condus de un arbitru cu o **Severitate / Agresivitate a Arbitrului** (0 - 100%).
* **Regula de Aur**:
  $$\text{Agresivitate Echipă Recomandată} = 100 - \text{Agresivitate Arbitru}$$
* Dacă `Agresivitate Echipă + Severitate Arbitru > 100`, riscul de cartonaș galben crește liniar.
* Dacă suma depășește `110`, probabilitatea de **cartonaș roșu** direct sau cumul de galbene devine critică.

### Căpitanul Echipei:
* Căpitanul oferă un bonus procentual direct la **toate cele 3 linii (Apărare, Mijloc, Atac)** în funcție de nivelul său de **Experiență**.

### Set Pieces (Fazele Fixe):
* Listă de 6 executanți de penalty-uri (`shooter1` – `shooter6`).
* Listă de 6 portari pentru loviturile de departajare (`keeper1` – `keeper6`).

---

## 3. Centrul Medical & Suspendările

### Centrul Medical (Ziekenboeg):
* Jucătorii accidentați au un diagnostic și o durată de indisponibilitate (zile).
* **Doctorul**: Reduce numărul de zile necesare recuperării și mărește precizia estimării afișate managerului.
* **Maseurul**: Nu tratează accidentări, ci este responsabil exclusiv cu **refacerea zilnică a Fitness-ului** (recuperarea după efort).

### Suspendările:
* **3 cartonașe galbene** în meciuri oficiale (Ligă / Cupă) = **1 meci suspendare**.
* **Cartonaș roșu direct** = Minimum **1 - 3 meciuri suspendare** în funcție de gravitate.
* Meciurile amicale au evidență separată a cartonașelor și nu afectează meciurile oficiale de campionat.

---

## 4. Personalul Clubului (Staff-ul – 7 Roluri)

1. **Antrenor Principal (Coach)**: Crește viteza de asimilare la antrenamente și menține forma ridicată.
2. **Scout**: Dezvăluie atributele reale și limitele ascunse (caps) ale jucătorilor căutați pe piață.
3. **Doctor**: Scade durata de vindecare a accidentărilor.
4. **Maseur / Kinetoterapeut**: Recuperează Fitness-ul între meciuri.
5. **Îngrijitor Stadion (Groundsman)**: Menține starea optimă a gazonului (un gazon degradat crește riscul de accidentare și scade prezența fanilor).
6. **Coordonator Tineret**: Atrage periodic talente tinere în Academia de Tineret.
7. **Asistent Manager**: Asigură administrarea generală.

*Membrii personalului pot fi trimiși la Cursuri de Calificare plătite pentru a-și crește ratingul până la 100%.*

---

## 5. Finanțe, Stadion & Formula SPINFO

### Registrul Financiar (Bookkeeping):
* **Venituri (Income)**:
  1. Panouri Publicitare / Sponsori (contracte de 9-11 zile)
  2. Drepturi TV (per meci jucat acasă)
  3. Bilete meci
  4. Baruri / Catering în incinta stadionului
  5. Vânzări jucători (Transfer Market)
  6. Premii oficiale de final de sezon
* **Cheltuieli (Expenses)**:
  1. Salariile staff-ului
  2. Cursurile de calificare ale staff-ului
  3. Întreținere Centru Tineret (cost fix: €10.000 / lună)
  4. Salariile jucătorilor (Salariu de bază + Win-Bonus dublu la victorie + Casă/Mașină)
  5. Costurile de organizare a meciurilor de acasă
  6. Lucrările de extindere și mentenanță stadion
  7. Cumpărări jucători + Comision agent (15% anti-inflație)

### Formulele Matematice Exacte ale Stadionului (SPINFO):
Raportat la **Capacitatea Totală a Stadionului ($C$)**:
$$\text{Locuri de Parcare (Parking)} = 33\% \times C = 0{,}33 \times C$$
$$\text{Toalete (Toilets)} = 1\% \times C = \frac{C}{100}$$
$$\text{Baruri (Bars)} = 0{,}2\% \times C = \frac{C}{500}$$

*Fără respectarea acestor proporții, fanii refuză să umple arena, indiferent de prețul biletului!*

### Salarii & Pachetul de Negociere:
* **Win-Bonus**: Dublează salariul de meci ($2 \times \text{Salariu de bază}$) doar dacă echipa câștigă și jucătorul a fost pe foaie.
* **Perk Casă**: €900 / lună cheltuială fixă.
* **Perk Mașină**: €900 / lună cheltuială fixă.
* Oferirea ambelor perk-uri scade pretențiile salariale fixe cerute de jucător la negocieri.

---

## 6. Piramida Ligilor & Sistemul Competițional

### Structura Diviziilor (255 de Ligi în Total):
* **Divizia A**: 1 serie (16 echipe) – Elita mondială
* **Divizia B**: 2 serii (`B.1`, `B.2`) – 32 echipe
* **Divizia C**: 4 serii (`C.1` – `C.4`) – 64 echipe
* **Divizia D**: 8 serii (`D.1` – `D.8`) – 128 echipe
* **Divizia E**: 16 serii (`E.1` – `E.16`) – 256 echipe
* **Divizia F**: 32 serii (`F.1` – `F.32`) – 512 echipe
* **Divizia G**: 64 serii (`G.1` – `G.64`) – 1.024 echipe
* **Divizia H**: 128 serii (`H.1` – `H.128`) – 2.048 echipe

### Promovare & Retrogradare:
* **Locurile 1 și 2**: Promovează direct în eșalonul superior.
* **Locurile 3 - 10**: Își mențin locul în aceeași serie.
* **Locurile 11 - 16**: Retrogradează în eșalonul inferior.
* Fiecare divizie superioară hrănește și preia echipe din 2 serii inferioare directe conform arborelui competițional.

### Calendarul Sezonului:
* Durată totală: **63 de zile (9 săptămâni)**.
* **30 de etape de campionat**: Se dispută Luni, Marți, Joi și Vineri la ora serverului `04:00 CET`.
* **Cupa Oficială**: Se dispută Miercurea (11 runde eliminatorii, fără prelungiri, departajare directă prin penalty-uri).
* **Meciuri Amicale**: Se pot programa în ferestrele zilnice de la orele `14:00`, `18:00`, `22:00`.
