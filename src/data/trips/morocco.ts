import { photos } from '../photos';
import type { Trip } from './types';

// Sample: stops and photos are placeholders until the real ones arrive.
export const morocco: Trip = {
  slug: 'morocco',
  title: 'Morocco',
  region: 'Africa',
  summary: 'Spice, colour and the silence of the desert.',
  stops: [
    { name: 'Marrakech', country: 'Morocco', photos: [photos.sampleMorocco] },
    { name: 'Sahara', country: 'Morocco', photos: [] },
  ],
  cover: { photo: photos.sampleMorocco },
  practical: [],
  meta: {
    title: 'Morocco · Hélder Gonçalves',
    description: 'Morocco, stop by stop: the streets of Marrakech and the dunes of the Sahara.',  },
};
