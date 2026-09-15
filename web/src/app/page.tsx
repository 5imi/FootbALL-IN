'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initialTeams } from '../engine/data/teams';
import { simulateMatch } from '../engine/matchSimulator';
import { MatchSimulationResult, LeagueStandingRow, CorruptionConfig, Player } from '../engine/types';
import { ScoreBoard } from '../components/ScoreBoard';
import { MatchControls } from '../components/MatchControls';
import { MatchTimeline } from '../components/MatchTimeline';
import { LiveTextTicker } from '../components/LiveTextTicker';
import { MatchStatsView } from '../components/MatchStatsView';
import { LeagueTableView } from '../components/LeagueTableView';
import { PitchLineupView } from '../components/PitchLineupView';
import { PlayerDetailsModal } from '../components/PlayerDetailsModal';
import { TrainingManagementView } from '../components/TrainingManagementView';

export default function Home() {
  const [homeTeam] = useState(initialTeams[0]);
  const [awayTeam] = useState(initialTeams[1]);

  // Tab activ: 'match' | 'tactics' | 'training' | 'standings'
  const [activeTab, setActiveTab] = useState<'match' | 'tactics' | 'training' | 'standings'>('match');


  // Configurație Corupție / Culise
  const [bribeTeam, setBribeTeam] = useState<'none' | 'home' | 'away'>('none');
  const [bribeAmount, setBribeAmount] = useState<number>(25000);
  const [biscottoEnabled, setBiscottoEnabled] = useState<boolean>(false);

  // Helper generare config corupție
  const buildCorruptionConfig = (
    teamChoice = bribeTeam,
    amount = bribeAmount,
    biscotto = biscottoEnabled
  ): CorruptionConfig | undefined => {
    if (teamChoice === 'none' && !biscotto) return undefined;
    return {
      bribingTeamId:
        teamChoice !== 'none'
          ? teamChoice === 'home'
            ? homeTeam.id
            : awayTeam.id
          : undefined,
      bribeAmount: teamChoice !== 'none' ? amount : undefined,
      isBiscottoAgreed: biscotto,
    };
  };

  // Simularea curentă (seed fix inițial pentru a evita hydration mismatch între SSR și client)
  const [matchResult, setMatchResult] = useState<MatchSimulationResult>(() =>
    simulateMatch(initialTeams[0], initialTeams[1], 1001)
  );

  const [currentMinute, setCurrentMinute] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(220); // default 3x rapid
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Popup Detalii Jucător (SoccerProject Card)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isForeignPlayer, setIsForeignPlayer] = useState<boolean>(false);


  // Clasament și Istoric meciuri
  const [standings, setStandings] = useState<LeagueStandingRow[]>([
    {
      teamId: initialTeams[0].id,
      teamName: initialTeams[0].name,
      shortName: initialTeams[0].shortName,
      primaryColor: initialTeams[0].primaryColor,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    },
    {
      teamId: initialTeams[1].id,
      teamName: initialTeams[1].name,
      shortName: initialTeams[1].shortName,
      primaryColor: initialTeams[1].primaryColor,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    },
  ]);

  const [matchHistory, setMatchHistory] = useState<{ home: string; away: string; score: [number, number] }[]>([]);

  // Referință pentru timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Funcție de finalizare și înregistrare meci în clasament
  const finalizeMatch = (finalScore: [number, number]) => {
    setIsFinished(true);
    setIsPlaying(false);
    const totalMin = 90 + (matchResult.extraTime || 0);
    setCurrentMinute(totalMin);

    const [hGoals, aGoals] = finalScore;

    setStandings((prev) => {
      const homeRow = { ...prev[0] };
      const awayRow = { ...prev[1] };

      homeRow.played += 1;
      awayRow.played += 1;
      homeRow.goalsFor += hGoals;
      homeRow.goalsAgainst += aGoals;
      homeRow.goalDiff = homeRow.goalsFor - homeRow.goalsAgainst;

      awayRow.goalsFor += aGoals;
      awayRow.goalsAgainst += hGoals;
      awayRow.goalDiff = awayRow.goalsFor - awayRow.goalsAgainst;

      if (hGoals > aGoals) {
        homeRow.won += 1;
        homeRow.points += 3;
        awayRow.lost += 1;
      } else if (aGoals > hGoals) {
        awayRow.won += 1;
        awayRow.points += 3;
        homeRow.lost += 1;
      } else {
        homeRow.drawn += 1;
        homeRow.points += 1;
        awayRow.drawn += 1;
        awayRow.points += 1;
      }

      return [homeRow, awayRow];
    });

    setMatchHistory((prev) => [
      ...prev,
      { home: homeTeam.shortName, away: awayTeam.shortName, score: finalScore },
    ]);
  };

  // Bucla de simulare live
  const maxMinute = 90 + (matchResult.extraTime || 0);

  useEffect(() => {
    if (isPlaying && !isFinished) {
      timerRef.current = setInterval(() => {
        setCurrentMinute((prevMin) => {
          if (prevMin >= maxMinute - 1) {
            clearInterval(timerRef.current!);
            finalizeMatch(matchResult.finalScore);
            return maxMinute;
          }
          return prevMin + 1;
        });
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isFinished, speedMs, matchResult.finalScore, maxMinute]);

  // Controale
  const handleTogglePlay = () => {
    if (isFinished) return;
    setIsPlaying((prev) => !prev);
  };

  const handleChangeSpeed = (newSpeed: number) => {
    setSpeedMs(newSpeed);
  };

  const handleInstantFinish = () => {
    if (isFinished) return;
    if (timerRef.current) clearInterval(timerRef.current);
    finalizeMatch(matchResult.finalScore);
  };

  const handleResetMatch = (overrideConfig?: CorruptionConfig) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newSeed = Date.now() + Math.floor(Math.random() * 10000);
    const config = overrideConfig !== undefined ? overrideConfig : buildCorruptionConfig();
    const newSim = simulateMatch(homeTeam, awayTeam, newSeed, config);
    setMatchResult(newSim);
    setCurrentMinute(1);
    setIsFinished(false);
    setIsPlaying(false);
  };

  const handleApplyCorruptionAndRestart = (
    newBribeTeam: 'none' | 'home' | 'away',
    newAmount: number,
    newBiscotto: boolean
  ) => {
    setBribeTeam(newBribeTeam);
    setBribeAmount(newAmount);
    setBiscottoEnabled(newBiscotto);
    const config = buildCorruptionConfig(newBribeTeam, newAmount, newBiscotto);
    handleResetMatch(config);
  };

  // Preluăm snapshot-ul curent al minutului
  const snapshotIdx = Math.max(
    0,
    Math.min(matchResult.minuteSnapshots.length - 1, currentMinute - 1)
  );
  const currentSnapshot =
    matchResult.minuteSnapshots[snapshotIdx] ||
    matchResult.minuteSnapshots[0];

  const currentScore: [number, number] = currentSnapshot
    ? (currentSnapshot.score as [number, number])
    : [0, 0];
  const currentStats = currentSnapshot ? currentSnapshot.stats : matchResult.finalStats;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-lg font-black text-white shadow-lg">
              ⚽
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                SOCCERMANAGER <span className="rounded bg-blue-600/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/30">PROTOTIP V1 + CORUPȚIE</span>
              </h1>
              <p className="text-[11px] text-zinc-400">Motor Determinist &bull; Arbitraj &bull; Culise & Anchetă</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveTab('match')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                activeTab === 'match'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🏟️</span> Meciul Zilei
            </button>
            <button
              onClick={() => setActiveTab('tactics')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                activeTab === 'tactics'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>📋</span> Primul 11 & Teren
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                activeTab === 'training'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🏋️</span> Antrenament & Refacere
            </button>
            <button
              onClick={() => setActiveTab('standings')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                activeTab === 'standings'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >

              <span>🏆</span> Clasament ({standings[0].played} Etape)
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Tabela de Marcaj Permanent Vizibilă pe Tab-ul Meci */}
        <ScoreBoard
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          currentScore={currentScore}
          currentMinute={currentMinute}
          isFinished={isFinished}
          isPlaying={isPlaying}
          referee={matchResult.referee}
          corruption={matchResult.corruption}
          events={matchResult.allEvents}
          extraTime={matchResult.extraTime}
          weather={matchResult.weather}
          pitch={matchResult.pitch}
        />

        {/* Tab-ul 1: Meciul Zilei (Live Ticker, Timeline, Statistici) */}
        {activeTab === 'match' && (
          <div className="space-y-6">
            {/* Panou Culise & Biroul Patronului (Corupție & Înțelegeri) */}
            <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/20 p-4 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💼</span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      Biroul Patronului &bull; Manevre de Culise
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                        OPȚIONAL
                      </span>
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Mituiește arbitrul din fondurile clubului sau negociază o remiză tacită (Biscotto).
                    </p>
                  </div>
                </div>

                {/* Status curent culise */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500">Scenariu activ:</span>
                  {bribeTeam !== 'none' ? (
                    <span className="rounded-md bg-red-500/20 px-2 py-0.5 font-bold text-red-400 border border-red-500/30">
                      💰 Mită {bribeTeam === 'home' ? homeTeam.shortName : awayTeam.shortName} (€{bribeAmount.toLocaleString()})
                    </span>
                  ) : biscottoEnabled ? (
                    <span className="rounded-md bg-amber-500/20 px-2 py-0.5 font-bold text-amber-400 border border-amber-500/30">
                      🤝 Blat Biscotto (1-1)
                    </span>
                  ) : (
                    <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-400 border border-emerald-500/30">
                      ⚖️ Joc Curat (Fără intervenții)
                    </span>
                  )}
                </div>
              </div>

              {/* Butoane de acțiune rapidă pentru teste */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                <button
                  onClick={() => handleApplyCorruptionAndRestart('none', bribeAmount, false)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    bribeTeam === 'none' && !biscottoEnabled
                      ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 shadow-md ring-1 ring-emerald-500/30'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <span>🕊️</span>
                  <span>Meci Curat (Fair-Play)</span>
                </button>

                <button
                  onClick={() => handleApplyCorruptionAndRestart('home', 25000, false)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    bribeTeam === 'home'
                      ? 'border-blue-500/50 bg-blue-950/50 text-blue-300 shadow-md ring-1 ring-blue-500/30'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <span>💰</span>
                  <span>Mită PRO (€25k)</span>
                </button>

                <button
                  onClick={() => handleApplyCorruptionAndRestart('away', 25000, false)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    bribeTeam === 'away'
                      ? 'border-red-500/50 bg-red-950/50 text-red-300 shadow-md ring-1 ring-red-500/30'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <span>💰</span>
                  <span>Mită GLO (€25k)</span>
                </button>

                <button
                  onClick={() => handleApplyCorruptionAndRestart('none', bribeAmount, true)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    biscottoEnabled
                      ? 'border-amber-500/50 bg-amber-950/50 text-amber-300 shadow-md ring-1 ring-amber-500/30'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <span>🤝</span>
                  <span>Înțelegere Blat (1-1)</span>
                </button>
              </div>
            </div>

            {/* Controale Simulare */}
            <MatchControls
              isPlaying={isPlaying}
              isFinished={isFinished}
              currentSpeed={speedMs}
              onTogglePlay={handleTogglePlay}
              onChangeSpeed={handleChangeSpeed}
              onInstantFinish={handleInstantFinish}
              onResetMatch={() => handleResetMatch()}
            />

            {/* Timeline 0' - 90' (+ Extra Time) */}
            <MatchTimeline
              currentMinute={currentMinute}
              timelineEvents={matchResult.timelineEvents}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              extraTime={matchResult.extraTime}
            />

            {/* Grid 2 Coloane: Ticker Live Text vs Statistici Meci */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <LiveTextTicker
                  events={matchResult.allEvents}
                  currentMinute={currentMinute}
                />
              </div>

              <div className="lg:col-span-5">
                <MatchStatsView
                  stats={currentStats}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab-ul 2: Așezare Tactică & Primul 11 */}
        {activeTab === 'tactics' && (
          <div className="space-y-6">
            <PitchLineupView 
              homeTeam={homeTeam} 
              awayTeam={awayTeam} 
              onSelectPlayer={(p, isForeign) => {
                setSelectedPlayer(p);
                setIsForeignPlayer(isForeign);
              }}
            />
          </div>
        )}

        {/* Tab-ul 3: Antrenament & Refacere Maseur (SoccerProject Style) */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            <TrainingManagementView
              players={[...homeTeam.lineup, ...homeTeam.bench]}
              onOpenPlayerCard={(p) => {
                setSelectedPlayer(p);
                setIsForeignPlayer(false);
              }}
            />
          </div>
        )}

        {/* Tab-ul 4: Clasament & Istoric Meciuri */}
        {activeTab === 'standings' && (
          <div className="space-y-6">
            <LeagueTableView
              standings={standings}
              matchHistory={matchHistory}
            />
          </div>
        )}


        {/* Modal Fișă Jucător SoccerProject */}
        <PlayerDetailsModal
          player={selectedPlayer}
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          isForeignClub={isForeignPlayer}
        />
      </main>
    </div>

  );
}
