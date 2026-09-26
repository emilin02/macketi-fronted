'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';


// ============================================================
// COMPONENTE
// ============================================================

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------------------------------------
  // HANDLER DE SUBMIT
  // ----------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación básica antes de enviar.
    if (!email.trim() || !password) {
      setError('Introduce tu email y contraseña.');
      return;
    }

    setIsLoading(true);

    const result = await login(email.trim(), password);

    setIsLoading(false);

    if (result.success) {
      // Login correcto → redirigimos a la home.
      router.push('/');
      router.refresh();
    } else {
      setError(result.error || 'Error al iniciar sesión.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ============================================================
          CAMPO DE EMAIL
      ============================================================ */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-macketi-navy mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-macketi-gray bg-white text-sm focus:outline-none focus:border-macketi-yellow disabled:opacity-60"
          />
        </div>
      </div>

      {/* ============================================================
          CAMPO DE CONTRASEÑA
      ============================================================ */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-macketi-navy mb-1">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-macketi-gray bg-white text-sm focus:outline-none focus:border-macketi-yellow disabled:opacity-60"
          />
        </div>
      </div>

      {/* ============================================================
          MENSAJE DE ERROR
      ============================================================ */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* ============================================================
          BOTÓN DE LOGIN
      ============================================================ */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-macketi-yellow hover:bg-macketi-yellow-dark text-macketi-navy font-bold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Iniciando sesión...</span>
          </>
        ) : (
          <span>Iniciar sesión</span>
        )}
      </button>

    </form>
  );
}