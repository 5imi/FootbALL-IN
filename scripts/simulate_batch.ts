/**
 * Script de test: 40 meciuri între o echipă puternică și una slabă
 * Rulat cu: npx tsx scripts/simulate_batch.ts
 */
import { simulateMatch } from '../web/src/engine/matchSimulator';
import { teamProgresul, teamGloria } from '../web/src/engine/data/teams';
import { refereePool } from '../web/src/engine/data/referees';
import { Team, CorruptionConfig } from '../web/src/engine/types';

// Echipele originale echilibrate (OVR ~74 vs OVR ~74)
const teamA = teamProgresul; // PRO - PASSING
const teamB = teamGloria;    // GLO - WING_PLAY

interface SimResult {
  score: string;
  winner: string;
  referee: string;
  weather: string;
  pitch: string;
  extraTime: string;
  events: number;
  highlights: string[];
}

function runBatch(count: number): SimResult[] {
  const results: SimResult[] = [];
  for (let i = 0; i < count; i++) {
    const seed = Date.now() + i * 1337 + Math.floor(Math.random() * 99999);
    const result = simulateMatch(teamA, teamB, seed);
    const [h, a] = result.finalScore;
    const winner = h > a ? teamA.shortName : (a > h ? teamB.shortName : 'EGAL');
    
    const extraTimeEv = result.allEvents.find(e => e.type === 'EXTRA_TIME');
    const extraTimeStr = extraTimeEv?.description.match(/(\d+) minute/)?.[1] ? `+${extraTimeEv.description.match(/(\d+) minute/)?.[1]}'` : '-';

    const highlights: string[] = [];
    for (const ev of result.allEvents) {
      if (ev.type === 'WEATHER_INCIDENT') highlights.push(`[${ev.minute}'] ${ev.description.substring(0, 30)}...`);
      if (ev.type === 'RED_CARD') highlights.push(`🟥 [${ev.minute}'] ${ev.description.includes('AL DOILEA') ? '2xGalben->ROSU' : 'ROSU DIRECT'}: ${ev.playerName}`);
      if (ev.type === 'INTIMIDATION') highlights.push(`👀 [${ev.minute}'] Intimidare: ${ev.playerName}`);
      if (ev.type === 'PLAYER_BRAWL') highlights.push(`🥊🟥🟥 [${ev.minute}'] BATAIE & DUBLU ROSU!`);
      if (ev.type === 'GOAL' && ev.minute > 90) highlights.push(`🔥 GOL IN PRELUNGIRI min.${ev.minute}!`);
      if (ev.type === 'TIME_WASTING') highlights.push(`[${ev.minute}'] Tragere timp`);


    }

    results.push({
      score: `${h}-${a}`,
      winner,
      referee: result.referee.name,
      weather: result.weather,
      pitch: result.pitch,
      extraTime: extraTimeStr,
      events: result.allEvents.length,
      highlights,
    });
  }
  return results;
}

function printBatch(label: string, results: SimResult[]) {
  console.log(`\n${'='.repeat(95)}`);
  console.log(`  ${label}`);
  console.log(`${'='.repeat(95)}`);
  
  let winsA = 0, draws = 0, winsB = 0;
  let totalA = 0, totalB = 0;
  
  results.forEach((r, i) => {
    const [h, a] = r.score.split('-').map(Number);
    totalA += h; totalB += a;
    if (r.winner === teamA.shortName) winsA++;
    else if (r.winner === 'EGAL') draws++;
    else winsB++;
    
    const hl = r.highlights.length > 0 ? ` | ${r.highlights.join('; ')}` : '';
    console.log(`  #${(i+1).toString().padStart(2,'0')}  ${r.score.padStart(5)}  ${r.winner.padEnd(5)} | Prel: ${r.extraTime.padEnd(4)} | Meteo: ${r.weather.padEnd(6)} | Gazon: ${r.pitch.padEnd(8)} | Ref: ${r.referee}${hl}`);
  });
  
  console.log(`${'─'.repeat(95)}`);
  console.log(`  BILANȚ: ${teamA.shortName} ${winsA}V / ${draws}E / ${teamB.shortName} ${winsB}V  |  Goluri totale: ${totalA}-${totalB} (Medie: ${(totalA/results.length).toFixed(1)}-${(totalB/results.length).toFixed(1)})`);
}

// Rulam 10 meciuri echilibrate
console.log(`\nTEST: ECHIPE ECHILIBRATE (${teamA.name} [OVR ~74] vs ${teamB.name} [OVR ~74])`);
console.log(`Condiții meteo & stare teren active dinamic în motorul de joc.`);

printBatch('10 MECIURI ECHILIBRATE - IMPACT METEO & TEREN', runBatch(10));

console.log(`\n${'='.repeat(95)}`);
console.log('  SIMULARE FINALIZATĂ CU SUCCES!');
console.log(`${'='.repeat(95)}\n`);
