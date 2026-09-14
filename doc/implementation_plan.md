# Plan de Implementare Definitiv: SoccerManager Clone (Arhitectură și Mecanici)

Am explorat toate cotloanele jocului tău și am extras fiecare componentă matematică și logică. Acest document este **Biblia de Design** a noului nostru joc.

## User Review Required

> [!IMPORTANT]
> Proiectul va fi construit în folderul `D:\Proiecte\SoccerManagerClone`. Cu acest plan extrem de detaliat (care acum include asistentul SPInfo integrat nativ), putem trece direct la execuție. Dacă ești gata, apasă **Proceed**.

---

## NOU: Integrarea Nativă SPInfo (The "Smart Assistant")

> [!TIP]
> Conform cerinței tale, uneltele externe (cum e SPInfo) **nu vor mai fi secrete**, ci vor face parte din experiența standard a jocului pentru a ajuta comunitatea să ia decizii inteligente fără să mai apeleze la site-uri externe.

Vom construi direct în joc un modul numit **Director Sportiv (Asistent AI)** care va oferi jucătorilor următoarele unelte vizibile direct pe ecran:
1. **Analiza Potențialului (Youth Prediction)**: Când un manager vrea să promoveze un junior, asistentul îi va calcula automat predicția de dezvoltare maximă (ex: "Acest jucător va atinge maxim 75% Calitate la vârsta de 24 ani").
2. **Optimizator de Prețuri (Ticket Advisor)**: Pe pagina Stadionului, asistentul îi va desena graficul curbei de preț (elasticitatea cererii) și îi va sugera: *"Prețul optim pentru profit maxim la meciul de mâine este 16 €"*.
3. **Consilier de Contracte (Wage Negotiator)**: Când ofertează un jucător, asistentul îi va calcula exact minimumul pe care jucătorul l-ar accepta, incluzând taxele ascunse și bonusurile pentru casă/mașină.
4. **Simulator Tactic**: Un modul unde poți testa tactica împotriva adversarului viitor pentru a vedea cum vor interacționa ratingurile pe linii.

---

## 1. SISTEMUL DE JUCĂTORI (Players & Positions)

### Pozițiile pe Teren:
- **Portar**: `GK`
- **Fundași**: `LB` (Stânga), `CB` (Central), `SW` (Libero), `RB` (Dreapta)
- **Mijlocași**: `LM` (Stânga), `CM` (Central), `RM` (Dreapta)
- **Atacanți**: `LF` (Stânga), `CF` (Central), `RF` (Dreapta)

### Atribute Globale (Scala 0-100%):
- **Bază**: Moral, Condiție fizică (Fitness), Experiență, Oboseală, Agresivitate (ascunsă/nativă).
- **Istoric**: Forma, Cea mai bună performanță.
- **Calitatea Globală**: Ratingul maxim teoretic.

### Atribute Specifice:
- **GK (Portar)**: Curaj, Flexibilitate, Detentă, Degajări, Joc de picioare, Reflexe.
- **DEF (Fundași)**: Respingeri.
- **MID (Mijlocași)**: Viziune.
- **FWD (Atacanți)**: Intuiție.

---

## 2. STADION ȘI INFRASTRUCTURĂ (Stadium & Finance)

### Componentele Stadionului:
- **Proporțiile obligatorii (Regula SPInfo)**: Parcări (33% din capacitate), Toalete (1%), Baruri (0.2%).
- **Facilități**: Nocturnă, Baruri, Tabela de marcaj, Centru de Tineret.

### Economia Clubului:
- **Venituri**: Bilete, Drepturi TV, Vânzări Baruri, Contracte Panouri Publicitare, Transferuri.
- **Cheltuieli**: Salarii Jucători (cu dublare la victorie), Costuri operaționale acasă, Mentenanță Centru Tineret, Cursuri Staff.

---

## 3. STAFF-UL TEHNIC (Personal)

Cei 7 piloni esențiali:
1. **Antrenorul (Trainer)**: Dictează viteza de antrenament.
2. **Scout-ul**: Dezvăluie potențialul.
3. **Medicul**: Estimează precis durata accidentărilor.
4. **Îngrijitorul**: Menține calitatea gazonului.
5. **Asistentul**: Funcție auto-pilot (înlocuit parțial de noul nostru Asistent Smart).
6. **Maseorul**: Scade oboseala.
7. **Coordonator Tineret**: Aduce tineri valoroși.

---

## 4. SISTEMUL DE ANTRENAMENT (Training)

- **Frecvență**: 5 antrenamente pe zi reală.
- **Mecanică**: Automat sau Manual (fokus pe un skill specific).

---

## 5. PIAȚA DE TRANSFERURI (Transfers)

- **Sistem de Bidding**: Preț de pornire, Deadline, Buy Now.
- **Agent Fee (Taxă anti-inflație)**: 15% comision la orice vânzare.

---

## 6. TACTICI ȘI ENGINE DE MECI (Match Simulation)

### Tactica Managerului:
- **Preset-uri**: Selecția A, B, C, D. Formație (ex: 4-4-2), Agresivitate (0-100%).

### Simulatorul Matematic (Match Engine):
- **Arbitrul**: Se compară agresivitatea ta cu strictețea arbitrului.
- **Evaluarea pe Linii**: Calitatea calculată pe 3 zone (Defensivă, Mijloc, Atac).

---

## 7. CICLUL DE TIMP AL JOCULUI (Game Cycle & Server CronJobs)

- **Durată Sezon**: 63 Zile Reale (30 etape).
- **Programator (BullMQ)**: Meciuri de ligă la 04:00 CET, Amicale la 14:00, 18:00, 22:00.

---

## 8. SCHEMA BAZEI DE DATE (Tech Specs)

Vom construi proiectul cu **Next.js**, **Node.js/Python** și **PostgreSQL**.
Tabele principale:
- `Users`, `Teams`, `Players`, `Stadiums`, `Staff`, `Matches`, `Transfers`, `Ledger`.
