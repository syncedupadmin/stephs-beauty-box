/**
 * Robots.txt
 * ==========
 * Controls search engine crawling
 */

import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://stephsbeautybox.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/book/success',
          '/checkout/success',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
