import type { Metadata } from 'next';
import { cars } from '@/lib/cars';

export const metadata: Metadata = {
  title: 'Image credits',
  description: 'Creators, licenses and source pages for CultEmergence vehicle photography.',
  alternates: { canonical: '/credits' }
};

export default function CreditsPage() {
  return (
    <div className="inner-page section-shell prose-page">
      <header className="inner-hero">
        <p className="eyebrow">Open-license media</p>
        <h1>
          Credit,
          <span>where it belongs.</span>
        </h1>
        <p>
          Photographs are loaded from Wikimedia Commons. Every record keeps the creator, source page
          and license visible; local SVGs are original fallbacks.
        </p>
      </header>
      <ul className="credits-list">
        {cars.map((car) => (
          <li key={car.slug}>
            <span>{String(car.rank).padStart(2, '0')}</span>
            <div>
              <h2>
                {car.brand} {car.model}
              </h2>
              <p>
                Photograph by{' '}
                <a href={car.image.pageUrl} target="_blank" rel="noopener noreferrer">
                  {car.image.creator}
                </a>{' '}
                under{' '}
                <a href={car.image.licenseUrl} target="_blank" rel="noopener noreferrer">
                  {car.image.license}
                </a>
                .
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
