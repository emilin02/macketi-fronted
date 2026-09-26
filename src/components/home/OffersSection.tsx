import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { getOnSaleProducts } from '@/services/products';

export default async function OffersSection() {
  const products = await getOnSaleProducts(12);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4 mt-10">
      {/* Header de la sección */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Icono de porcentaje */}
          <div className="bg-macketi-yellow rounded-xl p-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-macketi-black"
            >
              <line x1="19" y1="5" x2="5" y2="19" />
              <circle cx="6.5" cy="6.5" r="2.5" />
              <circle cx="17.5" cy="17.5" r="2.5" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-macketi-black">
              Ofertas de hoy
            </h2>
            <p className="text-xs text-gray-500">
              Los mejores precios, solo por tiempo limitado.
            </p>
          </div>
        </div>

        {/* Botón ver todas */}
        <Link
          href="/ofertas"
          className="hidden md:flex items-center gap-2 bg-macketi-yellow hover:bg-macketi-yellow-dark text-macketi-black text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          <span>Ver todas las ofertas</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Carrusel */}
      <div className="relative">
        {/* Flecha izquierda */}
        <button
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 items-center justify-center shadow-md hover:bg-gray-50"
          aria-label="Anterior"
        >
          <ChevronLeft size={20} className="text-macketi-black" />
        </button>

        {/* Grid de productos (en móvil scroll horizontal) */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-40 md:w-auto"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Flecha derecha */}
        <button
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 items-center justify-center shadow-md hover:bg-gray-50"
          aria-label="Siguiente"
        >
          <ChevronRight size={20} className="text-macketi-black" />
        </button>
      </div>
    </section>
  );
}