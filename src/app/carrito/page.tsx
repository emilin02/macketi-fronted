'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

import Link from 'next/link';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useIsClient } from '@/hooks/useIsClient';
import CartItemRow from '@/components/cart/CartItemRow';


// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function CartPage() {
  // ----------------------------------------------------------
  // HOOKS
  // ----------------------------------------------------------
  const { items, itemCount, subtotal, clearCart } = useCart();
  const isClient = useIsClient();

  // Estado de hidratación: evita hydration mismatch.
  const isEmpty = !isClient || items.length === 0;

  // ----------------------------------------------------------
  // AGRUPACIÓN POR TIENDA
  // ----------------------------------------------------------
  // Macketi es multivendedor: un carrito puede tener productos
  // de varias tiendas. Los agrupamos por storeId para mostrarlos
  // agrupados en la página, y más adelante generar sub-pedidos
  // por tienda en el checkout.
  //
  // Estructura resultante:
  // [
  //   { storeId: 1, storeName: "Carefour", items: [...] },
  //   { storeId: 2, storeName: "Farmacia Amanda", items: [...] },
  // ]
  const groupedByStore = items.reduce<
    Array<{ storeId: number; storeName: string; items: typeof items }>
  >((groups, item) => {
    const existing = groups.find((g) => g.storeId === item.storeId);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.push({
        storeId: item.storeId,
        storeName: item.storeName,
        items: [item],
      });
    }
    return groups;
  }, []);

  // ----------------------------------------------------------
  // FORMATEO DE PRECIOS
  // ----------------------------------------------------------
  const formatPrice = (value: number) => {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // ----------------------------------------------------------
  // CARRITO VACÍO
  // ----------------------------------------------------------
  if (isEmpty) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-macketi-gray-light rounded-full p-8 mb-6">
            <ShoppingBag size={64} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-macketi-navy mb-3">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-500 mb-8 max-w-md">
            Explora nuestro catálogo y añade productos para empezar a comprar.
          </p>
          <Link
            href="/"
            className="bg-macketi-yellow hover:bg-macketi-yellow-dark text-macketi-navy font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            <span>Explorar productos</span>
          </Link>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // CARRITO CON PRODUCTOS
  // ----------------------------------------------------------
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">

      {/* ============================================================
          CABECERA
      ============================================================ */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-macketi-navy mb-3"
        >
          <ArrowLeft size={14} />
          <span>Seguir comprando</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-macketi-navy">
          Tu carrito {itemCount > 0 && `(${itemCount})`}
        </h1>
      </div>

      {/* ============================================================
          LAYOUT: lista a la izquierda, resumen a la derecha
      ============================================================ */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">

        {/* ============================================================
            COLUMNA IZQUIERDA: LISTA DE PRODUCTOS
        ============================================================ */}
        <div>
          {groupedByStore.map((group) => (
            <div key={group.storeId} className="mb-6 last:mb-0">

              {/* Cabecera del grupo (vendedor) */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-macketi-gray">
                <h2 className="text-sm font-bold text-macketi-navy">
                  Vendido por {group.storeName}
                </h2>
                <span className="text-xs text-gray-500">
                  {group.items.length} {group.items.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>

              {/* Lista de productos de esta tienda */}
              <ul className="space-y-4">
                {group.items.map((item) => (
                  <CartItemRow key={item.cartKey} item={item} variant="default" />
                ))}
              </ul>
            </div>
          ))}

          {/* Botón vaciar carrito */}
          <div className="mt-6 pt-4 border-t border-macketi-gray">
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-macketi-red transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* ============================================================
            COLUMNA DERECHA: RESUMEN DEL PEDIDO
        ============================================================ */}
        <aside className="lg:sticky lg:top-4 h-fit">
          <div className="bg-white border border-macketi-gray rounded-2xl p-6">

            <h2 className="text-lg font-bold text-macketi-navy mb-4">
              Resumen del pedido
            </h2>

            {/* Subtotal */}
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-macketi-navy">
                {formatPrice(subtotal)} CFA
              </span>
            </div>

            {/* Envío (placeholder) */}
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-gray-600">Envío</span>
              <span className="text-gray-500 text-xs">
                Calculado en el checkout
              </span>
            </div>

            {/* Separador */}
            <div className="border-t border-macketi-gray my-4" />

            {/* Total */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-base font-bold text-macketi-navy">Total</span>
              <span className="text-xl font-extrabold text-macketi-navy">
                {formatPrice(subtotal)} CFA
              </span>
            </div>

            {/* Botón finalizar compra (deshabilitado por ahora) */}
            <button
              disabled
              className="w-full bg-macketi-yellow text-macketi-navy font-bold py-3 rounded-xl cursor-not-allowed opacity-60 mb-3"
              title="Próximamente"
            >
              Finalizar compra
            </button>

            <p className="text-xs text-center text-gray-500">
              El checkout estará disponible próximamente.
            </p>

            {/* Beneficios */}
            <div className="mt-6 pt-4 border-t border-macketi-gray space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Truck size={14} className="text-macketi-navy" />
                <span>Entrega en 1-3 días</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <ShieldCheck size={14} className="text-macketi-navy" />
                <span>Pago al recibir</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}