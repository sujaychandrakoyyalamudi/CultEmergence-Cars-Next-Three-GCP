import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { CarImage } from '@/components/CarImage';
import { JsonLd } from '@/components/JsonLd';
import { MotionReveal } from '@/components/MotionReveal';
import { SpecGrid } from '@/components/SpecGrid';
import { cars, formatUsd, getCarBySlug } from '@/lib/cars';
import { site } from '@/lib/site';

export function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) return {};

  const title = `${car.modelYear} ${car.brand} ${car.model}`;
  return {
    title,
    description: car.summary,
    alternates: { canonical: `/cars/${car.slug}` },
    openGraph: {
      title: `${title} — ${car.award}`,
      description: car.summary,
      url: `${site.url}/cars/${car.slug}`,
      images: [{ url: car.image.url, alt: car.image.alt }]
    }
  };
}

export default async function CarDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) notFound();

  const vehicleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${car.modelYear} ${car.brand} ${car.model}`,
    url: `${site.url}/cars/${car.slug}`,
    image: car.image.url,
    description: car.summary,
    vehicleModelDate: String(car.modelYear),
    manufacturer: { '@type': 'Organization', name: car.brand },
    fuelType: car.powertrain.type,
    vehicleTransmission: car.powertrain.transmission,
    driveWheelConfiguration: car.powertrain.drive,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: car.price.amountUsd,
      url: car.officialUrl,
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <article className="detail-page" style={{ '--accent': car.accent } as CSSProperties}>
      <JsonLd data={vehicleSchema} />
      <div className="detail-mast section-shell">
        <Link className="back-link" href="/#collection">
          ← Back to the collection
        </Link>
        <div className="detail-heading">
          <p className="eyebrow">
            No. {String(car.rank).padStart(2, '0')} · {car.award}
          </p>
          <h1>
            <span>{car.brand}</span>
            {car.model}
          </h1>
          <p>{car.tagline}</p>
        </div>
        <CarImage car={car} eager className="detail-image" />
      </div>

      <div className="detail-story section-shell">
        <MotionReveal className="detail-lead">
          <p className="detail-year">{car.modelYear}</p>
          <div>
            <p className="eyebrow">Why it belongs</p>
            <h2>{car.whyItMadeTheList}</h2>
            <p>{car.summary}</p>
          </div>
        </MotionReveal>

        <MotionReveal>
          <SpecGrid car={car} />
        </MotionReveal>

        <MotionReveal className="powertrain-panel">
          <p className="eyebrow">Powertrain architecture</p>
          <dl>
            <div>
              <dt>Energy</dt>
              <dd>{car.powertrain.type}</dd>
            </div>
            <div>
              <dt>Engine / motors</dt>
              <dd>{car.powertrain.engine}</dd>
            </div>
            <div>
              <dt>Driven wheels</dt>
              <dd>{car.powertrain.drive}</dd>
            </div>
            <div>
              <dt>Transmission</dt>
              <dd>{car.powertrain.transmission}</dd>
            </div>
          </dl>
        </MotionReveal>

        <div className="pros-cons">
          <MotionReveal>
            <section>
              <p className="eyebrow">The case for it</p>
              <h2>What it gets right.</h2>
              <ul>
                {car.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </MotionReveal>
          <MotionReveal>
            <section>
              <p className="eyebrow">The honest trade-offs</p>
              <h2>What to know first.</h2>
              <ul>
                {car.tradeoffs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </MotionReveal>
        </div>

        <MotionReveal className="price-panel">
          <div>
            <p className="eyebrow">U.S. starting price</p>
            <strong>{formatUsd(car.price.amountUsd)}</strong>
            <p>{car.price.qualifier}</p>
          </div>
          <a
            className="button button-primary"
            href={car.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View official model page
          </a>
        </MotionReveal>

        <section className="source-panel" aria-labelledby="source-title">
          <p className="eyebrow">Research trail</p>
          <h2 id="source-title">Sources and image license</h2>
          <ul>
            {car.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.label}
                </a>
                <span>{source.kind}</span>
              </li>
            ))}
          </ul>
          <p>
            Photo:{' '}
            <a href={car.image.pageUrl} target="_blank" rel="noopener noreferrer">
              {car.image.creator}
            </a>
            ,{' '}
            <a href={car.image.licenseUrl} target="_blank" rel="noopener noreferrer">
              {car.image.license}
            </a>
            .{' '}
            {car.image.representative
              ? 'The image represents the current vehicle generation and may show a different trim or market specification.'
              : ''}
          </p>
          <p>
            Data checked {car.price.checkedOn}. Pricing and specifications can change; verify before
            making a purchase decision.
          </p>
        </section>
      </div>

      <nav className="detail-pagination" aria-label="Browse the collection">
        {cars.map((item) => (
          <Link
            key={item.slug}
            href={`/cars/${item.slug}`}
            aria-current={item.slug === car.slug ? 'page' : undefined}
          >
            {String(item.rank).padStart(2, '0')}
            <span>{item.brand}</span>
          </Link>
        ))}
      </nav>
    </article>
  );
}
