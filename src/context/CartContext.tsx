'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';


// ============================================================
// TIPOS
// ============================================================

// Cada línea del carrito representa UN producto (o variante) con su cantidad.
export interface CartItem {
  productId: number;
  variationId?: number;
  cartKey: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  storeId: number;
  storeName: string;
  quantity: number;
}

// Estructura del contexto: estado + funciones.
interface CartContextValue {
  // Estado
  items: CartItem[];
  itemCount: number;
  lineCount: number;
  subtotal: number;

  // Funciones
  addItem: (item: Omit<CartItem, 'cartKey'>) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;

  // Utilidades
  isInCart: (productId: number, variationId?: number) => boolean;
  getQuantity: (productId: number, variationId?: number) => number;
}


// ============================================================
// CONSTANTES
// ============================================================

const STORAGE_KEY = 'macketi_cart';


// ============================================================
// CONTEXTO
// ============================================================

const CartContext = createContext<CartContextValue | undefined>(undefined);


// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

// Genera la clave única de una línea del carrito.
// - Producto simple: "123"
// - Producto variable: "123-456"
function buildCartKey(productId: number, variationId?: number): string {
  return variationId ? `${productId}-${variationId}` : String(productId);
}


// ============================================================
// PROVIDER
// ============================================================

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  // ----------------------------------------------------------
  // ESTADO (INICIALIZADO CON FUNCIÓN)
  // ----------------------------------------------------------
  // Leemos el carrito de localStorage en la inicialización del
  // estado, no en un useEffect. Evita cascada de renders.
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored) as CartItem[];
    } catch (error) {
      console.warn('Error leyendo carrito de localStorage:', error);
      return [];
    }
  });

  // ----------------------------------------------------------
  // PERSISTENCIA EN localStorage
  // ----------------------------------------------------------
  // Cada vez que cambia el carrito, lo guardamos.
  // localStorage es un sistema externo → useEffect es correcto aquí.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('Error guardando carrito en localStorage:', error);
    }
  }, [items]);

  // ----------------------------------------------------------
  // AÑADIR PRODUCTO AL CARRITO
  // ----------------------------------------------------------
  const addItem = useCallback((newItem: Omit<CartItem, 'cartKey'>) => {
    const cartKey = buildCartKey(newItem.productId, newItem.variationId);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.cartKey === cartKey);

      if (existingIndex >= 0) {
        // Ya existe: sumamos la cantidad.
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      }

      // No existe: añadimos línea nueva.
      return [...prevItems, { ...newItem, cartKey }];
    });
  }, []);

  // ----------------------------------------------------------
  // ELIMINAR PRODUCTO DEL CARRITO
  // ----------------------------------------------------------
  const removeItem = useCallback((cartKey: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.cartKey !== cartKey));
  }, []);

  // ----------------------------------------------------------
  // ACTUALIZAR CANTIDAD
  // ----------------------------------------------------------
  const updateQuantity = useCallback((cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((i) => i.cartKey !== cartKey));
      return;
    }

    setItems((prevItems) =>
      prevItems.map((i) =>
        i.cartKey === cartKey ? { ...i, quantity } : i
      )
    );
  }, []);

  // ----------------------------------------------------------
  // VACIAR CARRITO
  // ----------------------------------------------------------
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // ----------------------------------------------------------
  // COMPROBAR SI UN PRODUCTO ESTÁ EN EL CARRITO
  // ----------------------------------------------------------
  const isInCart = useCallback(
    (productId: number, variationId?: number) => {
      const cartKey = buildCartKey(productId, variationId);
      return items.some((i) => i.cartKey === cartKey);
    },
    [items]
  );

  // ----------------------------------------------------------
  // OBTENER CANTIDAD DE UN PRODUCTO EN EL CARRITO
  // ----------------------------------------------------------
  // Devuelve cuántas unidades de un producto hay en el carrito.
  // Útil para mostrar "Ya tienes X en el carrito" en la tarjeta.
  const getQuantity = useCallback(
    (productId: number, variationId?: number) => {
      const cartKey = buildCartKey(productId, variationId);
      const line = items.find((i) => i.cartKey === cartKey);
      return line?.quantity || 0;
    },
    [items]
  );

  // ----------------------------------------------------------
  // VALORES DERIVADOS
  // ----------------------------------------------------------
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const lineCount = items.length;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ----------------------------------------------------------
  // VALOR DEL CONTEXTO
  // ----------------------------------------------------------
  const value: CartContextValue = {
    items,
    itemCount,
    lineCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}


// ============================================================
// HOOK PARA CONSUMIR EL CARRITO
// ============================================================

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }

  return context;
}