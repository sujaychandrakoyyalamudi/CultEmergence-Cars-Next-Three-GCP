import { z } from 'zod';
import carData from '@/data/cars.json';

const sourceSchema = z.object({
  label: z.string().min(1),
  url: z.string().url().startsWith('https://'),
  kind: z.enum(['manufacturer', 'independent'])
});

const specSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  sortValue: z.number().optional(),
  unit: z.string().optional()
});

const carSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  rank: z.number().int().min(1).max(10),
  modelYear: z.number().int().min(2025).max(2030),
  brand: z.string().min(1),
  model: z.string().min(1),
  category: z.string().min(1),
  silhouette: z.enum(['sports', 'coupe', 'sedan', 'crossover', 'suv']),
  award: z.string().min(1),
  tagline: z.string().min(1),
  summary: z.string().min(40),
  whyItMadeTheList: z.string().min(40),
  price: z.object({
    amountUsd: z.number().positive(),
    display: z.string().min(1),
    qualifier: z.string().min(1),
    checkedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  }),
  powertrain: z.object({
    type: z.string().min(1),
    engine: z.string().min(1),
    drive: z.string().min(1),
    transmission: z.string().min(1)
  }),
  specs: z.array(specSchema).min(4),
  strengths: z.array(z.string().min(1)).min(3),
  tradeoffs: z.array(z.string().min(1)).min(3),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  image: z.object({
    url: z.string().url().startsWith('https://upload.wikimedia.org'),
    pageUrl: z.string().url().startsWith('https://commons.wikimedia.org'),
    fallback: z.string().startsWith('/images/fallback/'),
    alt: z.string().min(12),
    creator: z.string().min(1),
    license: z.string().min(1),
    licenseUrl: z.string().url(),
    representative: z.boolean()
  }),
  officialUrl: z.string().url().startsWith('https://'),
  sources: z.array(sourceSchema).min(1)
});

const carsSchema = z.array(carSchema).length(10);

export type Car = z.infer<typeof carSchema>;
export type CarSpec = z.infer<typeof specSchema>;

const parsedCars = carsSchema.parse(carData);

export const cars: readonly Car[] = Object.freeze(
  [...parsedCars].sort((left, right) => left.rank - right.rank)
);

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((car) => car.slug === slug);
}

export function getSpec(car: Car, label: string): CarSpec | undefined {
  return car.specs.find((spec) => spec.label.toLowerCase() === label.toLowerCase());
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}
