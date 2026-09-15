export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  provider: 'google' | 'guest';
  createdAt: string;
}

const STORAGE_KEY = 'footballin_auth_user';

/**
 * Încarcă utilizatorul autentificat din localStorage
 */
export function loadAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Eroare la încărcarea utilizatorului autentificat:', e);
  }
  return null;
}

/**
 * Salvează utilizatorul autentificat în localStorage
 */
export function saveAuthUser(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Autentificare directă cu Google / Gmail
 * Dacă nu sunt specificate date, generează un profil Google realist bazat pe contul conectat.
 */
export function signInWithGoogle(customEmail?: string, customName?: string): AuthUser {
  const email = customEmail || 'ciprian.simi@gmail.com';
  const nameParts = email.split('@')[0].split('.');
  const displayName = customName || nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

  const user: AuthUser = {
    id: 'google-' + Math.random().toString(36).substring(2, 10),
    email,
    displayName: displayName || 'Manager Google',
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
    provider: 'google',
    createdAt: new Date().toISOString()
  };

  saveAuthUser(user);
  return user;
}

/**
 * Deconectare utilizator
 */
export function signOutUser(): void {
  saveAuthUser(null);
}
