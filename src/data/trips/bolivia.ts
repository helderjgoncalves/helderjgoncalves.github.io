import { photos } from '../photos';
import type { Trip } from './types';

export const bolivia: Trip = {
  slug: 'bolivia',
  title: 'The altiplano and the cities',
  place: 'Bolivia',
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
      text: 'Downhill on a mountain bike, from a cold pass in the clouds to warm, green jungle, along a road cut into the cliff.',
    },
    {
      title: 'Salt, lagoons and stars',
      text: 'The Salar de Uyuni and the far south-west: cactus islands, red and green lagoons full of flamingos, geysers at dawn and a night sky worth the cold.',
    },
    {
      title: 'Cities with a story',
      text: "Ride La Paz's cable cars over a city poured into a canyon, go down into the silver mines of Potosí, then slow down in whitewashed Sucre and green Samaipata.",
    },
  ],
  stops: [
    {
      name: 'Death Road',
      country: 'Bolivia',
      note: 'The one road in Bolivia where traffic keeps to the left. It puts the driver on the cliff side, close enough to watch the outer wheel against a drop of hundreds of metres.',
      photos: [photos.deathRoad],
    },
    {
      name: 'Huayna Potosí',
      country: 'Bolivia',
      icon: 'mountain',
      photos: [photos.summitNight, photos.aboveTheClouds],
    },
    {
      name: 'Salar de Uyuni',
      country: 'Bolivia',
      note: 'Flat enough that NASA used it to check a satellite built to measure polar ice to the centimetre. Across the 2,000 km² that were surveyed, the salt rises and falls by less than 80 cm.',
      photos: [photos.saltFlatJump, photos.saltTables, photos.saltSunset],
    },
    { name: 'Isla Incahuasi', country: 'Bolivia', photos: [photos.islaIncahuasi] },
    {
      name: 'Laguna Hedionda',
      country: 'Bolivia',
      note: "Hedionda means stinking, for the sulphur in the springs that feed it. The flamingos don't seem to mind: three of the world's six species feed here.",
      photos: [photos.lagunaHedionda, photos.flamingos],
    },
    {
      name: 'Eduardo Avaroa Reserve',
      country: 'Bolivia',
      photos: [photos.arbolDePiedra, photos.solDeManana, photos.milkyWay],
    },
  ],
  cover: { photo: photos.summitNight, focus: '50% 25%' },
  featured: true,
  practical: [],
  meta: {
    title: 'Bolivia, the altiplano and the cities · Hélder Gonçalves',
    description:
      'Bolivia, stop by stop: the Death Road, a night climb of Huayna Potosí, the Salar de Uyuni, and the flamingo lagoons and geysers of the far south-west.',  },
};
