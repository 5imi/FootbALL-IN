'use client';

import React, { useState } from 'react';
import { MatchHistoryEntry } from './MatchResultsView';

export interface MatchEvent {
  minute: number;
  type: 'GOAL' | 'YELLOW' | 'RED' | 'SUB_ON' | 'MISSED_PENALTY' | 'PENALTY_GOAL' | 'OWN_GOAL';
  teamSide: 'home' | 'away';
  player: string;
  assist?: string;
  description?: string;
}

export interface MatchPlayerRating {
  name: string;
  position: string;
  rating: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutePlayed: number;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  offsides: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export interface FullMatchReport {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  roundName: string;
  type: 'L' | 'C' | 'A';
  stadium: string;
  attendance: number;
  referee: string;
  weather: string;
  homeFormation: string;
  awayFormation: string;
  events: MatchEvent[];
  homeLineup: MatchPlayerRating[];
  awayLineup: MatchPlayerRating[];
  stats: MatchStats;
  manOfTheMatch: string;
  coachComment: string;
}

function generateReport(match: MatchHistoryEntry): FullMatchReport {
  const isHomeForesta = match.homeTeamName.includes('Foresta');

  const forestaLineup: MatchPlayerRating[] = [
    { name: 'D. Dragota', position: 'GK', rating: 7.2, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'T. Ene', position: 'RB', rating: 6.8, goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutePlayed: 90 },
    { name: 'M. Barbu', position: 'CB', rating: 7.0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'A. Popa', position: 'CB', rating: 6.5, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'R. Ionescu', position: 'LB', rating: 7.1, goals: 0, assists: 1, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'V. Tanase', position: 'CM', rating: 7.8, goals: 1, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'B. Miron', position: 'CM', rating: 6.9, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 75 },
    { name: 'C. Pavel', position: 'CAM', rating: 7.3, goals: 0, assists: 1, yellowCards: 0, redCards: 0, minutePlayed: 85 },
    { name: 'L. Nedelea', position: 'RF', rating: 8.1, goals: match.homeScore > 0 ? Math.min(isHomeForesta ? match.homeScore : match.awayScore, 2) : 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'M. Savu', position: 'CF', rating: 7.4, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'G. Belodedici', position: 'LF', rating: 6.7, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 82 },
  ];

  const opponentLineup: MatchPlayerRating[] = [
    { name: 'K. Balogh', position: 'GK', rating: 6.1, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'J. Novak', position: 'RB', rating: 6.5, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'P. Kratky', position: 'CB', rating: 6.8, goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutePlayed: 90 },
    { name: 'F. Horvath', position: 'CB', rating: 6.2, goals: isHomeForesta ? (match.awayScore > 0 ? 1 : 0) : (match.homeScore > 0 ? 1 : 0), assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'L. Koval', position: 'LB', rating: 5.9, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'T. Blazek', position: 'CM', rating: 6.7, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'M. Varga', position: 'CM', rating: 6.0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 80 },
    { name: 'J. Sedlak', position: 'CAM', rating: 6.4, goals: 0, assists: 1, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'R. Molnar', position: 'RF', rating: 6.9, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
    { name: 'D. Kovar', position: 'CF', rating: 5.8, goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutePlayed: 75 },
    { name: 'P. Benes', position: 'LF', rating: 6.1, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutePlayed: 90 },
  ];

  const homeLineup = isHomeForesta ? forestaLineup : opponentLineup;
  const awayLineup = isHomeForesta ? opponentLineup : forestaLineup;

  const forestaGoals = isHomeForesta ? match.homeScore : match.awayScore;
  const opponentGoals = isHomeForesta ? match.awayScore : match.homeScore;

  const events: MatchEvent[] = [];
  const goalMinutes = [12, 23, 34, 45, 56, 67, 78, 89, 93];
  let gIdx = 0;

  for (let i = 0; i < forestaGoals; i++) {
    events.push({
      minute: goalMinutes[gIdx++ % goalMinutes.length],
      type: i % 3 === 2 ? 'PENALTY_GOAL' : 'GOAL',
      teamSide: isHomeForesta ? 'home' : 'away',
      player: i === 0 ? 'L. Nedelea' : i === 1 ? 'V. Tanase' : 'M. Savu',
      assist: i === 0 ? 'C. Pavel' : i === 1 ? 'R. Ionescu' : undefined,
    });
  }
  for (let i = 0; i < opponentGoals; i++) {
    events.push({
      minute: goalMinutes[(gIdx + 2) % goalMinutes.length],
      type: 'GOAL',
      teamSide: isHomeForesta ? 'away' : 'home',
      player: i === 0 ? 'F. Horvath' : 'R. Molnar',
    });
    gIdx++;
  }

  events.push({ minute: 38, type: 'YELLOW', teamSide: isHomeForesta ? 'away' : 'home', player: 'P. Kratky' });
  if (match.homeScore + match.awayScore > 3) {
    events.push({ minute: 71, type: 'YELLOW', teamSide: isHomeForesta ? 'home' : 'away', player: 'T. Ene' });
  }
  events.push({ minute: 63, type: 'SUB_ON', teamSide: isHomeForesta ? 'home' : 'away', player: 'I. Andrei', description: 'a intrat pentru B. Miron' });
  events.push({ minute: 75, type: 'SUB_ON', teamSide: isHomeForesta ? 'away' : 'home', player: 'Z. Petrak', description: 'a intrat pentru D. Kovar' });
  events.sort((a, b) => a.minute - b.minute);

  const forestaPossession = Math.min(68, Math.max(35, 50 + (forestaGoals - opponentGoals) * 4));
  const homePossession = isHomeForesta ? forestaPossession : 100 - forestaPossession;

  return {
    matchId: match.id,
    homeTeam: match.homeTeamName,
    awayTeam: match.awayTeamName,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    date: match.date,
    roundName: match.roundName,
    type: match.type,
    stadium: isHomeForesta ? 'Stadionul Municipal Suceava' : 'Stadionul Adversarului',
    attendance: 3800,
    referee: 'I. Kovacs (Romania)',
    weather: 'Partial noros, 18 C',
    homeFormation: isHomeForesta ? '4-3-3' : '4-4-2',
    awayFormation: isHomeForesta ? '4-4-2' : '4-3-3',
    events,
    homeLineup,
    awayLineup,
    stats: {
      possession: [homePossession, 100 - homePossession],
      shots: [isHomeForesta ? 14 + forestaGoals : 8 + opponentGoals, isHomeForesta ? 8 + opponentGoals : 14 + forestaGoals],
      shotsOnTarget: [isHomeForesta ? 6 + forestaGoals : 3 + opponentGoals, isHomeForesta ? 3 + opponentGoals : 6 + forestaGoals],
      corners: [isHomeForesta ? 7 : 4, isHomeForesta ? 4 : 7],
      fouls: [14, 17],
      offsides: [isHomeForesta ? 2 : 3, isHomeForesta ? 3 : 2],
      yellowCards: [isHomeForesta ? 1 : 1, isHomeForesta ? 1 : 0],
      redCards: [0, 0],
    },
    manOfTheMatch: forestaGoals > 0 ? 'L. Nedelea' : 'D. Dragota',
    coachComment: forestaGoals > opponentGoals
      ? 'Victorie meritata! Echipa a demonstrat caracter si determinare.'
      : forestaGoals === opponentGoals
      ? 'Punct castigat in deplasare. Trebuia sa finalizam mai bine ocaziile create.'
      : 'Infrangere dureroasa. Trebuie sa analizam atent ce s-a intamplat.',
  };
}

function RatingBadge({ rating }: { rating: number }) {
  const color = rating >= 8 ? 'bg-emerald-600 text-white' :
                rating >= 7 ? 'bg-blue-600 text-white' :
                rating >= 6 ? 'bg-amber-600 text-white' :
                'bg-rose-700 text-white';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md font-black font-mono text-xs ${color}`}>
      {rating.toFixed(1)}
    </span>
  );
}

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-bold">
        <span className="text-blue-400">{home}</span>
        <span className="text-zinc-400 text-[10px] uppercase tracking-wider">{label}</span>
        <span className="text-zinc-300">{away}</span>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden flex">
        <div className="bg-blue-500 h-full" style={{ width: `${homePct}%` }} />
        <div className="bg-zinc-600 h-full flex-1" />
      </div>
    </div>
  );
}

function EventIcon({ type }: { type: MatchEvent['type'] }) {
  if (type === 'GOAL') return <span>&#9917;</span>;
  if (type === 'PENALTY_GOAL') return <span>&#127919;</span>;
  if (type === 'OWN_GOAL') return <span className="text-rose-400">OG</span>;
  if (type === 'MISSED_PENALTY') return <span className="text-zinc-500">X</span>;
  if (type === 'YELLOW') return <span className="inline-block w-3 h-4 bg-amber-400 rounded-sm align-middle" />;
  if (type === 'RED') return <span className="inline-block w-3 h-4 bg-red-600 rounded-sm align-middle" />;
  if (type === 'SUB_ON') return <span className="text-emerald-400">&#8593;</span>;
  return null;
}

function LineupTable({ players, teamName, formation, isForesta }: {
  players: MatchPlayerRating[];
  teamName: string;
  formation: string;
  isForesta: boolean;
}) {
  const posColor = (pos: string) => {
    if (pos === 'GK') return 'bg-orange-900/70 text-orange-300 border border-orange-700/50';
    if (['CB', 'RB', 'LB', 'SW'].includes(pos)) return 'bg-cyan-900/70 text-cyan-300 border border-cyan-700/50';
    if (['CM', 'CAM', 'CDM', 'DM'].includes(pos)) return 'bg-green-900/70 text-green-300 border border-green-700/50';
    return 'bg-blue-900/70 text-blue-300 border border-blue-700/50';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className={`font-bold text-sm ${isForesta ? 'text-blue-400' : 'text-zinc-200'}`}>{teamName}</div>
        <span className="font-mono text-xs text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{formation}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-wider">
              <th className="py-2 px-3 text-left">Jucator</th>
              <th className="py-2 px-2 text-center">Pos</th>
              <th className="py-2 px-2 text-center">Not.</th>
              <th className="py-2 px-2 text-center">G</th>
              <th className="py-2 px-2 text-center">A</th>
              <th className="py-2 px-2 text-center">GBen</th>
              <th className="py-2 px-2 text-center">Min.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {players.map((p, i) => (
              <tr key={i} className={`hover:bg-zinc-900/80 transition ${p.rating >= 8 ? 'bg-emerald-950/20' : ''}`}>
                <td className="py-2 px-3 font-semibold text-zinc-200">{p.name}</td>
                <td className="py-2 px-2 text-center">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${posColor(p.position)}`}>
                    {p.position}
                  </span>
                </td>
                <td className="py-2 px-2 text-center"><RatingBadge rating={p.rating} /></td>
                <td className="py-2 px-2 text-center font-mono font-bold text-emerald-400">{p.goals > 0 ? p.goals : '-'}</td>
                <td className="py-2 px-2 text-center font-mono text-blue-400">{p.assists > 0 ? p.assists : '-'}</td>
                <td className="py-2 px-2 text-center">
                  {p.yellowCards > 0 && <span className="text-amber-400 font-bold mr-0.5">G</span>}
                  {p.redCards > 0 && <span className="text-rose-500 font-bold">R</span>}
                  {p.yellowCards === 0 && p.redCards === 0 && <span className="text-zinc-600">-</span>}
                </td>
                <td className="py-2 px-2 text-center font-mono text-zinc-400">{p.minutePlayed}&apos;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface MatchReportModalProps {
  match: MatchHistoryEntry;
  onClose: () => void;
}

export const MatchReportModal: React.FC<MatchReportModalProps> = ({ match, onClose }) => {
  const [activeSection, setActiveSection] = useState<'EVENTS' | 'STATS' | 'LINEUP_HOME' | 'LINEUP_AWAY'>('EVENTS');
  const report = generateReport(match);

  const isWin = (match.isUserHome && match.homeScore > match.awayScore) ||
                (!match.isUserHome && match.awayScore > match.homeScore);
  const isDraw = match.homeScore === match.awayScore;
  const gradientBg = isWin ? 'from-emerald-950' : isDraw ? 'from-amber-950' : 'from-rose-950';
  const resultLabel = isWin ? 'VICTORIE' : isDraw ? 'EGAL' : 'INFRANGERE';
  const resultBg = isWin ? 'bg-emerald-600 text-white' : isDraw ? 'bg-amber-500 text-black' : 'bg-rose-700 text-white';

  const sections: { id: 'EVENTS' | 'STATS' | 'LINEUP_HOME' | 'LINEUP_AWAY'; label: string }[] = [
    { id: 'EVENTS', label: 'Evenimente' },
    { id: 'STATS', label: 'Statistici' },
    { id: 'LINEUP_HOME', label: report.homeTeam },
    { id: 'LINEUP_AWAY', label: report.awayTeam },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl shadow-2xl my-4 overflow-hidden">

        {/* HEADER */}
        <div className={`relative bg-gradient-to-b ${gradientBg} via-zinc-950 to-zinc-950 p-5 sm:p-6 border-b border-zinc-800`}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-zinc-900/80 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center text-sm transition"
          >
            x
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono ${
              report.type === 'L' ? 'bg-blue-900/80 text-blue-300 border border-blue-700/50' :
              report.type === 'C' ? 'bg-amber-900/80 text-amber-300 border border-amber-700/50' :
              'bg-zinc-800 text-zinc-400 border border-zinc-700'
            }`}>
              {report.type === 'L' ? 'LIGA' : report.type === 'C' ? 'CUPA' : 'AMICAL'} - {report.roundName}
            </span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${resultBg}`}>
              {resultLabel}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-center">
            <div className="flex-1">
              <div className={`text-base sm:text-lg font-black leading-tight ${report.homeTeam.includes('Foresta') ? 'text-blue-400' : 'text-zinc-100'}`}>
                {report.homeTeam}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5 font-mono">{report.homeFormation}</div>
            </div>

            <div className="flex flex-col items-center shrink-0">
              <div className="flex items-center">
                <span className="text-4xl sm:text-5xl font-black font-mono text-white tabular-nums">{report.homeScore}</span>
                <span className="text-xl text-zinc-500 mx-2">-</span>
                <span className="text-4xl sm:text-5xl font-black font-mono text-white tabular-nums">{report.awayScore}</span>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">FT (Full Time)</div>
            </div>

            <div className="flex-1">
              <div className={`text-base sm:text-lg font-black leading-tight ${report.awayTeam.includes('Foresta') ? 'text-blue-400' : 'text-zinc-100'}`}>
                {report.awayTeam}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5 font-mono">{report.awayFormation}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-3">
            <span>Stadium: {report.stadium}</span>
            <span className="text-zinc-700">|</span>
            <span>{report.attendance.toLocaleString()} spectatori</span>
            <span className="text-zinc-700">|</span>
            <span>Arbitru: {report.referee}</span>
            <span className="text-zinc-700">|</span>
            <span>{report.weather}</span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl px-3 py-2 flex items-center gap-2">
              <span className="text-base">Star</span>
              <div>
                <div className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">Omul Meciului</div>
                <div className="text-xs text-white font-bold">{report.manOfTheMatch}</div>
              </div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2">
              <div className="text-[10px] text-zinc-300 leading-relaxed italic">&ldquo;{report.coachComment}&rdquo;</div>
            </div>
          </div>
        </div>

        {/* NAV TABS */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/80 overflow-x-auto">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex-1 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-all min-w-0 truncate ${
                activeSection === sec.id
                  ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500'
                  : 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-5 space-y-3 min-h-[200px]">

          {activeSection === 'EVENTS' && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold pb-1">
                Cronologia Meciului - {report.events.length} evenimente
              </div>
              {report.events.map((evt, idx) => {
                const isForestaSide = report.homeTeam.includes('Foresta')
                  ? evt.teamSide === 'home'
                  : evt.teamSide === 'away';
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs ${
                      evt.type === 'GOAL' || evt.type === 'PENALTY_GOAL'
                        ? 'bg-emerald-950/50 border border-emerald-500/20'
                        : evt.type === 'YELLOW'
                        ? 'bg-amber-950/30 border border-amber-700/20'
                        : evt.type === 'RED'
                        ? 'bg-rose-950/40 border border-rose-700/30'
                        : 'bg-zinc-900/70 border border-zinc-800/60'
                    }`}
                  >
                    <span className="font-mono font-black text-zinc-400 w-8 text-right shrink-0">
                      {evt.minute}&apos;
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      {isForestaSide ? (
                        <>
                          <div className="flex-1 text-right">
                            <span className="text-blue-300 font-semibold">{evt.player}</span>
                            {evt.assist && <span className="text-zinc-500 ml-1 text-[10px]">(assist: {evt.assist})</span>}
                            {evt.description && <span className="text-zinc-500 ml-1 text-[10px] italic">{evt.description}</span>}
                          </div>
                          <div className="shrink-0 w-6 text-center"><EventIcon type={evt.type} /></div>
                          <div className="flex-1" />
                        </>
                      ) : (
                        <>
                          <div className="flex-1" />
                          <div className="shrink-0 w-6 text-center"><EventIcon type={evt.type} /></div>
                          <div className="flex-1">
                            <span className="text-zinc-200 font-semibold">{evt.player}</span>
                            {evt.assist && <span className="text-zinc-500 ml-1 text-[10px]">(assist: {evt.assist})</span>}
                            {evt.description && <span className="text-zinc-500 ml-1 text-[10px] italic">{evt.description}</span>}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {report.events.length === 0 && (
                <div className="text-center py-6 text-zinc-600 text-xs">Niciun eveniment notabil.</div>
              )}
            </div>
          )}

          {activeSection === 'STATS' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-blue-400">{report.stats.possession[0]}%</span>
                  <span className="text-zinc-400 text-[10px] uppercase tracking-wider">Posesie</span>
                  <span className="text-zinc-300">{report.stats.possession[1]}%</span>
                </div>
                <div className="h-3 rounded-full bg-zinc-800 overflow-hidden flex">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full" style={{ width: `${report.stats.possession[0]}%` }} />
                  <div className="bg-zinc-500 h-full flex-1" />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>{report.homeTeam}</span>
                  <span>{report.awayTeam}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <StatBar label="Suturi" home={report.stats.shots[0]} away={report.stats.shots[1]} />
                <StatBar label="Pe poarta" home={report.stats.shotsOnTarget[0]} away={report.stats.shotsOnTarget[1]} />
                <StatBar label="Cornere" home={report.stats.corners[0]} away={report.stats.corners[1]} />
                <StatBar label="Faulturi" home={report.stats.fouls[0]} away={report.stats.fouls[1]} />
                <StatBar label="Ofsaiduri" home={report.stats.offsides[0]} away={report.stats.offsides[1]} />
                <StatBar label="Galbene" home={report.stats.yellowCards[0]} away={report.stats.yellowCards[1]} />
                <StatBar label="Rosii" home={report.stats.redCards[0]} away={report.stats.redCards[1]} />
              </div>
            </div>
          )}

          {activeSection === 'LINEUP_HOME' && (
            <LineupTable
              players={report.homeLineup}
              teamName={report.homeTeam}
              formation={report.homeFormation}
              isForesta={report.homeTeam.includes('Foresta')}
            />
          )}

          {activeSection === 'LINEUP_AWAY' && (
            <LineupTable
              players={report.awayLineup}
              teamName={report.awayTeam}
              formation={report.awayFormation}
              isForesta={report.awayTeam.includes('Foresta')}
            />
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-zinc-800 bg-zinc-900/50 px-5 py-3 flex justify-between items-center">
          <span className="text-[10px] text-zinc-600 font-mono">{report.date} - {report.roundName}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold text-xs text-white transition"
          >
            Inchide Raportul
          </button>
        </div>
      </div>
    </div>
  );
};
