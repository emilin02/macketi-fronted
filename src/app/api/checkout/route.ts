// ============================================================
// API ROUTE: CREAR PEDIDO EN WOOCOMMERCE
// ============================================================
// Esta ruta corre en el SERVIDOR de Next.js, no en el navegador.
// Tiene acceso a las claves ck_/cs_ de WooCommerce, que NO deben
// exponerse al cliente.
//
// El frontend le envía los datos del pedido y esta ruta:
// 1. Valida los datos.
// 2. Crea un pedido en WooCommerce por cada tienda.
// 3. Devuelve los IDs de los pedidos creados.

import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

// ============================================================
// TIPOS
// ============================================================

interface CheckoutLineItem {
  productId: number;
  variationId?: number;
  quantity: number;
}

interface CheckoutRequest {
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
  // Productos agrupados por tienda (storeId).
  stores: Array<{
    storeId: number;
    items: CheckoutLineItem[];
  }>;
}

interface WooOrderPayload {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  status: string;
  billing: Record<string, string>;
  shipping: Record<string, string>;
  line_items: Array<{
    product_id: number;
    variation_id?: number;
    quantity: number;
  }>;
  customer_note?: string;
  customer_id?: number;
}

// ============================================================
// HELPERS
// ============================================================

// Construye la autenticación Basic para WooCommerce.
function getAuthHeader(): string {
  const auth = Buffer.from(
    `${env.WOOCOMMERCE_CONSUMER_KEY}:${env.WOOCOMMERCE_CONSUMER_SECRET}`
  ).toString('base64');
  return `Basic ${auth}`;
}

// Crea un pedido en WooCommerce.
async function createWooOrder(payload: WooOrderPayload): Promise<{ id: number } | null> {
  try {
    const response = await fetch(
      `${env.WOOCOMMERCE_URL}/wp-json/wc/v3/orders`,
      {
        method: 'POST',
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creando pedido en WooCommerce:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error de red creando pedido:', error);
    return null;
  }
}

// ============================================================
// HANDLER POST
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Leer y validar el cuerpo.
    const body = (await request.json()) as CheckoutRequest;

    if (!body.billing || !body.shipping || !body.stores?.length) {
      return NextResponse.json(
        { success: false, error: 'Datos del pedido incompletos.' },
        { status: 400 }
      );
    }

    // 2. Crear un pedido por cada tienda.
    const createdOrders: Array<{ storeId: number; orderId: number }> = [];

    for (const store of body.stores) {
      const payload: WooOrderPayload = {
        payment_method: 'cod',
        payment_method_title: 'Pago contra entrega',
        set_paid: false,
        status: 'processing',

        billing: {
          first_name: body.billing.firstName,
          last_name: body.billing.lastName,
          phone: body.billing.phone,
          email: body.billing.email,
          address_1: body.shipping.address,
          city: body.shipping.city,
          country: 'GQ', // Guinea Ecuatorial
        },

        shipping: {
          first_name: body.billing.firstName,
          last_name: body.billing.lastName,
          address_1: body.shipping.address,
          city: body.shipping.city,
          country: 'GQ',
        },

        line_items: store.items.map((item) => ({
          product_id: item.productId,
          variation_id: item.variationId,
          quantity: item.quantity,
        })),

        customer_note: body.customerNote,
      };

      const order = await createWooOrder(payload);

      if (!order) {
        return NextResponse.json(
          { success: false, error: 'No se pudo crear el pedido. Inténtalo de nuevo.' },
          { status: 500 }
        );
      }

      createdOrders.push({ storeId: store.storeId, orderId: order.id });
    }

    // 3. Devolver los pedidos creados.
    return NextResponse.json({
      success: true,
      orders: createdOrders,
    });
  } catch (error) {
    console.error('Error en checkout:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}