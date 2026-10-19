import type { IconName } from '../components/Icon';
import { photos, type Photo } from './photos';

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

export interface OffTheClockPageData {
  title: string;
  thesis: string;
  /** A short paragraph under the thesis. */
  intro: string;
  goals: WonderGoal[];
  /**
   * One section per hobby, a few photos each. The page stays an overview;
   * travel's depth belongs on /trips/ and the trip pages.
   */
  themes: PhotoTheme[];
  /** The front-page preview, in order. */
  glance: Photo[];
  meta: {
    title: string;
    description: string;
    canonical: string;
    /**
     * The social card (`public/og/off-the-clock.jpg`, made by `npm run cards`):
     * this photo full-bleed, cropped to 1200x630 at `focus`, under the title
     * and the thesis. Not a trip's cover.
     */
    card: { photo: Photo; focus?: string };
  };
}

export const offTheClock: OffTheClockPageData = {
  title: 'Off the clock',
  thesis: 'What fills the hours once the laptop is closed.',
  intro:
    'Some of them go far: long trails, big skies, a summit before dawn. Some go fast, on two wheels, on fresh snow or hanging under a paraglider. And some stay close to home, with a guitar in the evening or a night out dancing. A camera comes along for most of it, and underneath runs a slow quest to see every wonder of the world.',
  goals: [
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
  ],
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
  glance: [photos.saltFlatJump, photos.volcano, photos.aboveTheClouds, photos.machuPicchu],
  meta: {
    title: 'Off the clock · Hélder Gonçalves',
    description:
      'What I do away from the laptop: travel, motorbikes, snowboarding, paragliding and photography — and a slow quest to see every wonder of the world, built and natural.',
    canonical: 'https://hgoncalves.uk/off-the-clock/',
    card: { photo: photos.motorcycle, focus: '50% 12%' },
  },
};

/** Every photo on the page, in page order — the viewer walks them top to bottom. */
export const allPhotos = offTheClock.themes.flatMap((theme) => theme.photos);