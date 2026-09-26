'use client';

// ============================================================
// PÁGINA DE CHECKOUT
// ============================================================

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useIsClient } from '@/hooks/useIsClient';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';


export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const { isAuthenticated } = useAuth();
  const isClient = useIsClient();

  const isEmpty = items.length === 0;

  // ----------------------------------------------------------
  // PROTECCIÓN DE RUTA
  // ----------------------------------------------------------
  // Si no está logueado, redirigimos a /login.
  // Si el carrito está vacío, redirigimos a /carrito.
  useEffect(() => {
    if (!isClient) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isEmpty) {
      router.push('/carrito');
      return;
    }
  }, [isClient, isAuthenticated, isEmpty, router]);

  // Mientras se comprueba, no renderizamos nada.
  if (!isClient || !isAuthenticated || isEmpty) {
    return null;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">

      {/* ============================================================
          CABECERA
      ============================================================ */}
      <div className="mb-6">
        <Link
          href="/carrito"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-macketi-navy mb-3"
        >
          <ArrowLeft size={14} />
          <span>Volver al carrito</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-macketi-navy">
          Finalizar compra
        </h1>
      </div>

      {/* ============================================================
          LAYOUT: formulario + resumen
      ============================================================ */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div>
          <CheckoutForm />
        </div>
        <OrderSummary />
      </div>
    </div>
  );
}