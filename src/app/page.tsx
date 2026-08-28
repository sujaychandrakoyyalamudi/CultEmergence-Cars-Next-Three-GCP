import Link from 'next/link';
import type { CSSProperties } from 'react';
import { CarCard } from '@/components/CarCard';
import { HeroExperience } from '@/components/HeroExperience';
import { JsonLd } from '@/components/JsonLd';
import { MotionReveal } from '@/components/MotionReveal';
import { brandCollectionEntryCount, brandCollections } from '@/lib/brandCollections';
import { cars } from '@/lib/cars';
import { site } from '@/lib/site';

export default function HomePage() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'CultEmergence ten standout cars sold in the United States',
    numberOfItems: cars.length,
    itemListElement: cars.map((car) => ({
      '@type': 'ListItem',
      position: car.rank,
      url: `${site.url}/cars/${car.slug}`,
      name: `${car.modelYear} ${car.brand} ${car.model}`
    }))
  };

  return (
    <>
      <JsonLd data={itemList} />
      <HeroExperience cars={cars} />

      <nav className="chapter-nav" aria-label="Page chapters">
        <a href="#collection">The ten</a>
        <a href="#makers">Manufacturers</a>
        <a href="#principles">Selection</a>
        <a href="#compare">Compare</a>
      </nav>

      <section
        id="collection"
        className="collection-section section-shell"
        aria-labelledby="collection-title"
      >
        <MotionReveal>
          <p className="eyebrow">The 2026 editorial collection</p>
          <h2 id="collection-title" className="display-heading">
            Different missions.
            <span>Exceptional answers.</span>
          </h2>
          <p className="section-intro">
            “Best” is not one number. This collection recognizes ten cars for how convincingly they
            execute a distinct mission—performance, luxury, efficiency, value or adventure.
          </p>
        </MotionReveal>
        <div className="car-grid">
          {cars.map((car) => (
            <MotionReveal key={car.slug}>
              <CarCard car={car} />
            </MotionReveal>
          ))}
        </div>
      </section>

      <section id="makers" className="makers-section" aria-labelledby="makers-title">
        <div className="section-shell">
          <MotionReveal>
            <p className="eyebrow">The expanded field · {brandCollectionEntryCount} vehicles</p>
            <h2 id="makers-title" className="display-heading">
              Ten makers.
              <span>Deeper cuts.</span>
            </h2>
            <p className="section-intro">
              Go beyond the headline collection with current, ranked model guides for every
              manufacturer represented here—each one tied to official U.S. data.
            </p>
          </MotionReveal>
          <div className="maker-strip">
            {brandCollections.map((collection) => (
              <MotionReveal key={collection.slug}>
                <Link href={`/brands/${collection.slug}`}>
                  <span>{String(collection.entries.length).padStart(2, '0')}</span>
                  <strong>{collection.name}</strong>
                  <small>{collection.entries[0]?.model}</small>
                </Link>
              </MotionReveal>
            ))}
          </div>
          <Link className="button button-dark" href="/brands">
            Explore all manufacturer rankings
          </Link>
        </div>
      </section>

      <section
        id="principles"
        className="principles-section dark-section"
        aria-labelledby="principles-title"
      >
        <div className="section-shell principles-layout">
          <MotionReveal>
            <p className="eyebrow">How the ten were selected</p>
            <h2 id="principles-title" className="display-heading">
              Mission first.
              <span>Then the numbers.</span>
            </h2>
          </MotionReveal>
          <div className="principle-list">
            {[
              [
                '01',
                'U.S. relevance',
                'On sale or publicly priced for the U.S. market when the data was checked.'
              ],
              [
                '02',
                'Segment excellence',
                'Judged against the purpose and expectations of its own category.'
              ],
              [
                '03',
                'Whole-car value',
                'Capability, usability, efficiency and price considered together.'
              ],
              [
                '04',
                'Editorial diversity',
                'No list of ten should pretend every excellent car solves the same problem.'
              ]
            ].map(([number, title, description]) => (
              <MotionReveal key={number} className="principle-row">
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </MotionReveal>
            ))}
          </div>
          <Link className="text-link" href="/methodology">
            Read the complete methodology <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section id="compare" className="compare-cta section-shell" aria-labelledby="compare-title">
        <MotionReveal>
          <p className="eyebrow">A more useful comparison</p>
          <h2 id="compare-title" className="display-heading">
            Put opposites
            <span>side by side.</span>
          </h2>
          <p>
            Compare up to ten vehicles from one manufacturer or across the field, with manufacturer
            and model filtering. The interface remains useful without WebGL or animation.
          </p>
          <Link className="button button-dark" href="/compare">
            Open comparison studio
          </Link>
        </MotionReveal>
        <div className="comparison-visual" aria-hidden="true">
          <span style={{ '--bar': '24%' } as CSSProperties}>Camry</span>
          <span style={{ '--bar': '54%' } as CSSProperties}>Model 3</span>
          <span style={{ '--bar': '88%' } as CSSProperties}>M5</span>
        </div>
      </section>

      <aside className="data-note">
        <div className="section-shell">
          <strong>Price and specification note</strong>
          <p>
            U.S. starting prices and specifications were checked on {site.checkedOn}. Taxes,
            options, dealer charges and delivery are excluded unless a vehicle note says otherwise.
            Future-model-year range figures may be manufacturer-projected. Always confirm current
            details with the automaker or dealer.
          </p>
        </div>
      </aside>
    </>
  );
}
