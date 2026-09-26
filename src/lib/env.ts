import { z } from 'zod';

const envSchema = z.object({
  WOOCOMMERCE_URL: z.string().url(),
  WOOCOMMERCE_CONSUMER_KEY: z.string().startsWith('ck_'),
  WOOCOMMERCE_CONSUMER_SECRET: z.string().startsWith('cs_'),
});

const parsed = envSchema.safeParse({
  WOOCOMMERCE_URL: process.env.WOOCOMMERCE_URL,
  WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET,
});

if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:', parsed.error.format());
  throw new Error('Faltan variables de entorno de WooCommerce');
}

export const env = parsed.data;