'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { type CSSProperties, useMemo, useState, useSyncExternalStore } from 'react';
import type { Car } from '@/lib/cars';

const HeroCanvas = dynamic(
  () => import('@/components/HeroCanvas').then((module) => module.HeroCanvas),
  {
    ssr: false,
    loading: () => <div className="canvas-loading" aria-hidden="true" />
  }
);

type HeroExperienceProps = {
  cars: readonly Car[];
};

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(onStoreChange: () => void): () => void {
  const motion = window.matchMedia(reducedMotionQuery);
  motion.addEventListener('change', onStoreChange);
  return () => motion.removeEventListener('change', onStoreChange);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia(reducedMotionQuery).matches;
}

function subscribeToWebGL(): () => void {
  return () => undefined;
}

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function HeroExperience({ cars }: HeroExperienceProps) {
  const [activeSlug, setActiveSlug] = useState(cars[0]?.slug ?? '');
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => true
  );
  const webgl = useSyncExternalStore(subscribeToWebGL, canUseWebGL, () => false);
  const activeCar = useMemo(
    () => cars.find((car) => car.slug === activeSlug) ?? cars[0],
    [activeSlug, cars]
  );

  if (!activeCar) return null;

  return (
    <section className="hero-experience" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">An independent U.S.-market collection</p>
        <h1 id="hero-title">
          Ten cars.
          <span>One moving sculpture.</span>
        </h1>
        <p className="hero-deck">
          A cinematic, evidence-linked guide to standout machines—from a 51-mpg family sedan to a
          717-hp super sedan.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#collection">
            Explore the ten
          </a>
          <Link className="button button-quiet" href="/compare">
            Compare specifications
          </Link>
        </div>
      </div>

      <div className="hero-stage" style={{ '--accent': activeCar.accent } as CSSProperties}>
        <div className="stage-glow" aria-hidden="true" />
        {webgl ? (
          <HeroCanvas
            accent={activeCar.accent}
            reducedMotion={reducedMotion}
            silhouette={activeCar.silhouette}
          />
        ) : (
          <img
            className="stage-fallback"
            src={activeCar.image.fallback}
            alt=""
            width="1200"
            height="720"
          />
        )}
        <div className="stage-caption" aria-live="polite">
          <span className="stage-rank">{String(activeCar.rank).padStart(2, '0')}</span>
          <div>
            <strong>{activeCar.brand}</strong>
            <span>{activeCar.model}</span>
          </div>
          <span>{activeCar.price.display}</span>
        </div>
        <p className="stage-instruction">Drag to orbit · procedural model, not a scanned vehicle</p>
      </div>

      <fieldset className="hero-selector">
        <legend className="visually-hidden">Choose a vehicle for the 3D stage</legend>
        {cars.map((car) => {
          const active = car.slug === activeCar.slug;
          return (
            <button
              key={car.slug}
              type="button"
              className={active ? 'is-active' : undefined}
              aria-pressed={active}
              onClick={() => setActiveSlug(car.slug)}
            >
              <span>{String(car.rank).padStart(2, '0')}</span>
              {car.brand}
            </button>
          );
        })}
      </fieldset>
    </section>
  );
}
