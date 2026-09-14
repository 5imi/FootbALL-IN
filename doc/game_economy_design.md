# Design-ul Economiei: SoccerManager Clone

O economie dezechilibrată (unde utilizatorii adună sute de milioane fără să aibă pe ce să le cheltuie, sau unde dau faliment instant) ruinează un joc de tip manager. Acest document descrie cum vom balansa banii în joc.

## User Review Required

> [!WARNING]
> Te rog să citești propunerile de mai jos, în special secțiunea **Controlul Inflației (Money Sinks)**. Acesta este secretul oricărui joc multiplayer de succes. Dacă ești de acord cu modelul, apasă pe **Proceed**.

---

## 1. Banii de Start (Newbie Boost)
Un manager nou va începe cu un buget de **€ 2.000.000**.
* **Scopul**: Suficient pentru a extinde puțin stadionul, a angaja un staff mediocru și a cumpăra 2-3 jucători tineri. Nu suficient pentru a cumpăra jucători de top.

---

## 2. Sursele de Venit (Incomes - Cum intră banii în joc)

1. **Vânzarea de Bilete**:
   * *Formula*: `Preț Bilet x Număr Spectatori`. 
   * Numărul de spectatori este limitat de capacitatea stadionului, starea toaletelor/parcărilor și performanța echipei (Baza de fani). Dacă pui biletul prea scump, fanii nu vin.
2. **Sponsorii (Panouri publicitare)**:
   * Venit garantat **zilnic** (ex: contract pe 10 zile cu 15.000€ pe zi per panou). Încurajează utilizatorii să se logheze regulat pentru a semna noi contracte când cele vechi expiră.
3. **Premiile de Final de Sezon (Prize Money)**:
   * Banii acordați în Săptămâna 9 pe baza locului ocupat în ligă (Locul 1 ia mult mai mult decât locul 6). Acesta este principalul stimulent pentru performanță.
4. **Drepturi TV**: O sumă fixă mică primită doar la meciurile oficiale.

---

## 3. Cheltuielile Zilnice / Săptămânale (Expenses)

Aici jocul taxează managerii pentru a-i împiedica să adune averi infinite.
1. **Salariile Jucătorilor (Scalare Exponențială)**:
   * Jucător de 60%: ~€ 1.000 / meci
   * Jucător de 70%: ~€ 3.000 / meci
   * Jucător de 80%: ~€ 8.000 / meci
   * Jucător de 90%: ~€ 20.000 / meci
   * *Motivul*: Un manager din Divizia H nu își va permite niciodată să țină 11 jucători de 90%, chiar dacă are bani de transfer, pentru că va da faliment din salarii! Asta ține echipele echilibrate per divizie.
2. **Salariile Staff-ului**:
   * Un doctor de 100% va cere un salariu exorbitant. Te obligă să iei decizii: "Îmi permit cel mai bun doctor sau e de ajuns unul de 70%?".
3. **Mentenanța Infrastructurii**:
   * Terenul, Academia de Tineret și Stadionul necesită fonduri zilnice pentru întreținere.

---

## 4. Controlul Inflației ("Money Sinks")

Într-un joc multiplayer, banii generați din meciuri intră permanent în economie. Dacă managerii își tot vând jucători între ei, masa monetară crește la nesfârșit. Avem nevoie de "Money Sinks" (Mecanisme de distrugere a banilor virtuali):

1. **Comisionul Impresarului / Taxa de Transfer (Cel mai important)**:
   * Când o echipă vinde un jucător cu 10.000.000€ unei alte echipe, vânzătorul primește doar **85%**. Restul de **15% dispare din joc** (simulat ca onorariu pentru agent). Aceasta este "taxa anti-inflație" de bază.
2. **Costurile de Construcție și Extindere**:
   * Banii plătiți pentru construcția a 5.000 de locuri noi pe stadion părăsesc sistemul. Costurile de construcție trebuie să fie suficient de mari.
3. **Costul Cursurilor de Staff**:
   * Pentru a trimite antrenorul la curs să crească de la 80% la 85%, managerul plătește o taxă uriașă jocului.
4. **Banii de Semnătură (Signing Bonuses)**:
   * Pentru ca un jucător liber de contract să accepte oferta, va cere un bonus la semnătură (sau Mașină/Casă). Acești bani dispar din economie.

---

## Concluzie
Acest sistem garantează că doar echipele din Diviziile A și B își vor permite să aibă jucători de top, deoarece doar stadionul mare de acolo (și biletele vândute la meciurile lor) vor acoperi cheltuielile cu salariile uriașe ale vedetelor. Diviziile inferioare vor fi nevoite să crească juniori pentru a supraviețui.
