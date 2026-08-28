import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CultEmergence Cars',
    short_name: 'CultEmergence',
    description: 'Exceptional cars, researched, ranked and presented with source-linked data.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090a0d',
    theme_color: '#090a0d',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }]
  };
}
