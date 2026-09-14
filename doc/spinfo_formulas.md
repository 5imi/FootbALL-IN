# Secretele SPInfo-Tool: Formule Matematice pentru SoccerManager Clone

În urma analizei `spinfo-tool.com` (cel mai avansat calculator al comunității), am extras ecuațiile exacte pe care jocul original le ține ascunse. Le vom încorpora direct în clone-ul nostru pentru a garanta o experiență perfect balansată.

## User Review Required

> [!TIP]
> Aceste formule detaliate vor fi transpuse direct în codul de backend al jocului nostru. Dacă ești de acord cu păstrarea acestor procente și reguli stricte (sau vrei să le ajustăm), apasă **Proceed**.

---

## 1. Infrastructură: Regula Proporțiilor de Aur

Nu poți pur și simplu să mărești doar scaunele din stadion. SPInfo ne arată că jocul are reguli foarte clare pentru infrastructura adiacentă pe baza capacității stadionului:
* **Parcări (Parking)**: Trebuie să acopere **33% din capacitatea stadionului**. (Ex. la un stadion de 10.000 de locuri, ai nevoie de minim 3.300 locuri de parcare).
* **Toalete**: Trebuie să reprezinte **1% din capacitatea stadionului** (1 toaletă la 100 de spectatori).
* **Baruri**: Trebuie să reprezinte **0.2% din capacitatea stadionului** (1 bar la 500 de spectatori).

Dacă nu respecți aceste rate, spectatorii pur și simplu nu vor veni, chiar dacă ai scaune libere și moralul echipei este 100%. Vom coda exact aceste dependințe.

---

## 2. Economie: Elasticitatea Prețului Biletelor

Cea mai fascinantă descoperire de pe SPInfo este curba de cerere și ofertă la prețul biletelor. Prețul biletelor nu scalează liniar cu veniturile.

Exemplu exact extras (pentru un stadion de 10.000 de locuri):
* **Bilet 14 €**: 100% plin (10.000 fani) $\rightarrow$ Profit: € 146.000.
* **Bilet 15 €**: 100% plin (10.000 fani) $\rightarrow$ Profit: € 155.000.
* **Bilet 16 €**: 94.6% plin (9.460 fani) $\rightarrow$ **Profit maxim absolut: € 155.145**.
* **Bilet 17 €**: 85.6% plin (8.564 fani) $\rightarrow$ Profit scade la € 148.167.

*Concluzia pentru cod*: Mărirea prețului cu un singur Euro peste limita de saturație ("cererea perfectă") scade prezența fanilor cu aproape 10%! Vom crea o formulă similară (cerere vs ofertă) pentru a forța managerii să își calculeze optim prețul la fiecare meci (în funcție de moral și de renumele adversarului).

---

## 3. Salarii și Contracte

Aceste cifre ascunse scot banii din economie și mențin jocul greu:
1. **Prime de Victorie (Win-Bonus)**: Jucătorul primește automat **2.0x salariul de bază** la o victorie oficială, DOAR dacă se află pe foaia de joc (titular sau una din cele 5 rezerve).
2. **Prima de Semnătură (Sign-On Bonus)**: Este achitată o singură dată și scalează cu numărul de ani (sezoane) oferiți în contract.
3. **Casă și Mașină (Perks)**: 
   * Fiecare opțiune oferită costă clubul **900 € / lună**.
   * Dacă oferi și casă și mașină jucătorului, el acceptă un salariu de bază un pic mai mic (reducere marginală), dar clubul are cheltuieli lunare fixe care se tot adună.

---

## 4. Repartizarea Suporterilor (Oaspeți vs Gazde)

Mecanica secretă a tribunelor:
* La meciurile de **Ligă și Cupă**: Repartiția de bază este de **85% Fani Gazdă / 15% Fani Oaspeți**. Dacă echipa gazdă domină masiv, se poate urca la o limită hard-coded de **95% Home / 5% Away**.
* La **Amicale**: Repartiția este înghețată automat la **85% / 15%**, tocmai pentru a descuraja fermele de bani (să joci non-stop amicale doar ca să îți umpli tot stadionul pe 100% suport local).

## Concluzie Finală

SPInfo.com dovedește că în spatele unei grafici simple de browser game se află un motor matematic foarte avansat. Planul este complet: avem ratele pentru arhitectură, ecuațiile pentru salarii și algoritmul pentru suporteri. 

Dacă ești mulțumit cu aceste reguli integrate în plan, te aștept să apeși pe **Proceed**! Vom începe prin a crea baza de date PostgreSQL și API-ul pentru echipa de start.
