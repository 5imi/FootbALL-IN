'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Language, getTranslation } from '../engine/i18n';
import { ClubFinances, spendClubBudget } from '../engine/financeEngine';
import {
  StadiumData,
  StadiumCategory,
  ALL_CATEGORIES,
  DEFAULT_STADIUM,
  getUpgradeInfo,
  calculateMatchRevenue,
  getStadiumRating,
  DetailedUpgradeOption,
} from '../engine/stadiumEngine';
import { StadiumFacilityDetailView } from './StadiumFacilityDetailView';

interface StadiumManagementViewProps {
  language: Language;
  finances: ClubFinances;
  isGuest: boolean;
  onRequireAuth: (message: string) => void;
  onFinancesUpdate: (newFinances: ClubFinances) => void;
  stadiumName: string;
}

export function StadiumManagementView({
  language,
  finances,
  isGuest,
  onRequireAuth,
  onFinancesUpdate,
  stadiumName,
}: StadiumManagementViewProps) {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  
  const [stadium, setStadium] = useState<StadiumData>(DEFAULT_STADIUM);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<StadiumCategory | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<StadiumCategory | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch stadium data from API
  const fetchStadium = useCallback(async () => {
    try {
      const res = await fetch('/api/stadium');
      if (res.ok) {
        const data = await res.json();
        if (data.stadium) {
          setStadium(data.stadium);
        }
      }
    } catch (err) {
      console.error('Error fetching stadium:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isGuest) {
      fetchStadium();
    } else {
      setLoading(false);
    }
  }, [isGuest, fetchStadium]);

  // Handle upgrade
  const handleUpgrade = async (category: StadiumCategory) => {
    if (isGuest) {
      onRequireAuth(
        language === 'ro'
          ? 'Trebuie să fii înregistrat pentru a face upgrade la stadion!'
          : 'You must be registered to upgrade the stadium!'
      );
      return;
    }

    const info = getUpgradeInfo(stadium, category, language);
    
    if (info.currentValue >= info.maxValue) {
      setErrorMsg(t('stadium_max'));
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    if (finances.balance < info.upgradeCost) {
      setErrorMsg(t('stadium_insufficient_funds'));
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    setUpgrading(category);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/stadium', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStadium(data.stadium);
        setSuccessMsg(`${t('stadium_upgrade_success')} -€${data.upgradeCost.toLocaleString()}`);
        
        // Update finances locally
        onFinancesUpdate({
          ...finances,
          balance: data.newBudget,
          transactions: [
            {
              id: `tx-${Date.now()}`,
              type: 'EXPENSE',
              category: 'BONUS',
              amount: data.upgradeCost,
              description: `Upgrade stadion: ${info.label}`,
              date: new Date().toLocaleDateString(),
            },
            ...finances.transactions,
          ],
        });

        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || 'Eroare la upgrade');
        setTimeout(() => setErrorMsg(null), 4000);
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      setErrorMsg('Eroare de conexiune');
      setTimeout(() => setErrorMsg(null), 3000);
    } finally {
      setUpgrading(null);
    }
  };

  // Modernizare detaliată fidelă SoccerProject (cu zile de lucru, costuri exacte și tipuri gazon)
  const handleExecuteDetailedUpgrade = (category: StadiumCategory, option: DetailedUpgradeOption) => {
    if (isGuest) {
      onRequireAuth(
        language === 'ro'
          ? 'Trebuie să fii înregistrat pentru a face modernizări la stadion!'
          : 'You must be registered to upgrade the stadium!'
      );
      return;
    }

    if (finances.balance < option.cost) {
      setErrorMsg(t('stadium_insufficient_funds'));
      setTimeout(() => setErrorMsg(null), 3500);
      return;
    }

    const spendResult = spendClubBudget(
      option.cost,
      'FACILITY_UPGRADE',
      `Modernizare stadion [${category}]: ${option.label} (Durată ${option.durationDays} zile)`
    );

    if (!spendResult.success) {
      setErrorMsg(t('stadium_insufficient_funds'));
      return;
    }

    onFinancesUpdate(spendResult.newFinances);

    // Actualizăm starea stadionului
    setStadium((prev) => {
      const next = { ...prev };
      if (category === 'PITCH') {
        next.pitchQuality = option.newPitchQuality || 100;
        next.pitchType = option.newPitchType || 'Doar iarbă naturală';
      } else if (category === 'SEATS') {
        next.seats += (option.increaseAmount || 0);
        next.capacity += (option.increaseAmount || 0);
      } else if (category === 'PARKING') {
        next.parking += (option.increaseAmount || 0);
      } else if (category === 'TOILETS') {
        next.toilets += (option.increaseAmount || 0);
      } else if (category === 'BARS') {
        next.bars += (option.increaseAmount || 0);
      }
      return next;
    });

    setSuccessMsg(`Lucrarea „${option.label}” a fost lansată cu succes! (Durată: ${option.durationDays} ${option.durationDays === 1 ? 'zi' : 'zile'}).`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const rating = getStadiumRating(stadium, language);
  const revenue = calculateMatchRevenue(stadium);

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-emerald-950/20 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-500/20 text-2xl">
              🏟️
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {t('stadium_title')}
              </h2>
              <p className="text-xs text-zinc-400 max-w-md">
                {t('stadium_desc')}
              </p>
            </div>
          </div>

          {/* Stadium Name & Rating */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-white">{stadiumName || 'Stadion Municipal'}</div>
              <div className="text-[11px] text-zinc-400">
                {t('stadium_comfort')}: {rating.comfortScore}%
              </div>
            </div>
            <div className="flex flex-col items-center bg-zinc-800/60 rounded-xl px-3 py-2 border border-zinc-700/50">
              <div className="text-lg leading-none">
                {'⭐'.repeat(rating.stars)}{'☆'.repeat(5 - rating.stars)}
              </div>
              <div className="text-[10px] font-bold text-emerald-400 mt-0.5">{rating.label}</div>
            </div>
          </div>
        </div>

        {/* Budget Pill */}
        <div className="mt-4 flex items-center gap-3 text-xs">
          <span className="text-zinc-500">{language === 'ro' ? 'Buget disponibil:' : 'Available budget:'}</span>
          <span className="rounded-lg bg-zinc-800/80 px-3 py-1 font-mono font-bold text-emerald-400 border border-zinc-700/50">
            €{finances.balance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ─── Toast Messages ─── */}
      {successMsg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm font-semibold text-emerald-300 flex items-center gap-2 animate-pulse">
          <span>✅</span> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm font-semibold text-red-300 flex items-center gap-2">
          <span>❌</span> {errorMsg}
        </div>
      )}

      {/* ─── Ecran Detaliat Facilitate (1-la-1 SoccerProject) sau Grilă Generală ─── */}
      {selectedFacility ? (
        <StadiumFacilityDetailView
          category={selectedFacility}
          stadium={stadium}
          stadiumName={stadiumName || 'Nada Florilor'}
          finances={finances}
          onExecuteUpgrade={handleExecuteDetailedUpgrade}
          onBack={() => setSelectedFacility(null)}
        />
      ) : (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_CATEGORIES.map((cat) => {
                const info = getUpgradeInfo(stadium, cat, language);
                const progressPercent = Math.min((info.currentValue / info.maxValue) * 100, 100);
                const isMax = info.currentValue >= info.maxValue;
                const isCurrentlyUpgrading = upgrading === cat;
                const canAfford = finances.balance >= info.upgradeCost;

                // Color themes per category
                const colorThemes: Record<StadiumCategory, { border: string; bg: string; bar: string; text: string; glow: string }> = {
                  SEATS: { border: 'border-blue-500/30', bg: 'from-blue-950/30', bar: 'bg-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
                  PARKING: { border: 'border-violet-500/30', bg: 'from-violet-950/30', bar: 'bg-violet-500', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
                  TOILETS: { border: 'border-cyan-500/30', bg: 'from-cyan-950/30', bar: 'bg-cyan-500', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
                  BARS: { border: 'border-amber-500/30', bg: 'from-amber-950/30', bar: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
                  PITCH: { border: 'border-emerald-500/30', bg: 'from-emerald-950/30', bar: 'bg-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
                  ADS: { border: 'border-pink-500/30', bg: 'from-pink-950/30', bar: 'bg-pink-500', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
                };

                const theme = colorThemes[cat];

                return (
                  <div
                    key={cat}
                    className={`rounded-xl border ${theme.border} bg-gradient-to-br ${theme.bg} to-zinc-900/90 p-4 shadow-lg ${theme.glow} transition-all hover:scale-[1.01] hover:shadow-xl`}
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{info.icon}</span>
                        <div>
                          <h3 className="text-sm font-bold text-white">{info.label}</h3>
                          <p className="text-[10px] text-zinc-500">{info.description}</p>
                        </div>
                      </div>
                      {isMax && (
                        <span className="rounded-md bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase">
                          {t('stadium_max')}
                        </span>
                      )}
                    </div>

                    {/* Current Value */}
                    <div className="mb-2">
                      <div className="flex items-end justify-between">
                        <span className={`text-2xl font-black ${theme.text} font-mono`}>
                          {info.currentValue.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium">
                          / {info.maxValue.toLocaleString()} {info.unit}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2.5 rounded-full bg-zinc-800/80 overflow-hidden mb-3">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${theme.bar} transition-all duration-700 ease-out`}
                        style={{ width: `${progressPercent}%` }}
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-white/5" />
                    </div>

                    {/* Effect Description */}
                    <p className="text-[10px] text-zinc-400 mb-3 italic">
                      ⬆️ {info.effect}
                    </p>

                    {/* Upgrade Button */}
                    <button
                      onClick={() => handleUpgrade(cat)}
                      disabled={isMax || isCurrentlyUpgrading}
                      className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                        isMax
                          ? 'bg-zinc-800/50 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                          : isCurrentlyUpgrading
                          ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-wait animate-pulse'
                          : canAfford
                          ? `bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/30`
                          : 'bg-zinc-800/60 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
                      }`}
                    >
                      {isCurrentlyUpgrading ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-500 border-t-white" />
                          <span>{language === 'ro' ? 'Se procesează...' : 'Processing...'}</span>
                        </>
                      ) : isMax ? (
                        <>
                          <span>🏆</span>
                          <span>{t('stadium_max')}</span>
                        </>
                      ) : (
                        <>
                          <span>🔨</span>
                          <span>{t('stadium_upgrade')}</span>
                          <span className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px]">
                            €{info.upgradeCost.toLocaleString()}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Buton Opțiuni & Detalii 1-la-1 SoccerProject */}
                    {cat !== 'ADS' && (
                      <button
                        onClick={() => setSelectedFacility(cat)}
                        className="w-full mt-2 py-1.5 rounded-lg border border-sky-600/40 text-sky-400 hover:text-white hover:bg-sky-950/60 font-bold text-[11px] transition flex items-center justify-center gap-1.5"
                      >
                        <span>📋</span>
                        <span>{language === 'ro' ? 'Opțiuni & Detalii SP' : 'SP Details & Options'} &rarr;</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ─── Revenue Estimator ─── */}
      <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-amber-950/15 p-5 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl">💰</span>
          <div>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              {t('stadium_revenue_title')}
            </h3>
            <p className="text-[10px] text-zinc-500">
              {language === 'ro' ? 'Calcul bazat pe infrastructura actuală și 60% popularitate' : 'Based on current infrastructure and 60% popularity'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Spectatori */}
          <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/40 p-3 text-center">
            <div className="text-[10px] text-zinc-500 mb-1">{t('stadium_attendance')}</div>
            <div className="text-lg font-black text-white font-mono">{revenue.attendance.toLocaleString()}</div>
            <div className="text-[9px] text-zinc-500">{revenue.attendancePercent}% {language === 'ro' ? 'capacitate' : 'capacity'}</div>
          </div>

          {/* Bilete */}
          <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/40 p-3 text-center">
            <div className="text-[10px] text-zinc-500 mb-1">{t('stadium_ticket_rev')}</div>
            <div className="text-lg font-black text-emerald-400 font-mono">€{revenue.ticketRevenue.toLocaleString()}</div>
            <div className="text-[9px] text-zinc-500">{t('stadium_ticket_price')}: €{stadium.ticketPrice}</div>
          </div>

          {/* Baruri */}
          <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/40 p-3 text-center">
            <div className="text-[10px] text-zinc-500 mb-1">{t('stadium_bar_rev')}</div>
            <div className="text-lg font-black text-amber-400 font-mono">€{revenue.barRevenue.toLocaleString()}</div>
            <div className="text-[9px] text-zinc-500">{stadium.bars} {language === 'ro' ? 'baruri active' : 'active bars'}</div>
          </div>

          {/* Sponsorizare */}
          <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/40 p-3 text-center">
            <div className="text-[10px] text-zinc-500 mb-1">{t('stadium_sponsor_rev')}</div>
            <div className="text-lg font-black text-pink-400 font-mono">€{revenue.sponsorRevenue.toLocaleString()}</div>
            <div className="text-[9px] text-zinc-500">{stadium.advertisingBoards} {language === 'ro' ? 'panouri' : 'boards'}</div>
          </div>
        </div>

        {/* Total Revenue Bar */}
        <div className="mt-4 rounded-xl bg-gradient-to-r from-emerald-950/50 to-amber-950/50 border border-emerald-500/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="text-sm font-bold text-zinc-300">{t('stadium_total_rev')}</span>
          </div>
          <span className="text-2xl font-black font-mono text-emerald-400">
            €{revenue.totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ─── Guest Banner ─── */}
      {isGuest && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <p className="text-xs text-amber-300">
              {language === 'ro'
                ? 'Înregistrează-te gratuit pentru a face upgrade la stadion și a genera venituri!'
                : 'Register for free to upgrade your stadium and generate revenue!'}
            </p>
          </div>
          <button
            onClick={() => onRequireAuth(
              language === 'ro'
                ? 'Înregistrează-te pentru a administra stadionul!'
                : 'Register to manage the stadium!'
            )}
            className="shrink-0 rounded-lg bg-amber-600 hover:bg-amber-500 px-4 py-2 text-xs font-bold text-white transition"
          >
            {language === 'ro' ? 'Înregistrează-te' : 'Register'}
          </button>
        </div>
      )}
    </div>
  );
}
