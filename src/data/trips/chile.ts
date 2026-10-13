import { photos } from '../photos';
import type { Trip } from './types';

// Sample: photos are placeholders until the real ones arrive.
export const chile: Trip = {
  slug: 'chile',
  title: 'Santiago & the coast',
  region: 'South America',
  summary:
    'A capital ringed by snowy Andes, then down to the Pacific: steep hills of painted houses, rattling funiculars and murals on every wall.',
  facts: { difficulty: 1, comfort: 4 },
  highlights: [
    {
      title: 'Santiago and wine',
      text: 'Ride up Cerro San Cristóbal for the whole city laid out against snow-capped peaks, then eat your way around the Mercado Central. Vineyards fill the Maipo valley just outside the city, still under those same peaks.',
    },
    {
      title: "Valparaíso's hills",
      text: 'A port that climbs straight up from the sea, its houses painted every colour and its walls covered in murals. Old funiculars save your legs.',
    },
    {
      title: 'Viña del Mar',
      text: 'Right next door and a world apart: beaches, gardens and a long seafront promenade for slow afternoons.',
    },
    {
      title: 'The Atacama',
      text: "The high desert shares Bolivia's far south-west: the same salt and lagoons, and less of them. El Tatio and Valle de la Luna are its own places.",
    },
  ],
  stops: [
    { name: 'Santiago', country: 'Chile', photos: [] },
    { name: 'Valparaíso', country: 'Chile', photos: [photos.sampleChile] },
    { name: 'Viña del Mar', country: 'Chile', photos: [] },
  ],
  cover: { photo: photos.sampleChile },
  practical: [],
  meta: {
    title: 'Santiago & the coast · Trips · Hélder Gonçalves',
    description: 'Santiago and the Chilean coast: the city under the Andes, the painted hills of Valparaíso and the beaches of Viña del Mar.',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
    imageAlt: 'Standing on the snowy summit of Huayna Potosí at night, the lights of La Paz far below',
  },
};
