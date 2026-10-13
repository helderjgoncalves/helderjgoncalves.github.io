import { photos } from '../photos';
import type { Trip } from './types';

export const patagonia: Trip = {
  slug: 'patagonia',
  title: 'Patagonia',
  region: 'South America',
  summary:
    'Wind that pushes you sideways, ice crashing into the lake and granite at the end of long days on foot. You come home feeling small, in the best way.',
  facts: { difficulty: 4, comfort: 3 },
  highlights: [
    {
      title: 'Ice that thunders',
      text: 'Stand in front of the Perito Moreno Glacier and wait: sooner or later a slab of ice breaks away and hits the lake with a roar.',
    },
    {
      title: 'Granite at the end of the trail',
      text: 'Long day hikes from El Chaltén to the foot of Fitz Roy, and in Torres del Paine up to the three towers. The last climb is steep; the view pays it back.',
    },
    {
      title: 'The empty south',
      text: 'Hours of open steppe, with guanacos and rheas for company, out to the old volcanic craters of Pali Aike.',
    },
    {
      title: 'Magellan and the penguins',
      text: 'Cross the Strait of Magellan to Tierra del Fuego, where a colony of king penguins stands around on the shore.',
    },
  ],
  stops: [
    {
      name: 'Perito Moreno Glacier',
      country: 'Argentina',
      photos: [photos.peritoMorenoLake, photos.glacier, photos.peritoMorenoIcebergs],
    },
    {
      name: 'Mirador de los Cóndores y las Águilas',
      country: 'Argentina',
      area: 'El Chaltén',
      icon: 'mountain',
      photos: [photos.miradorDeLosCondores, photos.miradorDeLasAguilas, photos.lagoViedma],
    },
    {
      name: 'Río Eléctrico',
      country: 'Argentina',
      area: 'El Chaltén',
      icon: 'mountain',
      photos: [photos.rioElectricoValley, photos.rioElectricoBridge, photos.rioElectrico],
    },
    {
      name: 'Laguna de los Tres',
      country: 'Argentina',
      area: 'El Chaltén',
      icon: 'mountain',
      photos: [photos.rioDeLasVueltas, photos.fitzRoy, photos.lagunaDeLosTres, photos.losTresBoardwalk],
    },
    {
      name: 'Loma del Pliegue Tumbado',
      country: 'Argentina',
      area: 'El Chaltén',
      icon: 'mountain',
      photos: [photos.lomaDelPliegueTumbado, photos.falcon, photos.pliegueTumbadoSummit],
    },
    {
      name: 'Laguna Torre',
      country: 'Argentina',
      area: 'El Chaltén',
      icon: 'mountain',
      photos: [photos.lagunaTorre],
    },
    {
      name: 'Torres del Paine',
      country: 'Chile',
      icon: 'mountain',
      photos: [photos.torresDelPaine, photos.lasTorres, photos.cuernosDelPaine],
    },
    { name: 'Lago Pehoé', country: 'Chile', photos: [photos.paineMassif, photos.lagoPehoe] },
    { name: 'Lago Grey', country: 'Chile', photos: [photos.lagoGrey, photos.lagoGreyClip, photos.chileanFlag] },
  ],
  cover: { photo: photos.cuernosDelPaine },
  featured: true,
  practical: [],
  meta: {
    title: 'Patagonia · Trips · Hélder Gonçalves',
    description:
      'Patagonia in Argentina and Chile: the Perito Moreno Glacier, El Chaltén and the granite towers of Torres del Paine, stop by stop.',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
    imageAlt: 'Standing on the snowy summit of Huayna Potosí at night, the lights of La Paz far below',
  },
};
