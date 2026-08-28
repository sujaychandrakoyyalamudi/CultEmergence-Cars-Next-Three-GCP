import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const data = JSON.parse(readFileSync(resolve(root, 'src/data/cars.json'), 'utf8'));
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(Array.isArray(data), 'cars.json must contain an array');
assert(data.length === 10, `expected 10 cars, received ${data.length}`);
const slugs = new Set();
const ranks = new Set();
for (const [index, car] of data.entries()) {
  const prefix = `cars[${index}]`;
  assert(typeof car.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(car.slug), `${prefix}: invalid slug`);
  assert(!slugs.has(car.slug), `${prefix}: duplicate slug ${car.slug}`); slugs.add(car.slug);
  assert(Number.isInteger(car.rank) && car.rank >= 1 && car.rank <= 10, `${prefix}: invalid rank`);
  assert(!ranks.has(car.rank), `${prefix}: duplicate rank ${car.rank}`); ranks.add(car.rank);
  assert(car.price?.amountUsd > 0, `${prefix}: positive USD price required`);
  assert(/^2026-08-26$/.test(car.price?.checkedOn ?? ''), `${prefix}: price check date must be 2026-08-26`);
  assert(Array.isArray(car.specs) && car.specs.length >= 4, `${prefix}: at least four specs required`);
  assert(['sports', 'coupe', 'sedan', 'crossover', 'suv'].includes(car.silhouette), `${prefix}: invalid 3D silhouette`);
  assert(Array.isArray(car.sources) && car.sources.length >= 1, `${prefix}: at least one source required`);
  assert(car.sources.some((source) => source.kind === 'manufacturer'), `${prefix}: manufacturer source required`);
  assert(car.image?.url?.startsWith('https://upload.wikimedia.org/'), `${prefix}: image must be from Wikimedia upload host`);
  assert(car.image?.pageUrl?.startsWith('https://commons.wikimedia.org/'), `${prefix}: Commons attribution page required`);
  const fallback = resolve(root, `public${car.image?.fallback ?? ''}`);
  assert(existsSync(fallback), `${prefix}: missing fallback ${car.image?.fallback}`);
}
assert(ranks.size === 10 && [...ranks].every((rank) => rank >= 1 && rank <= 10), 'ranks must be exactly 1–10');

if (errors.length) {
  console.error(`Vehicle data validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Vehicle data validation PASS: ${data.length} cars, ${slugs.size} unique slugs, ${ranks.size} ranks.`);
