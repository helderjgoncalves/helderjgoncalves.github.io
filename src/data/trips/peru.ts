import { photos } from '../photos';
import type { Trip } from './types';

export const peru: Trip = {
  slug: 'peru',
  title: 'The Andes, the desert and the lake',
  place: 'Peru',
  region: 'South America',
  summary:
    'Stone the Incas cut to fit without a gap, mountains painted in stripes, and a slow sunset over a lake on the roof of the Andes.',
  facts: { difficulty: 3, comfort: 3 },
  highlights: [
    {
      title: 'Inca stone up close',
      text: 'In Ollantaytambo, at Sacsayhuamán and across Machu Picchu, huge blocks sit so tightly together that nothing slips between them. No photo prepares you for it.',
    },
    {
      title: 'Walking the high Andes',
      text: "Rainbow Mountain's striped ridges sit above 5,000 metres, and the trail past the Seven Lakes keeps snow-capped Ausangate in view all day. Alpacas included.",
    },
    {
      title: 'Arequipa and the Colca Canyon',
      text: 'A city built from pale volcanic stone, then a canyon so deep that Andean condors glide below you on the morning air.',
    },
    {
      title: 'From desert to lake',
      text: 'Fly over the Nazca Lines, then cross to Lake Titicaca for the reed islands of the Uros and a quiet night on Amantaní.',
    },
  ],
  stops: [
    { name: 'Ollantaytambo', country: 'Peru', photos: [photos.ollantaytambo] },
    { name: 'Machu Picchu', country: 'Peru', icon: 'star', photos: [photos.machuPicchu] },
    { name: 'Cusco', country: 'Peru', photos: [photos.sacsayhuaman] },
    {
      name: 'Rainbow Mountain',
      country: 'Peru',
      icon: 'mountain',
      photos: [photos.rainbowMountain, photos.alpacas],
    },
    { name: 'Lake Titicaca', country: 'Peru', photos: [photos.lakeSunset] },
  ],
  cover: { photo: photos.machuPicchu, focus: '50% 45%' },
  practical: [],
  meta: {
    title: 'Peru, the Andes, the desert and the lake · Trips · Hélder Gonçalves',
    description:
      'Peru, stop by stop: Ollantaytambo, Machu Picchu, Cusco, Rainbow Mountain and Amantaní Island on Lake Titicaca.',  },
};
