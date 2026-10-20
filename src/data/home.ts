import type { HeroJump } from '../types';
import type { IconName } from '../components/Icon';
import { photos, type Photo } from './photos';
import { tripCountries, trips } from './trips';

export interface PhotoTheme {
  id: string;
  title: string;
  icon: IconName;
  /** One quiet line under the section title. */
  intro?: string;
  photos: Photo[];
  /** A link under the photos, to the page that has the rest. */
  more?: { href: string; label: string };
}

export interface Wonder {
  name: string;
  place: string;
  seen: boolean;
}

/** A list to see all of — a personal goal, shown with its progress. */
export interface WonderGoal {
  id: string;
  title: string;
  /** The photo theme it follows, so photo and text sections alternate. */
  after: string;
  icon: IconName;
  /** Completes "The goal: all seven of …". */
  collection: string;
  wonders: Wonder[];
}

export interface HomeDoor {
  eyebrow: string;
  title: string;
  line: string;
  href: string;
  cta: string;
}

export interface HomePageData {
  /** The page's heading. The name, portrait and work are the CV's alone. */
  title: string;
  /** A word of the title set in the sunrise colours. */
  highlight: string;
  /** One or two sentences under the title. */
  thesis: string;
  jumps: HeroJump[];
  goals: WonderGoal[];
  /**
   * One section per hobby, a few photos each. The page stays an overview;
   * travel's depth belongs on /trips/ and the trip pages.
   */
  themes: PhotoTheme[];
  /** The rest of the site, after the photos. */
  doors: HomeDoor[];
  meta: {
    title: string;
    description: string;
    /**
     * The social card (`public/og/home.jpg`, made by `npm run cards`): this
     * photo full-bleed, cropped to 1200x630 at `focus`, under the title. Not a
     * trip's cover, so no two cards match.
     */
    card: { photo: Photo; focus?: string };
  };
}

const countryCount = new Set(trips.flatMap(tripCountries)).size;

const goals: WonderGoal[] = [
  {
    id: 'wonders',
    title: 'Wonders of the World',
    after: 'travel',
    icon: 'star',
    collection: 'the New Seven Wonders',
    wonders: [
      { name: 'Machu Picchu', place: 'Peru', seen: true },
      { name: 'Chichén Itzá', place: 'Mexico', seen: true },
      { name: 'Christ the Redeemer', place: 'Brazil', seen: true },
      { name: 'Colosseum', place: 'Italy', seen: true },
      { name: 'Petra', place: 'Jordan', seen: false },
      { name: 'Taj Mahal', place: 'India', seen: false },
      { name: 'Great Wall', place: 'China', seen: false },
    ],
  },
  {
    // The classic list, not New7Wonders of Nature (2011) — Rio's harbour is only on this one.
    id: 'natural-wonders',
    title: 'Natural Wonders',
    after: 'ride',
    icon: 'mountain',
    collection: 'the Seven Natural Wonders',
    wonders: [
      { name: 'Harbour of Rio de Janeiro', place: 'Brazil', seen: true },
      { name: 'Grand Canyon', place: 'United States', seen: false },
      { name: 'Great Barrier Reef', place: 'Australia', seen: false },
      { name: 'Mount Everest', place: 'Nepal · China', seen: false },
      { name: 'Aurora', place: 'Polar skies', seen: false },
      { name: 'Parícutin', place: 'Mexico', seen: false },
      { name: 'Victoria Falls', place: 'Zambia · Zimbabwe', seen: false },
    ],
  },
];

export const home: HomePageData = {
  title: 'Engineer by trade, explorer by habit',
  highlight: 'explorer',
  thesis:
    'Give me a free day and I’ll spend it outside: on a ridge before sunrise, beside a volcano after dark, on fresh snow or a winding road — usually with a camera.',
  jumps: [
    { href: '#travel', label: 'Travel', icon: 'globe' },
    { href: '#wonders', label: 'Wonders', icon: 'star' },
    { href: '#ride', label: 'Ride', icon: 'motorbike' },
    { href: '#through-the-lens', label: 'Through the lens', icon: 'camera' },
  ],
  goals,
  themes: [
    {
      id: 'travel',
      title: 'Travel',
      icon: 'globe',
      intro: 'Walking the world, one country at a time. A few favourites so far.',
      // Two rows at three columns and at two: wide first, then night beside night.
      photos: [
        photos.summitNight,
        photos.volcano,
        photos.machuPicchu,
        photos.saltFlatJump,
        photos.glacier,
      ],
      more: { href: '/trips/', label: 'All trips' },
    },
    {
      id: 'ride',
      title: 'Ride',
      icon: 'motorbike',
      photos: [photos.motorcycle, photos.snowboard, photos.paragliding],
    },
    {
      id: 'through-the-lens',
      title: 'Through the lens',
      icon: 'camera',
      intro: 'Where the place is the whole picture.',
      photos: [photos.fuegoAsh, photos.saltTables, photos.saltSunset],
    },
  ],
  doors: [
    {
      eyebrow: 'Travel',
      title: 'Trips',
      line: `Where the landscape sets the pace: ${trips.length} trips across ${countryCount} countries.`,
      href: '/trips/',
      cta: 'See the trips',
    },
    {
      eyebrow: 'Side project',
      title: 'Home lab',
      line: 'A private cloud for the family, with no inbound ports and zero-trust access.',
      href: '/homelab/',
      cta: "See how it's built",
    },
  ],
  meta: {
    title: 'Hélder Gonçalves — engineer by trade, explorer by habit',
    description:
      'Where my free days go: travel, motorbikes, snowboarding, paragliding and photography, and a slow quest to see every wonder of the world — plus trip pages and a home lab.',
    card: { photo: photos.aboveTheClouds, focus: '50% 35%' },
  },
};

/** Every photo on the page, in page order — the viewer walks them top to bottom. */
export const allPhotos = home.themes.flatMap((theme) => theme.photos);
