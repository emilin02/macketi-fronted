'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  MapPin,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
} from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useIsClient } from '@/hooks/useIsClient';
import CartDrawer from '@/components/cart/CartDrawer';


// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function Header() {
  // ----------------------------------------------------------
  // HOOKS
  // ----------------------------------------------------------
  const { itemCount } = useCart();
  const isClient = useIsClient();

  // ----------------------------------------------------------
  // ESTADO DEL DRAWER
  // ----------------------------------------------------------
  // Controla si el panel lateral del carrito está abierto.
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-macketi-gray">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-4">

          {/* ============================================================
              BLOQUE 1: LOGO
          ============================================================ */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-full.png"
              alt="Macketi"
              width={140}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* ============================================================
              BLOQUE 2: BUSCADOR
          ============================================================ */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="¿Qué estás buscando?"
                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-macketi-gray bg-white text-sm focus:outline-none focus:border-macketi-yellow"
              />
            </div>
          </div>

          {/* ============================================================
              BLOQUE 3: UBICACIÓN
          ============================================================ */}
          <button className="flex items-center gap-1.5 text-sm font-medium text-macketi-navy hover:text-macketi-yellow-dark">
            <MapPin size={18} />
            <span>Malabo</span>
            <ChevronDown size={14} />
          </button>

          {/* ============================================================
              BLOQUE 4: MI CUENTA
          ============================================================ */}
          <Link
            href="/cuenta"
            className="flex items-center gap-1.5 text-sm font-medium text-macketi-navy hover:text-macketi-yellow-dark"
          >
            <User size={18} />
            <span>Mi cuenta</span>
          </Link>

          {/* ============================================================
              BLOQUE 5: FAVORITOS
          ============================================================ */}
          <Link
            href="/favoritos"
            className="flex items-center gap-1.5 text-sm font-medium text-macketi-navy hover:text-macketi-yellow-dark"
          >
            <Heart size={18} />
            <span>Favoritos</span>
          </Link>

          {/* ============================================================
              BLOQUE 6: CARRITO (abre el drawer)
          ============================================================ */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 text-sm font-medium text-macketi-navy hover:text-macketi-yellow-dark"
            aria-label="Abrir carrito de compras"
          >
            <div className="relative">
              <ShoppingCart size={20} />

              {isClient && itemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-macketi-yellow text-macketi-navy text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center"
                  aria-label={`${itemCount} productos en el carrito`}
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </div>
            <span>Carrito</span>
          </button>

        </div>
      </header>

      {/* ============================================================
          DRAWER DEL CARRITO
          ============================================================
          - Se renderiza fuera del header para que quede por encima
            de todo el contenido.
      ============================================================ */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}