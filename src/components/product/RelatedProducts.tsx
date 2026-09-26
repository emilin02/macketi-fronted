import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { getRelatedProducts } from '@/services/products';

interface RelatedProductsProps {
  categoryId: number;
  excludeProductId: number;
}

export default async function RelatedProducts({
  categoryId,
  excludeProductId,
}: RelatedProductsProps) {
  const products = await getRelatedProducts(categoryId, excludeProductId, 6);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-macketi-navy">
          Productos relacionados
        </h2>
        <Link
          href="/productos"
          className="hidden md:flex items-center gap-2 bg-macketi-yellow hover:bg-macketi-yellow-dark text-macketi-navy text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          <span>Ver más productos</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}