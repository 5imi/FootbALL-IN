'use client';

import React, { useState, useEffect } from 'react';
import { Team } from '../engine/types';
import { ClubFinances } from '../engine/financeEngine';
import { MatchReportModal } from './MatchReportModal';
import { PreMatchSetupModal, PreMatchSetupData } from './PreMatchSetupModal';

export interface MatchHistoryEntry {
  id: string;
  date: string;
  type: 'L' | 'C' | 'A'; // Ligă, Cupă, Amical
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  isUserHome: boolean;
  roundName: string;
  highlights?: string;
}

export interface SpyDossier {
  isUnlocked: boolean;
  cost: number;
  expectedFormation: string;
  tacticalStyle: string;
  opponentRating: number;
  weakness: {
    zone: string;
    description: string;
    targetHint: string;
  };
  keyThreat: {
    name: string;
    position: string;
    quality: number;
    danger: string;
  };
  refereeProfile: {
    name: string;
    strictness: number;
    advice: string;
  };
  weatherForecast: {
    condition: string;
    pitch: string;
    impact: string;
  };
  scoutTip: {
    recommendedPreset: 'Selecția A' | 'Selecția B' | 'Selecția C' | 'Selecția D';
    recommendedAggression: number;
    recommendedStyle: string;
    advice: string;
  };
}

export interface UpcomingFixture {
  id: string;
  date: string;
  type: 'L' | 'C' | 'A';
  home: string;
  away: string;
  round: string;
  stadium: string;
  spyReport: SpyDossier;
}

export const INITIAL_MATCH_RESULTS: MatchHistoryEntry[] = [
  {
    id: 'm-24',
    date: 'Mar 15 Sep 2026 (04:01 CET)',
    type: 'L',
    homeTeamName: 'FC BUZDEA',
    awayTeamName: 'FC Foresta',
    homeScore: 2,
    awayScore: 0,
    isUserHome: false,
    roundName: 'Etapa 24',
    highlights: 'Goluri: 23\' I. Andrei, 67\' G. Cojocaru (Penalty)'
  },
  {
    id: 'm-23',
    date: 'Lun 14 Sep 2026 (04:00 CET)',
    type: 'L',
    homeTeamName: 'FC Foresta',
    awayTeamName: 'FK TATRAN Turzovka',
    homeScore: 2,
    awayScore: 1,
    isUserHome: true,
    roundName: 'Etapa 23',
    highlights: 'Goluri: 12\' L. Nedelea, 89\' M. Savu / 45\' M. Horvath'
  },
  {
    id: 'm-22',
    date: 'Vin 11 Sep 2026 (04:00 CET)',
    type: 'L',
    homeTeamName: 'SV Kiev',
    awayTeamName: 'FC Foresta',
    homeScore: 2,
    awayScore: 6,
    isUserHome: false,
    roundName: 'Etapa 22',
    highlights: 'Spectacol total! Hat-trick L. Nedelea, dublă Belodedici'
  },
  {
    id: 'm-21',
    date: 'Joi 10 Sep 2026 (04:00 CET)',
    type: 'L',
    homeTeamName: 'FC Foresta',
    awayTeamName: 'Washington D.C.',
    homeScore: 3,
    awayScore: 2,
    isUserHome: true,
    roundName: 'Etapa 21',
    highlights: 'Gol dramatic marcat în minutul 90+4 de V. Tanase'
  },
  {
    id: 'm-20',
    date: 'Mier 09 Sep 2026 (04:00 CET)',
    type: 'L',
    homeTeamName: 'CS Mioveni',
    awayTeamName: 'FC Foresta',
    homeScore: 1,
    awayScore: 1,
    isUserHome: false,
    roundName: 'Etapa 20',
    highlights: 'Remiză albă până în min 78, goluri rapide pe final'
  },
  {
    id: 'm-19',
    date: 'Mar 08 Sep 2026 (04:00 CET)',
    type: 'L',
    homeTeamName: 'FC Foresta',
    awayTeamName: 'Rapid Viena B',
    homeScore: 4,
    awayScore: 0,
    isUserHome: true,
    roundName: 'Etapa 19',
    highlights: 'Meci perfect fără gol primit, D. Dragota penalty apărat'
  }
];

export const INITIAL_UPCOMING_FIXTURES: UpcomingFixture[] = [
  {
    id: 'up-25',
    date: 'Joi 17 Sep 2026 (04:00 CET)',
    type: 'L',
    home: 'FC Foresta',
    away: 'Spartak Trnava',
    round: 'Etapa 25',
    stadium: 'Stadionul Municipal',
    spyReport: {
      isUnlocked: true,
      cost: 2500,
      expectedFormation: '4-3-3',
      tacticalStyle: 'Pe aripi (Wing Play)',
      opponentRating: 73,
      weakness: {
        zone: 'Flancul Stâng Advers (Fundaș LB)',
        description: 'Fundașul stânga titular este suspendat; joacă o rezervă de 18 ani cu doar 58% condiție fizică și viteză modestă.',
        targetHint: 'Forțați atacurile pe banda dreaptă (RF / RM). Trageți la colțul lung!'
      },
      keyThreat: {
        name: 'Miroslav Kovač',
        position: 'CF (Atacant Central)',
        quality: 81,
        danger: 'A marcat 14 goluri în acest sezon; periculos la cornere și centrări aeriene. Necesită marcaj om-la-om.'
      },
      refereeProfile: {
        name: 'Alexandru Tudor (România)',
        strictness: 88,
        advice: 'Severitate foarte mare (88%)! Nu depășiți 50-55% agresivitate în Selecție, altfel riscați eliminare rapidă.'
      },
      weatherForecast: {
        condition: 'Ploaie Torențială 🌧️',
        pitch: 'Gazon Umed & Alunecos',
        impact: 'Portarii scapă ușor șuturile joase; forțați șuturi de la distanță.'
      },
      scoutTip: {
        recommendedPreset: 'Selecția A',
        recommendedAggression: 50,
        recommendedStyle: 'Pe aripi (Wing Play)',
        advice: 'Trimiteți o extremă rapidă pe dreapta pentru a exploata rezerva adversă. Mențineți joc curat pentru a nu fi taxați de arbitru!'
      }
    }
  },
  {
    id: 'up-26',
    date: 'Vin 18 Sep 2026 (04:00 CET)',
    type: 'L',
    home: 'Polonia Varșovia',
    away: 'FC Foresta',
    round: 'Etapa 26',
    stadium: 'Stadionul Poloniei',
    spyReport: {
      isUnlocked: false,
      cost: 2500,
      expectedFormation: '5-4-1',
      tacticalStyle: 'Zid defensiv & Contra-atac',
      opponentRating: 75,
      weakness: {
        zone: 'Mijlocul Terenului (Lentoare la Repliere)',
        description: 'Mijlocașii lor centrali au peste 33 de ani; în repriza a doua le scade drastic rezistența.',
        targetHint: 'Practicați posesie prelungită (Pase Scurte) pentru a-i epuiza fizic.'
      },
      keyThreat: {
        name: 'Jan Lewandowski',
        position: 'RF (Extremă Dreaptă)',
        quality: 79,
        danger: 'Sprint exploziv pe contra-atac. Nu permiteți fundașului stânga să urce neacoperit!'
      },
      refereeProfile: {
        name: 'Paweł Gil (Polonia)',
        strictness: 42,
        advice: 'Arbitru permisiv (42% severitate), tolerează jocul dur. Puteți urca agresivitatea la 70-75%!'
      },
      weatherForecast: {
        condition: 'Soare Arzător ☀️',
        pitch: 'Gazon Uscat',
        impact: 'Căldura crește consumul de stamina (+20% oboseală).'
      },
      scoutTip: {
        recommendedPreset: 'Selecția B',
        recommendedAggression: 70,
        recommendedStyle: 'Pase scurte (Posesie)',
        advice: 'Jucați agresiv fizic și țineți de minge. Golurile vor veni în ultimele 30 de minute când ei cedează.'
      }
    }
  },
  {
    id: 'up-cup',
    date: 'Lun 21 Sep 2026 (14:00 CET)',
    type: 'C',
    home: 'FC Foresta',
    away: 'Dinamo București',
    round: 'Optimi Cupa SP',
    stadium: 'Stadionul Municipal',
    spyReport: {
      isUnlocked: false,
      cost: 2500,
      expectedFormation: '3-5-2',
      tacticalStyle: 'Presing Total Ofensiv',
      opponentRating: 78,
      weakness: {
        zone: 'Spatele Liniei de 3 Fundași',
        description: 'Fundașii lor laterali urcă la atac și lasă bulevarde libere pe contra-atac.',
        targetHint: 'Mingea lungă pe spațiile libere din flancuri va genera ocazii 1-la-1 cu portarul!'
      },
      keyThreat: {
        name: 'Cătălin Mărginean',
        position: 'CM (Playmaker)',
        quality: 84,
        danger: 'Coordonează toate fazele ofensive și execută impecabil loviturile libere.'
      },
      refereeProfile: {
        name: 'István Kovács (România)',
        strictness: 76,
        advice: 'Severitate ridicată (76%). Sancționează rapid orice protest.'
      },
      weatherForecast: {
        condition: 'Vânt Puternic 💨',
        pitch: 'Gazon Rapid',
        impact: 'Centrările înalte pot fi deviate imprevizibil de vânt.'
      },
      scoutTip: {
        recommendedPreset: 'Selecția C',
        recommendedAggression: 60,
        recommendedStyle: 'Contra-atac rapid',
        advice: 'Așezați o defensivă compactă și lansați contra-atacuri tăioase în spatele liniei lor de 3.'
      }
    }
  }
];

interface MatchResultsViewProps {
  userTeam: Team;
  finances?: ClubFinances;
  onFinancesUpdate?: (newFinances: ClubFinances) => void;
  onOpenMatchDetails?: (matchId: string) => void;
  onNavigateToTactics?: () => void;
}

export const MatchResultsView: React.FC<MatchResultsViewProps> = ({
  userTeam,
  finances,
  onFinancesUpdate,
  onOpenMatchDetails,
  onNavigateToTactics,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'RESULTS' | 'UPCOMING' | 'ARCHIVE'>('RESULTS');
  const [selectedMatch, setSelectedMatch] = useState<MatchHistoryEntry | null>(null);
  const [upcomingMatches, setUpcomingMatches] = useState<UpcomingFixture[]>(INITIAL_UPCOMING_FIXTURES);
  const [activeDossier, setActiveDossier] = useState<{ match: UpcomingFixture; dossier: SpyDossier } | null>(null);
  const [spyNotification, setSpyNotification] = useState<string | null>(null);
  const [setupFixture, setSetupFixture] = useState<UpcomingFixture | null>(null);
  const [confirmedSetups, setConfirmedSetups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const confirmed: Record<string, boolean> = {};
      upcomingMatches.forEach(f => {
        if (localStorage.getItem(`footballin_prematch_${f.id}`)) {
          confirmed[f.id] = true;
        }
      });
      setConfirmedSetups(confirmed);
    }
  }, [upcomingMatches]);

  const teamName = userTeam?.name || 'FC Foresta';

  const handleUnlockSpyReport = (matchId: string) => {
    const cost = 2500;
    if (finances && finances.balance < cost) {
      setSpyNotification(`❌ Fonduri insuficiente! Clubul are nevoie de €${cost.toLocaleString()} pentru trimiterea spionului.`);
      return;
    }

    if (finances && onFinancesUpdate) {
      onFinancesUpdate({
        ...finances,
        balance: finances.balance - cost
      });
    }

    setUpcomingMatches(prev => prev.map(f => {
      if (f.id !== matchId) return f;
      const updated = {
        ...f,
        spyReport: {
          ...f.spyReport,
          isUnlocked: true
        }
      };
      setActiveDossier({ match: updated, dossier: updated.spyReport });
      return updated;
    }));

    setSpyNotification('🕵️ SPION TRIMIS! Raportul secret de analiză a fost descărcat cu succes în dosar!');
  };

  return (
    <div className="space-y-6 font-sans text-zinc-200">
      
      {/* ─── Antet Secțiune Rezultate ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl space-y-4">
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-emerald-600/10 blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-2xl shadow-lg border border-blue-500/30">
              📅
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
                Istoric &amp; Calendar Competițional &bull; Divizia A
              </div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                <span>Rezultate ({teamName})</span>
                <span className="rounded bg-emerald-950/80 text-emerald-400 px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-emerald-800/60">
                  Etapa 24
                </span>
              </h2>
            </div>
          </div>

          {/* Butoane Navigare Stil SoccerProject */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('RESULTS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                activeSubTab === 'RESULTS'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
              }`}
            >
              Meciuri Jucate
            </button>
            <button
              onClick={() => setActiveSubTab('UPCOMING')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
                activeSubTab === 'UPCOMING'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
              }`}
            >
              <span>Meciuri Viitoare</span>
              <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full">
                SPIONI
              </span>
            </button>
            <button
              onClick={() => setActiveSubTab('ARCHIVE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                activeSubTab === 'ARCHIVE'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
              }`}
            >
              Arhivă
            </button>
          </div>
        </div>
      </div>

      {/* Alert Notificare Spionaj */}
      {spyNotification && (
        <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center justify-between">
          <span>{spyNotification}</span>
          <button 
            onClick={() => setSpyNotification(null)}
            className="text-[10px] px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 text-zinc-300"
          >
            Închide
          </button>
        </div>
      )}

      {/* ─── Tabelul de Meciuri Jucate (Format Fidel SoccerProject) ─── */}
      {activeSubTab === 'RESULTS' && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-[220px]">Data &amp; Ora</th>
                  <th className="py-3 px-3 text-center w-[60px]" title="L = Ligă, C = Cupă, A = Amical">Tip</th>
                  <th className="py-3 px-4 text-right">Gazde</th>
                  <th className="py-3 px-4 text-center w-[120px]">Scor</th>
                  <th className="py-3 px-4 text-left">Oaspeți</th>
                  <th className="py-3 px-4 text-right w-[90px]">Detalii</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {INITIAL_MATCH_RESULTS.map((match) => {
                  const isWin = (match.isUserHome && match.homeScore > match.awayScore) || (!match.isUserHome && match.awayScore > match.homeScore);
                  const isDraw = match.homeScore === match.awayScore;

                  return (
                    <tr 
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className="hover:bg-zinc-800/50 transition cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-mono text-zinc-300 text-[11px] whitespace-nowrap">
                        {match.date}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          match.type === 'L' ? 'bg-blue-950 text-blue-400 border border-blue-800/80' : 'bg-amber-950 text-amber-400 border border-amber-800/80'
                        }`}>
                          {match.type}
                        </span>
                      </td>

                      <td className={`py-3 px-4 text-right font-bold ${
                        match.homeTeamName.includes('Foresta') ? 'text-blue-400' : 'text-zinc-200'
                      }`}>
                        {match.homeTeamName}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg font-mono font-black text-sm shadow-inner border ${
                          isWin 
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60' 
                            : isDraw 
                            ? 'bg-amber-950/80 text-amber-400 border-amber-800/60' 
                            : 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                        }`}>
                          {match.homeScore} - {match.awayScore}
                        </span>
                      </td>

                      <td className={`py-3 px-4 text-left font-bold ${
                        match.awayTeamName.includes('Foresta') ? 'text-blue-400' : 'text-zinc-200'
                      }`}>
                        {match.awayTeamName}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="text-[11px] text-zinc-400 group-hover:text-blue-400 font-semibold transition">
                          Raport &rarr;
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bară Acțiuni sub tabel exact ca în SoccerProject */}
          <div className="bg-zinc-950/90 border-t border-zinc-800 p-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveSubTab('UPCOMING')}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 transition"
            >
              Meciuri viitoare
            </button>
            <button
              onClick={() => alert('Toate meciurile din Sezonul 1 au fost afișate.')}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 transition"
            >
              Mai multe
            </button>
            <button
              onClick={() => setActiveSubTab('ARCHIVE')}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 transition"
            >
              Arhiva
            </button>
          </div>
        </div>
      )}

      {/* ─── Vizualizare Meciuri Viitoare cu Rapoarte de Spionaj & Hint-uri ─── */}
      {activeSubTab === 'UPCOMING' && (
        <div className="space-y-4">
          {/* Banner Didactic Spionaj */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕵️</span>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  Departamentul de Spionaj Tactic &bull; Inteligență Pre-Meci
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                    SCOUTING HINTS
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Scouterii noștri monitorizează antrenamentele rivalilor, găsesc punctele slabe ale defensivei lor și evaluează strictețea arbitrului delegat.
                </p>
              </div>
            </div>

            <div className="text-[11px] font-mono text-zinc-400 shrink-0">
              Buget club: <strong className="text-emerald-400">€{(finances?.balance || 5000000).toLocaleString()}</strong>
            </div>
          </div>

          <div className="space-y-3">
            {upcomingMatches.map((fix) => {
              const spy = fix.spyReport;
              return (
                <div 
                  key={fix.id}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/90 p-5 shadow-xl space-y-4 hover:border-zinc-700 transition"
                >
                  {/* Header Meci */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-blue-400 font-bold bg-blue-950/60 px-2.5 py-1 rounded border border-blue-800/60">
                        {fix.round}
                      </span>
                      <div>
                        <div className="font-bold text-white text-base">
                          <span className={fix.home.includes('Foresta') ? 'text-blue-400' : 'text-white'}>{fix.home}</span>
                          <span className="text-zinc-500 font-normal mx-2">vs</span>
                          <span className={fix.away.includes('Foresta') ? 'text-blue-400' : 'text-white'}>{fix.away}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          🏟️ {fix.stadium} &bull; 🕒 {fix.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {confirmedSetups[fix.id] && (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/50 flex items-center gap-1 shadow-sm">
                          <span>✓</span>
                          <span>Echipă Confirmată</span>
                        </span>
                      )}

                      <button
                        onClick={() => setSetupFixture(fix)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition shadow-md shadow-blue-950/50"
                      >
                        <span>⚙️</span>
                        <span>Setează Echipa (SP)</span>
                      </button>

                      <span className="text-xs font-semibold text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded-lg border border-zinc-700/60">
                        04:00 CET
                      </span>
                    </div>
                  </div>

                  {/* Zona de Spionaj & Hint-uri Rapide */}
                  {spy.isUnlocked ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {/* Hint 1: Punct Slab */}
                        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/20 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-red-400 font-bold text-[10px] uppercase">
                            <span>🎯</span> Punct Slab Identificat
                          </div>
                          <div className="font-semibold text-zinc-200 text-[11px] truncate" title={spy.weakness.zone}>
                            {spy.weakness.zone}
                          </div>
                          <div className="text-[10px] text-zinc-400 line-clamp-1">
                            {spy.weakness.targetHint}
                          </div>
                        </div>

                        {/* Hint 2: Vedeta Adversă */}
                        <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px] uppercase">
                            <span>⭐</span> Pericolul #1
                          </div>
                          <div className="font-semibold text-zinc-200 text-[11px]">
                            {spy.keyThreat.name} ({spy.keyThreat.position})
                          </div>
                          <div className="text-[10px] text-amber-300 font-mono">
                            Calitate: {spy.keyThreat.quality}% ★
                          </div>
                        </div>

                        {/* Hint 3: Arbitrul */}
                        <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/20 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-sky-400 font-bold text-[10px] uppercase">
                            <span>⚖️</span> Arbitru Delegat
                          </div>
                          <div className="font-semibold text-zinc-200 text-[11px] truncate">
                            {spy.refereeProfile.name}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            Strictețe: <strong className="text-sky-300">{spy.refereeProfile.strictness}%</strong>
                          </div>
                        </div>

                        {/* Hint 4: Recomandare Tactică */}
                        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase">
                            <span>💡</span> Sfat Tactic Spion
                          </div>
                          <div className="font-semibold text-emerald-300 text-[11px]">
                            {spy.scoutTip.recommendedPreset} ({spy.scoutTip.recommendedStyle})
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            Agresivitate optimă: <strong className="text-white">{spy.scoutTip.recommendedAggression}%</strong>
                          </div>
                        </div>
                      </div>

                      {/* Buton Deschidere Dosar Complet */}
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => setActiveDossier({ match: fix, dossier: spy })}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold transition shadow-sm"
                        >
                          <span>🕵️</span>
                          <span>Deschide Dosarul Secret de Spionaj &bull; Detalii Complete</span>
                          <span>&rarr;</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Când spionul nu este încă trimis */
                    <div className="p-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg text-zinc-500">
                          🔒
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-300">
                            Raportul de Spionaj este blocat pentru această etapă
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            Trimite un scouter la baza de antrenament a celor de la {fix.away} pentru a afla tactica și punctele slabe.
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUnlockSpyReport(fix.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xs transition shadow-md shadow-amber-950/50 self-start sm:self-auto shrink-0"
                      >
                        <span>🕵️</span>
                        <span>Trimite Spionul (€{spy.cost.toLocaleString()})</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Vizualizare Arhivă ─── */}
      {activeSubTab === 'ARCHIVE' && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl text-center space-y-3">
          <div className="text-3xl">🏛️</div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Arhiva Sezoanelor FootbALL-IN</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Clubul se află în primul sezon competițional oficial (Sezonul 1 - Divizia A). La încheierea celor 30 de etape, toate statisticile, golgheterii și meciurile vor fi arhivate aici permanent.
          </p>
        </div>
      )}

      {/* ─── Modal Dosar Secret de Spionaj Tactic (Top Secret Report) ─── */}
      {activeDossier && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-950 border border-amber-500/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header Dosar Secret */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🕵️</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">
                      DOSAR SECRET DE SPIONAJ TACTIC
                    </h3>
                    <span className="rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-black px-2 py-0.5 uppercase tracking-wider">
                      TOP SECRET &bull; CONFIDENȚIAL
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Meci: <strong className="text-white">{activeDossier.match.home} vs {activeDossier.match.away}</strong> ({activeDossier.match.round})
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setActiveDossier(null)}
                className="text-zinc-400 hover:text-white text-sm w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Secțiunea 1: Analiză Adversar */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span>📋</span> Așezare &amp; Stil Tactic Adversar
              </div>
              <div className="grid grid-cols-3 gap-3 text-center pt-1">
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">Formație Estimată</div>
                  <div className="text-sm font-black text-white">{activeDossier.dossier.expectedFormation}</div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">Stil de Joc</div>
                  <div className="text-sm font-black text-blue-400">{activeDossier.dossier.tacticalStyle}</div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">Rating Global Lot</div>
                  <div className="text-sm font-black text-emerald-400">{activeDossier.dossier.opponentRating}%</div>
                </div>
              </div>
            </div>

            {/* Secțiunea 2: Punctul Slab & Vedeta Adversă */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Punct Slab */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                <div className="text-xs font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>🎯</span> Punct Slab Detectat
                </div>
                <div className="font-bold text-xs text-white">
                  {activeDossier.dossier.weakness.zone}
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {activeDossier.dossier.weakness.description}
                </p>
                <div className="p-2 rounded-lg bg-black/40 border border-red-500/20 text-[10px] text-red-200 font-semibold">
                  💡 {activeDossier.dossier.weakness.targetHint}
                </div>
              </div>

              {/* Vedeta Adversă */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>⭐</span> Vedeta Periculoasă a Rivalului
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">
                    {activeDossier.dossier.keyThreat.name} ({activeDossier.dossier.keyThreat.position})
                  </span>
                  <span className="font-mono text-xs font-black text-amber-400">
                    {activeDossier.dossier.keyThreat.quality}% ★
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {activeDossier.dossier.keyThreat.danger}
                </p>
                <div className="p-2 rounded-lg bg-black/40 border border-amber-500/20 text-[10px] text-amber-200 font-semibold">
                  🛡️ Avertisment: Mențineți un CB cu viteză și marcaj strict pe acest jucător!
                </div>
              </div>
            </div>

            {/* Secțiunea 3: Arbitrul & Vremea */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Arbitru */}
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <div className="font-bold text-sky-400 flex items-center justify-between">
                  <span>⚖️ Arbitru Delegat</span>
                  <span className="font-mono text-white">{activeDossier.dossier.refereeProfile.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-400">Strictețe:</span>
                  <div className="flex-1 bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        activeDossier.dossier.refereeProfile.strictness > 75 ? 'bg-red-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${activeDossier.dossier.refereeProfile.strictness}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-[10px] text-zinc-200">
                    {activeDossier.dossier.refereeProfile.strictness}%
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  {activeDossier.dossier.refereeProfile.advice}
                </p>
              </div>

              {/* Meteo */}
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <div className="font-bold text-zinc-300 flex items-center justify-between">
                  <span>🌦️ Prognoză Meteo &amp; Gazon</span>
                  <span className="text-zinc-200 font-semibold">{activeDossier.dossier.weatherForecast.condition}</span>
                </div>
                <div className="text-[10px] text-zinc-400">
                  Stare teren: <strong className="text-white">{activeDossier.dossier.weatherForecast.pitch}</strong>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  {activeDossier.dossier.weatherForecast.impact}
                </p>
              </div>
            </div>

            {/* Secțiunea 4: Recomandarea Tactică a Scouterului Șef */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-teal-950/40 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span>💡</span> Recomandarea Oficială a Scouterului Șef
                </span>
                <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30">
                  {activeDossier.dossier.scoutTip.recommendedPreset}
                </span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {activeDossier.dossier.scoutTip.advice}
              </p>
              <div className="flex items-center gap-4 text-xs pt-1 border-t border-emerald-500/20">
                <span className="text-zinc-400">
                  Agresivitate optimă: <strong className="text-emerald-300">{activeDossier.dossier.scoutTip.recommendedAggression}%</strong>
                </span>
                <span className="text-zinc-400">
                  Stil de joc optim: <strong className="text-emerald-300">{activeDossier.dossier.scoutTip.recommendedStyle}</strong>
                </span>
              </div>
            </div>

            {/* Buton Închidere / Acțiune Rapidă */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              {onNavigateToTactics ? (
                <button
                  onClick={() => {
                    setActiveDossier(null);
                    onNavigateToTactics();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/30"
                >
                  <span>📋</span>
                  <span>Mergi la Primul 11 &amp; Configurează {activeDossier.dossier.scoutTip.recommendedPreset}</span>
                </button>
              ) : <div />}

              <button
                onClick={() => setActiveDossier(null)}
                className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold text-xs text-white transition"
              >
                Închide Dosarul
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Raport Meci Complet (SP-Style) ─── */}
      {selectedMatch && (
        <MatchReportModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* ─── Modal Setare Pre-Meci & Pariuri (SP-Style) ─── */}
      {setupFixture && (
        <PreMatchSetupModal
          isOpen={!!setupFixture}
          onClose={() => setSetupFixture(null)}
          fixture={{
            id: setupFixture.id,
            round: setupFixture.round,
            home: setupFixture.home,
            away: setupFixture.away,
            date: setupFixture.date,
            stadium: setupFixture.stadium,
            referee: {
              name: setupFixture.spyReport.refereeProfile.name,
              strictness: setupFixture.spyReport.refereeProfile.strictness,
            },
            opponentTacticsHint: setupFixture.spyReport.isUnlocked ? setupFixture.spyReport.scoutTip.recommendedStyle : undefined,
          }}
          userTeam={userTeam}
          finances={finances || null}
          onSaveSetup={(setupData) => {
            setConfirmedSetups(prev => ({ ...prev, [setupData.matchId]: true }));
          }}
        />
      )}

    </div>
  );
};
