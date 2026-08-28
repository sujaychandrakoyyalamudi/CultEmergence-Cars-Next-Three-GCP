import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { JsonLd } from '@/components/JsonLd';
import { brandCollectionEntryCount, brandCollections } from '@/lib/brandCollections';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Top cars by manufacturer',
  description: `Explore ${brandCollectionEntryCount} current, source-linked vehicle picks across ten manufacturers.`,
  alternates: { canonical: '/brands' }
};

export default function BrandsPage() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'CultEmergence manufacturer collections',
    numberOfItems: brandCollections.length,
    itemListElement: brandCollections.map((collection, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${site.url}/brands/${collection.slug}`,
      name: collection.name
    }))
  };

  return (
    <div className="inner-page section-shell brand-index-page">
      <JsonLd data={itemList} />
      <header className="inner-hero brand-index-hero">
        <p className="eyebrow">Manufacturer collections · checked {site.checkedOn}</p>
        <h1>
          Ten makers.
          <span>{brandCollectionEntryCount} current picks.</span>
        </h1>
        <p>
          Ranked, concise and evidence-linked. Open a manufacturer to explore its strongest current
          U.S. models and configurations without turning the homepage into an endless catalog.
        </p>
      </header>

      <div className="brand-index-grid">
        {brandCollections.map((collection) => (
          <Link
            key={collection.slug}
            className="brand-index-card"
            href={`/brands/${collection.slug}`}
            style={{ '--accent': collection.accent } as CSSProperties}
          >
            <div className="brand-card-topline">
              <span>{String(collection.entries.length).padStart(2, '0')} picks</span>
              <span aria-hidden="true">↗</span>
            </div>
            <h2>{collection.name}</h2>
            <p>{collection.summary}</p>
            <ol aria-label={`Top three ${collection.name} picks`}>
              {collection.entries.slice(0, 3).map((entry) => (
                <li key={entry.model}>{entry.model}</li>
              ))}
            </ol>
          </Link>
        ))}
      </div>

      <aside className="collection-disclosure">
        <strong>What “top” means here</strong>
        <p>
          These are editorial rankings, not sales charts or reliability forecasts. Mission
          execution, engineering character, usefulness, value and range breadth all matter. Prices
          and lineups can change; every card links to its manufacturer source.
        </p>
        <Link className="text-link" href="/methodology">
          Read the methodology <span aria-hidden="true">↗</span>
        </Link>
      </aside>
    </div>
  );
}
