import type { IconName } from '../../components/Icon';
import type { Photo } from '../photos';

export interface TripStop {
  name: string;
  country: string;
  /**
   * The town or park a trail or viewpoint belongs to, e.g. 'El Chaltén', so one
   * base with several day hikes can give each its own stop. Shown after the
   * country on the route; the cards on /trips/ show the area once instead.
   */
  area?: string;
  /** Section icon on the trip page. Defaults to the globe. */
  icon?: IconName;
  /**
   * A curiosity about the place, a sentence or two: what makes someone want
   * to go, never how to get there. Set among the stop's photos. Hidden while empty.
   */
  note?: string;
  /** A stop without photos still shows on the route, just without a section. */
  photos: Photo[];
}

/** One practical fact for someone planning the same trip, e.g. "Best season". */
export interface TripTip {
  label: string;
  text: string;
}

/** One reason to go, e.g. "Condors over Colca" and a sentence or two. */
export interface TripHighlight {
  title: string;
  text: string;
}

/** 1 is the least, 5 the most. */
export type Rating = 1 | 2 | 3 | 4 | 5;

/** At-a-glance facts for someone deciding whether the trip suits them. */
export interface TripFacts {
  difficulty: Rating;
  /** Never below 3: these are trips to enjoy, not endure. */
  comfort: Exclude<Rating, 1 | 2>;
}

/** The groups on /trips/, in page order. Add one here when a trip needs it. */
export const regions = ['Mexico & Central America', 'South America', 'Africa'] as const;
export type Region = (typeof regions)[number];

export interface Trip {
  /** URL segment: /trips/<slug>/. Keep it stable once published. */
  slug: string;
  title: string;
  /**
   * The name someone planning it would use, when the title is a description
   * ('Patagonia', 'Peru'). Fills "Heading to …?" and the viewer's trip link.
   * The eyebrow stays countries only. Defaults to the title.
   */
  place?: string;
  /** Which group the trip's card sits in on /trips/. */
  region: Region;
  /**
   * Two lines at most, shown under the title: what the trip feels like, not where it
   * goes — the route is listed right below it. No dates: trips are undated on purpose.
   */
  summary: string;
  /** Shown under the summary on the trip page. Hidden while absent. */
  facts?: TripFacts;
  /**
   * "Why go": what the trip has to offer, four reads best. May cover places
   * without photos. Written fresh, never borrowed. The section is hidden while absent.
   */
  highlights?: TripHighlight[];
  /** In the order travelled. */
  stops: TripStop[];
  /**
   * The trip's card on /trips/ (cropped to 3:2) and its page's full-bleed hero
   * (wide on desktop, tall on phones): one of its own photos. `focus` is the
   * object-position that keeps the subject in frame in both.
   */
  cover: { photo: Photo; focus?: string };
  /** Shown as a big card at the top of /trips/; the rest get compact cards. */
  featured?: boolean;
  /** Season, transport, operators, altitude… The section is hidden while empty. */
  practical: TripTip[];
  /** The social card is `public/og-trip-<slug>.jpg`, the cover beside the title (`npm run cards`). */
  meta: {
    title: string;
    description: string;
  };
}
