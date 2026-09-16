'use client';

import React, { useState } from 'react';
import { ClubFinances } from '../engine/financeEngine';
import { Team } from '../engine/types';

interface MindGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  finances: ClubFinances;
  homeTeam: Team;
  awayTeam: Team;
  onApplyMindGame: (action: {
    type: 'SPYGATE' | 'FIREWORKS' | 'TABLOID_LEAK' | 'MALETIN' | 'PRESS_PROVOKE' | 'PRESS_DIPLOMAT' | 'PRESS_REFEREE';
    cost: number;
    description: string;
  }) => void;
  activeActions: string[];
}

export const MindGamesModal: React.FC<MindGamesModalProps> = ({
  isOpen,
  onClose,
  finances,
  homeTeam,
  awayTeam,
  onApplyMindGame,
  activeActions,
}) => {
  const [selectedTab, setSelectedTab] = useState<'press' | 'culise'>('press');
  const [selectedPressAnswer, setSelectedPressAnswer] = useState<number | null>(null);
  const [pressSubmitted, setPressSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePressSubmit = (idx: number) => {
    setSelectedPressAnswer(idx);
    setPressSubmitted(true);

    if (idx === 0) {
      onApplyMindGame({
        type: 'PRESS_PROVOKE',
        cost: 0,
        description: 'Declarație Incendiară: Jucătorii tăi intră pe teren extrem de motivați (+10% Determinare), dar fanii oaspeților devin ostili!'
      });
      setFeedback('🎤 Presa a preluat titlul pe prima pagină! Vestiarul tău e în flăcări pozitive!');
    } else if (idx === 1) {
      onApplyMindGame({
        type: 'PRESS_DIPLOMAT',
        cost: 0,
        description: 'Declarație Diplomată: Echipa ta joacă calm și concentrat (+5% Precizie pase).'
      });
      setFeedback('🕊️ Răspuns respectuos. Atmosfera din vestiar este echilibrată și profesionistă.');
    } else if (idx === 2) {
      onApplyMindGame({
        type: 'PRESS_REFEREE',
        cost: 0,
        description: 'Tiradă împotriva Arbitrajului: Arbitrul simte presiunea publică și va ezita să dea penalty ușor oaspeților.'
      });
      setFeedback('⚖️ Arbitrul a aflat de declarație! Va fi atent la fiecare cădere în careu.');
    }
  };

  const handleDarkArt = (
    type: 'SPYGATE' | 'FIREWORKS' | 'TABLOID_LEAK' | 'MALETIN',
    cost: number,
    description: string
  ) => {
    if (finances.balance < cost) {
      setFeedback(`❌ Fonduri insuficiente! Trezoreria clubului are nevoie de €${cost.toLocaleString()}.`);
      return;
    }

    onApplyMindGame({ type, cost, description });
    setFeedback(`✅ Operațiune lansată cu succes: ${description}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-amber-500/40 bg-zinc-950 p-6 shadow-2xl shadow-amber-950/50 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Antet Modal */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🕵️</span>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Războiul Psihologic &bull; Culise & Presă
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  MIND GAMES
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Meciul se joacă și în afara dreptunghiului verde: declarații, drone de spionaj și șicane nocturne.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white rounded-lg p-1.5 hover:bg-zinc-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-semibold">
            {feedback}
          </div>
        )}

        {/* Taburi Modale */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <button
            onClick={() => setSelectedTab('press')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedTab === 'press'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            🎤 Conferință de Presă Pre-Meci
          </button>
          <button
            onClick={() => setSelectedTab('culise')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedTab === 'culise'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            🕶️ Operațiuni Secrete de Culise (Dark Arts)
          </button>
        </div>

        {/* ─── TAB 1: Conferință de Presă ─── */}
        {selectedTab === 'press' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>ÎNTREBAREA JURNALISTULUI (Gazeta Sporturilor & Daily Soccer):</span>
              </div>
              <p className="text-sm font-semibold text-white italic pl-4 border-l-2 border-amber-500">
                „Domnule Manager, meciul de azi împotriva celor de la {awayTeam.name} este crucial pentru obiectivele clubului. Adversarul susține că echipa dumneavoastră este vulnerabilă în apărare. Cum răspundeți?”
              </p>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Alege poziția oficială a clubului tău:
              </h4>

              {/* Răspuns 1: Provocator */}
              <button
                disabled={pressSubmitted}
                onClick={() => handlePressSubmit(0)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedPressAnswer === 0
                    ? 'bg-red-950/60 border-red-500/60 text-red-200'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:bg-zinc-800/60'
                } ${pressSubmitted ? 'opacity-70 cursor-default' : ''}`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span className="text-red-400 font-black">💥 Răspuns Incendiar / Războinic:</span>
                  <span className="text-[10px] text-zinc-500">+10% Determinare Lot</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  „Să vorbească pe teren dacă au curaj! Îi vom călca în picioare din primul minut și le vom arăta cine dictează fotbalul aici!”
                </p>
              </button>

              {/* Răspuns 2: Diplomat */}
              <button
                disabled={pressSubmitted}
                onClick={() => handlePressSubmit(1)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedPressAnswer === 1
                    ? 'bg-blue-950/60 border-blue-500/60 text-blue-200'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:bg-zinc-800/60'
                } ${pressSubmitted ? 'opacity-70 cursor-default' : ''}`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span className="text-blue-400 font-black">🕊️ Răspuns Diplomat / Calmant:</span>
                  <span className="text-[10px] text-zinc-500">+5% Concentrare & Calm</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  „Respectăm clubul {awayTeam.name}, dar noi ne concentrăm strict pe planul nostru tactic. Vorbim prin goluri, nu prin vorbe goale.”
                </p>
              </button>

              {/* Răspuns 3: Arbitraj */}
              <button
                disabled={pressSubmitted}
                onClick={() => handlePressSubmit(2)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedPressAnswer === 2
                    ? 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:bg-zinc-800/60'
                } ${pressSubmitted ? 'opacity-70 cursor-default' : ''}`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span className="text-amber-400 font-black">⚖️ Tiradă de Presiune pe Arbitru:</span>
                  <span className="text-[10px] text-zinc-500">Presiune 50-50 la decizii</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  „Sperăm doar ca brigada de arbitri să vadă jocul curat și să nu mai permită duritățile din meciurile trecute ale oaspeților!”
                </p>
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 2: Operațiuni Secrete de Culise ─── */}
        {selectedTab === 'culise' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">
              Manevre finanțate din fondurile secrete ale clubului pentru a destabiliza adversarul înainte de meci:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Drona Spygate */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base">🛰️</span>
                  <span className="text-xs font-mono font-bold text-amber-400">€15.000</span>
                </div>
                <div className="font-bold text-xs text-white">Drona Spion la Antrenament („Spygate”)</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Trimiți o dronă de spionaj peste baza adversarului. Afli schemele la faze fixe: <strong className="text-emerald-400">+20% apărare la cornere</strong>.
                </p>
                <button
                  disabled={activeActions.includes('SPYGATE')}
                  onClick={() => handleDarkArt('SPYGATE', 15000, 'Drona Spygate a scanat tactica adversă! +20% bonus defensiv la faze fixe.')}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                    activeActions.includes('SPYGATE')
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-500 text-black'
                  }`}
                >
                  {activeActions.includes('SPYGATE') ? 'Activată' : 'Lansează Drona (€15k)'}
                </button>
              </div>

              {/* Artificii la Hotel 03:00 */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base">🎆</span>
                  <span className="text-xs font-mono font-bold text-amber-400">€10.000</span>
                </div>
                <div className="font-bold text-xs text-white">Artificii sub geamul Hotelului la 03:00</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  O brigadă pirotehnică face zgomot toată noaptea la hotelul oaspeților. <strong className="text-red-400">-15% Stamina oaspeților în prima repriză</strong>.
                </p>
                <button
                  disabled={activeActions.includes('FIREWORKS')}
                  onClick={() => handleDarkArt('FIREWORKS', 10000, 'Artificii lansate la 03:00! Oaspeții încep meciul nedormiți și obosiți.')}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                    activeActions.includes('FIREWORKS')
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-500 text-black'
                  }`}
                >
                  {activeActions.includes('FIREWORKS') ? 'Activată' : 'Comandă Pirotehnie (€10k)'}
                </button>
              </div>

              {/* Știre Tabloid */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base">📰</span>
                  <span className="text-xs font-mono font-bold text-amber-400">€8.000</span>
                </div>
                <div className="font-bold text-xs text-white">Zvon Otrăvit de Transfer în Tabloide</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Plătești un articol exclusiv: „Căpitanul advers a semnat cu noi!”. <strong className="text-red-400">-15% Moral și Focus căpitan advers</strong>.
                </p>
                <button
                  disabled={activeActions.includes('TABLOID_LEAK')}
                  onClick={() => handleDarkArt('TABLOID_LEAK', 8000, 'Articol tabloid publicat! Căpitanul advers este huiduit de propriii suporteri.')}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                    activeActions.includes('TABLOID_LEAK')
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-500 text-black'
                  }`}
                >
                  {activeActions.includes('TABLOID_LEAK') ? 'Activată' : 'Publică Zvonul (€8k)'}
                </button>
              </div>

              {/* Valiza cu Bani */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base">💼</span>
                  <span className="text-xs font-mono font-bold text-amber-400">€50.000</span>
                </div>
                <div className="font-bold text-xs text-white">„Valiza cu Bani” (Premierea Terților)</div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Trimiți o primă uriașă de victorie echipei care joacă împotriva rivalei tale directe la titlu în această etapă!
                </p>
                <button
                  disabled={activeActions.includes('MALETIN')}
                  onClick={() => handleDarkArt('MALETIN', 50000, 'Valiza cu bani a fost livrată! Outsiderul va juca pe viață și pe moarte împotriva rivalei tale!')}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                    activeActions.includes('MALETIN')
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-500 text-black'
                  }`}
                >
                  {activeActions.includes('MALETIN') ? 'Activată' : 'Trimite Valiza (€50k)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
          >
            Închide &bull; Înapoi la Meci
          </button>
        </div>
      </div>
    </div>
  );
};
