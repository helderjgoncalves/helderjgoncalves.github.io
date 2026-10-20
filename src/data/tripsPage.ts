import { photos, type Photo } from './photos';
import { sampleTrips, tripCountries, trips, type Trip } from './trips';

export interface TripsPageData {
  title: string;
  /** How I travel, in a line. */
  thesis: string;
  /** A short paragraph under the thesis. */
  intro: string;
  /** While trips still use sample photos: a line under the intro, and a note on those trips. */
  wip: { note: string; samples: string };
  /** Labels for a trip's facts on its page, each scored out of 5. */
  facts: { difficulty: string; comfort: string };
  /** The label over a stop's curiosity (its `note`), set among the photos. */
  curiosity: string;
  /** A quiet offer of free tips, closing /trips/ and every trip page. */
  help: {
    /** The heading on /trips/; trip pages ask "Heading to <trip>?". */
    title: string;
    /** Where trip questions go: its own address, not the CV's. */
    email: string;
    text: string;
    cta: string;
    /**
     * One line under the route on a trip page, so the offer is still there
     * once the photos run long. The closing block below stays as it is.
     */
    prompt: string;
    promptLink: string;
    /**
     * The form `cta` opens in place (a mailto: does nothing on a computer
     * without a mail app). It posts to `scripts/contact-worker.js`.
     */
    form: {
      endpoint: string;
      /** The Turnstile widget's site key (public; its secret lives in the Worker). */
      siteKey: string;
      email: string;
      name: string;
      optional: string;
      trip: string;
      tripPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      send: string;
      /** Closes the form under the route, at the end of the line that heads it. */
      close: string;
      sending: string;
      /** Beside Send, before the address as a mailto: link. */
      direct: string;
      /** Before the trip's place, atop the form on a trip page. */
      about: string;
      sent: { title: string; text: string };
      /** On the label line of a field that needs fixing, so the form never shifts. */
      checks: { email: string; emailFormat: string; message: string; links: string };
      /** Keyed by the Worker's error codes; `failed` covers the rest. */
      errors: { invalid: string; bot: string; rate: string; failed: string };
    };
  };
  meta: {
    title: string;
    description: string;
    canonical: string;
    /**
     * The social card (`public/og/trips.jpg`, made by `npm run cards`): this
     * photo full-bleed, cropped to 1200x630 at `focus`, under the title and
     * `line`. Not a trip's cover, so no two cards match.
     */
    card: { photo: Photo; focus?: string; line: string };
  };
}

const countries = [...new Set(trips.flatMap(tripCountries))];

/** Every country the trips cover, in trip order: 'Guatemala, Peru, … and Chile'. */
const countryList =
  countries.length > 1 ? `${countries.slice(0, -1).join(', ')} and ${countries.at(-1)}` : countries.join('');

export const tripsPage: TripsPageData = {
  title: 'Trips',
  thesis: 'Where the landscape sets the pace — and, now and then, the heart rate.',
  intro:
    'Waking up above the clouds, trails that run for hours, the light shifting over a salt flat at sunset. Then the rush: a summit before dawn, a night beside an erupting volcano, a bike ride down the Death Road. The kind of trip you come home from rested and buzzing at the same time.',
  wip: { note: 'A few trips are still waiting for their photos.', samples: 'Photos soon' },
  facts: { difficulty: 'Difficulty', comfort: 'Comfort' },
  curiosity: 'Curiosity',
  help: {
    title: 'Planning something similar?',
    email: 'travel@hgoncalves.uk',
    text: "Happy to share what I learned: the route, how long to stay, what I'd skip. Just drop me a line.",
    cta: 'Email me',
    prompt: "Happy to share how long to stay, and what I'd skip —",
    promptLink: 'just ask',
    form: {
      endpoint: 'https://contact.hgoncalves.uk/',
      siteKey: '0x4AAAAAAFePNcKEhOqNaS_O',
      email: 'Your email',
      name: 'Your name',
      optional: 'optional',
      about: 'About',
      trip: 'Where to?',
      tripPlaceholder: 'Peru, Patagonia…',
      message: 'What would you like to know?',
      messagePlaceholder: "How long you have, what you're into, what you're unsure about…",
      send: 'Send',
      close: 'Close',
      sending: 'Sending…',
      direct: 'Or write to',
      sent: { title: 'Got it, thanks!', text: "I'll reply to your email soon." },
      checks: {
        email: 'Needed, so I can reply',
        emailFormat: "Doesn't look quite right",
        message: 'A few words more, please',
        links: 'Fewer links, please',
      },
      errors: {
        invalid: 'Something in the form needs another look.',
        bot: "Couldn't confirm you're not a bot. Please try once more.",
        rate: 'One moment! Give it a minute, then try again.',
        failed: "Couldn't send it just now. Try again in a moment, or write to the address below.",
      },
    },
  },
  meta: {
    title: 'Trips · Hélder Gonçalves',
    description: `Trips where the landscape sets the pace, and now and then the heart rate — through ${countryList}.`,
    canonical: 'https://hgoncalves.uk/trips/',
    card: { photo: photos.saltFlatJump, focus: '50% 38%', line: `${trips.length} trips across ${countries.length} countries` },
  },
};

/** A trip's eyebrow: its countries, plus "Photos soon" while it uses sample photos. */
export const tripEyebrow = (trip: Trip) =>
  [...tripCountries(trip), ...(sampleTrips.includes(trip) ? [tripsPage.wip.samples] : [])].join(' · ');
