// ============================================================
// PÁGINA DE LOGIN
// ============================================================

import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';


export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* ============================================================
            CABECERA
        ============================================================ */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-macketi-navy mb-2">
            Inicia sesión en Macketi
          </h1>
          <p className="text-sm text-gray-500">
            Accede a tu cuenta para gestionar tus pedidos y direcciones.
          </p>
        </div>

        {/* ============================================================
            FORMULARIO
        ============================================================ */}
        <div className="bg-white border border-macketi-gray rounded-2xl p-6 md:p-8">
          <LoginForm />
        </div>

        {/* ============================================================
            ENLACE A REGISTRO
            ============================================================
            El registro aún no está implementado. Dejamos el enlace
            pero lo desactivamos visualmente.
        ============================================================ */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{' '}
          <span className="text-macketi-navy font-semibold cursor-not-allowed opacity-60">
            Regístrate (próximamente)
          </span>
        </p>
      </div>
    </div>
  );
}