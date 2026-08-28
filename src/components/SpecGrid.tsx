import type { Car } from '@/lib/cars';
export function SpecGrid({ car }: { car: Car }) {
  return <dl className="spec-grid">{car.specs.map((spec) => <div key={`${car.slug}-${spec.label}`}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>;
}
