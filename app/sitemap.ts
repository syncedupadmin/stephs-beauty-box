/**
 * Dynamic Sitemap
 * ===============
 * Generates sitemap.xml for SEO
 */

import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/db/products';
import { isSupabaseConfigured } from '@/lib/supabase';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://stephsbeautybox.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/book`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/policies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];

  if (isSupabaseConfigured) {
    try {
      const products = await getProducts();
      productPages = products
        .filter(p => p.is_active)
        .map(product => ({
          url: `${BASE_URL}/shop/${product.handle}`,
          lastModified: new Date(product.updated_at || product.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
    } catch (error) {
      console.error('[Sitemap] Failed to fetch products:', error);
    }
  }

  return [...staticPages, ...productPages];
}
