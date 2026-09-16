'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { COUNTRIES_LIST } from '../engine/countries';
import { Language, getTranslation } from '../engine/i18n';

interface ManagerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAuthSuccess?: () => void;
  initialTab?: 'login' | 'register';
  contextMessage?: string | null;
}

export const ManagerRegistrationModal: React.FC<ManagerRegistrationModalProps> = ({
  isOpen,
  onClose,
  language,
  onAuthSuccess,
  initialTab = 'login',
  contextMessage = null,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  // Tab: 'login' | 'register'
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [username, setUsername] = useState('');
  const [teamName, setTeamName] = useState('');
  const [stadiumName, setStadiumName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('RO');
  const [noOtherAccountsConfirmed, setNoOtherAccountsConfirmed] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      console.error(err);
      setErrorMessage('Autentificarea cu Google a eșuat.');
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMessage('Introdu numele de manager/email-ul și parola.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        identifier: loginIdentifier.trim(),
        password: loginPassword,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Autentificare reușită! Se încarcă biroul de manager...');
      setTimeout(() => {
        setIsLoading(false);
        onClose();
        if (onAuthSuccess) onAuthSuccess();
        window.location.reload();
      }, 700);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Eroare de conexiune la server.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !teamName.trim() || !stadiumName.trim() || !email.trim() || !password) {
      setErrorMessage('Toate câmpurile marcate cu steluță sunt obligatorii.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Parola trebuie să conțină cel puțin 6 caractere.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Parolele introduse nu coincid.');
      return;
    }

    if (!noOtherAccountsConfirmed) {
      setErrorMessage('Trebuie să confirmi că respecți regula anti-multi-account!');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
          teamName: teamName.trim(),
          stadiumName: stadiumName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Înregistrarea a eșuat.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage(`Clubul "${data.team?.name || teamName}" a fost creat cu succes! Se realizează logarea...`);

      // Auto login după înregistrare
      const loginRes = await signIn('credentials', {
        redirect: false,
        identifier: email.trim().toLowerCase(),
        password,
      });

      if (loginRes?.ok) {
        setTimeout(() => {
          setIsLoading(false);
          onClose();
          if (onAuthSuccess) onAuthSuccess();
          window.location.reload();
        }, 1000);
      } else {
        setIsLoading(false);
        setTab('login');
        setLoginIdentifier(email.trim());
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('A apărut o eroare la conexiunea cu serverul.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 md:p-8 max-w-xl w-full shadow-2xl text-zinc-200 space-y-5">
        
        {/* Glow de fundal */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-emerald-600/10 blur-3xl" />

        {/* Antet Modal */}
        <div className="border-b border-zinc-800/80 pb-3 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
              <span>⚽</span> FootbALL-IN Manager
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Conectează-te sau preia o echipă din ligile oficiale (A, B1, B2, B3)
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-base bg-zinc-800/60 hover:bg-zinc-800 rounded-lg w-8 h-8 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Banner Contextual pentru Acțiuni Rezervate Managerilor */}
        {contextMessage && (
          <div className="bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5 shadow-md">
            <span className="text-base shrink-0">🔒</span>
            <div>
              <span className="font-bold text-amber-100">Acțiune rezervată managerilor înregistrați:</span>
              <p className="mt-0.5 text-amber-300/90 text-[11px] leading-relaxed">{contextMessage}</p>
            </div>
          </div>
        )}

        {/* Tabs de navigare Login / Register */}
        <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMessage(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              tab === 'login'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🔐 Autentificare (Login)
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMessage(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              tab === 'register'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📝 Înregistrare Club Nou
          </button>
        </div>

        {/* Mesaj de Eroare */}
        {errorMessage && (
          <div className="bg-rose-950/70 border border-rose-600/60 text-rose-300 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mesaj de Succes */}
        {successMessage && (
          <div className="bg-emerald-950/70 border border-emerald-600/60 text-emerald-300 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Buton Google OAuth */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm shrink-0">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Autentificare Rapidă Google</div>
              <div className="text-[11px] text-zinc-400">Intră direct cu adresa ta de Gmail.</div>
            </div>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
            className="w-full sm:w-auto rounded-lg bg-white hover:bg-zinc-100 text-zinc-900 px-4 py-2 text-xs font-black transition shadow-sm whitespace-nowrap active:scale-95 disabled:opacity-50"
          >
            Google Sign In
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-800 w-full"></div>
          <span className="bg-zinc-950 px-3 text-[10px] text-zinc-500 uppercase font-bold tracking-wider">sau</span>
          <div className="border-t border-zinc-800 w-full"></div>
        </div>

        {/* TAB LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Email sau Nume Manager
              </label>
              <input 
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="Ex: manager@fotbal.ro sau Simi"
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Parolă
              </label>
              <input 
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition"
              >
                Închide
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-lg border border-blue-500/50 transition active:translate-y-0.5 flex items-center gap-2"
              >
                <span>🚀</span>
                <span>{isLoading ? 'Se conectează...' : 'Conectează-te'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB REGISTER */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              {/* Nume Manager */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Nume Manager <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: cipriansimi"
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Adresă Email <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@gmail.com"
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Parolă */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Parolă (min. 6 caractere) <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Confirmare Parolă */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Confirmă Parola <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Numele Echipei */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Numele Echipei Tale <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Ex: FC Progresul București"
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Numele Stadionului */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Numele Stadionului <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={stadiumName}
                  onChange={(e) => setStadiumName(e.target.value)}
                  placeholder="Ex: Arena Cotroceni"
                  className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

            </div>

            {/* Notă explicativă Bot Takeover */}
            <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl text-[11px] text-blue-200/90 leading-relaxed flex items-start gap-2.5">
              <span className="text-base shrink-0">🏟️</span>
              <div>
                <span className="font-bold text-white">Alocare Automată & Buget de Start:</span> Vei prelua imediat o echipă existentă deținută de un bot dintr-o divizie activă (B3/B2/B1/A) cu un lot complet de 22 de jucători, stadion propriu și un buget de start de <strong>5.000.000 €</strong>!
              </div>
            </div>

            {/* Checkbox Anti-Multi-Account */}
            <div className="flex items-center gap-3 pt-1">
              <input 
                type="checkbox"
                id="confirmMulti"
                required
                checked={noOtherAccountsConfirmed}
                onChange={(e) => setNoOtherAccountsConfirmed(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="confirmMulti" className="text-xs text-zinc-300 font-medium cursor-pointer select-none">
                Declar pe propria răspundere că nu dețin alt club în FootbALL-IN (Fair Play).
              </label>
            </div>

            {/* Buton Submit */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition"
              >
                Anulează
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-lg border border-emerald-500/50 transition active:translate-y-0.5 flex items-center gap-2"
              >
                <span>⭐</span>
                <span>{isLoading ? 'Se creează clubul...' : 'Înregistrează-te & Preluare Echipă'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
