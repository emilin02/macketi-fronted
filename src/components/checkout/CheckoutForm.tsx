'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder, type CheckoutData } from '@/services/checkout';


// ============================================================
// COMPONENTE
// ============================================================

export default function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  // ----------------------------------------------------------
  // ESTADO DEL FORMULARIO
  // ----------------------------------------------------------
  const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name.split(' ').slice(1).join(' ') || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState('Malabo');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------------------------------------
  // HANDLER DE SUBMIT
  // ----------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas.
    if (!firstName || !lastName || !phone || !email || !city || !address) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    if (items.length === 0) {
      setError('Tu carrito está vacío.');
      return;
    }

    setIsLoading(true);

    // ----------------------------------------------------------
    // Agrupar items por tienda.
    // ----------------------------------------------------------
    const groupedByStore = items.reduce<
      Record<number, Array<{ productId: number; variationId?: number; quantity: number }>>
    >((groups, item) => {
      if (!groups[item.storeId]) groups[item.storeId] = [];
      groups[item.storeId].push({
        productId: item.productId,
        variationId: item.variationId,
        quantity: item.quantity,
      });
      return groups;
    }, {});

    const stores = Object.entries(groupedByStore).map(([storeId, items]) => ({
      storeId: Number(storeId),
      items,
    }));

    // ----------------------------------------------------------
    // Construir el payload.
    // ----------------------------------------------------------
    const data: CheckoutData = {
      billing: { firstName, lastName, phone, email },
      shipping: { city, neighborhood, address, reference },
      customerNote,
      stores,
    };

    // ----------------------------------------------------------
    // Crear el pedido.
    // ----------------------------------------------------------
    const result = await createOrder(data);

    setIsLoading(false);

    if (result.success && result.orders) {
      // Vaciar carrito y redirigir a la página de éxito.
      clearCart();
      const orderIds = result.orders.map((o) => o.orderId).join(',');
      router.push(`/checkout/exito?orders=${orderIds}`);
    } else {
      setError(result.error || 'Error al crear el pedido.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ============================================================
          SECCIÓN 1: DATOS DE CONTACTO
      ============================================================ */}
      <div className="bg-white border border-macketi-gray rounded-2xl p-6">
        <h2 className="text-lg font-bold text-macketi-navy mb-4">
          Datos de contacto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-macketi-navy mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-macketi-gray text-sm focus:outline-none focus:border-macketi-yellow"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-macketi-navy mb-1">
              Apellidos *
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-macketi-gray text-sm focus:outline-none focus:border-macketi-yellow"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-macketi-navy mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+240 222 000 000"
              className="w-full px-4 py-2.5 rounded-xl border border-macketi-gray text-sm focus:outline-none focus:border-macketi-yellow"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-macketi-navy mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-macketi-gray text-sm focus:outline-none focus:border-macketi-yellow"
              required
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          SECCIÓN 2: DIRECCIÓN DE ENTREGA
      ============================================================ */}
      <div className="bg-white border border-macketi-gray rounded-2xl p-6">
        <h2 className="text-lg font-bold text-macketi-navy mb-4">
          Dirección de entrega
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-macketi-navy mb-1">
              Ciudad *
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-macketi-gray text-sm focus:outline-none focus:border-macketi-yellow bg-white"
              required
            >
              <option value="Malabo">Malabo</option>
              <option value="Bata">Bata</option>
              <option value="Ebebiyín">Ebebiyín</option>
              <option value="Mongomo">Mongomo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-macketi-navy mb-1">
              Barrio
            </label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Ej: Los Ángeles"
              className="w-full px-4 py-2.5 rounded-xl border border-macketi-gray text-sm focus:outline-none focus:border-macketi-yellow"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-macketi-navy mb-1">
              Dirección completa *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle, número, piso..."
              className="w-full px-4 py-2.5 rounded-xl border border-macketi-gray text-sm focus:outline-none focus:border-macketi-yellow"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-macketi-navy mb-1">
              Punto de referencia
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ej: frente a la farmacia, junto al mercado..."
              className="w-full px-4 py-2.5 rounded-xl border border-macketi-gray text-sm focus:outline-none focus:border-macketi-yellow"
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          SECCIÓN 3: NOTAS DEL PEDIDO
      ============================================================ */}
      <div className="bg-white border border-macketi-gray rounded-2xl p-6">
        <h2 className="text-lg font-bold text-macketi-navy mb-4">
          Notas del pedido (opcional)
        </h2>
        <textarea
          value={customerNote}
          onChange={(e) => setCustomerNote(e.target.value)}
          rows={3}
          placeholder="Instrucciones especiales para el repartidor..."
          className="w-full px-4 py-2.5 rounded-xl border border-macketi-gray text-sm focus:outline-none focus:border-macketi-yellow resize-none"
        />
      </div>

      {/* ============================================================
          SECCIÓN 4: MÉTODO DE PAGO
      ============================================================ */}
      <div className="bg-white border border-macketi-gray rounded-2xl p-6">
        <h2 className="text-lg font-bold text-macketi-navy mb-4">
          Método de pago
        </h2>

        <div className="flex items-center gap-3 p-4 border-2 border-macketi-yellow rounded-xl bg-macketi-yellow/10">
          <input
            type="radio"
            checked
            readOnly
            className="accent-macketi-yellow w-4 h-4"
          />
          <div>
            <p className="font-semibold text-macketi-navy">Pago contra entrega</p>
            <p className="text-xs text-gray-500">
              Pagas cuando recibes el pedido.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          ERROR
      ============================================================ */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* ============================================================
          BOTÓN CONFIRMAR
      ============================================================ */}
      <button
        type="submit"
        disabled={isLoading || items.length === 0}
        className="w-full bg-macketi-yellow hover:bg-macketi-yellow-dark text-macketi-navy font-bold py-4 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>Creando pedido...</span>
          </>
        ) : (
          <span>Confirmar pedido</span>
        )}
      </button>

    </form>
  );
}