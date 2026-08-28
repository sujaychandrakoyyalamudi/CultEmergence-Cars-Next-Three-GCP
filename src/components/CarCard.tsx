import Link from 'next/link';
import type { CSSProperties } from 'react';
import { CarImage } from '@/components/CarImage';
import type { Car } from '@/lib/cars';

type CarCardProps = { car: Car };
export function CarCard({ car }: CarCardProps) {
  return (
    <article className="car-card" style={{ '--accent': car.accent } as CSSProperties}>
      <Link href={`/cars/${car.slug}`} aria-label={`Read about the ${car.modelYear} ${car.brand} ${car.model}`}>
        <CarImage car={car} />
        <div className="card-body">
          <div className="card-kicker"><span>{String(car.rank).padStart(2, '0')}</span><span>{car.award}</span></div>
          <h3>{car.brand} <span>{car.model}</span></h3>
          <p>{car.tagline}</p>
          <div className="card-meta"><strong>{car.price.display}</strong><span>{car.specs[0]?.value}</span><span>{car.specs[1]?.value}</span></div>
        </div>
      </Link>
    </article>
  );
}
