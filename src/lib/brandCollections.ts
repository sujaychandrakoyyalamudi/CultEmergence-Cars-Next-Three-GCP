import { z } from 'zod';
import collectionData from '@/data/brandCollections.json';

const collectionEntrySchema = z.object({
  rank: z.number().int().min(1).max(10),
  year: z.string().regex(/^(?:20\d{2}|Current)$/),
  model: z.string().min(1),
  category: z.string().min(1),
  powertrain: z.string().min(1),
  price: z.string().min(1),
  highlight: z.string().min(1),
  officialUrl: z.string().url().startsWith('https://'),
  detailSlug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional()
});

const brandCollectionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  summary: z.string().min(80),
  scopeNote: z.string().min(40),
  source: z.object({
    label: z.string().min(1),
    url: z.string().url().startsWith('https://')
  }),
  entries: z.array(collectionEntrySchema).min(1).max(10)
});

const collectionsSchema = z.array(brandCollectionSchema).length(10);
const parsedCollections = collectionsSchema.parse(collectionData);

for (const collection of parsedCollections) {
  const ranks = collection.entries.map((entry) => entry.rank);
  const expected = Array.from({ length: collection.entries.length }, (_, index) => index + 1);
  if (ranks.join(',') !== expected.join(',')) {
    throw new Error(`${collection.name} entries must use consecutive ranks starting at 1`);
  }
}

export type BrandCollectionEntry = z.infer<typeof collectionEntrySchema>;
type ParsedBrandCollection = z.infer<typeof brandCollectionSchema>;
export type BrandCollection = Omit<ParsedBrandCollection, 'entries'> & {
  readonly entries: readonly BrandCollectionEntry[];
};

export const brandCollections = Object.freeze(
  parsedCollections.map((collection) => ({
    ...collection,
    entries: Object.freeze([...collection.entries])
  }))
) satisfies readonly BrandCollection[];

export const brandCollectionEntryCount = brandCollections.reduce(
  (total, collection) => total + collection.entries.length,
  0
);

export function getBrandCollection(slug: string): BrandCollection | undefined {
  return brandCollections.find((collection) => collection.slug === slug);
}
