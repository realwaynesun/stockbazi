import type { MetadataRoute } from 'next';
import { IPO_DATA } from '@/data/ipo/index';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shixiang.app';

export default function sitemap(): MetadataRoute.Sitemap {
  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Stock pages - extract symbol from key format "EXCHANGE:SYMBOL"
  for (const key of Object.keys(IPO_DATA)) {
    const [, symbol] = key.split(':');
    routes.push({
      url: `${SITE_URL}/stock/${symbol}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  return routes;
}
