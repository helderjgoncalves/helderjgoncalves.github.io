import { photos } from '../photos';
import type { Trip } from './types';

export const peru: Trip = {
  slug: 'peru',
  title: 'Peru',
  region: 'South America',
  summary: 'Ancient stone, painted mountains and a lake on the roof of the Andes.',
  stops: [
    { name: 'Machu Picchu', country: 'Peru', icon: 'star', photos: [photos.machuPicchu] },
    { name: 'Rainbow Mountain', country: 'Peru', icon: 'mountain', photos: [photos.rainbowMountain] },
    { name: 'Lake Titicaca', country: 'Peru', photos: [photos.lakeSunset] },
  ],
  cover: { photo: photos.machuPicchu, focus: '50% 45%' },
  practical: [],
  meta: {
    title: 'Peru · Trips · Hélder Gonçalves',
    description:
      'Peru, stop by stop: Machu Picchu, Rainbow Mountain and Amantaní Island on Lake Titicaca.',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
    imageAlt: 'Standing on the snowy summit of Huayna Potosí at night, the lights of La Paz far below',
  },
};
