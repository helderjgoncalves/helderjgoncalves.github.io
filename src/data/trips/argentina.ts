import { photos } from '../photos';
import type { Trip } from './types';

// Iguazú is still a placeholder until its real photos arrive.
export const argentina: Trip = {
  slug: 'argentina',
  title: 'Buenos Aires and Iguazú',
  region: 'South America',
  summary:
    'Nights that start late and end in tango, Sundays among the stalls of old San Telmo, then hundreds of waterfalls thundering into the jungle.',
  facts: { difficulty: 1, comfort: 4 },
  highlights: [
    {
      title: 'Tango',
      text: 'Catch it danced on the cobbles of San Telmo, then find a milonga where locals dance into the early hours. Even one lesson changes how you watch it.',
    },
    {
      title: 'San Telmo on a Sunday',
      text: 'The old quarter fills with antique stalls, street musicians and dancers, and the market hall is made for a long, slow lunch.',
    },
    {
      title: 'A city that eats late',
      text: "Painted houses in La Boca, grand avenues and old cafés downtown, and dinner that rarely starts before ten: steak off the grill and a glass of Malbec.",
    },
    {
      title: 'Iguazú Falls',
      text: "Hundreds of falls on the border with Brazil. Walkways lead right to the edge of the Devil's Throat, where the spray soaks you in seconds.",
    },
  ],
  stops: [
    {
      name: 'Buenos Aires',
      country: 'Argentina',
      photos: [photos.sanTelmoMarket, photos.sanTelmo, photos.torreMonumental],
    },
    { name: 'Iguazú Falls', country: 'Argentina', photos: [photos.sampleArgentina] },
  ],
  cover: { photo: photos.torreMonumental, focus: '50% 30%' },
  practical: [],
  meta: {
    title: 'Buenos Aires and Iguazú · Trips · Hélder Gonçalves',
    description: 'Buenos Aires and the Iguazú Falls: tango, San Telmo on a Sunday and hundreds of waterfalls in the jungle.',  },
};
