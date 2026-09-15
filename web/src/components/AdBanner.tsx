'use client';

import React, { useState } from 'react';

interface AdBannerProps {
  format?: 'leaderboard' | 'rectangle' | 'in_match';
  className?: string;
  adClient?: string;
  adSlot?: string;
}

export function AdBanner({ format = 'leaderboard', className = '', adClient, adSlot }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Dacă există configurat un client AdSense real
  if (adClient && adSlot) {
    return (
      <div className={`flex flex-col items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-center text-xs text-zinc-500 ${className}`}>
        <div className="flex w-full items-center justify-between px-2 pb-1 text-[10px] uppercase tracking-wider text-zinc-600">
          <span>Publicitate Google</span>
          <button onClick={() => setIsVisible(false)} className="hover:text-zinc-400">✕</button>
        </div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Banner Publicitar In-Game (Fallback & Spațiu Sponsorizat Realist)
  if (format === 'rectangle') {
    return (
      <div className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-blue-950/30 p-4 shadow-lg ${className}`}>
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 pb-2">
          <span className="flex items-center gap-1">📢 Spațiu Publicitar</span>
          <button onClick={() => setIsVisible(false)} className="hover:text-zinc-300 text-xs">✕</button>
        </div>
        <div className="flex flex-col items-center text-center py-3 space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 text-2xl shadow-inner">
            ⚡
          </div>
          <h4 className="text-sm font-extrabold text-white">FootbALL-IN Pro Pass</h4>
          <p className="text-xs text-zinc-400 max-w-[220px]">
            Elimină reclamele terțe, deblochează rapoarte avansate de scouting și tactică.
          </p>
          <button className="mt-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-1.5 text-xs font-bold text-white transition shadow-md">
            Vezi Oferta (€4.99/lună)
          </button>
        </div>
      </div>
    );
  }

  // Format Leaderboard 728x90 (Orizontal Banner)
  return (
    <div className={`relative flex flex-col sm:flex-row items-center justify-between gap-3 overflow-hidden rounded-xl border border-zinc-800/90 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-2.5 shadow-md ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-xl">
          ⚽
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">Partener Oficial Divizia A</span>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-semibold text-zinc-400 border border-zinc-700">RECLAMĂ</span>
          </div>
          <p className="text-xs text-zinc-300">
            Echipament Oficial <strong className="text-white">Nike Football Elite</strong> — Campionatul Oficial FootbALL-IN Manager.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a 
          href="#sponsors" 
          onClick={(e) => { e.preventDefault(); alert('Spațiu publicitar disponibil pentru promovare brand sau Google AdSense.'); }}
          className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-200 transition border border-zinc-700"
        >
          Publicitate Aici
        </a>
        <button 
          onClick={() => setIsVisible(false)} 
          className="text-zinc-500 hover:text-zinc-300 p-1 text-xs" 
          title="Închide reclama"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
