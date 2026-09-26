import { notFound } from 'next/navigation';
import { getCategoryBySlug, getCategoryProducts } from '@/services/categories';
import CategoryHeader from '@/components/category/CategoryHeader';
import CategoryFilters from '@/components/category/CategoryFilters';
import Pagination from '@/components/category/Pagination';
import ProductCard from '@/components/product/ProductCard';

export const revalidate = 300; // ISR: 5 minutos

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10));

  // Obtener la categoría
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Obtener productos de la categoría
  const { products, total, totalPages } = await getCategoryProducts({
    categoryId: category.id,
    page: currentPage,
    perPage: 20,
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <CategoryHeader
        categoryName={category.name}
        productCount={total}
      />

      <div className="flex gap-6">
        {/* Sidebar de filtros */}
        <CategoryFilters />

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          {products.length === 0 ? (
            <div className="bg-macketi-gray-light rounded-2xl p-12 text-center">
              <p className="text-gray-500">
                No hay productos en esta categoría todavía.
              </p>
            </div>
          ) : (
            <>
              {/* Grid de productos */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Paginación */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={`/categorias/${slug}`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}