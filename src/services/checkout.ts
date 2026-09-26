// ============================================================
// SERVICIO DE CHECKOUT
// ============================================================
// Llama a la API Route interna de Next.js para crear pedidos.
// No habla directamente con WooCommerce (las claves viven en
// el servidor).

export interface CheckoutData {
  billing: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  shipping: {
    city: string;
    neighborhood: string;
    address: string;
    reference?: string;
  };
  customerNote?: string;
  stores: Array<{
    storeId: number;
    items: Array<{
      productId: number;
      variationId?: number;
      quantity: number;
    }>;
  }>;
}

export interface CheckoutResult {
  success: boolean;
  orders?: Array<{ storeId: number; orderId: number }>;
  error?: string;
}

/**
 * Crea los pedidos en WooCommerce a través de la API Route.
 */
export async function createOrder(data: CheckoutData): Promise<CheckoutResult> {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error || 'Error al crear el pedido.',
      };
    }

    return result;
  } catch (error) {
    console.error('Error en createOrder:', error);
    return {
      success: false,
      error: 'No se pudo conectar con el servidor.',
    };
  }
}