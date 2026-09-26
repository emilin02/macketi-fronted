import { wooCommerce } from './wordpress';
import type { WooProduct, WooVariation } from '@/types/woocommerce';

/**
 * Obtiene productos para la home (destacados)
 */
export async function getFeaturedProducts(limit = 8): Promise<WooProduct[]> {
  const { products } = await wooCommerce.getProducts({
    featured: true,
    perPage: limit,
  });
  return products;
}

/**
 * Obtiene productos en oferta
 */
export async function getOnSaleProducts(limit = 8): Promise<WooProduct[]> {
  const { products } = await wooCommerce.getProducts({
    onSale: true,
    perPage: limit,
    orderby: 'date',
  });
  return products;
}

/**
 * Obtiene los productos más recientes
 */
export async function getLatestProducts(limit = 12): Promise<WooProduct[]> {
  const { products } = await wooCommerce.getProducts({
    perPage: limit,
    orderby: 'date',
  });
  return products;
}

/**
 * Obtiene productos por categoría con paginación
 */
export async function getProductsByCategory(
  categoryId: number,
  page = 1,
  perPage = 20
) {
  return wooCommerce.getProducts({
    category: categoryId,
    page,
    perPage,
  });
}

/**
 * Busca productos por texto
 */
export async function searchProducts(query: string, limit = 20) {
  return wooCommerce.getProducts({
    search: query,
    perPage: limit,
  });
}

/**
 * Obtiene un producto completo con sus variantes
 */
export async function getFullProduct(slug: string) {
  const product = await wooCommerce.getProductBySlug(slug);
  if (!product) return null;

  let variations: WooVariation[] = [];
  if (product.type === 'variable' && product.variations.length > 0) {
    variations = await wooCommerce.getProductVariations(product.id);
  }

  return { product, variations };
}

/**
 * Obtiene productos relacionados de la misma categoría,
 * excluyendo el producto actual.
 */
export async function getRelatedProducts(
  categoryId: number,
  excludeProductId: number,
  limit = 6
): Promise<WooProduct[]> {
  const { products } = await wooCommerce.getProducts({
    category: categoryId,
    perPage: limit + 1, // Pedimos uno más por si el actual está en la lista
    orderby: 'date',
    order: 'desc',
  });

  // Excluir el producto actual y limitar al número deseado
  return products
    .filter((p) => p.id !== excludeProductId)
    .slice(0, limit);
}