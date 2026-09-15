import React, { useState } from 'react';
import { COUNTRIES_LIST, COUNTRIES } from '../engine/countries';
import { DivisionTeam, takeoverBotTeam, ManagerProfile } from '../engine/divisionEngine';
import { Player } from '../engine/types';
import { Language, getTranslation } from '../engine/i18n';

interface ManagerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  botTeams: DivisionTeam[];
  language: Language;
  onRegistrationComplete: (manager: ManagerProfile, squad: Player[]) => void;
}

export const ManagerRegistrationModal: React.FC<ManagerRegistrationModalProps> = ({
  isOpen,
  onClose,
  botTeams,
  language,
  onRegistrationComplete
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const [username, setUsername] = useState('');
  const [teamName, setTeamName] = useState('');
  const [stadiumName, setStadiumName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('RO');
  const [selectedBotTeamId, setSelectedBotTeamId] = useState(botTeams[0]?.id || 'div-11');
  const [noOtherAccountsConfirmed, setNoOtherAccountsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !teamName.trim() || !stadiumName.trim() || !email.trim()) {
      setErrorMessage(t('reg_error_all_fields'));
      return;
    }
    if (!noOtherAccountsConfirmed) {
      setErrorMessage('Trebuie să bifezi confirmarea că nu deții altă echipă!');
      return;
    }

    // Preluarea echipei bot
    const result = takeoverBotTeam(
      selectedBotTeamId,
      username.trim(),
      teamName.trim(),
      stadiumName.trim(),
      email.trim(),
      selectedCountry
    );

    onRegistrationComplete(result.manager, result.squad);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 md:p-8 max-w-2xl w-full shadow-2xl text-zinc-200 space-y-5">
        
        {/* Glow de fundal */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-emerald-600/10 blur-3xl" />

        {/* Antet Formular Fidel SoccerProject */}
        <div className="border-b border-zinc-800/80 pb-3 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {t('reg_title')}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {t('reg_subtitle')}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-lg bg-zinc-800/60 hover:bg-zinc-800 rounded-lg w-8 h-8 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Mesaj de Eroare */}
        {errorMessage && (
          <div className="bg-rose-950/60 border border-rose-600/50 text-rose-300 text-xs px-4 py-2.5 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Formular Înregistrare */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Logare */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                {t('reg_username')} <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: cipriansimi"
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 2. Numele Echipei */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                {t('reg_team_name')} <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Ex: FC Progresul București"
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 3. Numele Stadionului */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                {t('reg_stadium_name')} <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                value={stadiumName}
                onChange={(e) => setStadiumName(e.target.value)}
                placeholder="Ex: Arena Cotroceni"
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 4. Adresă E-Mail */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                {t('reg_email')} <span className="text-rose-500">*</span>
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@fotbal.ro"
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 5. Țară & Steag */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                {t('reg_country')} <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                {COUNTRIES_LIST.map((c) => (
                  <option key={c.code} value={c.code} className="bg-zinc-950 text-white">
                    {c.flag} {language === 'ro' ? c.nameRo : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Echipa Bot de Preluat */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                {t('reg_bot_takeover_select')}
              </label>
              <select
                value={selectedBotTeamId}
                onChange={(e) => setSelectedBotTeamId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 font-mono"
              >
                {botTeams.filter(b => b.isBot).map((b) => (
                  <option key={b.id} value={b.id} className="bg-zinc-950 text-white">
                    🤖 {b.name} (Locul {botTeams.indexOf(b) + 1}, {b.points} pct)
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Notă explicativă Bot Takeover */}
          <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-lg text-[11px] text-blue-300/90 leading-relaxed flex items-center gap-2">
            <span className="text-base">ℹ️</span>
            <span>{t('reg_bot_takeover_note')}</span>
          </div>

          {/* Checkbox No Multi-Accounts */}
          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox"
              id="confirmMulti"
              checked={noOtherAccountsConfirmed}
              onChange={(e) => setNoOtherAccountsConfirmed(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="confirmMulti" className="text-xs text-zinc-300 font-medium cursor-pointer select-none">
              {t('reg_no_multi_accounts')}
            </label>
          </div>

          {/* Buton Submit */}
          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition"
            >
              Anulează
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg border border-blue-500/50 transition active:translate-y-0.5 flex items-center gap-2"
            >
              <span>🚀</span>
              <span>{t('reg_submit')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
