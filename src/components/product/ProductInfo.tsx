'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

import { useState, useMemo } from 'react';
import { Truck, ShieldCheck, Store, Check } from 'lucide-react';
import VariantSelector from './VariantSelector';
import QuantitySelector from './QuantitySelector';
import type { WooProduct, WooVariation } from '@/types/woocommerce';
import { useCart } from '@/context/CartContext';

// Hook para saber si estamos en el cliente (evita hydration mismatch).
import { useIsClient } from '@/hooks/useIsClient';


// ============================================================
// TIPOS
// ============================================================

interface ProductInfoProps {
  product: WooProduct;
  variations: WooVariation[];
}


// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function ProductInfo({ product, variations }: ProductInfoProps) {
  // ----------------------------------------------------------
  // HOOKS
  // ----------------------------------------------------------
  const { addItem, isInCart } = useCart();
  const isClient = useIsClient();

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // ----------------------------------------------------------
  // CÁLCULOS DERIVADOS
  // ----------------------------------------------------------

  const isVariable = product.type === 'variable' && variations.length > 0;

  // Variación seleccionada
  const selectedVariation = useMemo(() => {
    if (!isVariable) return null;

    const attributeNames = new Set(
      variations.flatMap((v) => v.attributes.map((a) => a.name))
    );

    if (Object.keys(selectedAttributes).length < attributeNames.size) {
      return null;
    }

    return variations.find((variation) =>
      variation.attributes.every(
        (attr) => selectedAttributes[attr.name] === attr.option
      )
    );
  }, [variations, selectedAttributes, isVariable]);

  const displayPrice = selectedVariation ? selectedVariation.price : product.price;
  const displayRegularPrice = selectedVariation
    ? selectedVariation.regular_price
    : product.regular_price;

  const isOnSale = selectedVariation
    ? selectedVariation.sale_price &&
      selectedVariation.sale_price !== selectedVariation.regular_price
    : product.on_sale;

  const stockStatus = selectedVariation
    ? selectedVariation.stock_status
    : product.stock_status;
  const isOutOfStock = stockStatus === 'outofstock';

  const needsVariationSelection = isVariable && !selectedVariation;

  // ----------------------------------------------------------
  // ESTADO "YA EN EL CARRITO" (SOLO EN CLIENTE)
  // ----------------------------------------------------------
  // En SSR no podemos saber si el producto está en el carrito
  // (localStorage no existe en el servidor). Forzamos false para
  // que el HTML del servidor coincida con el primer render del
  // cliente. Después de la hidratación, React actualiza al
  // estado real sin mismatch.
  const alreadyInCart = isClient
    ? isInCart(product.id, selectedVariation?.id)
    : false;

  // Rango de precios
  const priceRange = useMemo(() => {
    if (!isVariable || selectedVariation) return null;

    const prices = variations
      .map((v) => parseFloat(v.price))
      .filter((p) => !isNaN(p));

    if (prices.length === 0) return null;

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (min === max) return null;

    return { min, max };
  }, [variations, selectedVariation, isVariable]);

  // ----------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------

  const handleAttributeChange = (name: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    if (needsVariationSelection) return;

    addItem({
      productId: product.id,
      variationId: selectedVariation?.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(displayPrice) || 0,
      image: selectedVariation?.image?.src || product.images[0]?.src,
      storeId: product.categories[0]?.id || 0,
      storeName: product.categories[0]?.name || 'Macketi',
      quantity,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const formatPrice = (price: string) => {
    if (!price) return '0';
    return parseFloat(price).toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="space-y-6">

      {/* ============================================================
          BLOQUE 1: NOMBRE
      ============================================================ */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-macketi-navy leading-tight">
          {product.name}
        </h1>
      </div>

      {/* ============================================================
          BLOQUE 2: PRECIO
      ============================================================ */}
      <div className="flex items-baseline gap-3">
        {priceRange ? (
          <p className="text-3xl font-bold text-macketi-navy">
            {formatPrice(String(priceRange.min))} - {formatPrice(String(priceRange.max))} CFA
          </p>
        ) : (
          <>
            <p className="text-3xl font-bold text-macketi-navy">
              {formatPrice(displayPrice)} CFA
            </p>
            {isOnSale && displayRegularPrice && (
              <p className="text-lg text-gray-400 line-through">
                {formatPrice(displayRegularPrice)} CFA
              </p>
            )}
          </>
        )}
      </div>

      {/* ============================================================
          BLOQUE 3: DESCRIPCIÓN CORTA
      ============================================================ */}
      {product.short_description && (
        <div
          className="text-sm text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        />
      )}

      {/* ============================================================
          BLOQUE 4: VARIANTES
      ============================================================ */}
      {isVariable && (
        <VariantSelector
          variations={variations}
          selectedAttributes={selectedAttributes}
          onAttributeChange={handleAttributeChange}
        />
      )}

      {/* ============================================================
          BLOQUE 5: CANTIDAD
      ============================================================ */}
      <div>
        <p className="text-sm font-semibold text-macketi-navy mb-2">Cantidad</p>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          max={selectedVariation?.stock_quantity || 99}
        />
      </div>

      {/* ============================================================
          BLOQUE 6: BOTÓN "AGREGAR AL CARRITO"
      ============================================================ */}
      <div>
        {isOutOfStock ? (
          <button
            disabled
            className="w-full bg-macketi-gray text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed"
          >
            Agotado
          </button>
        ) : needsVariationSelection ? (
          <button
            disabled
            className="w-full bg-macketi-gray text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed"
          >
            Selecciona las opciones
          </button>
        ) : alreadyInCart ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-macketi-navy text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-macketi-navy/90 transition-colors"
          >
            <Check size={20} />
            <span>En el carrito — Añadir {quantity} más</span>
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-macketi-yellow hover:bg-macketi-yellow-dark text-macketi-navy font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {justAdded ? (
              <>
                <Check size={20} />
                <span>Añadido al carrito</span>
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span>Agregar al carrito</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* ============================================================
          BLOQUE 7: INFORMACIÓN DEL VENDEDOR
      ============================================================ */}
      <div className="border-t border-macketi-gray pt-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Store size={18} className="text-macketi-navy" />
          <span>
            Vendido por{' '}
            <strong className="text-macketi-navy">
              {product.categories[0]?.name || 'Macketi'}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Truck size={18} className="text-macketi-navy" />
          <span>Entrega en 1-3 días</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ShieldCheck size={18} className="text-macketi-navy" />
          <span>Pago al recibir</span>
        </div>
      </div>
    </div>
  );
}