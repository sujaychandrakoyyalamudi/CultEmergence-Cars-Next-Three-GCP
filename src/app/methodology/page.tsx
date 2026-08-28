import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Selection methodology',
  description: 'How CultEmergence selected, researched and ranked standout U.S.-market cars.',
  alternates: { canonical: '/methodology' }
};

const dimensions = [
  {
    title: 'Mission execution',
    text: 'How completely the car fulfills the purpose of its own segment—not whether it wins an unrelated drag race.'
  },
  {
    title: 'Whole-car usefulness',
    text: 'Passenger and cargo utility, controls, range or efficiency, comfort and the friction of everyday ownership.'
  },
  {
    title: 'Engineering character',
    text: 'A coherent technical identity: response, feedback, efficiency, capability, repeatability or a meaningful innovation.'
  },
  {
    title: 'Value in context',
    text: 'Starting price relative to the capability and alternatives in the same market mission—not simply the lowest dollar amount.'
  },
  {
    title: 'Evidence quality',
    text: 'Current U.S. manufacturer information first, with independent testing labeled when the manufacturer does not publish a metric.'
  },
  {
    title: 'Collection diversity',
    text: 'A deliberate mix of powertrains, prices, body styles and use cases rather than ten versions of one enthusiast preference.'
  }
];

export default function MethodologyPage() {
  return (
    <div className="inner-page section-shell prose-page">
      <header className="inner-hero">
        <p className="eyebrow">Selection methodology</p>
        <h1>
          “Best” needs
          <span>a job description.</span>
        </h1>
        <p>
          The order is editorial, not a scientific universal score. Each car is a category winner
          selected for how convincingly it solves a distinct U.S.-market problem.
        </p>
      </header>

      <section>
        <h2>Six dimensions, applied in context</h2>
        <div className="method-grid">
          {dimensions.map((dimension, index) => (
            <article key={dimension.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{dimension.title}</h3>
              <p>{dimension.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Evidence rules</h2>
        <ol>
          <li>Use a current U.S. manufacturer source when available.</li>
          <li>Keep price qualifiers and measurement conditions attached to the value.</li>
          <li>Label projections and independent estimates explicitly.</li>
          <li>Expose source links on every car page.</li>
          <li>Date the data instead of implying it updates itself.</li>
        </ol>
      </section>

      <section>
        <h2>Manufacturer collections</h2>
        <p>
          The headline ten remain category winners across the market. Manufacturer pages use the
          same dimensions within one marque, selecting up to ten current U.S. nameplates or
          materially different configurations. When a company offers fewer than ten, the complete
          live range is shown instead of padding the ranking with discontinued or speculative cars.
        </p>
      </section>

      <section>
        <h2>What the list does not claim</h2>
        <p>
          It is not a reliability forecast, financial recommendation, safety ranking, dealer quote,
          guaranteed availability statement or substitute for a test drive. Prices and
          specifications were checked {site.checkedOn} and can change.
        </p>
      </section>

      <Link className="button button-dark" href="/compare">
        Compare the collection
      </Link>
    </div>
  );
}
