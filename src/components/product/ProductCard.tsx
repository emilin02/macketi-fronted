'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

import type { WooProduct } from '@/types/woocommerce';
import { useCart } from '@/context/CartContext';
import { useIsClient } from '@/hooks/useIsClient';


// ============================================================
// TIPOS
// ============================================================

interface ProductCardProps {
  product: WooProduct;
}


// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function ProductCard({ product }: ProductCardProps) {
  // ----------------------------------------------------------
  // HOOKS
  // ----------------------------------------------------------
  const router = useRouter();
  const { addItem, getQuantity } = useCart();
  const isClient = useIsClient();

  const [justAdded, setJustAdded] = useState(false);

  // ----------------------------------------------------------
  // CÁLCULOS DERIVADOS
  // ----------------------------------------------------------
  const discountPercent =
    product.on_sale && product.regular_price
      ? Math.round(
          ((parseFloat(product.regular_price) - parseFloat(product.price)) /
            parseFloat(product.regular_price)) *
            100
        )
      : 0;

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return num.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const vendorName = product.categories[0]?.name || 'Macketi';
  const productUrl = `/producto/${product.slug}`;

  const isVariable = product.type === 'variable';
  const isOutOfStock = product.stock_status === 'outofstock';

  // Cantidad en el carrito (solo se calcula en el cliente,
  // para evitar hydration mismatch).
  const quantityInCart = isClient ? getQuantity(product.id) : 0;

  // ----------------------------------------------------------
  // HANDLER: AÑADIR AL CARRITO
  // ----------------------------------------------------------
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Producto variable → redirigimos a la ficha para elegir opciones.
    if (isVariable) {
      router.push(productUrl);
      return;
    }

    // Producto simple → añadimos directamente.
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price) || 0,
      image: product.images[0]?.src,
      storeId: product.categories[0]?.id || 0,
      storeName: vendorName,
      quantity: 1,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    // ============================================================
    // CONTENEDOR PRINCIPAL
    // ============================================================
    <div className="group bg-white border border-macketi-gray rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">

      {/* ============================================================
          BLOQUE 1: IMAGEN + BADGES
      ============================================================ */}
      <div className="relative aspect-square bg-macketi-gray-light">

        {/* Imagen como Link */}
        <Link href={productUrl} className="block absolute inset-0 z-0">
          {product.images[0] ? (
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
              Sin imagen
            </div>
          )}

          {/* Badge de descuento */}
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-macketi-red text-white text-xs font-bold px-2 py-1 rounded-full z-10">
              -{discountPercent}%
            </div>
          )}

          {/* Badge de agotado */}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
              Agotado
            </div>
          )}
        </Link>

        {/* Botón de favoritos */}
        <button
          type="button"
          className="absolute top-2 right-2 z-30 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-macketi-yellow transition-colors"
          aria-label="Añadir a favoritos"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Favorito:', product.id);
          }}
        >
          <Heart size={16} className="text-macketi-navy" />
        </button>
      </div>

      {/* ============================================================
          BLOQUE 2: INFORMACIÓN
      ============================================================ */}
      <div className="p-3 flex flex-col flex-1">

        {/* Nombre */}
        <Link href={productUrl}>
          <h3 className="font-semibold text-sm text-macketi-navy line-clamp-2 mb-1 hover:text-macketi-yellow-dark transition-colors h-10">
            {product.name}
          </h3>
        </Link>

        {/* Vendedor */}
        <p className="text-xs text-gray-500 mb-2">{vendorName}</p>

        {/* Precios */}
        <div className="mb-3 h-12">
          <p className="text-base font-bold text-macketi-navy">
            {formatPrice(product.price)} CFA
          </p>
          {product.on_sale && product.regular_price ? (
            <p className="text-xs text-gray-400 line-through">
              {formatPrice(product.regular_price)} CFA
            </p>
          ) : (
            <p className="text-xs text-transparent">&nbsp;</p>
          )}
        </div>

        {/* ============================================================
            BOTÓN "AGREGAR" / "AGOTADO"
            ============================================================
            - Agotado: botón deshabilitado.
            - Disponible: botón "Agregar" siempre activo.
              Si ya está en el carrito, mostramos un texto
              indicador encima ("Ya tienes X en el carrito").
        ============================================================ */}
        <div className="mt-auto">
          {isOutOfStock ? (
            // Caso 1: agotado
            <button
              disabled
              className="w-full bg-macketi-gray text-gray-400 font-semibold text-sm py-2 rounded-lg cursor-not-allowed"
            >
              Agotado
            </button>
          ) : (
            // Caso 2: disponible
            <div>
              {/* Indicador de cantidad en el carrito */}
              {quantityInCart > 0 && (
                <p className="text-xs text-macketi-navy font-medium mb-1 text-center">
                  Ya tienes {quantityInCart} en el carrito
                </p>
              )}

              {/* Botón agregar */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-macketi-yellow hover:bg-macketi-yellow-dark text-macketi-navy font-semibold text-sm py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                aria-label={`Añadir ${product.name} al carrito`}
              >
                {justAdded ? (
                  <>
                    <Check size={16} />
                    <span>Añadido</span>
                  </>
                ) : isVariable ? (
                  <>
                    <ShoppingCart size={16} />
                    <span>Elegir opciones</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    <span>Agregar</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}