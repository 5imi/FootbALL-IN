'use client';

import React, { useState } from 'react';
import { Team, Player } from '../engine/types';

interface PitchLineupViewProps {
  homeTeam: Team;
  awayTeam: Team;
  onSelectPlayer?: (player: Player, isForeign: boolean) => void;
}

export const PitchLineupView: React.FC<PitchLineupViewProps> = ({ homeTeam, awayTeam, onSelectPlayer }) => {
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');
  const activeTeam = selectedTeam === 'home' ? homeTeam : awayTeam;


  const renderPlayerBadge = (p: Player) => (
    <div
      key={p.id}
      onClick={() => onSelectPlayer && onSelectPlayer(p, selectedTeam === 'away')}
      className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
      title="Apasă pentru fișa completă a jucătorului (SoccerProject style)"
    >

      <div
        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-black text-white shadow-lg border border-white/20"
        style={{ backgroundColor: activeTeam.primaryColor }}
      >
        {p.number}
      </div>
      <span className="mt-1 max-w-[85px] truncate rounded bg-zinc-950/80 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
        {p.name.split(' ').slice(-1)[0]}
      </span>
      <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-300">
        <span className="text-amber-400 font-bold">{p.overall}</span>
        <span className="text-zinc-500">|</span>
        <span className="text-emerald-400">{p.position}</span>
      </div>
    </div>
  );

  const gk = activeTeam.lineup.find(p => p.position === 'GK');
  const defs = activeTeam.lineup.filter(p => ['LB', 'CB', 'RB'].includes(p.position));
  const mids = activeTeam.lineup.filter(p => ['LM', 'CM', 'RM'].includes(p.position));
  const atts = activeTeam.lineup.filter(p => ['LF', 'CF', 'RF'].includes(p.position));

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl backdrop-blur-md space-y-4">
      {/* Selector Echipă */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Așezare Tactică & Primul 11
        </h3>

        <div className="flex rounded-lg bg-zinc-950 p-1 border border-zinc-800 text-xs">
          <button
            onClick={() => setSelectedTeam('home')}
            className={`rounded-md px-3 py-1 font-bold transition-all ${
              selectedTeam === 'home'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {homeTeam.shortName} (Gazde)
          </button>
          <button
            onClick={() => setSelectedTeam('away')}
            className={`rounded-md px-3 py-1 font-bold transition-all ${
              selectedTeam === 'away'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {awayTeam.shortName} (Oaspeți)
          </button>
        </div>
      </div>

      {/* Terenul Verde Stilizat */}
      <div className="relative h-80 w-full overflow-hidden rounded-xl border border-emerald-700/50 bg-gradient-to-b from-emerald-900 via-emerald-950 to-emerald-900 p-4 shadow-inner">
        {/* Linii Teren */}
        <div className="pointer-events-none absolute inset-4 rounded border-2 border-white/20" />
        <div className="pointer-events-none absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 bg-white/20" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/20" />
        <div className="pointer-events-none absolute left-1/2 top-4 h-16 w-32 -translate-x-1/2 border-2 border-t-0 border-white/20" />
        <div className="pointer-events-none absolute left-1/2 bottom-4 h-16 w-32 -translate-x-1/2 border-2 border-b-0 border-white/20" />

        {/* Jucători pe Linii */}
        <div className="relative z-10 flex h-full flex-col justify-between py-2">
          {/* Atac */}
          <div className="flex justify-around items-center">
            {atts.map(renderPlayerBadge)}
          </div>

          {/* Mijloc */}
          <div className="flex justify-around items-center">
            {mids.map(renderPlayerBadge)}
          </div>

          {/* Apărare */}
          <div className="flex justify-around items-center">
            {defs.map(renderPlayerBadge)}
          </div>

          {/* Portar */}
          <div className="flex justify-center items-center">
            {gk && renderPlayerBadge(gk)}
          </div>
        </div>
      </div>

      {/* Info Tactică Echivalent */}
      <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800 pt-3">
        <div>
          Formație: <span className="font-bold text-white font-mono">{activeTeam.tactics.formation}</span>
        </div>
        <div>
          Stil de Joc: <span className="font-bold text-white">{activeTeam.tactics.style}</span>
        </div>
        <div>
          Agresivitate: <span className="font-bold text-amber-400 font-mono">{activeTeam.tactics.aggressiveness}%</span>
        </div>
      </div>
    </div>
  );
};
