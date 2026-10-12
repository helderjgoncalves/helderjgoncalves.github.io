import { photos } from '../photos';
import type { Trip } from './types';

export const bolivia: Trip = {
  slug: 'bolivia',
  title: 'Bolivia',
  region: 'South America',
  summary: 'Thin air, endless salt and skies that go on forever.',
  stops: [
    { name: 'Death Road', country: 'Bolivia', photos: [] },
    {
      name: 'Huayna Potosí',
      country: 'Bolivia',
      icon: 'mountain',
      photos: [photos.summitNight, photos.aboveTheClouds],
    },
    {
      name: 'Salar de Uyuni',
      country: 'Bolivia',
      photos: [photos.saltFlatJump, photos.saltTables, photos.saltSunset],
    },
    { name: 'Eduardo Avaroa Reserve', country: 'Bolivia', photos: [] },
  ],
  cover: { photo: photos.summitNight },
  featured: true,
  practical: [],
  meta: {
    title: 'Bolivia · Trips · Hélder Gonçalves',
    description:
      'Bolivia, stop by stop: the Death Road, a night climb of Huayna Potosí, and the Salar de Uyuni.',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
    imageAlt: 'Standing on the snowy summit of Huayna Potosí at night, the lights of La Paz far below',
  },
};
