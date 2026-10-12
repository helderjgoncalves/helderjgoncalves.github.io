import { photos } from '../photos';
import type { Trip } from './types';

// Sample: stops and photos are placeholders until the real ones arrive.
export const yucatan: Trip = {
  slug: 'yucatan',
  title: 'Yucatán',
  region: 'Mexico & Central America',
  summary: 'Ancient ruins, hidden cenotes and warm Caribbean water.',
  stops: [
    { name: 'Chichén Itzá', country: 'Mexico', icon: 'star', photos: [photos.sampleYucatan] },
    { name: 'Valladolid', country: 'Mexico', photos: [] },
    { name: 'Tulum', country: 'Mexico', photos: [] },
  ],
  cover: { photo: photos.sampleYucatan },
  practical: [],
  meta: {
    title: 'Yucatán · Trips · Hélder Gonçalves',
    description: 'The Yucatán Peninsula in Mexico, stop by stop: Chichén Itzá, Valladolid and Tulum.',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
    imageAlt: 'Standing on the snowy summit of Huayna Potosí at night, the lights of La Paz far below',
  },
};
