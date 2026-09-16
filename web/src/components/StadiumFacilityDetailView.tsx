'use client';

import React from 'react';
import { 
  StadiumCategory, 
  StadiumData, 
  DetailedUpgradeOption,
  PITCH_UPGRADE_OPTIONS,
  STANDS_UPGRADE_OPTIONS,
  PARKING_UPGRADE_OPTIONS,
  TOILETS_UPGRADE_OPTIONS,
  BARS_UPGRADE_OPTIONS
} from '../engine/stadiumEngine';
import { ClubFinances } from '../engine/financeEngine';

interface StadiumFacilityDetailViewProps {
  category: StadiumCategory;
  stadium: StadiumData;
  stadiumName: string;
  finances: ClubFinances;
  onExecuteUpgrade: (category: StadiumCategory, option: DetailedUpgradeOption) => void;
  onBack: () => void;
}

export const StadiumFacilityDetailView: React.FC<StadiumFacilityDetailViewProps> = ({
  category,
  stadium,
  stadiumName,
  finances,
  onExecuteUpgrade,
  onBack,
}) => {
  const currentPitchType = stadium.pitchType || 'Doar iarbă naturală';
  const pitchQuality = stadium.pitchQuality || 40;

  // Opțiunile de upgrade conform categoriei
  const getOptions = (): DetailedUpgradeOption[] => {
    switch (category) {
      case 'PITCH':   return PITCH_UPGRADE_OPTIONS;
      case 'SEATS':   return STANDS_UPGRADE_OPTIONS;
      case 'PARKING': return PARKING_UPGRADE_OPTIONS;
      case 'TOILETS': return TOILETS_UPGRADE_OPTIONS;
      case 'BARS':    return BARS_UPGRADE_OPTIONS;
      default:        return [];
    }
  };

  const options = getOptions();

  // Titlul ecranului fidel SoccerProject
  const getHeaderTitle = () => {
    switch (category) {
      case 'PITCH':   return `Terenul / Iarba stadionului ${stadiumName}`;
      case 'SEATS':   return stadiumName;
      case 'PARKING': return `Locurile de parcare la stadionul ${stadiumName}`;
      case 'TOILETS': return `Toalete în stadionul ${stadiumName}`;
      case 'BARS':    return `Baruri in stadionul ${stadiumName}`;
      default:        return stadiumName;
    }
  };

  // Render bară segmentată stare teren (roșu/roz când degradat, verde când bun)
  const renderPitchConditionBar = (quality: number) => {
    const totalSegments = 28;
    const filledCount = Math.round((Math.max(0, Math.min(100, quality)) / 100) * totalSegments);

    return (
      <div className="flex items-center gap-[1px] p-[2px] bg-zinc-950/90 rounded border border-zinc-700/60 w-fit">
        {Array.from({ length: totalSegments }).map((_, i) => (
          <div
            key={i}
            className={`w-[4.5px] h-[9px] rounded-[0.5px] ${
              i < filledCount 
                ? quality < 60
                  ? 'bg-gradient-to-t from-rose-600 to-pink-500 shadow-[0_0_2px_rgba(244,63,94,0.6)]'
                  : 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-[0_0_2px_rgba(45,212,191,0.6)]'
                : 'bg-zinc-800/80'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl space-y-4 font-sans text-zinc-100">
      
      {/* ─── Titlu Secțiune cu linie punctată clasică SoccerProject ─── */}
      <div className="border-b border-dashed border-zinc-700 pb-2">
        <h2 className="text-base font-black text-white tracking-wide">
          {getHeaderTitle()}
        </h2>
      </div>

      {/* ─── Informații Stare Curentă & Sentiment Fani ─── */}
      <div className="space-y-1.5 text-xs">
        {category === 'PITCH' && (
          <>
            <div className="flex items-center gap-3 py-1">
              <span className="font-semibold text-zinc-300">Starea terenului</span>
              {renderPitchConditionBar(pitchQuality)}
            </div>
            <div className="text-zinc-300">
              Terenul este de tip <strong className="text-white font-bold">{currentPitchType}</strong>
            </div>
            {pitchQuality < 60 ? (
              <div className="text-rose-400 font-semibold pt-1">
                Acum chiar trebuie să instalezi un gazon nou
              </div>
            ) : (
              <div className="text-emerald-400 font-semibold pt-1">
                Terenul este într-o stare excelentă pentru meciuri oficiale.
              </div>
            )}
          </>
        )}

        {category === 'SEATS' && (
          <div className="text-zinc-300">
            <strong className="text-white font-bold">Secţiunea nordică: {stadium.seats.toLocaleString()} Locuri</strong>
          </div>
        )}

        {category === 'PARKING' && (
          <>
            <div className="text-zinc-300">
              În acest moment ai spaţiu pentru <strong className="text-white font-bold">{stadium.parking.toLocaleString()} maşini</strong>
            </div>
            {stadium.parking < stadium.seats * 0.35 ? (
              <div className="text-amber-400 font-medium pt-0.5">
                Fanii sunt nemulţumiţi de situaţia actuală, sunt supăraţi şi unii se gândesc să lipseasca la unele meciuri de acasă!
              </div>
            ) : (
              <div className="text-emerald-400 font-medium pt-0.5">
                Fanii sunt mulţumiţi de situaţia actuală
              </div>
            )}
          </>
        )}

        {category === 'TOILETS' && (
          <>
            <div className="text-zinc-300">
              În acest moment sunt <strong className="text-white font-bold">{stadium.toilets.toLocaleString()} toalete</strong>
            </div>
            {stadium.toilets < stadium.seats / 30 ? (
              <div className="text-amber-400 font-medium pt-0.5">
                Fanii sunt nemulţumiţi de situaţia actuală, cozile sunt prea lungi la pauză!
              </div>
            ) : (
              <div className="text-emerald-400 font-medium pt-0.5">
                Fanii sunt mulţumiţi de situaţia actuală
              </div>
            )}
          </>
        )}

        {category === 'BARS' && (
          <>
            <div className="text-zinc-300">
              În acest moment sunt <strong className="text-white font-bold">{stadium.bars.toLocaleString()} baruri</strong>
            </div>
            {stadium.bars < stadium.seats / 120 ? (
              <div className="text-amber-400 font-medium pt-0.5">
                Fanii sunt nemulţumiţi de situaţia actuală, sunt supăraţi şi unii se gândesc să lipseasca la unele meciuri de acasă!
              </div>
            ) : (
              <div className="text-emerald-400 font-medium pt-0.5">
                Fanii sunt mulţumiţi de situaţia actuală
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Tabel Opțiuni Upgrade 1-la-1 SoccerProject ─── */}
      <div className="overflow-x-auto rounded-xl border border-sky-900/60 bg-zinc-950/70 mt-3">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-sky-900/60 bg-sky-950/20 text-sky-200 font-bold">
              <th className="py-2.5 px-4 text-left">Upgradează</th>
              <th className="py-2.5 px-4 text-center w-24">Durată</th>
              <th className="py-2.5 px-4 text-right w-36">Preţ</th>
              <th className="py-2.5 px-6 text-center w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {options.map((opt, idx) => {
              const canAfford = finances.balance >= opt.cost;

              return (
                <tr key={idx} className="hover:bg-sky-950/30 transition-colors">
                  <td className="py-2 px-4 font-semibold text-zinc-200">
                    {opt.label}
                  </td>
                  <td className="py-2 px-4 text-center font-mono text-zinc-300">
                    {opt.durationDays} {opt.durationDays === 1 ? 'zi' : 'zile'}
                  </td>
                  <td className="py-2 px-4 text-right font-mono font-bold text-sky-300">
                    € {opt.cost.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 px-6 text-center">
                    <button
                      onClick={() => onExecuteUpgrade(category, opt)}
                      disabled={!canAfford}
                      className={`text-xs font-bold transition hover:underline ${
                        canAfford 
                          ? 'text-sky-400 hover:text-sky-300 cursor-pointer' 
                          : 'text-zinc-600 cursor-not-allowed'
                      }`}
                      title={!canAfford ? 'Fonduri insuficiente în bugetul clubului' : 'Lansează lucrarea'}
                    >
                      Execută
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Buton Revenire la Vederea Generală a Stadionului ─── */}
      <div className="pt-2">
        <button
          onClick={onBack}
          className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-sky-300 hover:text-white font-bold text-xs border border-sky-600/80 shadow-sm transition"
        >
          {stadiumName || 'Stadion'}
        </button>
      </div>

    </div>
  );
};
