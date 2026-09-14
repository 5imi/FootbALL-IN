'use client';

import React from 'react';
import { LeagueStandingRow } from '../engine/types';

interface LeagueTableViewProps {
  standings: LeagueStandingRow[];
  matchHistory: { home: string; away: string; score: [number, number] }[];
}

export const LeagueTableView: React.FC<LeagueTableViewProps> = ({ standings, matchHistory }) => {
  // Sortare după puncte, apoi golaveraj, apoi goluri marcate
  const sorted = [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    return b.goalsFor - a.goalsFor;
  });

  return (
    <div className="space-y-6">
      {/* Clasament Oficial Divizia Prototip */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-xl backdrop-blur-md">
        <div className="border-b border-zinc-800 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Superliga Prototip — Divizia A (2 Echipe)
            </h3>
            <p className="text-xs text-zinc-400">Duel direct meci de meci între rivale</p>
          </div>
          <span className="rounded bg-blue-950 border border-blue-800/60 px-2.5 py-1 text-xs font-semibold text-blue-300">
            Sezonul 1 Activ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Echipă</th>
                <th className="py-3 px-3 text-center">M</th>
                <th className="py-3 px-3 text-center">V</th>
                <th className="py-3 px-3 text-center">E</th>
                <th className="py-3 px-3 text-center">Î</th>
                <th className="py-3 px-3 text-center">GM</th>
                <th className="py-3 px-3 text-center">GP</th>
                <th className="py-3 px-3 text-center">G</th>
                <th className="py-3 px-4 text-center font-bold text-white">Pct</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              {sorted.map((row, index) => (
                <tr
                  key={row.teamId}
                  className={`hover:bg-zinc-800/40 transition-colors ${
                    index === 0 ? 'bg-emerald-950/10' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center font-bold font-mono">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                        index === 0
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'text-zinc-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2.5">
                    <span
                      className="inline-block h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: row.primaryColor }}
                    />
                    <span>{row.teamName}</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">({row.shortName})</span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">{row.played}</td>
                  <td className="py-3.5 px-3 text-center font-mono text-emerald-400 font-bold">{row.won}</td>
                  <td className="py-3.5 px-3 text-center font-mono text-zinc-400">{row.drawn}</td>
                  <td className="py-3.5 px-3 text-center font-mono text-rose-400">{row.lost}</td>
                  <td className="py-3.5 px-3 text-center font-mono">{row.goalsFor}</td>
                  <td className="py-3.5 px-3 text-center font-mono">{row.goalsAgainst}</td>
                  <td
                    className={`py-3.5 px-3 text-center font-mono font-bold ${
                      row.goalDiff > 0
                        ? 'text-emerald-400'
                        : row.goalDiff < 0
                        ? 'text-rose-400'
                        : 'text-zinc-400'
                    }`}
                  >
                    {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-sm font-black text-amber-400">
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Istoric Meciuri Simulate în Sesiune */}
      {matchHistory.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Istoricul Meciurilor Directe Jucate ({matchHistory.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {matchHistory.map((m, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-zinc-950/70 border border-zinc-800/80 px-3 py-2 text-xs"
              >
                <span className="font-semibold text-zinc-300">Meciul #{idx + 1}</span>
                <span className="font-mono font-bold text-white bg-zinc-800/80 px-2 py-0.5 rounded">
                  {m.score[0]} - {m.score[1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
