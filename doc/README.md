# Documentația Tehnică & Mecanicile Oficiale (SoccerManager Clone)

Bine ați venit în centrul de documentare complet al proiectului **SoccerManager Clone** (un joc modern de tip football manager browser-based, inspirat din matematica riguroasă a *SoccerProject*, calculatoarele analitice *SPINFO-Tool*, mecanicile reale din fotbalul european modern *UEFA / FIFA*, extinderea dinamică organică a diviziilor și retenția din *Top Eleven*).

Toată documentația a fost scrisă integral în format Markdown (`.md`) și este structurată pe capitole independente, gata de consultat în orice moment:

---

## Cuprins & Navigare Documentație

### 1. [Motorul de Simulare al Meciului & Mecanica Aleatorie (RNG)](file:///D:/Proiecte/SoccerManagerClone/doc/motor_simulare_si_mecanica_random.md)
* **Determinism pe bază de Seed**: Meciuri 100% reproductibile și anti-cheat bazate pe SHA256 match seed.
* **Ciclul Minut cu Minut**: Lupta pentru posesie la mijloc $\rightarrow$ Crearea șansei de gol (xG) $\rightarrow$ Duelul atacant vs portar $\rightarrow$ Verificare faulturi & VAR.
* **Live Text Ticker & Timeline**: Meciul se desfășoară ca un comentariu text dinamic minut cu minut, fără încărcare grea de grafică 2D.
* **Factorul Aleatoriu Controlat (Curba lui Gauss)**: Echilibrul dintre tactica pură și "Marea Surpriză" (underdog effect 85% / 10% / 5%).

### 2. [Extinderea Dinamică a Diviziilor (Organic League Scaling)](file:///D:/Proiecte/SoccerManagerClone/doc/extindere_dinamica_divizii.md)
* **Pornirea cu Divizia 1 (A)**: Începem cu o singură ligă vie de 16 echipe pentru primii manageri înscriși, creând comunitate și rivalitate instantă.
* **Scalarea de Sus în Jos**: Când se înregistrează jucători noi, sistemul deblochează automat Divizia 2 (2 serii), Divizia 3 (4 serii) etc., fără ligi pustii de boți.

### 3. [Generarea Automată a Jucătorilor & Piața Liberă](file:///D:/Proiecte/SoccerManagerClone/doc/generare_jucatori_si_piata_libera.md)
* **Injectarea Regulată de Jucători (Free Agents Pool)**: Loturi proaspete generate la fiecare 6 ore pentru a menține piața lichidă și activă.
* **Curba lui Gauss**: Distribuția calității (55% comuni, 25% solizi, 12% tinere talente cu potențial ascuns, 5% veterani, 3% vedete de elită).
* **Misiunile Scout-ului**: Posibilitatea de a trimite scouterul să caute profile exacte (3 oferte exclusive per misiune).

### 4. [Manualul Complet al Mecanicilor de Joc](file:///D:/Proiecte/SoccerManagerClone/doc/manual_complet_mecanici.md)
* **Lot & Poziții**: Cele 11 poziții pe teren, atributele tehnice per post, atributele generale (Fitness, Morale, Experience, Form).
* **Motorul de Meci & Tactici**: Cele 8 formații permise, cele 4 stiluri de joc (Passing, Wing Play, Kick & Rush, Defensive/Counter) și sinergiile lor.
* **Instrucțiuni Individuale**: Ordinele `+` (Ofensiv), `=` (Normal), `-` (Defensiv) per jucător.
* **Formula de Aur a Arbitrajului**: Relația matematică dintre agresivitatea echipei și strictețea arbitrului ($Agresivitate \le 100 - Severitate$).

### 5. [Regulamentele Reale din Fotbalul European (UEFA & IFAB)](file:///D:/Proiecte/SoccerManagerClone/doc/fotbal_european_si_reguli_reale.md)
* **Formatul Elvețian (The Swiss System)**: Noul model UEFA Champions League (36 echipe, 8 meciuri garantate, baraj locurile 9-24).
* **Fair-Play Financiar UEFA (Squad Cost Rule 70%)**: Plafonarea cheltuielilor cu salariile și lotul la 70% din veniturile reale ale clubului.
* **Regula Jucătorilor Crescuți la Club (Homegrown Rule)**: Obligativitatea de a înscrie pe lista oficială minimum 4 jucători crescuți în propria Academie de Tineret.
* **Ferestre de Transferuri (Mercato) & Împrumuturi (Loans)**: Fereastra de vară, fereastra de iarnă, Transfer Deadline Day și sistemul de împrumut cu opțiune de cumpărare.
* **VAR & Reguli Moderne IFAB**: 5 schimbări în 3 ferestre, desființarea regulii golului în deplasare și suspansul verificării VAR în text ticker.

### 6. [Echipele Bot, Inactivitatea & Mecanica de Promovare/Retrogradare](file:///D:/Proiecte/SoccerManagerClone/doc/bot_teams_si_structura_promovare.md)
* **Echipele Bot (Computer Teams / FC Teams)**: Cum apar boții din manageri inactivi (regula de 21 de zile fără login), comportamentul lor default și rolul lor strategic (odihnă titulari, spălare de cartonașe galbene).
* **Promovare și Retrogradare (Diviziile A - G)**: Primele 2 promovează, ultimele 6 retrogradează.
* **Cazul Special al Diviziei H**: Baza piramidei unde nu există retrogradare; curățarea boților și resetarea sloturilor la final de sezon.

### 7. [Strategia de Piață, Concurență & Rețeta Retenției Zilnice](file:///D:/Proiecte/SoccerManagerClone/doc/analiza_concurenta_si_retentie.md)
* **Comparație Detaliată**: SoccerProject vs. Hattrick vs. Top Eleven vs. OSM.
* **Oportunitatea Noastră**: Fuziunea dintre simularea matematică cinstită (fără Pay-to-Win) și grafica modernă cu Live Text Ticker & Timeline.
* **Buclele de Dependență Pozitivă (Dopamine Loops)**: Comentariu Live Text alert, Asistentul SPInfo integrat, Asociații de Clan, Licitații anti-snipe, Misiuni zilnice.

### 8. [Design-ul Economiei Clubului & Controlul Inflației](file:///D:/Proiecte/SoccerManagerClone/doc/game_economy_design.md)
* **Sursele de Venit (Incomes)**: Bilete meci, panouri publicitare zilnice (sponsori), drepturi TV, premii oficiale de sezon, catering la baruri.
* **Cheltuielile Curente (Expenses)**: Salariile jucătorilor, salariile staff-ului, mentenanța centrului de tineret și a gazonului.
* **Controlul Inflației (Money Sinks)**: Comisionul de 15% al impresarului la transferuri și salarizarea exponențială a jucătorilor peste 80%.

### 9. [Formulele Secrete din SPINFO-Tool](file:///D:/Proiecte/SoccerManagerClone/doc/spinfo_formulas.md)
* **Proporțiile de Aur ale Stadionului**: Parcări (33%), Toalete (1%), Baruri (0.2%).
* **Curba de Elasticitate a Biletelor**: Variația profitului pe praguri de preț (€14, €15, €16, €17).
* **Salarii & Pachetul de Negociere**: Regula dublării salariului la victorie (Win-Bonus 2x) și costul de €900/lună pentru casă și mașină.

### 10. [Sistemul Competițional (Piramida celor 255 de Ligi & Cupa)](file:///D:/Proiecte/SoccerManagerClone/doc/competition_rules.md)
* **Piramida Competițională**: De la Divizia A (1 ligă) până la Divizia H (128 ligi).
* **Calendarul Oficial de 63 de Zile (9 Săptămâni)**: 30 de etape de ligă (Luni, Marți, Joi, Vineri la 04:00 CET).
* **Cupa Oficială**: 11 runde eliminatorii (Miercurea la 04:00 CET), fără prelungiri, doar penalty-uri.

### 11. [Obiectivele End-Game (Studiul Campioanelor din Divizia A)](file:///D:/Proiecte/SoccerManagerClone/doc/endgame_progression.md)
* **Capacitatea Maximă a Stadionului**: 160.000 de locuri, 50.000 locuri de parcare, 1.600 toalete, 320 baruri.
* **Plafonul Jucătorilor de Top**: Vârsta de aur (26 - 31 ani), calitate globală maximă de 76 - 77.5%, Line Rating de 154 de puncte per post.

### 12. [Planul de Implementare Tehnică & Arhitectură](file:///D:/Proiecte/SoccerManagerClone/doc/implementation_plan.md)
* **Tech Stack**: Next.js (React), Tailwind CSS / Vanilla CSS, Node.js / Python API, PostgreSQL.
* **Schema Bazei de Date**: Tabelele `users`, `teams`, `players`, `stadiums`, `staff`, `matches`, `transfers`, `finances`.

### 13. [Psihologia Jucătorului și Factori de Viață (Hidden Events)](file:///D:/Proiecte/SoccerManagerClone/doc/factori_de_viata_si_psihologie.md)
* **Moral și Personalitate**: Axa de profesionalism și rezistență la stres a jucătorilor.
* **Evenimente Extra-Fotbalistice**: Beție, probleme de familie, gagicăreală, scandaluri mondene care adaugă buffs și debuffs ascunse (impact pe Moral și Condiție Fizică).
* **Impactul Strategic**: Forțează managerul să se adapteze la situații umane imprevizibile (conducerea lotului "dincolo de numere").

### 14. [Balansul Antrenamentului, Mecanica „Ruletei” (+10 / -10) și Riscul](file:///D:/Proiecte/SoccerManagerClone/doc/balans_antrenament_si_ruleta_simularii.md)
* **Intensități de Antrenament**: De la Regenerare (-2% fitness) la Extrem/Overload (-28% fitness, progres accelerat).
* **Mecanica Ruletei (+10 / -10)**: Fluctuația ascunsă zilnică/orară; forțarea limitelor aduce riscul de prăbușire bruscă a randamentului sau lovitura de grație.
* **Echilibrul Gestionat de Manager**: Managerul monitorizează semnalele din UI (Medical Briefing, Barometrul de Burnout) și alege când să forțeze sau să protejeze lotul.
* **Staff-ul Auxiliar și Cursurile de Licențiere**: Rolul medicului, maseurului, psihologului și îngrijitorului; compromisul trimiterii la cursuri (absență temporară vs. competență superioară).
* **Vreme Extremă & Întâmplări Reale**: Teren mlăștinos, ploaie, soția și copiii la meci, vedete pe jumbotron, underdog momentum.

### 15. [Dezvoltarea Juniorilor: Triunghiul Echilibrului și Tranziția la Seniori](file:///D:/Proiecte/SoccerManagerClone/doc/dezvoltare_juniori_si_triunghiul_echilibrului.md)
* **Triunghiul Echilibrului (GBI)**: Armonia dintre Școală/Educație (disciplină și viziune), Viață Personală/Familie (stabilitate psihică) și Antrenament Fotbalistic (calități motrice).
* **Șansa de Super-Vedetă**: Cu cât echilibrul este mai aproape de proporția optimă (30/30/40), cu atât șansele de a scoate un talent generațional (Ballon d'Or) cresc spre 95%.
* **Debutul la Seniori**: Victoria aduce creștere exponențială de experiență (+250% XP) și moral maxim (100%), în timp ce înfrângerea oferă învățare moderată sau stagnare temporară, fără regres traumatizant dacă echipa are psiholog.

### 16. [Sistemul de Scouting, Perioada de Probe și Echilibrul Simulării](file:///D:/Proiecte/SoccerManagerClone/doc/sistem_scouting_probe_si_echilibrul_simularii.md)
* **Atributele Scouterului**: JPA (Abilitate Curentă), JPP (Potențial Viitor) și Profilare Psihologică (detectare caracter/vicii ascunse); marja de eroare scade odată cu calificarea scouterului.
* **Perioada de Probe (Trials 7-14 zile)**: Testarea gratuită a jucătorilor necunoscuți în amicale și antrenamente pentru a le dezvălui atributele reale înainte de a semna un contract.
* **Mecanica Hit vs. Flop**: De ce eșuează talentele mari (complacere după contract gras, dor de casă, presiunea așteptărilor, erori de scouting).
* **Echilibrul Motorului (Anti-Scoruri Uriașe)**: Legea randamentelor descrescătoare (logaritmic), spiritul de sacrificiu al echipelor mici (Park-the-bus), relaxarea periculoasă a giganților și curba realistă a scorurilor europene.

### 17. [Sistemul de Arbitraj, Corupția și Meciurile Aranjate (Blaturile)](file:///D:/Proiecte/SoccerManagerClone/doc/arbitraj_si_mecanica_coruptiei.md)
* **Profilul Arbitrilor**: Severitate (0-100), Integritate Morală (0-100) și vulnerabilitatea la presiunea tribunelor/gazdelor (Home bias).
* **Cumpărarea Arbitrului (Mita din Fonduri Secrete)**: Scoaterea de bani negri din vistieria clubului pentru a influența deciziile cheie (penalty-uri inventate, goluri anulate rivalilor, toleranță la faulturi).
* **Înțelegerea pentru Egal („Biscotto” / Blatul)**: Pactul secret de non-agresiune între două echipe care au nevoie de un punct (posesie sterilă, dueluri simulate, risc de revoltă a jucătorilor profesioniști).
* **Comisia de Disciplină și Riscul Judiciar**: Anchete federale, anularea rezultatelor (0-3 la masa verde), depunctări severe (-9 până la -15 puncte) și retrogradare forțată.

### 18. [Războiul Psihologic, Manipularea Presei și Culisele Fotbalului](file:///D:/Proiecte/SoccerManagerClone/doc/razboi_psihologic_presa_si_secrete_fotbal.md)
* **Manipularea Mediei (Black PR)**: Articole comandate și zvonuri false de transfer ("Tapping-Up") lansate în săptămâna meciului direct pentru a destabiliza vedeta adversă.
* **Șicane Pre-Meci de Hotel**: Artificii la ora 03:00 sub geamul oaspeților (reducere de stamina în prima repriză) și autocar blocat pe traseu.
* **Spionaj Tactic („Spygate”)**: Drone trimise la antrenamentele secrete adverse pentru a contracara schemele la faze fixe.
* **„Valiza cu Bani” (Premierea Terților)**: Stimularea financiară a unei echipe mici („La Prima”) pentru a juca pe viață și pe moarte împotriva rivalului tău la titlu.

### 19. [Enciclopedia Situațiilor din Viața Reală și Dramele Fotbalului](file:///D:/Proiecte/SoccerManagerClone/doc/enciclopedie_situatii_reale_si_drame_fotbal.md)
* **Factori de Mediu & Atmosferă**: Altitudinea extremă (La Paz 3.600m), fumigenele care opresc meciul, laserul verde în ochii portarului, viscolul și mingea portocalie.
* **Drame Interne & Relația cu Patronul**: Patronul care coboară la pauză în vestiar, bisericuțele etnice, greva salariilor neplătite, săparea antrenorului tiranic.
* **Bizarerii pe Teren**: Fundașul intrat în poartă după eliminarea portarului (efectul Cosmin Moți), scărița Panenka eșuată penibil, accidentarea grotescă la bucuria golului, câinele pe teren.
* **Mistere & Rețele Sociale**: Cazul Ronaldo Paris 1998, livestream-ul clandestin pe TikTok din vestiar, despărțirile de pe Instagram.

### 20. [Balansul Matematic și Cadrul de Prevenire a Scorurilor Astronomice](file:///D:/Proiecte/SoccerManagerClone/doc/balans_matematic_si_anti_scoruri_astronomice.md)
* **Cei 5 Piloni Anti-Blowout**: Compresia forțelor prin funcție sigmoidă ($k=0.045$), plafonarea tempoului la 18-26 ocazii totale pe meci, blocul defensiv jos („Park-the-Bus”), relaxarea involuntară a favoritului la 3-0 („Foot-off-the-Gas”) și bravura portarului.
* **Distribuția Statistică Realistă**: 75% meciuri strânse (1-0, 2-1, 1-1), 18% victorii clare (3-0, 3-1), scorurile de peste 5 goluri limitate la sub 1.9%, iar scorurile de maidan (10-0+) blocate matematic (0.000%).

### 21. [Jurnalul de Descoperiri, Idei (Bune și Rele) și Cazuri Limită](file:///D:/Proiecte/SoccerManagerClone/doc/jurnal_descoperiri_si_idei_dezvoltare.md)
* **Jurnal Tehnic Continuu**: Consemnarea în timp real a soluțiilor inginerești (ex: arhitectura Time-Travel cu Snapshots pentru zero desincronizare React 19).
* **Idei Bune vs. Idei Proaste Analizate**: Mecanica golului de onoare vs. respingerea afișării calculelor brute în timpul fazei sau a schimbărilor abuzive în prelungiri.
* **Tabelul Centralizator al Ideilor**: Evidența statusului fiecărei propuneri (Implementată, În Curs, De Implementat, Respinsă).







