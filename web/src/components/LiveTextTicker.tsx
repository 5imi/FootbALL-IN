'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MatchEvent } from '../engine/types';

interface LiveTextTickerProps {
  events: MatchEvent[];
  currentMinute: number;
}

export const LiveTextTicker: React.FC<LiveTextTickerProps> = ({ events, currentMinute }) => {
  const [filterHighlightsOnly, setFilterHighlightsOnly] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Evenimentele consumate până la minutul curent
  const visibleEvents = events
    .filter((e) => e.minute <= currentMinute)
    .filter((e) => !filterHighlightsOnly || e.isHighlight);

  // Auto-scroll la ultimul eveniment adăugat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleEvents.length]);

  const getEventBadge = (type: MatchEvent['type']) => {
    switch (type) {
      case 'GOAL':
        return <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">GOL ⚽</span>;
      case 'PENALTY':
        return <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">PENALTY ⚽</span>;
      case 'YELLOW_CARD':
        return <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">CARTONAȘ 🟨</span>;
      case 'RED_CARD':
        return <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs font-bold text-red-400">ROȘU 🟥</span>;
      case 'WOODWORK':
        return <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-400">BARĂ 💥</span>;
      case 'GREAT_SAVE':
        return <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-400">PARADĂ 🧤</span>;
      case 'VAR_DECISION':
        return <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-400">VAR 📺</span>;
      case 'BRIBED_DECISION':
        return <span className="rounded bg-red-600/30 px-2 py-0.5 text-xs font-bold text-red-300 animate-pulse">CONTROVERSAT ⚖️</span>;
      case 'SUSPICIOUS_PASSIVITY':
        return <span className="rounded bg-orange-500/20 px-2 py-0.5 text-xs font-bold text-orange-400">SUSPECT 😴</span>;
      case 'BISCOTTO_BETRAYAL':
        return <span className="rounded bg-pink-500/30 px-2 py-0.5 text-xs font-bold text-pink-300 animate-pulse">TRĂDARE 🔥</span>;
      case 'MOMENTUM_SHIFT':
        return <span className="rounded bg-teal-500/20 px-2 py-0.5 text-xs font-bold text-teal-300 animate-pulse">RĂSTURNARE 🌪️</span>;
      case 'COUNTER_ATTACK':
        return <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">CONTRAATAC ⚡</span>;
      case 'INJURY_STOPPAGE':
        return <span className="rounded bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-300">MEDICI 🚑</span>;
      case 'INTIMIDATION':
        return <span className="rounded bg-zinc-600/30 px-2 py-0.5 text-xs font-bold text-zinc-300">INTIMIDARE 👀</span>;
      case 'PLAYER_BRAWL':
        return <span className="rounded bg-red-600/40 px-2 py-0.5 text-xs font-bold text-red-200 animate-pulse border border-red-500/50">BĂTAIE 🟥🟥</span>;
      case 'BENCH_CLASH':
        return <span className="rounded bg-orange-600/30 px-2 py-0.5 text-xs font-bold text-orange-300">SCÂNTEI 🥊</span>;

      case 'CROWD_CHANT':
        return <span className="rounded bg-violet-500/20 px-2 py-0.5 text-xs font-bold text-violet-300">PELUZĂ 📢</span>;
      case 'SCOUT_SPOTTED':
        return <span className="rounded bg-sky-500/25 px-2 py-0.5 text-xs font-bold text-sky-300 animate-pulse">SCOUT 🔭</span>;
      case 'TACTICAL_SUB':
        return <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-300">SCHIMBARE 🔄</span>;
      case 'HEATED_PROTEST':
        return <span className="rounded bg-red-500/25 px-2 py-0.5 text-xs font-bold text-red-300">PROTESTE 😡</span>;
      case 'WEATHER_INCIDENT':
        return <span className="rounded bg-slate-500/25 px-2 py-0.5 text-xs font-bold text-slate-300">VREME ⛈️</span>;
      case 'FAN_INVASION':
        return <span className="rounded bg-yellow-500/25 px-2 py-0.5 text-xs font-bold text-yellow-300 animate-pulse">INCIDENT 🏃</span>;
      case 'DRAMA_LASTMIN':
        return <span className="rounded bg-fuchsia-500/25 px-2 py-0.5 text-xs font-bold text-fuchsia-300 animate-pulse">DRAMĂ ⏱️</span>;
      case 'HALF_TIME':
      case 'FULL_TIME':
        return <span className="rounded bg-zinc-700 px-2 py-0.5 text-xs font-bold text-zinc-300">ARBITRU ⏱️</span>;
      default:
        return <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">FAZĂ</span>;
    }
  };

  const getEventStyle = (evt: MatchEvent) => {
    // Evenimente de corupție — stilizare specială
    if (evt.isCorruption) {
      if (evt.type === 'BRIBED_DECISION') {
        return 'border border-red-500/50 bg-red-950/30 shadow-md shadow-red-950/30 ring-1 ring-red-500/20';
      }
      if (evt.type === 'BISCOTTO_BETRAYAL') {
        return 'border border-pink-500/50 bg-pink-950/25 shadow-md shadow-pink-950/30';
      }
      if (evt.type === 'SUSPICIOUS_PASSIVITY') {
        return 'border border-orange-500/30 bg-orange-950/15';
      }
      return 'border border-red-500/30 bg-red-950/15';
    }

    // Evenimente normale
    switch (evt.type) {
      case 'GOAL':
      case 'PENALTY':
        return 'border border-emerald-500/40 bg-emerald-950/20 shadow-md shadow-emerald-950/20';
      case 'MOMENTUM_SHIFT':
        return 'border border-teal-500/40 bg-teal-950/25 shadow-md ring-1 ring-teal-500/30';
      case 'COUNTER_ATTACK':
        return 'border border-amber-500/40 bg-amber-950/20';
      case 'BENCH_CLASH':
        return 'border border-orange-500/40 bg-orange-950/20';
      case 'INJURY_STOPPAGE':
        return 'border border-rose-500/30 bg-rose-950/15';
      case 'CROWD_CHANT':
        return 'border border-violet-500/30 bg-violet-950/15';
      case 'YELLOW_CARD':
        return 'border border-amber-500/30 bg-amber-950/15';
      case 'RED_CARD':
        return 'border border-red-500/40 bg-red-950/20 shadow-md';
      case 'WOODWORK':
        return 'border border-purple-500/30 bg-purple-950/15';
      case 'SCOUT_SPOTTED':
        return 'border border-sky-500/40 bg-sky-950/20 shadow-md ring-1 ring-sky-500/25';
      case 'TACTICAL_SUB':
        return 'border border-blue-500/30 bg-blue-950/15';
      case 'HEATED_PROTEST':
        return 'border border-red-500/35 bg-red-950/15 shadow-sm';
      case 'WEATHER_INCIDENT':
        return 'border border-slate-500/35 bg-slate-950/20';
      case 'FAN_INVASION':
        return 'border border-yellow-500/40 bg-yellow-950/20 shadow-md ring-1 ring-yellow-500/25';
      case 'DRAMA_LASTMIN':
        return 'border border-fuchsia-500/40 bg-fuchsia-950/20 shadow-md ring-1 ring-fuchsia-500/25';
      default:
        return 'border border-zinc-800/60 bg-zinc-950/40';
    }
  };

  return (
    <div className="flex h-[420px] flex-col rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-xl backdrop-blur-md">
      {/* Header Ticker cu Filtru */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Comentariu Live Text (Ticker)
          </h3>
        </div>

        <button
          onClick={() => setFilterHighlightsOnly(!filterHighlightsOnly)}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            filterHighlightsOnly
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          {filterHighlightsOnly ? '✓ Doar Momente Cheie' : 'Toate Fazele'}
        </button>
      </div>

      {/* Lista de comentarii cu scroll */}
      <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto p-4">
        {visibleEvents.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Apasă pe Start Meci pentru a urmări comentariul live minut cu minut...
          </div>
        ) : (
          visibleEvents.map((evt) => (
            <div
              key={evt.id}
              className={`flex items-start gap-3 rounded-lg p-3 transition-all ${getEventStyle(evt)}`}
            >
              <div className="flex shrink-0 flex-col items-center">
                <span className={`font-mono text-sm font-black ${evt.isCorruption ? 'text-red-400' : 'text-amber-400'}`}>
                  {evt.minute > 90 ? `90+${evt.minute - 90}'` : `${evt.minute}'`}
                </span>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {getEventBadge(evt.type)}
                  {evt.isCorruption && (
                    <span className="rounded bg-red-900/40 px-1.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                      🕵️ CORUPȚIE
                    </span>
                  )}
                  {evt.scoreAfter && (evt.type === 'GOAL' || evt.type === 'PENALTY' || evt.type === 'BRIBED_DECISION' || evt.type === 'BISCOTTO_BETRAYAL') && (
                    <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-xs font-bold text-white">
                      {evt.scoreAfter[0]} - {evt.scoreAfter[1]}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-zinc-200">{evt.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
