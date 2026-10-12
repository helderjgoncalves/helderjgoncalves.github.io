import type { IconName } from '../components/Icon';

export interface Photo {
  src: string;
  alt: string;
  caption: string;
  /** Where it was, shown under the caption. */
  place?: string;
  width: number;
  height: number;
  /** Landscape shots span two grid columns on the full page. */
  wide?: boolean;
  /** CSS object-position, for subjects that sit off-centre in the crop. */
  focus?: string;
}

export interface PhotoTheme {
  id: string;
  title: string;
  icon: IconName;
  /** One quiet line under the section title. */
  intro?: string;
  photos: Photo[];
}

export interface Wonder {
  name: string;
  place: string;
  seen: boolean;
}

export interface OffTheClockPageData {
  title: string;
  thesis: string;
  /** The New Seven Wonders of the World — the collection goal. */
  wonders: Wonder[];
  /** Country names, shown as tags once filled in. Hidden while empty. */
  countries: string[];
  themes: PhotoTheme[];
  /** `src`s of the photos previewed on the front page, in order. */
  glance: string[];
  meta: {
    title: string;
    description: string;
    canonical: string;
    /** Absolute URL of the 1200x630 social card for this page. */
    image: string;
  };
}

export const offTheClock: OffTheClockPageData = {
  title: 'Off the clock',
  thesis: 'Travel, adventures and the odd ride — the places I go when I close the laptop.',
  wonders: [
    { name: 'Machu Picchu', place: 'Peru', seen: true },
    { name: 'Chichén Itzá', place: 'Mexico', seen: true },
    { name: 'Christ the Redeemer', place: 'Brazil', seen: true },
    { name: 'Colosseum', place: 'Italy', seen: true },
    { name: 'Petra', place: 'Jordan', seen: false },
    { name: 'Taj Mahal', place: 'India', seen: false },
    { name: 'Great Wall', place: 'China', seen: false },
  ],
  countries: [],
  themes: [
    {
      id: 'adventures',
      title: 'Adventures',
      icon: 'mountain',
      photos: [
        {
          src: '/photos/summit-night.jpg',
          alt: 'On the snowy summit of Huayna Potosí at night in crampons and a helmet, the lights of La Paz far below',
          caption: 'Huayna Potosí',
          place: 'Bolivia · the 6,088\u00a0m summit, before dawn',
          width: 800,
          height: 600,
          wide: true,
          focus: '70% 50%',
        },
        {
          src: '/photos/above-the-clouds.jpg',
          alt: 'Sunrise over a sea of clouds from the snow ridge of Huayna Potosí',
          caption: 'Huayna Potosí',
          place: 'Bolivia · sunrise above the clouds',
          width: 600,
          height: 800,
        },
        {
          src: '/photos/volcano.jpg',
          alt: 'Volcán de Fuego erupting at night, lava running down its flanks under the stars',
          caption: 'Volcán de Fuego',
          place: 'Guatemala · seen from 4,000\u00a0m',
          width: 600,
          height: 800,
        },
        {
          src: '/photos/glacier.jpg',
          alt: 'The blue-white front of the Perito Moreno Glacier meeting a grey-green lake',
          caption: 'Perito Moreno Glacier',
          place: 'Argentina · Patagonia',
          width: 600,
          height: 800,
        },
      ],
    },
    {
      id: 'travel',
      title: 'Travel',
      icon: 'globe',
      intro: 'Walking the world, one country at a time. A few favourites so far.',
      photos: [
        {
          src: '/photos/salt-flat-jump.jpg',
          alt: 'Jumping mid-air on the mirrored Salar de Uyuni at sunset, reflection below',
          caption: 'Salar de Uyuni',
          place: 'Bolivia · the world’s largest salt flat',
          width: 600,
          height: 800,
        },
        {
          src: '/photos/machu-picchu.jpg',
          alt: 'Arms wide in front of Machu Picchu and the green peaks behind it',
          caption: 'Machu Picchu',
          place: 'Peru · a New Seven Wonder',
          width: 600,
          height: 800,
        },
        {
          src: '/photos/lake-sunset.jpg',
          alt: 'Silhouette watching the sun set over Lake Titicaca from Amantaní Island',
          caption: 'Amantaní Island',
          place: 'Peru · sunset over Lake Titicaca',
          width: 600,
          height: 800,
          focus: '50% 40%',
        },
      ],
    },
    {
      id: 'ride',
      title: 'Ride',
      icon: 'motorbike',
      photos: [
        {
          src: '/photos/motorcycle.jpg',
          alt: 'Sitting on a dark red motorcycle on a forest road',
          caption: 'Forest roads',
          width: 600,
          height: 800,
        },
        {
          src: '/photos/snowboard.jpg',
          alt: 'Smiling in sunglasses, holding a red snowboard upright on a sunny snow slope',
          caption: 'Snowboarding',
          width: 599,
          height: 800,
        },
      ],
    },
    {
      id: 'through-the-lens',
      title: 'Through the lens',
      icon: 'camera',
      intro: 'Where the place is the whole picture.',
      photos: [
        {
          src: '/photos/fuego-ash.jpg',
          alt: 'A tall ash cloud rising from Volcán de Fuego above a sea of clouds, a line of people silhouetted on the ridge in front',
          caption: 'Volcán de Fuego',
          place: 'Guatemala · an ash cloud at dawn',
          width: 600,
          height: 800,
        },
        {
          src: '/photos/salt-tables.jpg',
          alt: 'Tables built from salt bricks on the white Salar de Uyuni, distant mountains under a wide blue sky',
          caption: 'Salar de Uyuni',
          place: 'Bolivia · salt-brick tables',
          width: 600,
          height: 800,
        },
        {
          src: '/photos/salt-sunset.jpg',
          alt: 'Golden sunset mirrored in a thin layer of water on the Salar de Uyuni, low hills on the horizon',
          caption: 'Salar de Uyuni',
          place: 'Bolivia · sunset on the mirror',
          width: 600,
          height: 800,
        },
      ],
    },
  ],
  glance: [
    '/photos/salt-flat-jump.jpg',
    '/photos/volcano.jpg',
    '/photos/above-the-clouds.jpg',
    '/photos/machu-picchu.jpg',
  ],
  meta: {
    title: 'Off the clock · Hélder Gonçalves',
    description:
      'Photos from travel and adventures: Huayna Potosí in Bolivia, Volcán de Fuego in Guatemala, and a slow quest to see all seven wonders of the world.',
    canonical: 'https://hgoncalves.uk/off-the-clock/',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
  },
};

export const allPhotos = offTheClock.themes.flatMap((theme) => theme.photos);

export const wondersSeen = offTheClock.wonders.filter((wonder) => wonder.seen).length;
