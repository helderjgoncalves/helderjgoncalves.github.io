import { photos } from '../photos';
import type { Trip } from './types';

export const bolivia: Trip = {
  slug: 'bolivia',
  title: 'The altiplano and the cities',
  region: 'South America',
  summary:
    'Thin air and endless salt: sunrise from above the clouds, flamingos in still lagoons, and skies so full of stars it is hard to go to bed.',
  facts: { difficulty: 5, comfort: 3 },
  highlights: [
    {
      title: 'A 6,000-metre summit',
      text: 'Huayna Potosí is climbed through the night on crampons, roped to a guide, to stand on top as the sun comes up over a sea of clouds.',
    },
    {
      title: 'Riding the Death Road',
      text: 'A full day downhill on a mountain bike, from a cold pass in the clouds to warm, green jungle, along a road cut into the cliff.',
    },
    {
      title: 'Salt, lagoons and stars',
      text: 'Three days across the Salar de Uyuni and the far south-west: cactus islands, red and green lagoons full of flamingos, geysers at dawn and a night sky worth the cold.',
    },
    {
      title: 'Cities with a story',
      text: "Ride La Paz's cable cars over a city poured into a canyon, go down into the silver mines of Potosí, then slow down in whitewashed Sucre and green Samaipata.",
    },
  ],
  stops: [
    { name: 'Death Road', country: 'Bolivia', photos: [photos.deathRoad] },
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
    { name: 'Isla Incahuasi', country: 'Bolivia', photos: [photos.islaIncahuasi] },
    { name: 'Laguna Hedionda', country: 'Bolivia', photos: [photos.lagunaHedionda, photos.flamingos] },
    {
      name: 'Eduardo Avaroa Reserve',
      country: 'Bolivia',
      photos: [photos.arbolDePiedra, photos.solDeManana, photos.milkyWay],
    },
  ],
  cover: { photo: photos.summitNight },
  featured: true,
  practical: [],
  meta: {
    title: 'The altiplano and the cities · Trips · Hélder Gonçalves',
    description:
      'Bolivia, stop by stop: the Death Road, a night climb of Huayna Potosí, the Salar de Uyuni, and the flamingo lagoons and geysers of the far south-west.',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
    imageAlt: 'Standing on the snowy summit of Huayna Potosí at night, the lights of La Paz far below',
  },
};
