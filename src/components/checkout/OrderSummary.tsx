'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';

import { useCart } from '@/context/CartContext';


// ============================================================
// COMPONENTE
// ============================================================

export default function OrderSummary() {
  const { items, subtotal } = useCart();

  // Formateo de precios.
  const formatPrice = (value: number) => {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // ----------------------------------------------------------
  // AGRUPAR POR TIENDA
  // ----------------------------------------------------------
  const groupedByStore = items.reduce<
    Record<number, { storeName: string; items: typeof items }>
  >((groups, item) => {
    if (!groups[item.storeId]) {
      groups[item.storeId] = { storeName: item.storeName, items: [] };
    }
    groups[item.storeId].items.push(item);
    return groups;
  }, {});

  return (
    <aside className="bg-white border border-macketi-gray rounded-2xl p-6 lg:sticky lg:top-4 h-fit">

      <h2 className="text-lg font-bold text-macketi-navy mb-4 flex items-center gap-2">
        <ShoppingBag size={20} />
        <span>Resumen del pedido</span>
      </h2>

      {/* ============================================================
          LISTA DE PRODUCTOS AGRUPADOS POR TIENDA
      ============================================================ */}
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
        {Object.entries(groupedByStore).map(([storeId, group]) => (
          <div key={storeId}>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              {group.storeName}
            </p>

            <ul className="space-y-3">
              {group.items.map((item) => (
                <li key={item.cartKey} className="flex gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-macketi-gray-light">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-[10px]">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-macketi-navy line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × {formatPrice(item.price)} CFA
                    </p>
                  </div>

                  <p className="text-xs font-bold text-macketi-navy">
                    {formatPrice(item.price * item.quantity)} CFA
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ============================================================
          TOTALES
      ============================================================ */}
      <div className="border-t border-macketi-gray pt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-macketi-navy">
            {formatPrice(subtotal)} CFA
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Envío</span>
          <span className="text-xs text-gray-500">Por confirmar</span>
        </div>

        <div className="border-t border-macketi-gray pt-3 flex items-center justify-between">
          <span className="font-bold text-macketi-navy">Total</span>
          <span className="text-xl font-extrabold text-macketi-navy">
            {formatPrice(subtotal)} CFA
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        El pago se realiza al recibir el pedido.
      </p>
    </aside>
  );
}