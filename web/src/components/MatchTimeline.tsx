'use client';

import React from 'react';
import { MatchEvent, Team } from '../engine/types';

interface MatchTimelineProps {
  currentMinute: number;
  timelineEvents: MatchEvent[];
  homeTeam: Team;
  awayTeam: Team;
  extraTime?: number;
}

export const MatchTimeline: React.FC<MatchTimelineProps> = ({
  currentMinute,
  timelineEvents,
  homeTeam,
  extraTime = 0,
}) => {
  const totalDuration = 90 + extraTime;
  // Filtrăm evenimentele petrecute până la minutul curent
  const visibleEvents = timelineEvents.filter(e => e.minute <= currentMinute);

  const getEventIcon = (type: MatchEvent['type']) => {
    switch (type) {
      case 'GOAL': return '⚽';
      case 'PENALTY': return '🎯';
      case 'YELLOW_CARD': return '🟨';
      case 'RED_CARD': return '🟥';
      case 'WOODWORK': return '💥';
      case 'GREAT_SAVE': return '🧤';
      case 'VAR_DECISION': return '📺';
      case 'MOMENTUM_SHIFT': return '🌪️';
      case 'COUNTER_ATTACK': return '⚡';
      case 'BENCH_CLASH': return '🥊';
      case 'BRIBED_DECISION': return '💼';
      case 'SUSPICIOUS_PASSIVITY': return '😴';
      case 'BISCOTTO_BETRAYAL': return '🗡️';
      case 'SCOUT_SPOTTED': return '🔭';
      case 'TACTICAL_SUB': return '🔄';
      case 'HEATED_PROTEST': return '😡';
      case 'WEATHER_INCIDENT': return '⛈️';
      case 'FAN_INVASION': return '🏃';
      case 'DRAMA_LASTMIN': return '⏱️';
      case 'EXTRA_TIME': return '⏱️';
      case 'HALF_TIME': return '⏸️';
      case 'FULL_TIME': return '🏁';
      default: return '📍';
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
        <span>Timeline Evenimente Meci</span>
        <span className="font-mono text-zinc-400">
          {currentMinute > 90 ? `90+${currentMinute - 90}'` : `${currentMinute}'`} / {extraTime > 0 ? `90+${extraTime}'` : `90'`}
        </span>
      </div>

      {/* Bara Orizontală de Progres */}
      <div className="relative my-6 h-3 w-full rounded-full bg-zinc-800">
        {/* Fill de progres */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, (currentMinute / totalDuration) * 100)}%` }}
        />

        {/* Marcaj Pauză */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-zinc-600" 
          style={{ left: `${(45 / totalDuration) * 100}%` }}
        />
        <span 
          className="absolute -top-5 -translate-x-1/2 font-mono text-[10px] text-zinc-500"
          style={{ left: `${(45 / totalDuration) * 100}%` }}
        >
          45&apos;
        </span>

        {/* Marcaj 90' dacă există prelungiri */}
        {extraTime > 0 && (
          <>
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-amber-500/70" 
              style={{ left: `${(90 / totalDuration) * 100}%` }}
            />
            <span 
              className="absolute -top-5 -translate-x-1/2 font-mono text-[10px] text-amber-400 font-bold"
              style={{ left: `${(90 / totalDuration) * 100}%` }}
            >
              90&apos;
            </span>
          </>
        )}

        {/* Punctele de Eveniment */}
        {visibleEvents.map((evt) => {
          const leftPercent = Math.min(97, Math.max(3, (evt.minute / totalDuration) * 100));
          const isHome = evt.teamId === homeTeam.id;

          const isCorruptionEvt = evt.isCorruption ||
            evt.type === 'BRIBED_DECISION' ||
            evt.type === 'BISCOTTO_BETRAYAL' ||
            evt.type === 'SUSPICIOUS_PASSIVITY';

          return (
            <div
              key={evt.id}
              className={`group absolute -translate-x-1/2 transition-transform hover:scale-125 ${
                isHome ? '-top-7' : '-bottom-7'
              }`}
              style={{ left: `${leftPercent}%` }}
            >
              <div
                className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs shadow-md border ${
                  isCorruptionEvt
                    ? 'border-red-500 bg-red-950/90 ring-2 ring-red-500/50 animate-pulse'
                    : evt.type === 'GOAL'
                    ? 'border-emerald-500 bg-emerald-950 font-bold'
                    : evt.type === 'PENALTY'
                    ? 'border-amber-400 bg-amber-950 font-bold'
                    : evt.type === 'RED_CARD'
                    ? 'border-red-600 bg-red-900 font-bold'
                    : evt.type === 'YELLOW_CARD'
                    ? 'border-amber-500 bg-amber-950'
                    : 'border-zinc-600 bg-zinc-900'
                }`}
              >
                {getEventIcon(evt.type)}
              </div>

              {/* Tooltip la hover */}
              <div className="pointer-events-none absolute left-1/2 z-30 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-950 px-2.5 py-1 text-[11px] text-zinc-200 shadow-xl border border-zinc-700 group-hover:block -top-8">
                <span className="font-bold text-amber-400">{evt.minute}&apos;</span> {evt.playerName || evt.type}
                {isCorruptionEvt && <span className="ml-1 text-red-400 font-bold">(Corupție)</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[11px] font-mono text-zinc-500">
        <span>0&apos; Fluier Start</span>
        <span>45&apos; Pauză</span>
        <span>90&apos; Final</span>
      </div>
    </div>
  );
};
