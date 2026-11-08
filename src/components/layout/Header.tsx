'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

// useState: para el estado del drawer del carrito.
import { useState } from 'react';

// next/image: componente optimizado de Next.js para imágenes.
// Se usa para el logo (lazy load, formatos modernos, responsive).
import Image from 'next/image';

// next/link: navegación del lado del cliente sin recargar la página.
// Se usa para el logo, "Favoritos" y el carrito.
import Link from 'next/link';

// lucide-react: librería de iconos SVG.
// - Search: lupa del buscador.
// - MapPin: icono de ubicación.
// - User: icono de cuenta.
// - Heart: icono de favoritos.
// - ShoppingCart: icono del carrito.
// - ChevronDown: flecha del desplegable de ubicación y cuenta.
import {
  Search,
  MapPin,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
} from 'lucide-react';

// useCart: hook del contexto global del carrito.
// Nos da itemCount (número total de unidades) para el badge.
import { useCart } from '@/context/CartContext';

// useAuth: hook del contexto de autenticación.
// Nos da el usuario logueado y la función de logout.
import { useAuth } from '@/context/AuthContext';

// useIsClient: hook que detecta si estamos en el cliente.
// Necesario para no renderizar datos del carrito ni del usuario
// durante el SSR (evita hydration mismatch).
import { useIsClient } from '@/hooks/useIsClient';

// CartDrawer: panel lateral que muestra el resumen del carrito.
import CartDrawer from '@/components/cart/CartDrawer';


// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function Header() {
  // ----------------------------------------------------------
  // HOOKS DEL CARRITO
  // ----------------------------------------------------------
  // itemCount: número total de unidades en el carrito.
  // Cada vez que el carrito cambia, el Header se re-renderiza.
  const { itemCount } = useCart();

  // ----------------------------------------------------------
  // HOOKS DE AUTENTICACIÓN
  // ----------------------------------------------------------
  // user: datos del usuario logueado (o null).
  // isAuthenticated: true si hay un usuario logueado.
  // logout: función para cerrar la sesión.
  const { user, isAuthenticated, logout } = useAuth();

  // ----------------------------------------------------------
  // FLAG DE HIDRATACIÓN
  // ----------------------------------------------------------
  // isClient: true en el cliente, false en el servidor.
  // Se usa para no renderizar el badge del carrito ni el nombre
  // del usuario durante el SSR (evita hydration mismatch).
  const isClient = useIsClient();

  // ----------------------------------------------------------
  // ESTADO DEL DRAWER DEL CARRITO
  // ----------------------------------------------------------
  // Controla si el panel lateral del carrito está abierto.
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      {/* ============================================================
          HEADER PRINCIPAL
      ============================================================ */}
      <header className="bg-white border-b border-macketi-gray">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-4">

          {/* ============================================================
              BLOQUE 1: LOGO
          ============================================================ */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/Macketi_logo_full_v2.png"
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
              ============================================================
              - Si el usuario está logueado (y ya hidratamos):
                mostramos su nombre + dropdown con logout.
              - Si es invitado (o aún no hidratamos):
                mostramos enlace a /login.
          ============================================================ */}
          {isClient && isAuthenticated && user ? (
            // Usuario logueado
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-sm font-medium text-macketi-navy hover:text-macketi-yellow-dark">
                <User size={18} />
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDown size={14} />
              </button>

              {/* Dropdown (aparece al pasar el ratón) */}
              <div className="absolute right-0 top-full mt-1 bg-white border border-macketi-gray rounded-lg shadow-lg py-1 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link
                  href="/cuenta"
                  className="block px-4 py-2 text-sm text-macketi-navy hover:bg-macketi-gray-light"
                >
                  Mi cuenta
                </Link>
                <Link
                  href="/pedidos"
                  className="block px-4 py-2 text-sm text-macketi-navy hover:bg-macketi-gray-light"
                >
                  Mis pedidos
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-macketi-red hover:bg-macketi-gray-light"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            // Usuario invitado (o aún no hidratado)
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-medium text-macketi-navy hover:text-macketi-yellow-dark"
            >
              <User size={18} />
              <span>Mi cuenta</span>
            </Link>
          )}

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

              {/* Badge del contador (solo en cliente, solo si hay productos) */}
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
          ============================================================ */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}