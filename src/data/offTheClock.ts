import type { IconName } from '../components/Icon';

export interface Photo {
  src: string;
  alt: string;
  caption: string;
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
  countryCount: number;
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
  thesis:
    'Travel, mountains and two wheels — happiest somewhere high, cold or a long way from a desk.',
  countryCount: 26,
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
      id: 'mountains',
      title: 'Mountains',
      icon: 'mountain',
      photos: [
        {
          src: '/photos/summit-night.jpg',
          alt: 'Standing on a snowy summit at night in crampons and a helmet, city lights far below',
          caption: 'Summit, before dawn',
          width: 800,
          height: 600,
          wide: true,
          focus: '70% 50%',
        },
        {
          src: '/photos/above-the-clouds.jpg',
          alt: 'Sunrise over a sea of clouds, seen from a snow ridge',
          caption: 'Above the clouds',
          width: 600,
          height: 800,
        },
        {
          src: '/photos/volcano.jpg',
          alt: 'A volcano erupting at night, lava running down its flanks under the stars',
          caption: 'A volcano, awake',
          width: 600,
          height: 800,
        },
        {
          src: '/photos/glacier.jpg',
          alt: 'The blue-white front of a glacier meeting a grey-green lake',
          caption: 'Glacier front',
          width: 600,
          height: 800,
        },
      ],
    },
    {
      id: 'travel',
      title: 'Travel',
      icon: 'globe',
      photos: [
        {
          src: '/photos/salt-flat-jump.jpg',
          alt: 'Jumping mid-air on a mirrored salt flat at sunset, reflection below',
          caption: 'Salt flat, sunset',
          width: 600,
          height: 800,
        },
        {
          src: '/photos/machu-picchu.jpg',
          alt: 'Arms wide in front of Machu Picchu and the green peaks behind it',
          caption: 'Machu Picchu',
          width: 600,
          height: 800,
        },
        {
          src: '/photos/lake-sunset.jpg',
          alt: 'Silhouette watching the sun set over a wide lake',
          caption: 'Sunset over the lake',
          width: 600,
          height: 800,
          focus: '50% 40%',
        },
      ],
    },
    {
      id: 'two-wheels',
      title: 'Two wheels',
      icon: 'motorbike',
      photos: [
        {
          src: '/photos/motorcycle.jpg',
          alt: 'Sitting on a dark red motorcycle on a forest road',
          caption: 'Forest roads',
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
      'Travel, mountains and two wheels: 26 countries, summits before sunrise, glaciers, salt flats and a volcano at night — the off-the-clock side of a software engineer.',
    canonical: 'https://hgoncalves.uk/off-the-clock/',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
  },
};

export const allPhotos = offTheClock.themes.flatMap((theme) => theme.photos);

export const wondersSeen = offTheClock.wonders.filter((wonder) => wonder.seen).length;
