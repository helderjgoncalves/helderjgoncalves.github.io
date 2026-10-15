import { photos } from '../photos';
import type { Trip } from './types';

export const patagonia: Trip = {
  slug: 'patagonia',
  title: 'From the glacier to the towers',
  place: 'Patagonia',
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
      note: 'Fitz Roy stands over the lagoon. The cloud the wind pins to its summit is why the Tehuelche called the mountain Chaltén, the smoking mountain, and the town below kept the name.',
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
      note: 'The dark caps on the Cuernos are older than the pale rock below them. Some 12.5 million years ago molten granite pushed in underneath and baked them dark; ice-age glaciers scraped the rest away and left only these scraps on top.',
      photos: [photos.torresDelPaine, photos.lasTorres, photos.cuernosDelPaine],
    },
    { name: 'Lago Pehoé', country: 'Chile', photos: [photos.paineMassif, photos.lagoPehoe] },
    {
      name: 'Lago Grey',
      country: 'Chile',
      note: 'These icebergs and the Perito Moreno Glacier break off the same ice field, the largest in the southern hemisphere outside Antarctica. It straddles the border, and from either side you only ever see its edge.',
      photos: [photos.lagoGrey, photos.lagoGreyClip, photos.chileanFlag],
    },
  ],
  cover: { photo: photos.cuernosDelPaine },
  featured: true,
  practical: [],
  meta: {
    title: 'Patagonia, from the glacier to the towers · Trips · Hélder Gonçalves',
    description:
      'Patagonia in Argentina and Chile: the Perito Moreno Glacier, El Chaltén and the granite towers of Torres del Paine, stop by stop.',  },
};
