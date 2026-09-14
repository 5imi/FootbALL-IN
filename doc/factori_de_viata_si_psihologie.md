# Psihologia Jucătorului și Factori de Viață (Hidden Events)

Un fotbalist nu este un simplu set de numere pe un ecran. Dincolo de atributele fizice și tehnice (Viteză, Șut, Pase), performanța lui în ziua meciului este puternic influențată de **Factori de Viață (Life Factors)** și de **Psihologie**.

Pentru a crea un joc care generează povești unice și memoriabile (și, cum zicea un mare manager, "creează dependență"), am introdus un sistem de **Evenimente Ascunse (Hidden Events)**.

Aceste evenimente sunt generate aleatoriu între meciuri și aplică **buffs (bonusuri)** sau **debuffs (penalizări)** temporare asupra **Moralului**, **Rezistenței (Stamina)** și, implicit, asupra **Randamentului în Linie (Line Rating)**.

> [!IMPORTANT]
> **Sabia cu Două Tăișuri (The Double-Edged Sword)**
> Absolut toți acești factori pot crea atât avantaje, cât și dezavantaje. De exemplu, un jucător foarte agresiv (Bad Boy) poate intimida adversarii și câștiga dueluri fizice (Avantaj), dar are șanse uriașe să ia cartonaș roșu sau să petreacă în club înainte de meci (Dezavantaj). Echilibrul psihologic al echipei este cheia succesului.

---

## 1. Sistemul de Moral și Personalitate

Fiecare jucător are o **Personalitate** ascunsă, definită de două axe:
1. **Profesionalism** (1-100): Cât de serios se pregătește. Jucătorii cu profesionalism mare ignoră "tentațiile" vieții de noapte.
2. **Rezistență la Stres / Presiune** (1-100): Cât de mult îl afectează criticile presei, problemele de familie sau statutul de rezervă.

**Moralul de Bază (0 - 100%)** este influențat de statutul în echipă (titular/rezervă), rezultatele recente și salariu. Însă moralul efectiv de meci este ajustat de *Factorii de Viață*.

---

## 2. Tipuri de Evenimente Extra-Fotbalistice (Life Factors)

Sistemul de "Life Factors" rulează zilnic (la actualizarea serverului) și poate declanșa evenimente textuale (care apar în Inbox-ul managerului sau rămân ascunse, vizibile doar prin scăderea performanței).

### A. Evenimente Negative (Debuffs)

1. **Gagicăreala / Scandaluri Mondene**
   * *Trigger*: Șansă mică pentru jucătorii tineri (U23) cu Profesionalism scăzut și Formă bună (ajung "vedete" prea repede).
   * *Efect*: **Moral -15%**, **Focus la Antrenament -20%** timp de 1-3 zile.
   * *Exemplu Mesaj Inbox*: *"Paparazzi l-au surprins pe [Nume Jucător] într-un club exclusivist cu un model celebru cu doar 48 de ore înainte de meci. Fanii sunt furioși."*

2. **Beție / Nopți Nedormite**
   * *Trigger*: După o victorie mare sau la jucătorii cu "Bad Boy trait" (Profesionalism foarte mic).
   * *Efect*: **Rezistență (Stamina) Maxima temporară scade la 70%** (obosește în minutul 50), **Acuratețea Șut/Pase -10%**.
   * *Exemplu Mesaj Inbox*: *"Antrenorul secund raportează că [Nume Jucător] a lipsit de la recuperarea de dimineață. Se zvonește că ar fi petrecut până târziu în oraș."*

3. **Probleme de Familie (Family Issues)**
   * *Trigger*: Aleatoriu pentru orice jucător (chiar și cei cu Profesionalism ridicat). Reflectă latura umană.
   * *Efect*: **Moral -25%** pentru 1-2 săptămâni, jucătorul este distras. Uneori cere "Învoire / Leave of Absence" pentru 1 meci. Dacă nu e lăsat, moralul scade și mai mult.
   * *Exemplu Mesaj Inbox*: *"[Nume Jucător] trece printr-un divorț dificil (sau are o problemă medicală în familie). Mintea lui nu este la fotbal în acest moment."*

4. **Certuri în Vestiar / Bisericuțe**
   * *Trigger*: Când 2 jucători au personalități conflictuale sau când echipa are 3-4 înfrângeri consecutive.
   * *Efect*: Scade grav **Team Spirit (Spiritul Echipei)**. 

### B. Evenimente Pozitive (Buffs)

1. **Nașterea unui Copil (New Father Effect)**
   * *Trigger*: Extrem de rar, o dată în cariera unui jucător.
   * *Efect*: "Bebeto Celebration Mode". **Moral blocat la 100%**, șanse mai mari să marcheze ("+20% Finishing") pentru următorul meci dedicat copilului.
   
2. **Declarație de Iubire pentru Club**
   * *Trigger*: Jucător loial, petrece 5+ sezoane la club, primește prelungire de contract.
   * *Efect*: Devine "Fan Favorite", boost la Team Spirit dacă e pe teren, vinde mai multe tricouri (impact economic).

3. **Revansa Față de Fosta Echipă (Revenge Match)**
   * *Trigger*: Joacă împotriva clubului care l-a vândut în sezonul precedent.
   * *Efect*: **Agresivitate +20**, **Motivație (Work Rate) +30%**. Va alerga ca nebunul, dar riscă un cartonaș roșu.

---

## 3. Impactul în Motorul de Simulare (Match Engine)

Când se calculează **Line Rating-ul** (Notele pe linii, vezi `motor_simulare_si_mecanica_random.md`), acești factori de viață intervin ca un multiplicator final.

Formula de calcul a randamentului individual într-un meci devine:
$$ \text{Performanță Efectivă} = \left( \text{Atribute Bază} \times \frac{\text{Moral}}{100} \right) - \text{Penalizare Oboseală} + \text{Factori de Viață (Debuffs/Buffs)} $$

* De exemplu, un Atacant de clasă mondială (Rating 90), dar care "a fost la băutură" (Debuff Nopți Nedormite: -20% la Stats, Stamina Max 70%), va juca cu un Rating real de **~72** și va "leșina" pe teren în a doua repriză, fiind depășit de un fundaș modest, dar 100% profesionist și odihnit (Rating 75).

### Rolul Managerului
Managerul nu vede direct "Beția" ca pe o statistică numerică clară (nu va exista o bară de "Alcool 30%"). El va observa scăderea bruscă a Moralului și Condiției Fizice (Fitness) înainte de meci sau va primi "hint-uri" (zvonuri) în căsuța de mesaje (Inbox) de la staff-ul tehnic.
Dacă managerul insistă să joace cu un fotbalist "mahmur", consecințele în teren (greșeli neforțate, accidentări, cartonașe roșii din lipsă de concentrare) sunt responsabilitatea lui.

---

## 4. Profilul Psihologic al Antrenorului (The Human Coach)

Așa cum jucătorii sunt afectați de viața extrasportivă, **Antrenorul Principal (Head Coach)** pe care îl angajezi nu este doar un simplu multiplicator de antrenamente, ci este "și el om". 

Antrenorul are două atribute ascunse (evaluate de la 1 la 100) care intervin în mod direct pe bancă, la marginea terenului:

1. **Curajul (Courage / Fear Factor)**
   * **Antrenor Fricos (Curaj < 40)**: Dacă echipa ta joacă împotriva unui adversar mult mai bine cotat, un antrenor fricos va transmite panică echipei, anulând instrucțiunile tale ultra-ofensive. El "trage echipa înapoi", reducând randamentul atacului cu până la 10% în meciurile cu presiune mare.
   * **Antrenor Curajos (Curaj > 80)**: Își asumă riscuri. Dacă tu (managerul) setezi o tactică foarte agresivă (`3-4-3`, `Wing Play`, ordin de atac masiv), un antrenor curajos o va executa perfect, oferind un bonus la posesie și xG (Expected Goals), chiar dacă adversarul este pe hârtie mai bun.

2. **Capacitatea de Motivare (Man Management / Motivation)**
   * *The Half-Time Speech (Discursul de la pauză)*: Dacă echipa este condusă la pauză cu 2-0, un antrenor cu Motivare mare (>85) poate declanșa un eveniment de "Comeback". Moralul echipei primește un "boost" instantaneu la intrarea pe teren în repriza a doua.
   * *Recuperarea Eșecurilor*: După o serie de 3 înfrângeri, un antrenor bun știe să țină vestiarul unit, prevenind evenimentul de "Certuri în Vestiar / Bisericuțe" și ajutând echipa să își recupereze *Team Spirit-ul* mult mai repede.

Astfel, chiar dacă ai construit tactica perfectă pe hârtie, omul care strigă de pe margine va influența executarea ei în funcție de personalitatea sa. Alegerea staff-ului potrivit devine la fel de importantă ca alegerea primului 11!

Această dinamică sparge monotonia numerelor și adaugă un "stratum de RPG" (Role Playing Game), unde jucătorii și personalul clubului se simt vii și imprevizibili.

---

## 5. Psihologia în Timpul Meciului (In-Match Psychology)

Starea mentală a unui jucător nu este fixată doar de evenimentele dinaintea fluierului de start. **Evenimentele din timpul celor 90 de minute** pot altera dramatic moralul și performanța pe teren, generând un efect de "Momentum" (inerție psihologică).

1. **Intimidarea și Frica (The "Roy Keane" Effect)**
   * Când un jucător cu **Agresivitate mare** (ex: un Fundaș Central dur) are câteva intervenții la limită sau comite un fault dur în primele minute, el poate declanșa o mecanică de *Intimidare* asupra adversarilor direcți (în special atacanții tehnici, dar cu *Rezistență la Stres* mică).
   * **Efect**: Jucătorii intimidați vor avea un debuff de **-10% la Curaj și Posesie** în duelurile directe cu acel fundaș. În text-ticker va apărea: *"Atacantul [Nume] pare timorat după intrarea dură de mai devreme și evită duelurile unu-la-unu."*

2. **Panica în Apărare (Momentum Shift)**
   * Dacă o echipă primește **2 goluri într-un interval scurt** (ex: sub 10 minute), se declanșează un test de *Rezistență la Stres* pentru linia defensivă.
   * **Efect**: Dacă fundașii cedează presiunii, apare un debuff de **Panică (-15% la randamentul apărării)** pentru restul reprizei. Aici intervine din nou rolul Antrenorului de a opri acest colaps mental fie printr-o schimbare tactică, fie printr-un speech la pauză.

3. **Efectul de "On Fire" (Confidence Boost)**
   * Un jucător care reușește un dribling spectaculos urmat de un șut periculos (sau marchează un gol) capătă instantaneu un bonus de **Încredere (+10% la calitatea șuturilor/paselor)** pentru următoarele 15-20 de minute de joc, devenind extrem de greu de oprit de către adversari.

---

## 6. Compendiu de Evenimente Dinamice (15+ Scenarii Double-Edged)

Pentru a asigura o imprevizibilitate controlată în simulare, jocul conține zeci de scenarii specifice (in-match și pre-match) bazate pe ideea de "Sabie cu două tăișuri" (Double-Edged Sword). Fiecare bonus aduce un risc inerent.

### Scenarii cu Fanii și Presa
1. **Idolizarea în Peluză**: Fanii îi scandează numele după o serie bună de meciuri.
   * *Avantaj*: Jucătorul primește un impuls enorm de energie (Stamina scade mult mai greu).
   * *Dezavantaj*: Presiunea de a performa îl face egoist; ignoră instrucțiunile tactice de pasă și încearcă șuturi imposibile de la distanță.
2. **Scandalul Pariurilor (Zvonuri false)**: Presa scrie că un jucător ar fi pariat pe meci.
   * *Avantaj*: Jucătorul se apără disperat, cu o agresivitate calculată impecabilă, pentru a-și dovedi inocența (+20% Defending).
   * *Dezavantaj*: La prima greșeală, propriii fani îl fluieră, moment în care moralul său se prăbușește total (cădere mentală pe teren).
3. **Prezența pe Ecranele Stadionului (Jumbotron Star)**: O celebritate sau o legendă a clubului este arătată pe ecran aplaudând o reușită a jucătorului.
   * *Avantaj*: Jucătorul intră în starea "On Fire" (+15% rating per total).
   * *Dezavantaj*: Jucătorii adverși devin geloși / enervați de aroganță și vor juca mult mai dur împotriva lui (risc masiv de accidentare).
4. **Scandalagiu în Tribuna Oficială**: Presa filmează un prieten din anturajul jucătorului făcând scandal la lojă.
   * *Avantaj*: Furie canalizată; jucătorul trage cu o forță uriașă în minge (+Shot Power).
   * *Dezavantaj*: Jucătorul pierde concentrarea (Focus -20%), uitându-se des spre loja VIP pentru a vedea ce se întâmplă.

### Scenarii Personale și de Familie
5. **Vizita Surpriză a Familiei**: Soția și copiii apar neașteptat la un meci în deplasare.
   * *Avantaj*: "Boost" emoțional instant, viteză de reacție incredibilă la mingi respinse.
   * *Dezavantaj*: Distragere temporară de la sarcinile defensive (uită să facă marcaj strâns).
6. **Noaptea Nedormită cu Copilul Nou-Născut**: Copilul plânge toată noaptea înainte de derby.
   * *Avantaj*: Instinct de protector, jucătorul este gata să se sacrifice în orice duel pentru a aduce victoria familiei.
   * *Dezavantaj*: Epuizare fizică masivă. La pauză trebuie înlocuit, având Stamina sub 30%.
7. **Bilete Cerute de Neamuri**: Jucătorul trebuie să facă rost de 30 de bilete pentru prieteni la un meci de Cupă.
   * *Avantaj*: Joacă pentru spectacol, probabilitate mare de a executa scheme tehnice ("rabona", călcâie) care, dacă ies, ridică moralul întregii echipe.
   * *Dezavantaj*: Dacă dă greș, se simte umilit în fața apropiaților și rating-ul lui scade dramatic până la final.

### Scenarii din Timpul Meciului (In-Match)
8. **Echipamentul Rupt (Gheata crăpată)**: Jucătorul își rupe gheata, dar jocul nu e oprit.
   * *Avantaj*: Gest eroic apreciat de public; spiritul de sacrificiu crește "Team Spirit" cu 15%.
   * *Dezavantaj*: Risc de alunecare masiv pe faza de construcție, ducând la pierderea mingii într-o zonă periculoasă.
9. **Bandajul Însângerat ("The Terry Butcher")**: După un duel aerian sângeros, jucătorul refuză schimbarea și joacă bandajat la cap.
   * *Avantaj*: Intimidează vizual atacanții adverși, câștigă garantat următoarele 3 dueluri aeriene (bonus la Heading).
   * *Dezavantaj*: Câmp vizual redus, scade acuratețea paselor lungi cu 25%.
10. **Schimbarea Vremii în Minutul 60**: Începe o furtună torențială din senin.
    * *Avantaj*: Echipele bazate pe forță fizică (Tackling, Agresivitate) primesc bonus uriaș. Jucătorii alunecă "bine" la deposedări.
    * *Dezavantaj*: Echipele tehnice, bazate pe "Tiki-Taka" (Pase Mici), suferă o cădere de 30% a preciziei paselor.
11. **Faultul Neacordat (Injustiția Arbitrului)**: Arbitrul refuză un penalty evident pentru echipa ta.
    * *Avantaj*: Mentalitatea "Noi împotriva Tuturor" - echipa aleargă cu 15% mai mult în următoarele 10 minute pentru a face dreptate.
    * *Dezavantaj*: Căpitanul sau jucătorii nervoși protestează violent și încasează cartonașe galbene stupide.
12. **Penalty Ratat în Primele 5 Minute**: Un star ratează imediat după start.
    * *Avantaj*: Vrea să își repare greșeala cu orice preț, șutează din orice poziție, fiind super-ofensiv.
    * *Dezavantaj*: Dacă nu reușește să înscrie repede, intră în depresie de meci și devine "invizibil" pe teren.
13. **Flashback-ul Accidentării**: Se joacă pe stadionul unde a suferit o accidentare horror acum 2 ani.
    * *Avantaj*: Dacă învinge frica și dă gol, face meciul carierei (Rating maxim).
    * *Dezavantaj*: "Fantomele Trecutului" îl bântuie; sare din duelurile 50-50 de teamă să nu se accidenteze iar.
14. **Trash-Talk din partea Rivalului**: Un fundaș advers îi aduce insulte personale la un corner.
    * *Avantaj*: Adrenalină maximă, jucătorul reușește să câștige forța fizică împotriva adversarului direct.
    * *Dezavantaj*: Risc iminent de cartonaș roșu direct pentru lovire intenționată fără minge.
15. **Sponsorul Nerăbdător**: Sponsorul principal cere public ca noul jucător transferat să fie titular, deși e nepregătit.
    * *Avantaj*: Clubul primește un bonus de bani post-meci, iar jucătorul are ambiția să demonstreze.
    * *Dezavantaj*: Jucătorul strică chimia (Team Spirit) deoarece ia locul unui titular merituos, iar pasele nu se mai leagă pe acel flanc.

---

## 7. Influența Completă a Echipei Auxiliare (Staff-ul Tehnic)

Nu doar Antrenorul Principal contează. Orice membru de Staff aduce atât un beneficiu tehnic, cât și un risc psihologic sau tactic (sabie cu două tăișuri).

1. **Maseurul (Masseur)**
   * *Rol de bază*: Grăbește recuperarea condiției fizice (Fitness) între meciuri.
   * *Sabia cu două tăișuri*: O ședință pre-meci excepțională elimină toate durerile (Avantaj), dar poate lăsa jucătorul "prea relaxat" (Dezavantaj), ceea ce înseamnă că are un timp de reacție întârziat în primele 15 minute ale meciului (risc de gol rapid încasat).
2. **Medicul Clubului (Club Doctor)**
   * *Rol de bază*: Tratează și reduce durata accidentărilor grave.
   * *Sabia cu două tăișuri*: Permite unui jucător vital cu o accidentare minoră ("Orange Cross") să joace sub injecții cu calmante (Avantaj enorm pe moment). Dacă jucătorul este faultat exact în acea zonă, accidentarea minoră devine "Ruptură" și îl ține pe tușă 3 luni (Risc catastrofal).
3. **Îngrijitorul Terenului (Groundsman)**
   * *Rol de bază*: Menține calitatea gazonului (Pitch Quality).
   * *Sabia cu două tăișuri*: Poate uda excesiv o anumită bandă pe care atacă extrema rapidă a adversarului pentru a-l încetini (Avantaj tactic). Există un risc de 20% ca exact fundașii tăi să alunece pe porțiunea respectivă (Dezavantaj autoinflict).
4. **Scouterul (Scout)**
   * *Rol de bază*: Descoperă atributele ascunse ale adversarilor pe piața de transferuri.
   * *Sabia cu două tăișuri*: Transmite informații tactice înainte de meci (ex: "Portarul advers plonjează slab pe stânga"). Atacanții tăi vor șuta perfect acolo (Avantaj). Dar dacă portarul advers "are o zi bună", atacanții tăi devin prea predictibili, refuzând alte soluții (Dezavantaj).
5. **Coordonatorul de Juniori (Youth Coordinator)**
   * *Rol de bază*: Aduce regen-uri / juniori în academie.
   * *Sabia cu două tăișuri*: Dacă promovezi brusc în echipa mare un fenomen de 17 ani descoperit de el: juniorul este imprevizibil pentru adversari (Avantaj). Însă prezența lui scade "Experiența Medie" a echipei, făcând echipa susceptibilă la a pierde meciuri tensionate pe final (Dezavantaj).
6. **Antrenorul Secund (Assistant Manager)**
   * *Rol de bază*: Conduce antrenamente specifice și preia sarcinile administrative.
   * *Sabia cu două tăișuri*: De la marginea terenului, poate urla la fundași când tu i-ai setat pe stil "Calm și Posesie". Uneori asta trezește o defensivă adormită (Avantaj), alteori supra-scrie instrucțiunile tale și rupe total echilibrul tactic (Dezavantaj, cauzează confuzie).
7. **Psihologul (The Psychologist)**
   * *Rol de bază*: Menține echilibrul mental în vestiar, accelerează refacerea Moralului scăzut și previne "burnout-ul".
   * *Sabia cu două tăișuri*: Un psiholog bun ține echipa stabilă în crize (Avantaj masiv). Dar dacă echilibrează *prea mult* jucătorii foarte agresivi (Bad Boys), aceștia își pierd acea "răutate pozitivă" (scade factorul de intimidare "Roy Keane effect"). Echipa devine prea calmă, "soft", pierzând duelurile fizice la limită (Dezavantaj tactic).

---

## 8. Cursurile de Perfecționare pentru Staff (Staff Training & Courses)

Pentru a crește calitatea (Skill Level) unui membru de staff, managerul îl poate trimite la **Cursuri de Perfecționare** (ex: Licența Pro UEFA pentru antrenori, Simpozioane Medicale pentru doctori).

* **Mecanica Double-Edged**: 
  * *Beneficiul (Avantaj)*: Când se întoarce, membrul de staff va avea un *Skill Level* superior, aducând bonusuri mai mari echipei pe termen lung.
  * *Riscul (Dezavantaj)*: Pe perioada cursului (ex: 7-14 zile), el este **plecat de la club (`isOnCourse = true`)**. Dacă îți trimiți medicul principal la cursuri, toți jucătorii care se accidentează în acea săptămână vor avea perioade de recuperare cu 30% mai lungi. Dacă îți trimiți Maseurul, echipa ta va începe meciurile următoare cu Fitness-ul sub optim.
  * *Efect Secundar Economic*: Un staff cu o diplomă nouă va pretinde un salariu mult mai mare la reînnoirea contractului sau ar putea atrage atenția unui club rival.

---

## 9. Antrenamentul Jucătorilor (Training Intensity)

Programul de antrenament setat de manager este esențial pentru creșterea calității (Global Quality) și a atributelor individuale.

* **Antrenament de Mare Intensitate (High Intensity)**:
  * *Avantaj*: Jucătorii cresc în Stats extrem de rapid, excelent pentru tineri (wonderkids).
  * *Dezavantaj*: Riscul de accidentări musculare la antrenament crește exponențial (+40%), iar Rezistența (Stamina Max) în ziua meciului abia dacă atinge 80%. O echipă supra-antrenată este lentă pe teren în ultimele 20 de minute.
* **Antrenament Ușor (Low Intensity / Recovery)**:
  * *Avantaj*: Jucătorii sunt la 100% Fitness în ziua meciului, proaspeți și gata de joc.
  * *Dezavantaj*: Creșterea (Growth-ul) se oprește complet. Pe termen lung, jucătorii plafonati vor stagna. 

Echilibrul dintre cât tragi de un jucător pe terenul de antrenament și cât îl odihnești pentru meci separă managerii amatori de cei de top.
