'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useIsClient } from '@/hooks/useIsClient';
import CartItemRow from './CartItemRow';


// ============================================================
// TIPOS
// ============================================================

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}


// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // ----------------------------------------------------------
  // HOOKS
  // ----------------------------------------------------------
  const { items, itemCount, subtotal, clearCart } = useCart();
  const isClient = useIsClient();

  // Estado de hidratación: evita hydration mismatch.
  const isEmpty = !isClient || items.length === 0;

  // ----------------------------------------------------------
  // FORMATEO DE PRECIOS
  // ----------------------------------------------------------
  const formatPrice = (value: number) => {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <>
      {/* ============================================================
          OVERLAY
      ============================================================ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
          aria-label="Cerrar carrito"
        />
      )}

      {/* ============================================================
          PANEL LATERAL
      ============================================================ */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Carrito de compras"
      >

        {/* ============================================================
            CABECERA
        ============================================================ */}
        <div className="flex items-center justify-between p-4 border-b border-macketi-gray">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-macketi-navy" />
            <h2 className="text-lg font-bold text-macketi-navy">
              Tu carrito {isClient && itemCount > 0 && `(${itemCount})`}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-macketi-gray-light transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={20} className="text-macketi-navy" />
          </button>
        </div>

        {/* ============================================================
            CONTENIDO
        ============================================================ */}
        <div className="flex-1 overflow-y-auto p-4">

          {isEmpty ? (
            // Caso 1: carrito vacío
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="bg-macketi-gray-light rounded-full p-6 mb-4">
                <ShoppingBag size={48} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-macketi-navy mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Añade productos para empezar a comprar.
              </p>
              <button
                onClick={onClose}
                className="bg-macketi-yellow hover:bg-macketi-yellow-dark text-macketi-navy font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            // Caso 2: hay productos → usamos CartItemRow en modo compacto.
            <ul className="space-y-4">
              {items.map((item) => (
                <CartItemRow key={item.cartKey} item={item} variant="compact" />
              ))}
            </ul>
          )}
        </div>

        {/* ============================================================
            PIE DEL DRAWER
        ============================================================ */}
        {!isEmpty && (
          <div className="border-t border-macketi-gray p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-lg font-bold text-macketi-navy">
                {formatPrice(subtotal)} CFA
              </span>
            </div>

            <p className="text-xs text-gray-500">
              Los gastos de envío se calculan en el checkout.
            </p>

            <Link
              href="/carrito"
              onClick={onClose}
              className="w-full bg-macketi-yellow hover:bg-macketi-yellow-dark text-macketi-navy font-bold py-3 rounded-lg flex items-center justify-center transition-colors"
            >
              Ver carrito completo
            </Link>

            <button
              onClick={clearCart}
              className="w-full text-xs text-gray-500 hover:text-macketi-red transition-colors py-1"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}