import { wooCommerce } from './wordpress';

export interface CategoryFilters {
  categoryId: number;
  minPrice?: number;
  maxPrice?: number;
  brandIds?: number[];
  colors?: string[];
  sizes?: string[];
  orderby?: 'date' | 'price' | 'popularity' | 'rating';
  order?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

/**
 * Obtiene una categoría por slug
 */
export async function getCategoryBySlug(slug: string) {
  return wooCommerce.getCategoryBySlug(slug);
}

/**
 * Obtiene subcategorías de una categoría padre
 */
export async function getSubcategories(parentId: number) {
  const response = await wooCommerce.getCategories({
    parent: parentId,
    perPage: 100,
  });
  return response;
}

/**
 * Obtiene productos de una categoría con filtros
 */
export async function getCategoryProducts(filters: CategoryFilters) {
  const { products, total, totalPages } = await wooCommerce.getProducts({
    category: filters.categoryId,
    page: filters.page ?? 1,
    perPage: filters.perPage ?? 20,
    orderby: filters.orderby ?? 'date',
    order: filters.order ?? 'desc',
  });

  // Filtrar en cliente (por ahora) hasta que implementemos query params de WooCommerce
  let filtered = products;

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => parseFloat(p.price) >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => parseFloat(p.price) <= filters.maxPrice!);
  }
  if (filters.brandIds && filters.brandIds.length > 0) {
    filtered = filtered.filter((p) =>
      p.categories.some((c) => filters.brandIds!.includes(c.id))
    );
  }

  return {
    products: filtered,
    total,
    totalPages,
  };
}