import { photos } from '../photos';
import type { Trip } from './types';

export const guatemala: Trip = {
  slug: 'guatemala',
  title: 'Volcanoes to the Caribbean',
  place: 'Guatemala',
  region: 'Mexico & Central America',
  summary:
    'Lava lighting up the night from a cold camp high on a volcano, then slow days doing nothing at all in warm, turquoise jungle pools.',
  facts: { difficulty: 4, comfort: 3 },
  highlights: [
    {
      title: 'Fire on Acatenango',
      text: 'Climb to a camp high on Acatenango and watch its neighbour, Fuego, throw lava into the dark every few minutes. A hard climb and a cold night, for a show you never forget.',
    },
    {
      title: 'Lake Atitlán',
      text: 'Three volcanoes stand around a deep blue lake, and each village on its shore has its own market, colours and pace. You get around by boat.',
    },
    {
      title: 'Swimming in Semuc Champey',
      text: 'Turquoise pools step down over a river that vanishes under the rock. Swim, float, and let the jungle do the rest.',
    },
    {
      title: 'Maya temples and the Caribbean',
      text: 'Climb a temple at Yaxhá to see nothing but rainforest to the horizon, wander cobbled Antigua under its volcanoes, and follow the Río Dulce down to Livingston on the Caribbean.',
    },
  ],
  stops: [
    {
      name: 'Acatenango',
      country: 'Guatemala',
      icon: 'mountain',
      photos: [photos.volcano, photos.fuegoAsh],
    },
    { name: 'Semuc Champey', country: 'Guatemala', photos: [photos.semucChampey] },
  ],
  cover: { photo: photos.volcano, focus: '50% 65%', phoneZoom: 1.5 },
  practical: [],
  meta: {
    title: 'Guatemala, volcanoes to the Caribbean · Trips · Hélder Gonçalves',
    description:
      'A night on Acatenango in Guatemala, watching Volcán de Fuego erupt at night and send up an ash cloud at dawn.',  },
};
