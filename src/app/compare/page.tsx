import type { Metadata } from 'next';
import { CompareClient } from '@/components/CompareClient';
import { comparisonVehicles } from '@/lib/comparisonVehicles';

export const metadata: Metadata = {
  title: 'Compare up to ten vehicles',
  description:
    'Compare up to ten vehicles from the same manufacturer or across manufacturers, with manufacturer and model filtering.',
  alternates: { canonical: '/compare' }
};

export default function ComparePage() {
  return (
    <div className="inner-page section-shell">
      <header className="inner-hero">
        <p className="eyebrow">Comparison studio</p>
        <h1>
          Different answers.
          <span>One table.</span>
        </h1>
        <p>
          Choose up to ten vehicles from one manufacturer or across the field. Filter by
          manufacturer and model without reducing the data to a misleading universal score.
        </p>
      </header>
      <CompareClient vehicles={comparisonVehicles} />
    </div>
  );
}
