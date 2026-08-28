import type { MetadataRoute } from 'next';
import { brandCollections } from '@/lib/brandCollections';
import { cars } from '@/lib/cars';
import { site } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(`${site.checkedOn}T00:00:00Z`);
  return [
    { url: site.url, lastModified: updated, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${site.url}/compare`,
      lastModified: updated,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    { url: `${site.url}/brands`, lastModified: updated, changeFrequency: 'monthly', priority: 0.8 },
    {
      url: `${site.url}/methodology`,
      lastModified: updated,
      changeFrequency: 'yearly',
      priority: 0.5
    },
    { url: `${site.url}/credits`, lastModified: updated, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}/privacy`, lastModified: updated, changeFrequency: 'yearly', priority: 0.3 },
    ...cars.map((car) => ({
      url: `${site.url}/cars/${car.slug}`,
      lastModified: updated,
      changeFrequency: 'monthly' as const,
      priority: 0.7
    })),
    ...brandCollections.map((collection) => ({
      url: `${site.url}/brands/${collection.slug}`,
      lastModified: updated,
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }))
  ];
}
