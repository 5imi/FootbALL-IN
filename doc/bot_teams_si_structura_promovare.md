# Echipele Bot (Computer Teams), Inactivitatea & Mecanica de Promovare / Retrogradare

Acest document descrie în detaliu modul în care funcționează echipele automate (Bot / Computer Teams), gestionarea conturilor inactive, atribuirea echipelor către noii utilizatori și mecanismele exacte de promovare și retrogradare între divizii.

---

## 1. Ce sunt Echipele Bot (Computer Teams / "Echipe FC")?

În SoccerProject, o mare parte din ligile inferioare (Diviziile F, G, H) sunt populate de **Echipe Controlate de Calculator (Computer Teams)**.

### Cum apar Boții?
O echipă devine "Computer Team" în următoarele cazuri:
1. **Inactivitate prelungită**: Managerul uman nu s-a logat timp de **21 de zile consecutive (3 săptămâni)** și nu a activat Modul Vacanță (*Holiday Mode*).
2. **Ștergerea voluntară a contului**: Managerul a cerut renunțarea la club.
3. **Banarea contului de către Șerifi (Administratori)**: Conturi prinse cu multi-accounting sau transferuri ilegale de bani între cluburi.
4. **Completarea ligilor inferioare nou-generate**: Când jocul se extinde în Divizia H și nu există suficienți oameni reali.

### Comportamentul unei Echipe Bot:
* Nu face transferuri, nu concediază/angajează staff și nu investește în stadion.
* Joacă meciurile cu o **formație standard (default 4-4-2)** și tactică simplă.
* Contractele jucătorilor și ale staff-ului sunt **înghețate** (nu expiră, salariile se procesează automat în background fără risc de faliment) până când echipa este resetată sau preluată de un om.
* **Rolul în joc pentru managerii umani**: Meciurile contra boților sunt considerate "victorii sigure" (3 puncte garantate). Managerii avansați folosesc aceste meciuri strategic:
  * Odihnesc titularii pentru a le reface Condiția Fizică (Fitness).
  * Folosesc juniorii sau rezervele pentru a acumula experiență.
  * Șterg suspendările (un titular suspendat pentru cumul de galbene stă pe bară la meciul cu botul și devine apt pentru derby-ul următor).

---

## 2. Politica de Inactivitate & Ștergerea Conturilor

* **Perioada de grație**: 21 de zile (3 săptămâni).
* **Notificări automate**: Sistemul trimite e-mailuri de avertizare după 7 zile și după 14 zile de inactivitate.
* **Modul Vacanță (Holiday Mode)**: Managerii pot activa acest mod pentru a-și proteja clubul de ștergere dacă lipsesc o perioadă lungă.
* **Măturarea conturilor (Purge Schedule)**:
  Conturile inactive sunt șterse sau transformate în boți **de două ori per sezon**:
  1. La **începutul sezonului** (în fereastra dintre sezoane).
  2. La **finalul etapei a 15-a** (la jumătatea campionatului de 30 de meciuri).

---

## 3. Mecanica de Promovare și Retrogradare (Cu Boți Inclusi)

Piramida este formată din 8 eșaloane (Diviziile A, B, C, D, E, F, G, H), fiecare serie având **16 echipe**.

### Diviziile Superioare și Medii (A până la G):
* **Promovare**: Primele **2 echipe (Locurile 1 și 2)** promovează în eșalonul superior.
* **Menținere**: Echipele de pe **Locurile 3 - 10** rămân în aceeași divizie.
* **Retrogradare**: Ultimele **6 echipe (Locurile 11 - 16)** retrogradează în eșalonul inferior.
* *Regula Boților*: Dacă o echipă bot termină pe locurile 11-16, ea retrogradează exact ca o echipă umană. Dacă un bot termină pe locurile 1-2 (rar, dacă ceilalți au fost extrem de slabi), promovează.

### Divizia H (Ultimul eșalon al piramidei):
* **Promovare**: Primele **2 echipe** promovează în Divizia G.
* **Fără Retrogradare**: Întrucât Divizia H este baza absolută a jocului (nu există Divizia I), **locurile 11 - 16 NU pot retrograda**.
* **Ce se întâmplă cu ultimele 6 locuri din Divizia H?**
  * Dacă pe locurile 11-16 se află un **manager uman activ**, el pur și simplu rămâne în Divizia H pentru sezonul următor.
  * Dacă pe locurile 11-16 se află **echipe bot sau conturi inactive șterse**, acestea sunt **șterse complet (wiped/resetate)** pentru a elibera locuri noilor jucători.

---

## 4. Preluarea Echipei de către un Manager Nou (Onboarding)

Când un utilizator nou își creează cont:
1. **Punctul de intrare**: Intră ÎNTOTDEAUNA la baza piramidei, în **Divizia H**.
2. **Alocarea Slotului**: Sistemul caută un slot ocupat de un "Computer Team" (bot) din Divizia H și îl atribuie noului manager. Dacă toate seriile H sunt pline de oameni, serverul generează automat o nouă serie `H.x`.
3. **Pachetul de Start (Starter Pack)**:
   * Numele echipei și stadionului sunt redenumite conform preferinței utilizatorului.
   * Lotul este resetat: primește **20 - 25 de jucători generați aleatoriu** (cu calități între 50% și 65%).
   * Buget de start: **€ 250.000 – € 500.000**.
   * Stadion de pornire: Capacitate de **4.000 de locuri** și gazon standard.
   * Spiritul Echipei (Team Spirit): Inițializat la valoarea de pornire (~50%).

---

## 5. Avantajul Nostru Competitiv (Îmbunătățirea Boților în Jocul Nostru)

În SoccerProject clasic, boții sunt proști și plictisitori: joacă un 4-4-2 fix, fără viață.

În **SoccerManager Clone**, vom introduce **Boți Inteligenți (Smart AI Bots)**:
1. **Personalități de Boți**:
   * *Bot Defensiv*: Joacă 5-4-1 "Autobază", greu de bătut fără extreme rapide.
   * *Bot Ofensiv*: Joacă 3-4-3 la rupere.
2. **Generare de Nume Realiste**: Nume de cluburi și manageri plauzibile, astfel încât utilizatorul să nu simtă că joacă într-un cimitir pustiu, ci într-un campionat viu și competitiv.
3. **Preluare Instantanee**: Când un om nou se înscrie, ia locul unui bot instantaneu, primind o notificare de bun venit și un scurt tur interactiv (Tutorial Onboarding).
