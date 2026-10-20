import { photos } from '../photos';
import type { Trip } from './types';

// Sample: stops and photos are placeholders until the real ones arrive.
export const rioDeJaneiro: Trip = {
  slug: 'rio-de-janeiro',
  title: 'Rio de Janeiro',
  region: 'South America',
  summary: 'Mountains tumbling into the sea, and a city that never sits still.',
  stops: [
    { name: 'Christ the Redeemer', country: 'Brazil', icon: 'star', photos: [photos.sampleRio] },
    { name: 'Sugarloaf Mountain', country: 'Brazil', photos: [] },
  ],
  cover: { photo: photos.sampleRio },
  practical: [],
  meta: {
    title: 'Rio de Janeiro · Hélder Gonçalves',
    description: 'Rio de Janeiro, stop by stop: Christ the Redeemer and Sugarloaf Mountain.',  },
};
