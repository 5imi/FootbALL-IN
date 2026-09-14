'use client';

import React from 'react';
import { MatchStats, Team } from '../engine/types';

interface MatchStatsViewProps {
  stats: MatchStats;
  homeTeam: Team;
  awayTeam: Team;
}

export const MatchStatsView: React.FC<MatchStatsViewProps> = ({ stats, homeTeam, awayTeam }) => {
  const StatBar = ({
    label,
    homeVal,
    awayVal,
    isPercentage = false,
  }: {
    label: string;
    homeVal: number;
    awayVal: number;
    isPercentage?: boolean;
  }) => {
    const total = homeVal + awayVal;
    const homePercent = total > 0 ? (homeVal / total) * 100 : 50;

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
          <span className="font-mono text-blue-400 font-bold">
            {homeVal}
            {isPercentage ? '%' : ''}
          </span>
          <span className="uppercase tracking-wider text-zinc-400 text-[11px]">{label}</span>
          <span className="font-mono text-red-400 font-bold">
            {awayVal}
            {isPercentage ? '%' : ''}
          </span>
        </div>
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${homePercent}%` }}
          />
          <div
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${100 - homePercent}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Statistici Meci</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 font-bold text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> {homeTeam.shortName}
          </span>
          <span className="flex items-center gap-1.5 font-bold text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500" /> {awayTeam.shortName}
          </span>
        </div>
      </div>

      {/* Statistici Directe */}
      <div className="space-y-4">
        <StatBar
          label="Posesie Balon"
          homeVal={stats.possession[0]}
          awayVal={stats.possession[1]}
          isPercentage
        />
        <StatBar
          label="Șuturi Totale"
          homeVal={stats.shots[0]}
          awayVal={stats.shots[1]}
        />
        <StatBar
          label="Șuturi pe Poartă"
          homeVal={stats.shotsOnTarget[0]}
          awayVal={stats.shotsOnTarget[1]}
        />
        <StatBar
          label="Expected Goals (xG)"
          homeVal={stats.xG[0]}
          awayVal={stats.xG[1]}
        />
        <StatBar
          label="Lovituri de Colț"
          homeVal={stats.corners[0]}
          awayVal={stats.corners[1]}
        />
        <StatBar
          label="Faulturi Comise"
          homeVal={stats.fouls[0]}
          awayVal={stats.fouls[1]}
        />
        <StatBar
          label="Cartonașe Galbene"
          homeVal={stats.yellowCards[0]}
          awayVal={stats.yellowCards[1]}
        />
        <StatBar
          label="Cartonașe Roșii"
          homeVal={stats.redCards ? stats.redCards[0] : 0}
          awayVal={stats.redCards ? stats.redCards[1] : 0}
        />
      </div>

      {/* Note pe Linii (Line Ratings SPInfo) */}
      <div className="border-t border-zinc-800 pt-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
          Note pe Linii (Line Ratings)
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-zinc-950/60 p-2.5 border border-zinc-800">
            <span className="block text-zinc-500 text-[10px] uppercase font-bold">Defensivă</span>
            <div className="mt-1 font-mono font-bold">
              <span className="text-blue-400">{stats.lineRatings.home.defense}</span>
              <span className="text-zinc-600 mx-1.5">vs</span>
              <span className="text-red-400">{stats.lineRatings.away.defense}</span>
            </div>
          </div>

          <div className="rounded-lg bg-zinc-950/60 p-2.5 border border-zinc-800">
            <span className="block text-zinc-500 text-[10px] uppercase font-bold">Mijloc</span>
            <div className="mt-1 font-mono font-bold">
              <span className="text-blue-400">{stats.lineRatings.home.midfield}</span>
              <span className="text-zinc-600 mx-1.5">vs</span>
              <span className="text-red-400">{stats.lineRatings.away.midfield}</span>
            </div>
          </div>

          <div className="rounded-lg bg-zinc-950/60 p-2.5 border border-zinc-800">
            <span className="block text-zinc-500 text-[10px] uppercase font-bold">Atac</span>
            <div className="mt-1 font-mono font-bold">
              <span className="text-blue-400">{stats.lineRatings.home.attack}</span>
              <span className="text-zinc-600 mx-1.5">vs</span>
              <span className="text-red-400">{stats.lineRatings.away.attack}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
