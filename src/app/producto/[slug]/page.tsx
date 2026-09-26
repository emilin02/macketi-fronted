import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getFullProduct } from '@/services/products';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getFullProduct(slug);

  if (!result) {
    notFound();
  }

  const { product, variations } = result;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
        <Link href="/" className="hover:text-macketi-navy">
          Inicio
        </Link>
        {product.categories[0] && (
          <>
            <ChevronRight size={12} />
            <Link
              href={`/categorias/${product.categories[0].slug}`}
              className="hover:text-macketi-navy"
            >
              {product.categories[0].name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-macketi-navy font-medium line-clamp-1">
          {product.name}
        </span>
      </nav>

      {/* Bloque principal: galería + info */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} variations={variations} />
      </div>

      {/* Descripción larga */}
      {product.description && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-macketi-navy mb-4">
            Descripción del producto
          </h2>
          <div
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      )}

      {/* Productos relacionados */}
      {product.categories[0] && (
        <RelatedProducts
          categoryId={product.categories[0].id}
          excludeProductId={product.id}
        />
      )}
    </div>
  );
}