# Sistemul Competițional (Ligi & Cupe)

Am analizat clasamentele actuale, sectiunea oficială de Reguli (Ligă și Cupă) și modul în care funcționează ierarhia echipelor în SoccerProject. Aceste reguli vor sta la baza bazei noastre de date.

## User Review Required

> [!TIP]
> Te rog să revizuiești structura matematică a piramidei de ligi. Am descifrat de ce mereu promovează 2 echipe și retrogradează 6. Odată ce ești de acord cu sistemul piramidal și cu programul (calendarul), apasă **Proceed**. Vom fi gata de codare!

---

## 1. Piramida Ligilor (Expansion Ratio 3:1)

Jocul nu are pur și simplu divizii liniare, ci folosește un model piramidal în care fiecare divizie este "hrănită" de **3 divizii din nivelul inferior**. 
Avem **16 echipe per divizie**.

- **Nivel 1 (Divizia A)**: 1 ligă
- **Nivel 2 (Divizia B)**: 3 ligi (B.1 – B.3)
- **Nivel 3 (Divizia C)**: 9 ligi (C.1 – C.9)
- **Nivel 4 (Divizia D)**: 27 ligi
- **Nivel 5 (Divizia E)**: 81 ligi
- **Nivel 6 (Divizia F)**: 243 ligi
- **Nivel 7 (Divizia G)**: 729 ligi
- **Nivel 8 (Divizia H)**: 2.187 ligi

### Promovare și Retrogradare (Mecanica perfectă)
Deoarece fiecare ligă e hrănită de 3 ligi inferioare, mecanica matematică a sezonului (pentru a asigura echilibrul) este fixă:
* **Locurile 1 și 2 (Top 2)**: PROMOVEAZĂ în eșalonul superior. (Deci din cele 3 ligi inferioare, urcă exact 6 echipe).
* **Locurile 3 - 10 (Mijlocul clasamentului)**: RĂMÂN în aceeași divizie.
* **Locurile 11 - 16 (Ultimele 6)**: RETROGRADEAZĂ în eșalonul inferior. (Aceste 6 echipe coboară pentru a face loc celor 6 echipe venite de jos).

---

## 2. Calendarul Sezonului (63 de Zile)

- Un sezon are exact **9 săptămâni**.
- Fiecare echipă joacă **30 de meciuri de campionat** (Tur-Retur).
- **Zilele Meciurilor de Ligă (ora 04:00 CET)**: Luni, Marți, Joi, Vineri (în săptămânile 1-8). 
  - *Zile de Odihnă (Rest Days)*: Nu se joacă ligă în Vinerile din Săptămâna 4 și Săptămâna 8.
- Toate datele statistice sunt salvate per divizie: *Golgheteri, Cartonașe Galbene/Roșii, Diagrama meciurilor directe*.

---

## 3. Cupa Oficială (SP Cup)

- **Participare**: Toate echipele intră automat.
- **Format**: Sistem eliminatoriu (Knockout) cu 11 runde în total.
- **Zile de disputare**: Miercuri (la 04:00 CET). În Săptămâna 9, când Liga se termină, se joacă restul finalelor de Cupă.
- **Departajare**: Nu există prelungiri! Dacă meciul se termină la egalitate după 90 de minute, se trece direct la **Lovituri de departajare (Penalty Shootout)**.
- **Împărțire Bani (Bilete)**: Echipa gazdă ia 70%, oaspeții iau 30%. (Spre deosebire de Ligă, unde raportul este 90% Home / 10% Away, iar la Amicale 95% Home / 5% Away).

---

## 4. Academia de Tineret (Youth Setup)

Acesta este sistemul prin care jucătorii aduc sânge proaspăt în echipă fără a apela la piața de transferuri:
- Cele 3 nivele de upgrade: Simplu, Profesional, Hiper-Modern.
- **Cadence (Generarea Jucătorilor)**: Când extinzi la nivelul Profesional, va dura ~30 de zile până la promovarea primului junior. 
- Tinerii promovați preiau automat **naționalitatea managerului** contului.

## Concluzie

Acesta este ultimul pilon de gameplay de care aveam nevoie pentru baza de date. Știm cum merg banii, știm cum arată jucătorii, știm regulile stadionului și cunoaștem calendarul competițional pe ore exacte! Dacă totul sună bine, te rog să apeși **Proceed** și eu voi deschide terminalul pentru a inițializa `Next.js` și baza de date!
