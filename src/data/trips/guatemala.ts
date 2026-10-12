import { photos } from '../photos';
import type { Trip } from './types';

export const guatemala: Trip = {
  slug: 'guatemala',
  title: 'Guatemala',
  region: 'Mexico & Central America',
  summary: 'Lava by night, jungle pools by day.',
  stops: [
    {
      name: 'Acatenango',
      country: 'Guatemala',
      icon: 'mountain',
      photos: [photos.volcano, photos.fuegoAsh],
    },
    { name: 'Semuc Champey', country: 'Guatemala', photos: [] },
  ],
  cover: { photo: photos.volcano, focus: '50% 65%' },
  practical: [],
  meta: {
    title: 'Guatemala · Trips · Hélder Gonçalves',
    description:
      'A night on Acatenango in Guatemala, watching Volcán de Fuego erupt at night and send up an ash cloud at dawn.',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
    imageAlt: 'Standing on the snowy summit of Huayna Potosí at night, the lights of La Paz far below',
  },
};
