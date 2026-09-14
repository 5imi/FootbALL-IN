'use client';

import React from 'react';

interface MatchControlsProps {
  isPlaying: boolean;
  isFinished: boolean;
  currentSpeed: number; // ms per minut: 800 (1x), 250 (3x), 60 (10x), 0 (instant)
  onTogglePlay: () => void;
  onChangeSpeed: (speedMs: number) => void;
  onInstantFinish: () => void;
  onResetMatch: () => void;
}

export const MatchControls: React.FC<MatchControlsProps> = ({
  isPlaying,
  isFinished,
  currentSpeed,
  onTogglePlay,
  onChangeSpeed,
  onInstantFinish,
  onResetMatch,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur-md">
      {/* Buton Principal Play/Pause */}
      <div className="flex items-center gap-3">
        {!isFinished ? (
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold text-white shadow-lg transition-all active:scale-95 ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/30'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
            }`}
          >
            {isPlaying ? (
              <>
                <span>⏸️</span> Pauză
              </>
            ) : (
              <>
                <span>▶️</span> {currentSpeed === 0 ? 'Reia Simularea' : 'Start Meci'}
              </>
            )}
          </button>
        ) : (
          <span className="rounded-xl bg-zinc-800 px-4 py-2 font-medium text-zinc-400">
            🏁 Meci Finalizat
          </span>
        )}

        <button
          onClick={onResetMatch}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-700 active:scale-95"
          title="Resetează și generează un alt meci între cele 2 echipe"
        >
          <span>🔄</span> Meci Nou
        </button>
      </div>

      {/* Selectoare Viteză */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mr-1">
          Viteză:
        </span>
        
        <button
          onClick={() => onChangeSpeed(800)}
          disabled={isFinished}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            currentSpeed === 800
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          1x Normal
        </button>

        <button
          onClick={() => onChangeSpeed(220)}
          disabled={isFinished}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            currentSpeed === 220
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          3x Rapid
        </button>

        <button
          onClick={() => onChangeSpeed(50)}
          disabled={isFinished}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            currentSpeed === 50
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          10x Turbo
        </button>

        <button
          onClick={onInstantFinish}
          disabled={isFinished}
          className="rounded-lg bg-purple-600/20 px-3 py-1.5 text-xs font-bold text-purple-300 border border-purple-500/30 transition-all hover:bg-purple-600 hover:text-white"
        >
          ⚡ Rezultat Direct
        </button>
      </div>
    </div>
  );
};
