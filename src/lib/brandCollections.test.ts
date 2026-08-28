import { describe, expect, it } from 'vitest';
import {
  brandCollectionEntryCount,
  brandCollections,
  getBrandCollection
} from '@/lib/brandCollections';
import { getCarBySlug } from '@/lib/cars';

describe('brand collections', () => {
  it('publishes ten manufacturer collections and 96 current entries', () => {
    expect(brandCollections).toHaveLength(10);
    expect(brandCollectionEntryCount).toBe(96);
    expect(new Set(brandCollections.map((collection) => collection.slug)).size).toBe(10);
  });

  it('keeps every ranking consecutive and every entry evidence-linked', () => {
    for (const collection of brandCollections) {
      expect(collection.entries.map((entry) => entry.rank)).toEqual(
        Array.from({ length: collection.entries.length }, (_, index) => index + 1)
      );
      expect(collection.source.url).toMatch(/^https:\/\//);
      for (const entry of collection.entries) {
        expect(entry.officialUrl).toMatch(/^https:\/\//);
        if (entry.detailSlug) expect(getCarBySlug(entry.detailSlug)).toBeDefined();
      }
    }
  });

  it('does not pad a manufacturer beyond its live catalog', () => {
    expect(getBrandCollection('lucid')?.entries).toHaveLength(6);
    expect(getBrandCollection('porsche')?.entries).toHaveLength(10);
  });
});
