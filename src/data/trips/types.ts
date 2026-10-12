import type { IconName } from '../../components/Icon';
import type { Photo } from '../photos';

export interface TripStop {
  name: string;
  country: string;
  /** Section icon on the trip page. Defaults to the globe. */
  icon?: IconName;
  /** A line or two about the stop. Hidden while empty. */
  note?: string;
  /** A stop without photos still shows on the route, just without a section. */
  photos: Photo[];
}

/** One practical fact for someone planning the same trip, e.g. "Best season". */
export interface TripTip {
  label: string;
  text: string;
}

/** The groups on /trips/, in page order. Add one here when a trip needs it. */
export const regions = ['Mexico & Central America', 'South America', 'Africa'] as const;
export type Region = (typeof regions)[number];

export interface Trip {
  /** URL segment: /trips/<slug>/. Keep it stable once published. */
  slug: string;
  title: string;
  /** Which group the trip's card sits in on /trips/. */
  region: Region;
  /**
   * One line, shown under the title: what the trip feels like, not where it
   * goes — the route is listed right below it. No dates: trips are undated on purpose.
   */
  summary: string;
  /** In the order travelled. */
  stops: TripStop[];
  /**
   * The trip's card on /trips/: one of its own photos, cropped to 3:2. `focus`
   * is the object-position that keeps the subject in frame.
   */
  cover: { photo: Photo; focus?: string };
  /** Shown as a big card at the top of /trips/; the rest get compact cards. */
  featured?: boolean;
  /** Season, transport, operators, altitude… The section is hidden while empty. */
  practical: TripTip[];
  meta: {
    title: string;
    description: string;
    /** Absolute URL of a 1200x630 social card. */
    image: string;
    imageAlt: string;
  };
}
