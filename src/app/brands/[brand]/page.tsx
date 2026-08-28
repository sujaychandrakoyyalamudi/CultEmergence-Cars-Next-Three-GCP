import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { JsonLd } from '@/components/JsonLd';
import { brandCollections, getBrandCollection } from '@/lib/brandCollections';
import { site } from '@/lib/site';

export function generateStaticParams() {
  return brandCollections.map((collection) => ({ brand: collection.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const collection = getBrandCollection(brand);
  if (!collection) return {};

  return {
    title: `Top ${collection.entries.length} ${collection.name} vehicles`,
    description: collection.summary,
    alternates: { canonical: `/brands/${collection.slug}` }
  };
}

export default async function BrandCollectionPage({
  params
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const collection = getBrandCollection(brand);
  if (!collection) notFound();

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `CultEmergence top ${collection.entries.length} ${collection.name} vehicles`,
    numberOfItems: collection.entries.length,
    itemListElement: collection.entries.map((entry) => ({
      '@type': 'ListItem',
      position: entry.rank,
      name: `${entry.year} ${collection.name} ${entry.model}`,
      url: entry.detailSlug ? `${site.url}/cars/${entry.detailSlug}` : entry.officialUrl
    }))
  };

  return (
    <div
      className="brand-collection-page"
      style={{ '--accent': collection.accent } as CSSProperties}
    >
      <JsonLd data={itemList} />
      <header className="brand-collection-hero section-shell">
        <Link className="back-link" href="/brands">
          ← All manufacturers
        </Link>
        <p className="eyebrow">Manufacturer collection · {collection.entries.length} picks</p>
        <h1>{collection.name}</h1>
        <p>{collection.summary}</p>
        <div className="brand-hero-meta">
          <span>Data checked {site.checkedOn}</span>
          <a href={collection.source.url} target="_blank" rel="noreferrer">
            {collection.source.label} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main
        className="section-shell brand-ranking"
        aria-label={`${collection.name} ranked vehicles`}
      >
        {collection.entries.map((entry) => (
          <article key={`${entry.rank}-${entry.model}`} className="ranked-model-card">
            <div className="ranked-model-rank" aria-label={`Rank ${entry.rank}`}>
              {String(entry.rank).padStart(2, '0')}
            </div>
            <div className="ranked-model-heading">
              <span>
                {entry.year} · {entry.category}
              </span>
              <h2>{entry.model}</h2>
            </div>
            <dl className="ranked-model-data">
              <div>
                <dt>Powertrain</dt>
                <dd>{entry.powertrain}</dd>
              </div>
              <div>
                <dt>Starting price</dt>
                <dd>{entry.price}</dd>
              </div>
              <div>
                <dt>Why it stands out</dt>
                <dd>{entry.highlight}</dd>
              </div>
            </dl>
            <div className="ranked-model-actions">
              {entry.detailSlug ? (
                <Link href={`/cars/${entry.detailSlug}`}>Read full profile</Link>
              ) : null}
              <a href={entry.officialUrl} target="_blank" rel="noreferrer">
                Official data <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ))}
      </main>

      <aside className="brand-scope-note section-shell">
        <strong>Scope note</strong>
        <p>
          {collection.scopeNote} Prices exclude taxes, registration, options and dealer charges
          unless the manufacturer says otherwise.
        </p>
      </aside>

      <nav className="brand-pagination" aria-label="Other manufacturer collections">
        {brandCollections.map((item) => (
          <Link
            key={item.slug}
            href={`/brands/${item.slug}`}
            aria-current={item.slug === collection.slug ? 'page' : undefined}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
