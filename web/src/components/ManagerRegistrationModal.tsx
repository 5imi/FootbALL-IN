import React, { useState } from 'react';
import { COUNTRIES_LIST, COUNTRIES } from '../engine/countries';
import { DivisionTeam, assignRandomBotTeam, ManagerProfile } from '../engine/divisionEngine';
import { Player } from '../engine/types';
import { Language, getTranslation } from '../engine/i18n';
import { signInWithGoogle } from '../engine/authEngine';

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
  const [noOtherAccountsConfirmed, setNoOtherAccountsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleQuickRegister = () => {
    const authUser = signInWithGoogle();
    const gUsername = authUser.displayName.replace(/\s+/g, '').toLowerCase();
    const gTeam = `FC ${authUser.displayName}`;
    const gStadium = `Arena ${authUser.displayName.split(' ')[0] || 'Central'}`;
    
    // Alocare automată aleatorie
    const result = assignRandomBotTeam(
      gUsername,
      gTeam,
      gStadium,
      authUser.email,
      selectedCountry
    );

    onRegistrationComplete(result.manager, result.squad);
    onClose();
  };

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

    // Jocul alocă o echipă bot aleatorie (Regulă oficială SP)
    const result = assignRandomBotTeam(
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

        {/* Înregistrare Instantă cu Google */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Vrei să începi direct?</div>
              <div className="text-[11px] text-zinc-400">Crează-ți clubul cu 1 singur click prin contul tău Google / Gmail.</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGoogleQuickRegister}
            className="w-full sm:w-auto rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 px-4 py-2 text-xs font-extrabold transition shadow-md whitespace-nowrap active:scale-95"
          >
            Înregistrează-te cu Google
          </button>
        </div>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-zinc-800 w-full"></div>
          <span className="bg-zinc-950 px-3 text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Sau completează manual</span>
          <div className="border-t border-zinc-800 w-full"></div>
        </div>

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
                placeholder="manager@gmail.com"
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

            {/* 6. Alocare Automată Echipă Bot (Regulă SP) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Alocare Divizia A</span>
                <span className="text-[10px] text-emerald-400 font-normal">🎲 Aleatoriu</span>
              </label>
              <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 p-2.5 text-xs text-zinc-300 flex items-center gap-2">
                <span className="text-base">🤖</span>
                <div>
                  <div className="font-bold text-white text-[11px]">Echipă Bot Alocată Aleatoriu</div>
                  <div className="text-[10px] text-zinc-400">Jocul îți atribuie automat un loc disponibil de bot.</div>
                </div>
              </div>
            </div>

          </div>

          {/* Notă explicativă Bot Takeover */}
          <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-lg text-[11px] text-blue-300/90 leading-relaxed flex items-center gap-2">
            <span className="text-base">ℹ️</span>
            <span>Conform regulilor jocului, noul tău club va prelua în mod automat una dintre echipele bot din Divizia A și va primi un lot inițial de 24 de jucători.</span>
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
