export interface TravelPhoto {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  /** Landscape shots span two grid columns on the travel page. */
  wide?: boolean;
  /** CSS object-position, for subjects that sit off-centre in the crop. */
  focus?: string;
}

export interface TravelPageData {
  title: string;
  thesis: string;
  intro: string;
  countryCount: number;
  /** Country names, shown as a list once filled in. Hidden while empty. */
  countries: string[];
  photos: TravelPhoto[];
  /** `src`s of the photos previewed on the CV page, in order. */
  glance: string[];
  meta: {
    title: string;
    description: string;
    canonical: string;
    /** Absolute URL of the 1200x630 social card for this page. */
    image: string;
  };
}

export const travel: TravelPageData = {
  title: 'Travel',
  thesis: '26 countries so far, and happiest somewhere high, cold or a long way from a desk.',
  intro:
    'Summits before sunrise, glaciers, salt flats, a volcano erupting at night — and, closer to home, forest roads on two wheels.',
  countryCount: 26,
  countries: [],
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
      src: '/photos/salt-flat-jump.jpg',
      alt: 'Jumping mid-air on a mirrored salt flat at sunset, reflection below',
      caption: 'Salt flat, sunset',
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
      src: '/photos/above-the-clouds.jpg',
      alt: 'Sunrise over a sea of clouds, seen from a snow ridge',
      caption: 'Above the clouds',
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
      src: '/photos/glacier.jpg',
      alt: 'The blue-white front of a glacier meeting a grey-green lake',
      caption: 'Glacier front',
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
    {
      src: '/photos/motorcycle.jpg',
      alt: 'Sitting on a dark red motorcycle on a forest road',
      caption: 'Forest roads',
      width: 600,
      height: 800,
    },
  ],
  glance: [
    '/photos/salt-flat-jump.jpg',
    '/photos/volcano.jpg',
    '/photos/above-the-clouds.jpg',
    '/photos/machu-picchu.jpg',
  ],
  meta: {
    title: 'Travel · Hélder Gonçalves',
    description:
      'Twenty-six countries so far: summits before sunrise, glaciers, salt flats and a volcano erupting at night — the off-the-clock side of a software engineer.',
    canonical: 'https://hgoncalves.uk/travel/',
    image: 'https://hgoncalves.uk/og-travel.jpg',
  },
};
