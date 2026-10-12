import { photos } from '../photos';
import type { Trip } from './types';

export const patagonia: Trip = {
  slug: 'patagonia',
  title: 'Patagonia',
  region: 'South America',
  summary: 'Wind, ice and granite: the edge of the map, on foot.',
  stops: [
    { name: 'Perito Moreno Glacier', country: 'Argentina', photos: [photos.glacier] },
    {
      name: 'El Chaltén',
      country: 'Argentina',
      icon: 'mountain',
      photos: [photos.fitzRoy, photos.rioDeLasVueltas, photos.lomaDelPliegueTumbado],
    },
    {
      name: 'Torres del Paine',
      country: 'Chile',
      icon: 'mountain',
      photos: [photos.torresDelPaine, photos.lasTorres, photos.cuernosDelPaine],
    },
  ],
  cover: { photo: photos.lasTorres, focus: '50% 30%' },
  featured: true,
  practical: [],
  meta: {
    title: 'Patagonia · Trips · Hélder Gonçalves',
    description:
      'Patagonia in Argentina and Chile: the Perito Moreno Glacier, El Chaltén and the granite towers of Torres del Paine, stop by stop.',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
    imageAlt: 'Standing on the snowy summit of Huayna Potosí at night, the lights of La Paz far below',
  },
};
