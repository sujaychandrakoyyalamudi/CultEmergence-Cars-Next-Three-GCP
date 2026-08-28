'use client';

import { type ReactNode, useEffect, useRef } from 'react';

type MotionRevealProps = { children: ReactNode; className?: string };

export function MotionReveal({ children, className = '' }: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.dataset.visible = 'true';
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.dataset.visible = 'true';
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`motion-reveal ${className}`} data-visible="false">{children}</div>;
}
