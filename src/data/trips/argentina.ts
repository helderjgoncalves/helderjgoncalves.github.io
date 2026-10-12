import { photos } from '../photos';
import type { Trip } from './types';

// Sample: stops and photos are placeholders until the real ones arrive.
export const argentina: Trip = {
  slug: 'argentina',
  title: 'Argentina',
  region: 'South America',
  summary: 'Big cities and bigger waterfalls.',
  stops: [
    { name: 'Buenos Aires', country: 'Argentina', photos: [] },
    { name: 'Iguazú Falls', country: 'Argentina', photos: [photos.sampleArgentina] },
  ],
  cover: { photo: photos.sampleArgentina },
  practical: [],
  meta: {
    title: 'Argentina · Trips · Hélder Gonçalves',
    description: 'Argentina beyond Patagonia, stop by stop: Buenos Aires and the Iguazú Falls.',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
    imageAlt: 'Standing on the snowy summit of Huayna Potosí at night, the lights of La Paz far below',
  },
};
