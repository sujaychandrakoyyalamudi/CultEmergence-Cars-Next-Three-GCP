import { describe, expect, it } from 'vitest';
import { cars, formatUsd, getCarBySlug, getSpec } from '@/lib/cars';

describe('vehicle catalog', () => {
  it('contains ten uniquely ranked vehicles', () => {
    expect(cars).toHaveLength(10);
    expect(new Set(cars.map((car) => car.slug)).size).toBe(10);
    expect(cars.map((car) => car.rank)).toEqual([1,2,3,4,5,6,7,8,9,10]);
  });
  it('requires manufacturer evidence and photo attribution', () => {
    for (const car of cars) {
      expect(car.sources.some((source) => source.kind === 'manufacturer')).toBe(true);
      expect(car.image.pageUrl).toContain('commons.wikimedia.org');
      expect(car.image.license).toBeTruthy();
    }
  });
  it('finds a car and its normalized specification', () => {
    const car = getCarBySlug('porsche-911-carrera-gts');
    expect(car?.brand).toBe('Porsche');
    expect(car && getSpec(car, 'Power')?.value).toBe('532 hp');
  });
  it('formats prices in U.S. dollars', () => {
    expect(formatUsd(29300)).toBe('$29,300');
  });
});
