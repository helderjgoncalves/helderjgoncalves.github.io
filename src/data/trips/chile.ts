import { photos } from '../photos';
import type { Trip } from './types';

// Sample: stops and photos are placeholders until the real ones arrive.
export const chile: Trip = {
  slug: 'chile',
  title: 'Chile',
  region: 'South America',
  summary: 'Desert skies at the top of a long, thin country.',
  stops: [
    { name: 'Santiago', country: 'Chile', photos: [] },
    { name: 'Atacama Desert', country: 'Chile', photos: [photos.sampleChile] },
  ],
  cover: { photo: photos.sampleChile },
  practical: [],
  meta: {
    title: 'Chile · Trips · Hélder Gonçalves',
    description: 'Chile beyond Patagonia, stop by stop: Santiago and the Atacama Desert.',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
    imageAlt: 'Standing on the snowy summit of Huayna Potosí at night, the lights of La Paz far below',
  },
};
