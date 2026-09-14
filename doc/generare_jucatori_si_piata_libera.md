# Generarea Automată a Jucătorilor & Piața Liberă (Free Agent Market Injection)

Pentru a preveni blocarea pieței de transferuri (mai ales la începutul jocului, când managerii umani au loturi mici și nu doresc să își vândă titularii), jocul va include un **Motor Automat de Injectare a Jucătorilor pe Piață (Free Agent Market Pool)**.

Acest sistem garantează lichiditate permanentă, creează oportunități de scouting și funcționează ca un **Money Sink esențial** (banii plătiți pe acești jucători dispar din economie, prevenind inflația).

---

## 1. De ce este esențial acest sistem?

1. **Lichiditate în Sezoanele de Început**:
   * Fără jucători generați de sistem, primii 16 manageri s-ar baza doar pe cei 20-25 de jucători primiți la start. Piața ar fi moartă.
   * Injectarea regulată de jucători oferă opțiuni tactice: dacă ți se accidentează portarul titular, găsești mereu pe piață un înlocuitor pentru care să licitezi.
2. **Lupte de Licitații (Thrill & Bidding Wars)**:
   * Când pe piață apare un tânăr de 18 ani cu potențial uriaș, toți managerii din ligă intră într-o bătălie aprigă de licitare până la miezul nopții.
3. **Absorbant de Bani (Money Sink Definitiv)**:
   * La transferurile între oameni, banii doar se mută dintr-un buzunar în altul.
   * La cumpărarea unui jucător generat de sistem, **100% din suma de transfer / prima de instalare este ștearsă din joc**, ținând sub control masa monetară.

---

## 2. Ritmul & Loturile de Injectare (Injection Schedule)

Serverul va genera jucători în mod automat conform unui cronjob:
* **Frecvență**: Un lot proaspăt generat **la fiecare 6 ore** (orele 00:00, 06:00, 12:00, 18:00 CET) sau un lot mare zilnic.
* **Durata pe Piață (Listing Window)**: Fiecare jucător rămâne pe piață timp de **24 până la 48 de ore**.
* **Curățarea Pieței (Market Purge)**: Jucătorii pentru care nu s-a primit nicio ofertă în 48 de ore părăsesc piața (semnează în ligi neafiliate) și fac loc generațiilor următoare.

---

## 3. Algoritmul de Distribuție a Calității (Curba lui Gauss)

Calitatea globală (Global Rating) a jucătorilor generați respectă o curbă normală matematică, pentru a menține raritatea vedetelor:

| Categorie Jucător | Procent din Piață | Calitate Globală | Vârstă | Descriere |
| :--- | :--- | :--- | :--- | :--- |
| **Comuni (Squad Depth)** | **55%** | 50% – 64% | 22 – 32 ani | Jucători ieftini, ideali pentru banca de rezerve sau completat lotul. |
| **Solizi (Starters)** | **25%** | 65% – 71% | 24 – 30 ani | Jucători capabili să fie titulari imediați în Diviziile 1 sau 2. |
| **Tinere Talente (Wonderkids)** | **12%** | 55% – 63% inițial *(Potențial ascuns 73% - 77%)* | **17 – 20 ani** | Diamante neșlefuite. Necesită un Scout bun pentru a le citi potențialul real! |
| **Veterani Maeștri** | **5%** | 70% – 74% | 33 – 36 ani | Jucători bătrâni cu Experiență uriașă (perfecți pentru rolul de Căpitan), dar cu rezistență scăzută. |
| **Vedete de Elită (Marquee Stars)** | **3%** | **75% – 77%** | 25 – 28 ani | Extrem de rari. Generați doar 1-2 pe săptămână pentru a declanșa licitații record. |

---

## 4. Generare Realistă de Identitate (Nume, Naționalități, Poziții)

1. **Baza de Date de Nume Locale**:
   * Generatorul combină baze de date cu mii de prenume și nume de familie conforme cu naționalitatea (românești, spaniole, engleze, braziliene, germane, franceze, olandeze, italiene etc.).
2. **Echilibrul Pozițiilor**:
   * Algoritmul nu generează haotic doar atacanți. Păstrează proporțiile reale ale unui teren de fotbal:
     * Portari (`GK`): ~12%
     * Fundași (`CB`, `LB`, `RB`): ~38%
     * Mijlocași (`CM`, `LM`, `RM`, `CAM`): ~32%
     * Atacanți (`CF`, `LF`, `RF`): ~18%

---

## 5. Misiunile Scout-ului (Scouting Search Network)

Pe lângă piața publică comună la care au acces toți managerii, fiecare club își poate folosi propriul **Scout (Departamentul de Recrutare)**:
* Managerul plătește o taxă de misiune (ex: €15.000) și setează filtre:
  * *"Caută Fundaș Central (CB) sub 21 de ani"*
  * *"Caută Portar cu reflexe peste 70%"*
* După 24 de ore, Scout-ul revine cu **3 propuneri exclusive generate doar pentru managerul respectiv**.
* Managerul are 48 de ore să semneze direct cu unul dintre ei înainte ca raportul să expire.
* **Calitatea Scout-ului**: Un scout de 90% aduce jucători mai buni și rapoarte mai precise despre potențialul ascuns al tinerilor.
