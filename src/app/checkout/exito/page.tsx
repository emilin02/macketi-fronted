
'use client';

// ============================================================
// PÁGINA DE ÉXITO DEL PEDIDO
// ============================================================

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

import { useIsClient } from '@/hooks/useIsClient';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const isClient = useIsClient();

  const orderIds = searchParams.get('orders')?.split(',') || [];

  if (!isClient) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">

      {/* Icono */}
      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} className="text-green-600" />
      </div>

      {/* Título */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-macketi-navy mb-3">
        ¡Pedido confirmado!
      </h1>

      <p className="text-gray-500 mb-8">
        Tu pedido ha sido registrado correctamente. El vendedor se pondrá en contacto contigo para confirmar la entrega.
      </p>

      {/* Números de pedido */}
      <div className="bg-white border border-macketi-gray rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 justify-center mb-3">
          <Package size={20} className="text-macketi-navy" />
          <h2 className="font-bold text-macketi-navy">
            {orderIds.length === 1 ? 'Pedido' : 'Pedidos'} creado{orderIds.length > 1 ? 's' : ''}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {orderIds.map((id) => (
            <span
              key={id}
              className="bg-macketi-yellow text-macketi-navy font-bold px-3 py-1 rounded-full text-sm"
            >
              #{id}
            </span>
          ))}
        </div>
      </div>

      {/* Nota */}
      <p className="text-sm text-gray-500 mb-8">
        Recibirás un email de confirmación en breve. Si tienes alguna duda, contacta con el vendedor.
      </p>

      {/* Enlaces */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="bg-macketi-yellow hover:bg-macketi-yellow-dark text-macketi-navy font-bold px-6 py-3 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
        >
          <span>Seguir comprando</span>
          <ArrowRight size={18} />
        </Link>
      </div>

    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        Verificando tu pedido...
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
