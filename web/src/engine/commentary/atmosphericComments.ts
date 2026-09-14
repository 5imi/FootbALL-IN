import { Team, Referee, MatchEvent } from '../types';
import { PlayerPickers } from './playerPickers';

export interface CommentaryExtraContext {
  biscottoActive?: boolean;
  scoutSpottedMinute?: number;
  weatherCondition?: string;
  pitchCondition?: string;
  fanInvasionOccurred?: boolean;
  tacticalSubsDone?: number;
  heatedProtestOccurred?: boolean;
}

/**
 * Generează comentarii dinamice de atmosferă, evenimente narative speciale
 * (scout în tribună, proteste, incidente meteo, invazie de teren, schimbări, dueluri tactice).
 */
export function generateAtmosphericComment(
  min: number,
  homeTeam: Team,
  awayTeam: Team,
  homeGoals: number,
  awayGoals: number,
  homeMomentum: number,
  awayMomentum: number,
  referee: Referee,
  rng: () => number,
  pickers: PlayerPickers,
  extraContext?: CommentaryExtraContext
): MatchEvent | undefined {
  const isHome = rng() < 0.55;
  const attTeam = isHome ? homeTeam : awayTeam;
  const defTeam = isHome ? awayTeam : homeTeam;
  const { pickAttacker, pickMidfielder, pickDefender, pickGoalkeeper } = pickers;

  // 1. Răsturnare de ritm / Asalt furios dacă există momentum ridicat
  if ((homeMomentum >= 10 || awayMomentum >= 10) && rng() < 0.35) {
    const momentumTeam = homeMomentum >= awayMomentum ? homeTeam : awayTeam;
    const defendingTeam = momentumTeam.id === homeTeam.id ? awayTeam : homeTeam;
    return {
      id: `evt-atm-${min}`,
      minute: min,
      type: 'MOMENTUM_SHIFT',
      teamId: momentumTeam.id,
      description: [
        `🌪️ ASALT FURIOS! ${momentumTeam.name} simte deruta adversarului și forțează poarta cu toate liniile! Centrare după centrare în careul lui ${defendingTeam.shortName}!`,
        `🌪️ PRESIUNE INFERNALĂ! ${momentumTeam.shortName} asediază careul advers! Stadionul e un vulcan, golul plutește în aer!`,
        `🌪️ RĂSTURNARE DE DINAMICĂ! ${momentumTeam.shortName} domină categoric fiecare duel la mijlocul terenului și împinge adversarul în propria jumătate!`,
        `🌪️ OFENSIVĂ TOTALĂ! ${momentumTeam.shortName} atacă val după val! Apărarea lui ${defendingTeam.shortName} e la limită, se clatină la fiecare centrare!`,
        `🌪️ INFERN PE TEREN! ${momentumTeam.shortName} nu lasă adversarului nicio clipă de respiro! Pasele curg cu o viteză amețitoare!`,
      ][Math.floor(rng() * 5)],
      scoreAfter: [homeGoals, awayGoals],
      isHighlight: true,
    };
  }

  // 2. SCOUT SPOTTED — un jucător observă un selecționer în tribună (unic per meci, min 25-70)
  if (extraContext?.scoutSpottedMinute === min) {
    const scoutTeam = rng() < 0.5 ? homeTeam : awayTeam;
    const ambitiousPlayer = pickAttacker(scoutTeam);
    const bigClubs = [
      'AC Milan', 'Inter Milano', 'Juventus', 'FC Barcelona', 'Real Madrid',
      'Bayern München', 'PSG', 'Manchester City', 'Liverpool', 'Chelsea'
    ];
    const scoutClub = bigClubs[Math.floor(rng() * bigClubs.length)];
    return {
      id: `evt-scout-${min}`,
      minute: min,
      type: 'SCOUT_SPOTTED',
      teamId: scoutTeam.id,
      playerName: ambitiousPlayer,
      description: [
        `🔭 SCOUT ÎN TRIBUNĂ! Se zvonește că un emisar de la ${scoutClub} a fost observat în loja VIP! ${ambitiousPlayer} (${scoutTeam.shortName}) pare că joacă cu o energie suplimentară de când a aflat!`,
        `🔭 PRIVIRI DIN LOJĂ! ${ambitiousPlayer} aruncă priviri spre tribunele superioare. Conform jurnaliștilor de pe margine, un selecționer de la ${scoutClub} urmărește meciul! Se anunță o a doua repriză pe viață și pe moarte!`,
        `🔭 INFORMAȚII DIN CULISE! Sursele din presă confirmă: un scout de la ${scoutClub} este în stadion să-l urmărească pe ${ambitiousPlayer}! Colegii de pe bancă îi strigă: „Arată ce poți!"`,
      ][Math.floor(rng() * 3)],
      scoreAfter: [homeGoals, awayGoals],
      isHighlight: true,
    };
  }

  // 3. Incident de peluză / Scandări (14%)
  if (rng() < 0.14) {
    return {
      id: `evt-atm-${min}`,
      minute: min,
      type: 'CROWD_CHANT',
      description: [
        `📢 SPECTACOL ÎN TRIBUNE! Peluza lui ${homeTeam.shortName} aprinde torțe și cântă neîncetat. Atmosferă incendiară pe ${homeTeam.stadium}!`,
        `📢 REVOLTĂ ÎN PELUZĂ! Fanii gazdelor fluieră vehement o decizie a arbitrului ${referee.name}, punând o presiune colosală pe brigadă!`,
        `📢 GALERIA CÂNTĂ! Fanii celor de la ${awayTeam.shortName} se aud superb din sectorul oaspete, susținându-și favoriții în momentele grele.`,
        `📢 SCANDĂRI DIN TRIBUNE! Întreg stadionul cântă la unison, ritmul pe teren este electrizant!`,
        `📢 TORȚE ÎN PELUZĂ! Ultrașii gazdelor au aprins fumigene colorate! Meciul este întrerupt câteva secunde pentru că fumul invadează suprafața de joc!`,
        `📢 COREGRAFIE SPECTACULOASĂ! Peluza gazdelor desfășoară o coregrafie impresionantă cu steaguri uriașe! Jucătorii lui ${homeTeam.shortName} aplaudă galeria!`,
        `📢 VUVUZELE ȘI TOBE! Fanfara din tribună creează o atmosferă de cupă! ${awayTeam.shortName} simte presiunea enormă a galeriei adverse!`,
      ][Math.floor(rng() * 7)],
      scoreAfter: [homeGoals, awayGoals],
    };
  }

  // 4. Întrerupere medicală / Crampe (10%)
  if (rng() < 0.10 && min > 20) {
    const injured = pickMidfielder(defTeam);
    return {
      id: `evt-atm-${min}`,
      minute: min,
      type: 'INJURY_STOPPAGE',
      description: [
        `🚑 ÎNTRERUPERE TEMPORARĂ! ${injured} rămâne întins pe gazon după un duel aerian tare. Medicii intervin cu spray rece, iar jucătorul își revine în aplauze.`,
        `🚑 CRAMPE PE FINAL! ${injured} acuză dureri musculare după un efort prelungit. Arbitrul ${referee.name} oprește cronometrul pentru îngrijiri.`,
        `🚑 MOMENT DE GROAZĂ! ${injured} (${defTeam.shortName}) se prăbușește fără minge! Colegii fac semn disperat spre bancă! Din fericire, e doar o crampe severă.`,
        `🚑 INTERVENȚIE MEDICALĂ! ${injured} este tratat pe margine după un contact dur. Se pregătește apă și gheață pe bancă, antrenorul discută cu al doilea.`,
      ][Math.floor(rng() * 4)],
      scoreAfter: [homeGoals, awayGoals],
    };
  }

  // 5. Schimbare tactică (8%, doar după minutul 55, max 3 per meci)
  if (rng() < 0.08 && min > 55 && (extraContext?.tacticalSubsDone ?? 0) < 3) {
    const subTeam = rng() < 0.5 ? homeTeam : awayTeam;
    const outPlayer = pickMidfielder(subTeam);
    const inPlayer = pickAttacker(subTeam);
    const scoreDiff = homeGoals - awayGoals;
    const isLosing = (subTeam.id === homeTeam.id && scoreDiff < 0) || (subTeam.id === awayTeam.id && scoreDiff > 0);
    return {
      id: `evt-sub-${min}`,
      minute: min,
      type: 'TACTICAL_SUB',
      teamId: subTeam.id,
      description: [
        `🔄 SCHIMBARE TACTICĂ! Antrenorul lui ${subTeam.shortName} scoate pe ${outPlayer} și introduce pe ${inPlayer}! ${isLosing ? 'Semnal clar: se merge pe atac total!' : 'Se caută mai mult echilibru în centru.'}`,
        `🔄 MIȘCARE DE PE BANCĂ! ${subTeam.shortName} face o tripla schimbare! ${outPlayer} părăsește terenul vizibil nemulțumit. ${inPlayer} intră cu multă energie! ${isLosing ? 'Totul sau nimic!' : 'Se controlează ritmul meciului.'}`,
        `🔄 SEMNAL DE PE BANCĂ! ${outPlayer} este chemat la margine, ${inPlayer} intră în locul său. Antrenorul lui ${subTeam.shortName} gesticulează nervos, cerând o altă dinamică!`,
      ][Math.floor(rng() * 3)],
      scoreAfter: [homeGoals, awayGoals],
      isHighlight: true,
    };
  }

  // 6. Proteste vehemente (6%, la scor strâns, min 40+)
  if (rng() < 0.06 && min > 40 && Math.abs(homeGoals - awayGoals) <= 1 && !extraContext?.heatedProtestOccurred) {
    const protestTeam = rng() < 0.55 ? awayTeam : homeTeam;
    const captain = pickDefender(protestTeam);
    return {
      id: `evt-protest-${min}`,
      minute: min,
      type: 'HEATED_PROTEST',
      teamId: protestTeam.id,
      playerName: captain,
      description: [
        `😡 PROTESTE VEHEMENTE! ${captain} (${protestTeam.shortName}), căpitanul echipei, aleargă către arbitrul ${referee.name} contestând o decizie! Colegii îl înconjoară pe central! Momente tensionate!`,
        `😡 SCANDAL PE TEREN! Jucătorii lui ${protestTeam.shortName} protestează în cor! ${captain} arată cu mâna spre ecranul VAR cerând reverificarea fazei! ${referee.name} rămâne inflexibil!`,
        `😡 NERVI LA COTĂ MAXIMĂ! ${captain} lovește cu pumnul într-un panou publicitar de frustrare! Antrenorul lui ${protestTeam.shortName} strigă de pe margine: „Hoțule!"`,
      ][Math.floor(rng() * 3)],
      scoreAfter: [homeGoals, awayGoals],
      isHighlight: true,
    };
  }

  // 7. Incident meteo & gazon (8% în condiții grele)
  if (rng() < 0.08 && min > 15 && min < 80) {
    if (extraContext?.weatherCondition === 'RAIN' || extraContext?.pitchCondition === 'MUDDY') {
      return {
        id: `evt-weather-${min}`,
        minute: min,
        type: 'WEATHER_INCIDENT',
        description: [
          `⛈️ PLOAIE TORENȚIALĂ! Gazonul a devenit o mocirlă! Mingea se oprește brusc în bălți, jucătorii alunecă la fiecare schimbare de direcție! Spectacol cu bune și rele!`,
          `⛈️ FULGER DEASUPRA STADIONULUI! Ploaia se intensifică dramatic! Arbitrul ${referee.name} consultă delegatul meciului — se joacă în continuare, dar condițiile sunt infernale!`,
          `🌊 TEREN DESFUNDAT! Jocul tehnic de pase scurte este complet anulat de noroi! Echipele sunt forțate să arunce mingi lungi de luptă!`,
        ][Math.floor(rng() * 3)],
        scoreAfter: [homeGoals, awayGoals],
        isHighlight: true,
      };
    } else if (extraContext?.weatherCondition === 'SNOW' || extraContext?.pitchCondition === 'FROZEN') {
      return {
        id: `evt-weather-${min}`,
        minute: min,
        type: 'WEATHER_INCIDENT',
        description: [
          `❄️ VISCOL ȘI MINGE PORTOCALIE! Ninsoarea deasă acoperă liniile terenului! Arbitrul ${referee.name} cere degajarea careurilor cu lopețile!`,
          `🥶 TEREN ÎNGHEȚAT BOCNĂ! Jucătorii abia își mențin echilibrul pe crampoane, fiecare duel fizic se lasă cu alunecări spectaculoase!`,
          `❄️ VÂNT TĂIOS ȘI TEMPERATURĂ SUB ZERO! Rezervele dârdâie pe bancă sub pături groase, meciul s-a transformat într-o bătălie de sacrificiu!`,
        ][Math.floor(rng() * 3)],
        scoreAfter: [homeGoals, awayGoals],
        isHighlight: true,
      };
    } else if (extraContext?.weatherCondition === 'FOG') {
      return {
        id: `evt-weather-${min}`,
        minute: min,
        type: 'WEATHER_INCIDENT',
        description: [
          `🌫️ CEAȚĂ DEASĂ PE STADION! Vizibilitatea scade de la o poartă la alta! Portarul vede mingea doar în ultimul moment la șuturile de la distanță!`,
          `🌫️ PERDEA DE CEAȚĂ! Asistenții au dificultăți uriașe la semnalizarea ofsaidului! Tensiunea crește pe bancă!`,
        ][Math.floor(rng() * 2)],
        scoreAfter: [homeGoals, awayGoals],
        isHighlight: true,
      };
    }
  }

  // 8. Fan invasion / Incident tribună (2%, foarte rar, max 1 per meci)
  if (rng() < 0.02 && min > 30 && !extraContext?.fanInvasionOccurred) {
    return {
      id: `evt-fan-${min}`,
      minute: min,
      type: 'FAN_INVASION',
      description: [
        `🏃 SUPORTER PE TEREN! Un fan a sărit gardurile și aleargă spre jucători! Stewarzii îl urmăresc prin tot careul de joc! Meciul este întrerupt 2 minute. Arbitrul ${referee.name} dă semn de reluare!`,
        `🏃 INCIDENT ÎN TRIBUNE! O altercație între galerii provoacă intervenția jandarmeriei! Meciul continuă, dar tensiunea este palpabilă pe ${homeTeam.stadium}!`,
        `🏃 HAOS ÎN TRIBUNE! Fanii aruncă obiecte pe teren! Arbitrul ${referee.name} amenință cu suspendarea meciului! Delegatul FRF coboară la vestiare pentru o discuție de urgență cu reprezentanții galeriilor!`,
      ][Math.floor(rng() * 3)],
      scoreAfter: [homeGoals, awayGoals],
      isHighlight: true,
    };
  }

  // 9. Dramă de ultim minut (8%, doar min 85+)
  if (rng() < 0.08 && min >= 85) {
    const dramaTeam = rng() < 0.5 ? homeTeam : awayTeam;
    const heroPlayer = pickAttacker(dramaTeam);
    return {
      id: `evt-drama-${min}`,
      minute: min,
      type: 'DRAMA_LASTMIN',
      description: [
        `⏱️ CRONOMETRUL SE SCURGE! ${dramaTeam.shortName} aruncă toți jucătorii în atac! Portarul a urcat la corner! Nebunie totală pe ${homeTeam.stadium}!`,
        `⏱️ MOMENTE DRAMATICE! ${heroPlayer} (${dramaTeam.shortName}) cade în careu după un contact cu fundașul advers! Toată lumea cere penalty! ${referee.name} face semn să se continue!`,
        `⏱️ ULTIMELE SECUNDE! Mingea se plimbă nervos în careul de 16 metri! ${heroPlayer} prinde o jumătate de voleu care trece milimetric pe lângă bară! Ce final de meci!`,
        `⏱️ TRAGERE DE TIMP! ${dramaTeam.id === homeTeam.id ? awayTeam.shortName : homeTeam.shortName} trage de timp cu fiecare aruncare de la margine! Publicul fluieră isteric!`,
      ][Math.floor(rng() * 4)],
      scoreAfter: [homeGoals, awayGoals],
      isHighlight: true,
    };
  }

  // 10. Dueluri tactice și faze de joc
  const attacker = pickAttacker(attTeam);
  const midfielder = pickMidfielder(attTeam);
  const defender = pickDefender(defTeam);
  const goalkeeper = pickGoalkeeper(defTeam);

  const comments = [
    `⚔️ Duel crâncen la mijloc! ${midfielder} (${attTeam.shortName}) câștigă o minge disputată și deschide jocul pe banda dreaptă.`,
    `🛡️ Intervenție la sacrificiu! ${defender} (${defTeam.shortName}) blochează cu o alunecare impecabilă o pasă decisivă a lui ${attacker}.`,
    `🧤 Ieșire sigură de portar! ${goalkeeper} (${defTeam.shortName}) prinde cu siguranță centrarea periculoasă trimisă în careul mic.`,
    `💨 Dribling încântător! ${attacker} trece în viteză de adversarul direct pe aripă, dar centrarea este respinsă cu capul de defensivă.`,
    `🚩 Fanion ridicat! ${attacker} pleacă cu o fracțiune de secundă prea devreme, iar tușierul semnalizează ofsaid.`,
    `🧱 Zid de netrecut! Șutul expediat de la 20 de metri de ${midfielder} este blocat cu pieptul de fundașii centrali.`,
    `🔁 Presing coordonat! ${attTeam.shortName} recuperează rapid balonul în jumătatea adversă și construiește cu răbdare.`,
    `📣 Indicații tactice de pe bancă! Antrenorul lui ${attTeam.shortName} cere mai multă viteză de pasare și deschiderea jocului pe extreme.`,
    `🎯 Pase scurte, ritmice! ${attTeam.shortName} construiește un atac tip „tiki-taka" cu 15 pase consecutive! ${defTeam.shortName} aleargă după minge fără s-o atingă!`,
    `🦶 Tunnel spectaculos! ${attacker} trece mingea printre picioarele lui ${defender} provocând o explozie de aplauze în tribune!`,
    `🏃 Sprint devastator pe contră! ${attacker} fuge 50 de metri cu balonul la picior, dar ultima pasă este interceptată magistral de ${defender}!`,
    `📐 Schimbare de flanc impecabilă! ${midfielder} trimite o pasă de 40 de metri care găsește perfect extrema! Mingea călătorește ca un proiectil teledirijat!`,
    `🤝 Capitanul strânge echipa! Căpitanul lui ${defTeam.shortName} adună toți jucătorii într-un cerc rapid pentru a transmite instrucțiuni. Se simte că echipa vrea o altă abordare!`,
    `🎭 Simulare în careu! ${attacker} cade teatral după un contact minim! ${referee.name} nu se lasă păcălit și indică lovitură liberă pentru ${defTeam.shortName}!`,
    `🏋️ Duel fizic colosal! ${defender} și ${attacker} se împing corp la corp timp de 10 secunde pe marginea careului! Arbitrul lasă jocul să curgă!`,
    `👀 Jucător nemulțumit pe bancă! Un rezervist al lui ${attTeam.shortName} gesitculează nervos, vizibil frustrat că nu a fost introdus. Camera TV îl surprinde!`,
    `🎪 Fază de manual! O combinație la doi-trei între ${midfielder} și ${attacker} destramă linia defensivă, dar ultimul „touch" îi trădează pe atacanți!`,
    `🌡️ Tensiune crescândă! Duelurile devin din ce în ce mai aprige pe măsură ce se apropie finalul! ${referee.name} face semn cu mâinile: „Calmați-vă!"`,
    `📊 Posesie sterilă! ${attTeam.shortName} domină balonul dar nu reușește să pătrundă în zona de decizie. Fundașii lui ${defTeam.shortName} stau compact!`,
    `🗣️ Comunicare pe teren! Se aud strigătele jucătorilor: „DESCHIDEȚI!", „LINIE!", „PRESING SUS!" — un meci în care tacticianul face diferența!`,
    `⚡ Contraatac fulger! ${defTeam.shortName} recuperează balonul la centru și pleacă în viteză cu trei jucători! Pasa finală este greșită de milimetri!`,
    `🎶 Stadionul fredoanează imnul echipei! Atmosfera este electrizantă pe ${homeTeam.stadium}, iar jucătorii simt fiecare vibrație din tribune!`,
  ];

  // Comentarii speciale pentru biscotto activ (când jocul e suspect de plat)
  if (extraContext?.biscottoActive) {
    const biscottoComments = [
      `🥱 Pasivitate la mijlocul terenului! Niciunul dintre atacanți nu pare că vrea cu adevărat mingea. Fiecare pasă lungă este trimisă direct în brațele portarului!`,
      `😐 Ritmul meciului a scăzut dramatic! Se plimbă mingea la linia de centru fără nicio intenție ofensivă. Publicul începe să fluiere!`,
      `🤔 Antrenorul secundar notează ceva pe tabletă cu o expresie suspicioasă... Jurnaliștii de pe margine încep să-și pună întrebări!`,
      `💤 Al 10-lea minut consecutiv fără o ocazie de gol! Analiștii TV vor avea mult material de discutat la pauză despre „intensitatea" acestui meci!`,
      `🕳️ GOL INEXISTENT! ${attacker} ajunge singur la 6 metri dar trimite incredibil pe lângă poartă! Ratare sau... altceva? Tribunele murmură!`,
    ];
    if (rng() < 0.40) {
      return {
        id: `evt-atm-${min}`,
        minute: min,
        type: 'COMMENT',
        description: biscottoComments[Math.floor(rng() * biscottoComments.length)],
        scoreAfter: [homeGoals, awayGoals],
      };
    }
  }

  return {
    id: `evt-atm-${min}`,
    minute: min,
    type: 'COMMENT',
    description: comments[Math.floor(rng() * comments.length)],
    scoreAfter: [homeGoals, awayGoals],
  };
}
