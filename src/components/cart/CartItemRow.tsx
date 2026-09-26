'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2 } from 'lucide-react';

import { useCart, type CartItem } from '@/context/CartContext';


// ============================================================
// TIPOS
// ============================================================

interface CartItemRowProps {
  item: CartItem;
  variant?: 'default' | 'compact';
}


// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function CartItemRow({ item, variant = 'default' }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();

  // Formateo de precios con separador de miles español.
  // Se usa 'es-ES' explícitamente para evitar hydration mismatch.
  const formatPrice = (value: number) => {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // En modo compacto (drawer), la imagen es más pequeña.
  const imageSize = variant === 'compact' ? 'w-20 h-20' : 'w-24 h-24';

  return (
    <li className="flex gap-3 pb-4 border-b border-macketi-gray last:border-b-0">

      {/* ============================================================
          IMAGEN
      ============================================================ */}
      <div className={`relative ${imageSize} flex-shrink-0 rounded-lg overflow-hidden bg-macketi-gray-light`}>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes={variant === 'compact' ? '80px' : '96px'}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
            Sin imagen
          </div>
        )}
      </div>

      {/* ============================================================
          INFO + CONTROLES
      ============================================================ */}
      <div className="flex-1 min-w-0">

        {/* Nombre del producto */}
        <Link href={`/producto/${item.slug}`} className="block">
          <h4 className="font-semibold text-sm text-macketi-navy line-clamp-2 hover:text-macketi-yellow-dark">
            {item.name}
          </h4>
        </Link>

        {/* Vendedor */}
        <p className="text-xs text-gray-500 mt-1">{item.storeName}</p>

        {/* Precio unitario */}
        <p className="text-xs text-gray-500 mt-1">
          {formatPrice(item.price)} CFA / unidad
        </p>

        <div className="flex items-center justify-between mt-2">

          {/* Controles de cantidad */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
              className="w-7 h-7 rounded-lg border border-macketi-gray flex items-center justify-center hover:bg-macketi-gray-light"
              aria-label="Reducir cantidad"
            >
              <Minus size={12} />
            </button>
            <span className="text-sm font-semibold text-macketi-navy w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
              className="w-7 h-7 rounded-lg border border-macketi-gray flex items-center justify-center hover:bg-macketi-gray-light"
              aria-label="Aumentar cantidad"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Subtotal de la línea */}
          <p className="text-sm font-bold text-macketi-navy">
            {formatPrice(item.price * item.quantity)} CFA
          </p>
        </div>
      </div>

      {/* ============================================================
          BOTÓN ELIMINAR
      ============================================================ */}
      <button
        onClick={() => removeItem(item.cartKey)}
        className="self-start w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-macketi-red hover:bg-macketi-gray-light transition-colors"
        aria-label={`Eliminar ${item.name}`}
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
}