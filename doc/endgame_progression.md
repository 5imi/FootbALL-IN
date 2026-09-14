# Obiectivele End-Game (Analiza Echipelor de Top)

Pentru a ne asigura că jocul nostru scalează perfect de la un utilizator nou până la 20 de ani de activitate, am folosit agentul de navigare pentru a analiza campioanele din Divizia A din jocul original (ex: *Chelsea.Fc, aQuaRedon, Sulangii*).

## User Review Required

> [!TIP]
> Aceste date vor dicta plafoanele maxime în codul jocului nostru. Vom seta limitele infrastructurii și calității exact după acest tipar. Dacă ești de acord cu limitele de mai jos, apasă **Proceed**.

---

## 1. Infrastructura (Uriașul Sincron Financiar)

La început, echipa ta (ex. FC Foresta în Divizia F) are un stadion de aproximativ 30.000 locuri.
Echipele de elită ajung la limita absolută a infrastructurii:
* **Capacitate Stadion**: 150.000 – 160.000 de locuri. (Aceasta presupune extinderi de 5 ori mai mari).
* **Parcări**: Peste 50.000 de locuri (creștere 8x față de început).
* **Toalete & Baruri**: Peste 2.000 de toalete și 450 de baruri pentru a deservi zeci de mii de fani.
* **Prețul Biletelor**: Interesant este că echipele mari **scad** prețul biletelor de la 15€ la 11-12€ pentru a se asigura că umplu arena de 160.000 de locuri. *Volumul bate prețul.*

---

## 2. Jucătorii (Limita Calității)

Dacă în Divizia F jucătorii au o calitate globală de 50-65% și vârste amestecate, la echipele de top lotul arată complet diferit:
* **Vârsta de Aur**: Toți titularii au între 26 și 32 de ani. Echipele mari nu joacă cu tineri, ci cu jucători ajunși la plafonul maxim. Odată ce trec de 32 de ani, îi vând sau îi retrag pentru că încep să scadă.
* **Calitatea Globală Maximă**: Am observat că jucătorii de vârf ating o calitate de **76% - 77.5%**. 
* **Performanța în Meci (Line Rating)**: Jucătorii de 77% generează pe posturile lor un scor de performanță (LR) de până la **154**. (Comparativ cu un LR de 40-50 în Divizia F). Totalul echipei adunat atinge peste **800** puncte în simularea meciului.
* **Dimensiunea Lotului**: Fixată pe limită, la 32 de jucători, pentru a avea o bancă de rezerve uriașă în fața accidentărilor sau suspendărilor (dat fiind că joacă și în Cupă).

---

## Concluzie pentru Codul Nostru

Asta ne confirmă matematica pe care trebuie să o scriem:
1. Max-cap-ul (Plafonul) bazei de fani a unui club trebuie programat la ~90.000 fani.
2. Max-cap-ul capacității stadionului este 160.000.
3. Generatorul de jucători nu va crea tineri de 18 ani cu Global Quality mai mare de 50-55%. Astfel, vor fi necesari cel puțin 6-8 ani (sezoane în joc) de antrenamente zilnice ca jucătorul să ajungă la 77%. Această evoluție lungă va ține utilizatorii lipiți de ecran.
