'use client';

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface GoogleAuthButtonProps {
  onAuthChange?: (user: any | null) => void;
  onOpenModal?: () => void;
  className?: string;
}

export function GoogleAuthButton({ onAuthChange, onOpenModal, className = '' }: GoogleAuthButtonProps) {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = session?.user as any;

  // Google 4-Color SVG Icon
  const GoogleGIcon = () => (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );

  return (
    <div className={`relative ${className}`}>
      {user ? (
        // Stare Conectat (NextAuth Profile)
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800 shadow-sm"
          >
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || 'Manager'}
                className="h-6 w-6 rounded-full border border-blue-500/50 bg-zinc-800 object-cover"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] uppercase">
                {(user.name || user.username || 'M')[0]}
              </div>
            )}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">{user.name || user.username}</span>
              <span className="text-[10px] text-emerald-400 leading-tight flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> 
                {user.team ? user.team.name : 'Manager Activ'}
              </span>
            </div>
            <span className="text-zinc-500 text-[10px]">▼</span>
          </button>

          {/* Meniu Dropdown Utilizator */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || 'Manager'}
                    className="h-10 w-10 rounded-full border border-blue-500 bg-zinc-800 object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm uppercase">
                    {(user.name || user.username || 'M')[0]}
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="font-bold text-sm text-white truncate">{user.name || user.username}</div>
                  <div className="text-xs text-zinc-400 truncate">{user.email}</div>
                  <span className="inline-block mt-1 rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-400 border border-blue-500/30">
                    {user.team?.division?.name || 'Manager Oficial'}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-1">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 transition"
                >
                  <span>Deconectare</span>
                  <span>🚪</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Stare Neconectat: Buton Deschidere Modal Login/Register
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenModal}
            className="flex items-center gap-1.5 rounded-xl border border-blue-600/60 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition shadow-md shadow-blue-600/20 active:scale-95"
          >
            <span>🔐</span>
            <span>Conectare / Cont Nou</span>
          </button>
        </div>
      )}
    </div>
  );
}
