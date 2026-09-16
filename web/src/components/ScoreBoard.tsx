'use client';

import { Team, Referee, CorruptionResult, MatchEvent, WeatherType, PitchCondition } from '../engine/types';

interface ScoreBoardProps {
  homeTeam: Team;
  awayTeam: Team;
  currentScore: [number, number];
  currentMinute: number;
  isFinished: boolean;
  isPlaying: boolean;
  referee: Referee;
  corruption?: CorruptionResult;
  events?: MatchEvent[];
  extraTime?: number;
  weather?: WeatherType;
  pitch?: PitchCondition;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  homeTeam,
  awayTeam,
  currentScore,
  currentMinute,
  isFinished,
  isPlaying,
  referee,
  corruption,
  events = [],
  extraTime = 0,
  weather,
  pitch,
}) => {
  // Jucătorii marcatori până la minutul curent
  const isGoalEvent = (evt: MatchEvent) => {
    return (
      evt.type === 'GOAL' ||
      evt.type === 'BISCOTTO_BETRAYAL' ||
      (evt.type === 'BRIBED_DECISION' && evt.description.includes('transformă')) ||
      (evt.type === 'PENALTY' && !evt.description.includes('RATAT'))
    );
  };

  const activeGoals = events.filter(
    (e) => e.minute <= currentMinute && isGoalEvent(e) && e.playerName
  );

  const homeScorers = activeGoals.filter((e) => e.teamId === homeTeam.id);
  const awayScorers = activeGoals.filter((e) => e.teamId === awayTeam.id);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl">
      {/* Glow efect subtil de fundal */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-red-600/10 blur-3xl" />

      {/* Header Stadion & Arbitru & Status */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 text-xs">
        <div className="flex items-center gap-4 text-zinc-400">
          <span>🏟️ {homeTeam.stadium}</span>
          <span className="h-3 w-px bg-zinc-700" />
          <span className="flex items-center gap-1">
            🧑‍⚖️ <span className="font-semibold text-zinc-300">{referee.name}</span>
            <span className="ml-1 rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500" title="Severitate / Integritate">
              SEV:{referee.strictness} INT:{referee.integrity}
            </span>
          </span>
          {weather && (
            <span className="flex items-center gap-1 rounded bg-zinc-800/80 px-2 py-0.5 text-zinc-300">
              {weather === 'RAIN' ? '⛈️ Ploaie' : weather === 'SNOW' ? '❄️ Ninsoare' : weather === 'FOG' ? '🌫️ Ceață' : '☀️ Senin'}
            </span>
          )}
          {pitch && pitch !== 'PRISTINE' && (
            <span className="flex items-center gap-1 rounded bg-zinc-800/80 px-2 py-0.5 text-zinc-300">
              {pitch === 'MUDDY' ? '🌊 Mocirlă' : pitch === 'FROZEN' ? '🥶 Înghețat' : '💧 Teren Ud'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isFinished ? (
            <span className="rounded-full bg-zinc-800 px-3 py-1 font-semibold text-zinc-300">
              MECI ÎNCHEIAT {extraTime > 0 ? `(90+${extraTime}')` : `(90')`}
            </span>
          ) : isPlaying ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 font-bold text-emerald-400">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              LIVE {currentMinute > 90 ? `90+${currentMinute - 90}'` : `${currentMinute}'`}
              {currentMinute >= 90 && extraTime > 0 && (
                <span className="text-[10px] text-amber-400 font-normal">
                  (din +{extraTime}&apos;)
                </span>
              )}
            </span>
          ) : (
            <span className="rounded-full bg-amber-500/15 px-3 py-1 font-semibold text-amber-400">
              ÎN AȘTEPTARE {currentMinute > 1 ? (currentMinute > 90 ? `(90+${currentMinute - 90}')` : `(${currentMinute}')`) : ''}
            </span>
          )}
        </div>
      </div>

      {/* Tabela de Marcaj Mare */}
      <div className="grid grid-cols-7 items-center gap-4 py-6">
        {/* Gazde */}
        <div className="col-span-3 flex items-start justify-end gap-4 text-right">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              {homeTeam.name}
            </h2>
            <div className="flex items-center justify-end gap-2 text-xs text-zinc-400">
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-300">
                {homeTeam.tactics.formation}
              </span>
              <span>{homeTeam.tactics.style}</span>
            </div>

            {/* Marcatori Gazde */}
            {homeScorers.length > 0 && (
              <div className="mt-2.5 flex flex-col items-end gap-1">
                {homeScorers.map((scorer, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-800/40 px-2 py-0.5 rounded border border-zinc-800/60">
                    <span className="font-semibold text-zinc-100">{scorer.playerName}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{scorer.minute}&apos;</span>
                    <span className="text-emerald-400 text-xs">⚽</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black shadow-lg mt-0.5"
            style={{ backgroundColor: homeTeam.primaryColor, color: '#ffffff' }}
          >
            {homeTeam.shortName}
          </div>
        </div>

        {/* Scor Central cu Suspans */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          {!isPlaying && !isFinished && currentMinute === 1 ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 font-mono text-3xl md:text-4xl font-black tracking-wider text-amber-400 px-3.5 py-1 rounded-xl bg-zinc-950 border border-amber-500/40 shadow-inner">
                <span className="animate-pulse">?</span>
                <span className="text-zinc-600">:</span>
                <span className="animate-pulse">?</span>
              </div>
              <span className="mt-1.5 font-mono text-[10px] font-bold text-amber-300 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60">
                În Așteptare &bull; Start pt. Rezultat
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 font-mono text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                <span className={currentScore[0] > currentScore[1] ? 'text-blue-400' : 'text-white'}>
                  {currentScore[0]}
                </span>
                <span className="text-zinc-600">:</span>
                <span className={currentScore[1] > currentScore[0] ? 'text-red-400' : 'text-white'}>
                  {currentScore[1]}
                </span>
              </div>
              <span className="mt-1 font-mono text-xs font-medium text-zinc-400">
                {currentMinute > 90 ? `Min. 90+${currentMinute - 90}'` : `Min. ${currentMinute}'`}
              </span>
            </>
          )}
        </div>

        {/* Oaspeți */}
        <div className="col-span-3 flex items-start justify-start gap-4 text-left">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black shadow-lg mt-0.5"
            style={{ backgroundColor: awayTeam.primaryColor, color: '#ffffff' }}
          >
            {awayTeam.shortName}
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              {awayTeam.name}
            </h2>
            <div className="flex items-center justify-start gap-2 text-xs text-zinc-400">
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-300">
                {awayTeam.tactics.formation}
              </span>
              <span>{awayTeam.tactics.style}</span>
            </div>

            {/* Marcatori Oaspeți */}
            {awayScorers.length > 0 && (
              <div className="mt-2.5 flex flex-col items-start gap-1">
                {awayScorers.map((scorer, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-800/40 px-2 py-0.5 rounded border border-zinc-800/60">
                    <span className="text-emerald-400 text-xs">⚽</span>
                    <span className="font-semibold text-zinc-100">{scorer.playerName}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{scorer.minute}&apos;</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Raport Investigație Corupție — apare doar la final dacă a existat corupție */}
      {isFinished && corruption && (
        <div className={`mt-2 rounded-xl border p-4 text-xs ${
          corruption.isDiscovered
            ? 'border-red-500/40 bg-red-950/30'
            : corruption.bribeAccepted || corruption.biscottoActive
              ? 'border-amber-500/30 bg-amber-950/20'
              : 'border-zinc-800 bg-zinc-900/50'
        }`}>
          <div className="flex items-center justify-between font-bold text-zinc-200 mb-2.5 pb-2 border-b border-zinc-800/80">
            <span className="flex items-center gap-1.5">
              🔍 <span>Raport Investigație & Bilanț Financiar</span>
            </span>
            {corruption.moneySpent > 0 && (
              <span className="font-mono text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                💸 BANI SCOȘI DIN CLUB: €{corruption.moneySpent.toLocaleString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-zinc-400 mb-2">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Suspiciune:</span>
              <span className={`font-mono font-bold ${
                corruption.investigationScore > 60 ? 'text-red-400' :
                corruption.investigationScore > 30 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {Math.round(corruption.investigationScore)}/100
              </span>
            </div>

            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Efect Mită:</span>
              <span className="font-semibold text-zinc-200">
                {corruption.bribeReported
                  ? '🚨 Raportată (DNA)'
                  : corruption.bribeEffectiveness === 'SCAMMED'
                  ? '🤡 Țeapă (Fluierat Neutru)'
                  : corruption.bribeEffectiveness === 'FAILED_PENALTY'
                  ? '🧤 Penalty Ratat pe Teren'
                  : corruption.bribeAccepted
                  ? '⚖️ Influență Subtilă'
                  : '— Fără Mită'}
              </span>
            </div>

            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Blat Biscotto:</span>
              <span className="font-semibold text-zinc-200">
                {corruption.biscottoActive
                  ? corruption.biscottoBroken
                    ? `💔 Trădat de ${corruption.biscottoTraitorName}`
                    : '🤝 Respectat (Egal)'
                  : '— Fără Înțelegere'}
              </span>
            </div>

            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Verdict Federație:</span>
              <span className={`font-bold ${corruption.isDiscovered ? 'text-red-400' : 'text-emerald-400'}`}>
                {corruption.isDiscovered
                  ? `⛔ ${corruption.penalty === 'RELEGATION' ? 'RETROGRADARE' :
                      corruption.penalty === 'POINTS_DEDUCTION' ? `-${corruption.pointsDeducted} PUNCTE` :
                      corruption.penalty === 'MATCH_VOID' ? 'MECI ANULAT (0-3)' :
                      `AMENDĂ €${(corruption.fineAmount || 0).toLocaleString()}`}`
                  : '✅ Nedescoperit'}
              </span>
            </div>
          </div>

          {/* Verdictul Financiar / Bilanțul Clubului */}
          {corruption.financialVerdict && (
            <div className="mt-2.5 rounded-lg bg-zinc-950/70 p-2.5 border border-zinc-800 text-xs text-zinc-300 font-medium leading-relaxed">
              {corruption.financialVerdict}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
