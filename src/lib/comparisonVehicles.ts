import { brandCollections } from '@/lib/brandCollections';
import type { ComparisonVehicle } from '@/lib/compare';

export const comparisonVehicles: readonly ComparisonVehicle[] = Object.freeze(
  brandCollections.flatMap((collection) =>
    collection.entries.map((entry) => ({
      id: `${collection.slug}-${entry.rank}`,
      brandSlug: collection.slug,
      brand: collection.name,
      accent: collection.accent,
      rank: entry.rank,
      year: entry.year,
      model: entry.model,
      category: entry.category,
      powertrain: entry.powertrain,
      price: entry.price,
      highlight: entry.highlight,
      officialUrl: entry.officialUrl,
      detailHref: entry.detailSlug ? `/cars/${entry.detailSlug}` : `/brands/${collection.slug}`
    }))
  )
);
