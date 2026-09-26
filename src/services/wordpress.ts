import axios, { AxiosInstance } from 'axios';
import { env } from '@/lib/env';
import type { WooProduct, WooVariation } from '@/types/woocommerce';

class WooCommerceClient {
  private client: AxiosInstance;

  constructor() {
    const auth = Buffer.from(
      `${env.WOOCOMMERCE_CONSUMER_KEY}:${env.WOOCOMMERCE_CONSUMER_SECRET}`
    ).toString('base64');

    this.client = axios.create({
      baseURL: `${env.WOOCOMMERCE_URL}/wp-json/wc/v3`,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
  }

  /**
   * Lista productos con paginación
   */
  async getProducts(params: {
    page?: number;
    perPage?: number;
    category?: number;
    search?: string;
    featured?: boolean;
    onSale?: boolean;
    orderby?: 'date' | 'price' | 'popularity' | 'rating';
    order?: 'asc' | 'desc';
  } = {}): Promise<{ products: WooProduct[]; total: number; totalPages: number }> {
    const response = await this.client.get<WooProduct[]>('/products', {
      params: {
        page: params.page ?? 1,
        per_page: params.perPage ?? 20,
        category: params.category,
        search: params.search,
        featured: params.featured,
        on_sale: params.onSale,
        orderby: params.orderby ?? 'date',
        order: params.order ?? 'desc',
        status: 'publish',
      },
    });

    return {
      products: response.data,
      total: parseInt(response.headers['x-wp-total'] || '0', 10),
      totalPages: parseInt(response.headers['x-wp-totalpages'] || '0', 10),
    };
  }

  /**
   * Obtiene un producto por su slug
   */
  async getProductBySlug(slug: string): Promise<WooProduct | null> {
    const response = await this.client.get<WooProduct[]>('/products', {
      params: { slug, status: 'publish' },
    });
    return response.data[0] || null;
  }

  /**
   * Obtiene las variantes de un producto variable
   */
  async getProductVariations(productId: number): Promise<WooVariation[]> {
    const response = await this.client.get<WooVariation[]>(
      `/products/${productId}/variations`,
      { params: { per_page: 100 } }
    );
    return response.data;
  }

  /**
   * Lista categorías de producto
   */
  async getCategories(params: { parent?: number; perPage?: number } = {}) {
    const response = await this.client.get('/products/categories', {
      params: {
        parent: params.parent ?? 0,
        per_page: params.perPage ?? 100,
        hide_empty: true,
      },
    });
    return response.data;
  }

  /**
   * Obtiene una categoría por slug
   */
  async getCategoryBySlug(slug: string) {
    const response = await this.client.get('/products/categories', {
      params: { slug },
    });
    return response.data[0] || null;
  }
}

// Singleton: reutilizamos la misma instancia en todo el proyecto
export const wooCommerce = new WooCommerceClient();