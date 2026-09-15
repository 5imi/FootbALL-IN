'use client';

import React, { useState, useEffect, useRef } from 'react';
import { initialTeams } from '../engine/data/teams';
import { simulateMatch } from '../engine/matchSimulator';
import { MatchSimulationResult, CorruptionConfig, Player } from '../engine/types';
import { ScoreBoard } from '../components/ScoreBoard';
import { MatchControls } from '../components/MatchControls';
import { MatchTimeline } from '../components/MatchTimeline';
import { LiveTextTicker } from '../components/LiveTextTicker';
import { MatchStatsView } from '../components/MatchStatsView';
import { LeagueTableView } from '../components/LeagueTableView';
import { PitchLineupView } from '../components/PitchLineupView';
import { PlayerDetailsModal } from '../components/PlayerDetailsModal';
import { TrainingManagementView } from '../components/TrainingManagementView';
import { StaffManagementView } from '../components/StaffManagementView';
import { ControlPanelView } from '../components/ControlPanelView';
import { ManagerRegistrationModal } from '../components/ManagerRegistrationModal';
import { TransferMarketView } from '../components/TransferMarketView';
import { GoogleAuthButton } from '../components/GoogleAuthButton';
import { AdBanner } from '../components/AdBanner';
import { 
  loadDivisionTeams, 
  loadActiveManager, 
  DivisionTeam, 
  ManagerProfile 
} from '../engine/divisionEngine';
import { loadClubFinances, ClubFinances, saveClubFinances } from '../engine/financeEngine';
import { Language, getTranslation } from '../engine/i18n';
import { COUNTRIES } from '../engine/countries';

export default function Home() {
  // Limbă internațională (i18n)
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('footballin_lang');
      if (saved === 'en' || saved === 'ro') return saved;
    }
    return 'ro';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('footballin_lang', lang);
    }
  };

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  // Manager Activ & Echipe Divizia A
  const [activeManager, setActiveManager] = useState<ManagerProfile | null>(() => loadActiveManager());
  const [divisionTeams, setDivisionTeams] = useState<DivisionTeam[]>(() => loadDivisionTeams());
  const [finances, setFinances] = useState<ClubFinances>(() => loadClubFinances());
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  // Echipe meci
  const [homeTeam, setHomeTeam] = useState(() => {
    const base = { ...initialTeams[0] };
    if (typeof window !== 'undefined') {
      try {
        const savedSquad = localStorage.getItem('footballin_user_squad');
        if (savedSquad) {
          const parsed: Player[] = JSON.parse(savedSquad);
          base.lineup = parsed.slice(0, 11);
          base.bench = parsed.slice(11);
        }
      } catch (e) {
        console.error(e);
      }
    }
    return base;
  });

  const [awayTeam] = useState(initialTeams[1]);

  // Tab activ: 'match' | 'tactics' | 'training' | 'standings' | 'staff' | 'transfers' | 'control'
  const [activeTab, setActiveTab] = useState<'match' | 'tactics' | 'training' | 'standings' | 'staff' | 'transfers' | 'control'>('standings');

  // Configurație Corupție / Culise
  const [bribeTeam, setBribeTeam] = useState<'none' | 'home' | 'away'>('none');
  const [bribeAmount, setBribeAmount] = useState<number>(25000);
  const [biscottoEnabled, setBiscottoEnabled] = useState<boolean>(false);

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

  // Simularea curentă
  const [matchResult, setMatchResult] = useState<MatchSimulationResult>(() =>
    simulateMatch(homeTeam, initialTeams[1], 1001)
  );

  const [currentMinute, setCurrentMinute] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(220);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Popup Detalii Jucător (SoccerProject Card)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isForeignPlayer, setIsForeignPlayer] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Când managerul finalizează înregistrarea și preluarea echipei bot
  const handleRegistrationComplete = (newManager: ManagerProfile, newSquad: Player[]) => {
    setActiveManager(newManager);
    setDivisionTeams(loadDivisionTeams());
    
    // Actualizăm echipa utilizatorului
    setHomeTeam(prev => ({
      ...prev,
      name: newManager.teamName,
      stadium: newManager.stadiumName,
      lineup: newSquad.slice(0, 11),
      bench: newSquad.slice(11)
    }));

    // Actualizăm și simularea
    setMatchResult(simulateMatch(
      { ...homeTeam, name: newManager.teamName, lineup: newSquad.slice(0, 11) },
      awayTeam,
      1002
    ));

    setActiveTab('control');
  };

  // Gestionare simulare meci
  useEffect(() => {
    if (isPlaying && !isFinished) {
      const totalMatchLength = 90 + (matchResult.extraTime || 0);

      timerRef.current = setInterval(() => {
        setCurrentMinute((prev) => {
          if (prev >= totalMatchLength) {
            setIsPlaying(false);
            setIsFinished(true);
            return totalMatchLength;
          }
          return prev + 1;
        });
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isFinished, speedMs, matchResult]);

  const handleTogglePlay = () => {
    if (isFinished) return;
    setIsPlaying(!isPlaying);
  };

  const handleChangeSpeed = (newSpeed: number) => {
    setSpeedMs(newSpeed);
  };

  const handleInstantFinish = () => {
    const totalMin = 90 + (matchResult.extraTime || 0);
    setCurrentMinute(totalMin);
    setIsPlaying(false);
    setIsFinished(true);
  };

  const handleResetMatch = (customSeed?: number, corruptionConfig = buildCorruptionConfig()) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setIsFinished(false);
    setCurrentMinute(1);
    const newSeed = customSeed ?? Math.floor(Math.random() * 1000000);
    setMatchResult(simulateMatch(homeTeam, awayTeam, newSeed, corruptionConfig));
  };

  const handleApplyCorruptionAndRestart = (
    teamChoice: 'none' | 'home' | 'away',
    amount: number,
    biscotto: boolean
  ) => {
    setBribeTeam(teamChoice);
    setBribeAmount(amount);
    setBiscottoEnabled(biscotto);
    const newConfig = buildCorruptionConfig(teamChoice, amount, biscotto);
    handleResetMatch(undefined, newConfig);
  };

  const currentScore: [number, number] = [
    matchResult.allEvents.filter(
      (e) =>
        e.minute <= currentMinute &&
        e.teamId === homeTeam.id &&
        (e.type === 'GOAL' || e.type === 'BISCOTTO_BETRAYAL' || (e.type === 'BRIBED_DECISION' && e.description.includes('transformă')) || (e.type === 'PENALTY' && !e.description.includes('RATAT')))
    ).length,
    matchResult.allEvents.filter(
      (e) =>
        e.minute <= currentMinute &&
        e.teamId === awayTeam.id &&
        (e.type === 'GOAL' || e.type === 'BISCOTTO_BETRAYAL' || (e.type === 'BRIBED_DECISION' && e.description.includes('transformă')) || (e.type === 'PENALTY' && !e.description.includes('RATAT')))
    ).length,
  ];

  const currentSnapshot = matchResult.minuteSnapshots?.find((s) => s.minute === currentMinute);
  const currentStats = currentSnapshot?.stats || matchResult.finalStats;

  const managerCountry = activeManager ? (COUNTRIES[activeManager.countryCode] || COUNTRIES.RO) : COUNTRIES.RO;

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-blue-600 selection:text-white pb-16">
      
      {/* ─── Header Principal Unificat ─── */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1550px] items-center justify-between gap-3 px-4 py-2 sm:px-6">
          
          {/* Logo & Info Club Activ */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Logo Brand */}
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => setActiveTab('control')}
              title="Acasă / Panou Control"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 text-lg transition-transform group-hover:scale-105">
                ⚽
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                  <span>FootbALL-IN</span>
                  <span className="rounded bg-blue-900/60 text-blue-400 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase border border-blue-700/40">
                    SP
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 font-medium mt-0.5">
                  SoccerProject Classic
                </div>
              </div>
            </div>

            {/* Club Status Pill */}
            <div 
              onClick={() => setActiveTab('control')}
              className="flex items-center gap-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 px-2.5 py-1 cursor-pointer transition shadow-inner"
              title="Clubul Tău Activ (Click pentru Panou Control)"
            >
              <span className="text-sm">{managerCountry.flag}</span>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-zinc-100 max-w-[130px] sm:max-w-[170px] truncate leading-tight">
                  {activeManager ? activeManager.teamName : homeTeam.name}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 leading-tight">
                  €{finances.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Navigare Tab-uri (Central) */}
          <div className="flex-1 flex items-center justify-center overflow-x-auto no-scrollbar py-1">
            <nav className="flex items-center gap-1 rounded-xl bg-zinc-900/90 p-1 border border-zinc-800/80 text-xs shadow-inner shrink-0">
              <button
                onClick={() => setActiveTab('match')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-bold transition-all whitespace-nowrap ${
                  activeTab === 'match'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span>🏟️</span>
                <span>{t('nav_match')}</span>
              </button>

              <button
                onClick={() => setActiveTab('tactics')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-bold transition-all whitespace-nowrap ${
                  activeTab === 'tactics'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span>📋</span>
                <span>{t('nav_tactics')}</span>
              </button>

              <button
                onClick={() => setActiveTab('training')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-bold transition-all whitespace-nowrap ${
                  activeTab === 'training'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span>🏃</span>
                <span>{t('nav_training')}</span>
              </button>

              <button
                onClick={() => setActiveTab('standings')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-bold transition-all whitespace-nowrap ${
                  activeTab === 'standings'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span>🏆</span>
                <span>{t('nav_standings')}</span>
              </button>

              <button
                onClick={() => setActiveTab('staff')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-bold transition-all whitespace-nowrap ${
                  activeTab === 'staff'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span>👔</span>
                <span>{t('nav_staff')}</span>
              </button>

              <button
                onClick={() => setActiveTab('transfers')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-bold transition-all whitespace-nowrap ${
                  activeTab === 'transfers'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span>🤝</span>
                <span>{t('nav_transfers')}</span>
              </button>

              <button
                onClick={() => setActiveTab('control')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-bold transition-all whitespace-nowrap ${
                  activeTab === 'control'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span>⚙️</span>
                <span>{t('nav_control')}</span>
              </button>
            </nav>
          </div>

          {/* Acțiuni Dreapta (Google Auth + Selector Limbă) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Google / Gmail Login Button */}
            <GoogleAuthButton 
              onAuthChange={(u) => {
                if (u && !activeManager) {
                  setIsRegistrationModalOpen(true);
                }
              }}
            />

            {/* Selector Unic Limbă */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
              <button 
                onClick={() => handleLanguageChange('ro')}
                className={`px-2 py-1 rounded-lg font-bold transition ${language === 'ro' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                title="Română"
              >
                RO
              </button>
              <button 
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded-lg font-bold transition ${language === 'en' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                title="English"
              >
                EN
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ─── Main Content Area ─── */}
      <main className="mx-auto max-w-[1450px] px-4 py-6 sm:px-6 space-y-6">

        {/* Spațiu Publicitar / Partener Oficial (Monetizare) */}
        <AdBanner format="leaderboard" className="mb-2" />

        {/* Tab-ul 1: Meciul Zilei */}
        {activeTab === 'match' && (
          <div className="space-y-6">
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

            {/* Biroul Patronului (Culise & Arbitraj) */}
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

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                <button
                  onClick={() => handleApplyCorruptionAndRestart('none', bribeAmount, false)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    bribeTeam === 'none' && !biscottoEnabled
                      ? 'border-emerald-500/50 bg-emerald-950/50 text-emerald-300 shadow-md ring-1 ring-emerald-500/30'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <span>⚖️</span>
                  <span>Joc Curat (Sportiv)</span>
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

            {/* Timeline */}
            <MatchTimeline
              currentMinute={currentMinute}
              timelineEvents={matchResult.timelineEvents}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              extraTime={matchResult.extraTime}
            />

            {/* Ticker & Statistici */}
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

        {/* Tab-ul 2: Așezare Tactică */}
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

        {/* Tab-ul 3: Antrenament & Refacere */}
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

        {/* Tab-ul 4: Clasament Divizia A (16 Echipe, Steaguri, Boți SP) */}
        {activeTab === 'standings' && (
          <div className="space-y-6">
            <LeagueTableView
              divisionTeams={divisionTeams}
              language={language}
              onOpenTeamDetails={(team) => {
                if (team.isBot) {
                  setIsRegistrationModalOpen(true);
                }
              }}
            />
          </div>
        )}

        {/* Tab-ul 5: Personal & Buget (Staff) */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <StaffManagementView
              finances={finances}
              language={language}
              onFinancesUpdate={(newFinances) => {
                setFinances(newFinances);
                saveClubFinances(newFinances);
              }}
            />
          </div>
        )}

        {/* Tab-ul 6: Piață de Transferuri (SoccerProject Style) */}
        {activeTab === 'transfers' && (
          <div className="space-y-6">
            <TransferMarketView
              language={language}
              activeManager={activeManager}
              finances={finances}
              userSquad={[...homeTeam.lineup, ...homeTeam.bench]}
              onPlayerAcquired={(newPlayer) => {
                setHomeTeam(prev => {
                  const updatedBench = [...prev.bench, newPlayer];
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('footballin_user_squad', JSON.stringify([...prev.lineup, ...updatedBench]));
                  }
                  return {
                    ...prev,
                    bench: updatedBench
                  };
                });
                setFinances(loadClubFinances());
              }}
              onFinancesUpdated={() => {
                setFinances(loadClubFinances());
              }}
            />
          </div>
        )}

        {/* Tab-ul 6: Panou de Control Manager */}
        {activeTab === 'control' && (
          <div className="space-y-6">
            <ControlPanelView
              manager={activeManager}
              finances={finances}
              language={language}
              onLanguageChange={handleLanguageChange}
              onOpenRegistration={() => setIsRegistrationModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {/* Modal Înregistrare Manager & Preluare Echipă Bot */}
        <ManagerRegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          botTeams={divisionTeams}
          language={language}
          onRegistrationComplete={handleRegistrationComplete}
        />

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
