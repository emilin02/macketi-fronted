'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

import { login as loginService, type AuthUser } from '@/services/auth';


// ============================================================
// TIPOS
// ============================================================

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}


// ============================================================
// CONSTANTES
// ============================================================

const STORAGE_KEY = 'macketi_auth';


// ============================================================
// CONTEXTO
// ============================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);


// ============================================================
// TIPO DEL ESTADO PERSISTIDO
// ============================================================

interface StoredAuth {
  token: string;
  user: AuthUser;
}


// ============================================================
// PROVIDER
// ============================================================

export function AuthProvider({ children }: AuthProviderProps) {
  // ----------------------------------------------------------
  // ESTADO (INICIALIZADO CON FUNCIÓN)
  // ----------------------------------------------------------
  // Leemos el token y el usuario de localStorage en la
  // inicialización del estado (no en useEffect, para evitar
  // cascada de renders).
  const [auth, setAuth] = useState<StoredAuth | null>(() => {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as StoredAuth;
    } catch (error) {
      console.warn('Error leyendo auth de localStorage:', error);
      return null;
    }
  });

  // ----------------------------------------------------------
  // PERSISTENCIA EN localStorage
  // ----------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (auth) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Error guardando auth en localStorage:', error);
    }
  }, [auth]);

  // ----------------------------------------------------------
  // LOGIN
  // ----------------------------------------------------------
  const login = useCallback(async (email: string, password: string) => {
    const result = await loginService(email, password);

    if (!result.success || !result.token || !result.user) {
      return { success: false, error: result.error || 'Error al iniciar sesión.' };
    }

    setAuth({ token: result.token, user: result.user });
    return { success: true };
  }, []);

  // ----------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------
  const logout = useCallback(() => {
    setAuth(null);
  }, []);

  // ----------------------------------------------------------
  // VALOR DERIVADO
  // ----------------------------------------------------------
  const value: AuthContextValue = {
    user: auth?.user || null,
    token: auth?.token || null,
    isAuthenticated: !!auth,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


// ============================================================
// HOOK
// ============================================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
}