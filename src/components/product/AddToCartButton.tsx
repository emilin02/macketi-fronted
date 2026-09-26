'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  disabled?: boolean;
  disabledReason?: string;
}

export default function AddToCartButton({
  productId,
  productName,
  disabled = false,
  disabledReason,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    // TODO: lógica real del carrito (se implementará después)
    console.log('Añadir al carrito:', { productId, productName });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (disabled) {
    return (
      <button
        disabled
        className="w-full bg-macketi-gray text-gray-400 font-semibold py-3 rounded-xl cursor-not-allowed"
      >
        {disabledReason || 'No disponible'}
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-macketi-yellow hover:bg-macketi-yellow-dark text-macketi-navy font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
    >
      {added ? (
        <>
          <Check size={20} />
          <span>Añadido</span>
        </>
      ) : (
        <>
          <ShoppingCart size={20} />
          <span>Agregar al carrito</span>
        </>
      )}
    </button>
  );
}