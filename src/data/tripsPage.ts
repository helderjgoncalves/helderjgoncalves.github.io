import { sampleTrips, tripCountries, trips, type Trip } from './trips';

export interface TripsPageData {
  title: string;
  /** How I travel, in a line. */
  thesis: string;
  /** A short paragraph under the thesis. */
  intro: string;
  /** While trips still use sample photos: a hero badge, and a note on those trips. */
  wip: { badge: string; samples: string };
  /** Labels for a trip's facts on its page, each scored out of 5. */
  facts: { difficulty: string; comfort: string };
  /** A quiet offer of free tips, closing /trips/ and every trip page. */
  help: {
    /** The heading on /trips/; trip pages ask "Heading to <trip>?". */
    title: string;
    text: string;
    cta: string;
  };
  meta: {
    title: string;
    description: string;
    canonical: string;
    /** Absolute URL of the 1200x630 social card for this page. */
    image: string;
    imageAlt: string;
  };
}

/** Every country the trips cover, in trip order: 'Guatemala, Peru, … and Chile'. */
const countryList = (() => {
  const names = [...new Set(trips.flatMap(tripCountries))];
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names.join('');
})();

export const tripsPage: TripsPageData = {
  title: 'Trips',
  thesis: 'Where the landscape sets the pace — and, now and then, the heart rate.',
  intro:
    'Waking up above the clouds, trails that run for hours, the light shifting over a salt flat at sunset. Then the rush: a summit before dawn, a night beside an erupting volcano, a bike ride down the Death Road. The kind of trip you come home from rested and buzzing at the same time.',
  wip: { badge: 'Work in progress', samples: 'Photos soon' },
  facts: { difficulty: 'Difficulty', comfort: 'Comfort' },
  help: {
    title: 'Planning something similar?',
    text: "Happy to share what I learned: the route, how long to stay, what I'd skip. Just drop me a line.",
    cta: 'Email me',
  },
  meta: {
    title: 'Trips · Hélder Gonçalves',
    description: `Trips where the landscape sets the pace, and now and then the heart rate — through ${countryList}.`,
    canonical: 'https://hgoncalves.uk/trips/',
    image: 'https://hgoncalves.uk/og-off-the-clock.jpg',
    imageAlt: 'Standing on the snowy summit of Huayna Potosí at night, the lights of La Paz far below',
  },
};

/** A trip's eyebrow: its countries, plus "Photos soon" while it uses sample photos. */
export const tripEyebrow = (trip: Trip) =>
  [...tripCountries(trip), ...(sampleTrips.includes(trip) ? [tripsPage.wip.samples] : [])].join(' · ');
