'use client';

import { useState } from 'react';
import type { Car } from '@/lib/cars';

type CarImageProps = { car: Car; eager?: boolean; className?: string };

export function CarImage({ car, eager = false, className = '' }: CarImageProps) {
  const [source, setSource] = useState(car.image.url);
  return (
    <figure className={`car-image ${className}`}>
      <img
        src={source}
        alt={car.image.alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => {
          if (source !== car.image.fallback) setSource(car.image.fallback);
        }}
      />
      <figcaption>
        {car.image.representative ? 'Representative photograph · ' : ''}
        {car.image.creator} · {car.image.license}
      </figcaption>
    </figure>
  );
}
