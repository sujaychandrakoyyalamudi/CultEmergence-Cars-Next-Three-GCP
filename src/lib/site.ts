export const site = {
  name: 'CultEmergence',
  title: 'CultEmergence — Exceptional cars, researched and ranked',
  description:
    'An independent, cinematic guide to standout U.S.-market cars, with a ten-car feature collection and source-linked rankings across ten manufacturers.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cultemergence.com',
  domain: 'cultemergence.com',
  checkedOn: '2026-08-27'
} as const;
