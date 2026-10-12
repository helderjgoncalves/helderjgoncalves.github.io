import { photos } from '../photos';
import type { Trip } from './types';

// Sample: stops and photos are placeholders until the real ones arrive.
export const belize: Trip = {
  slug: 'belize',
  title: 'Belize',
  region: 'Mexico & Central America',
  summary: 'Sea and jungle, side by side.',
  stops: [
    { name: 'Caye Caulker', country: 'Belize', photos: [photos.sampleBelize] },
    { name: 'San Ignacio', country: 'Belize', photos: [] },
  ],
  cover: { photo: photos.sampleBelize },
  practical: [],
  meta: {
    title: 'Belize · Trips · Hélder Gonçalves',
    description: 'Belize, stop by stop: the sea at Caye Caulker and the jungle around San Ignacio.',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
    imageAlt: 'Standing on the snowy summit of Huayna Potosí at night, the lights of La Paz far below',
  },
};
