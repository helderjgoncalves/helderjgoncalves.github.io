import { photoId, type Photo } from '../photos';
import { argentina } from './argentina';
import { belize } from './belize';
import { bolivia } from './bolivia';
import { chile } from './chile';
import { guatemala } from './guatemala';
import { morocco } from './morocco';
import { patagonia } from './patagonia';
import { peru } from './peru';
import { rioDeJaneiro } from './rioDeJaneiro';
import { yucatan } from './yucatan';
import type { Trip, TripStop } from './types';

export type { Rating, Region, Trip, TripFacts, TripHighlight, TripStop, TripTip } from './types';
export { regions } from './types';

/**
 * Every trip page, by region: north to south through the Americas, then
 * further afield. One page per destination someone would plan
 * as a trip — a region spanning borders (Patagonia) stays one page, while one
 * journey through two rich countries (Peru, then Bolivia) is two. Adding one:
 * a file beside this one, an entry here. Routing,
 * prerendering, the sitemap, and the cards on /trips/ all follow from this list.
 */
export const trips: Trip[] = [
  yucatan,
  belize,
  guatemala,
  peru,
  bolivia,
  patagonia,
  argentina,
  chile,
  rioDeJaneiro,
  morocco,
];

/** Trips still standing on placeholder photos — the build lists them so none ship unnoticed. */
export const sampleTrips = trips.filter((trip) => tripPhotos(trip).some((photo) => photo.sample));

// Fails the build (the SSR render imports this) rather than shipping a card
// whose cover the trip page doesn't show.
for (const trip of trips) {
  if (!tripPhotos(trip).includes(trip.cover.photo)) {
    throw new Error(`trips/${trip.slug}: cover ${trip.cover.photo.src} isn't in any of its stops`);
  }
}

export function tripPath(trip: Trip): string {
  return `/trips/${trip.slug}/`;
}

/** Path without its trailing slash, as App's normalizePath produces. */
export function tripForPath(path: string): Trip | undefined {
  return trips.find((trip) => tripPath(trip).replace(/\/$/, '') === path);
}

/** In route order, so the viewer's next/previous follows the journey. */
export function tripPhotos(trip: Trip): Photo[] {
  return trip.stops.flatMap((stop) => stop.photos);
}

export function tripCountries(trip: Trip): string[] {
  return [...new Set(trip.stops.map((stop) => stop.country))];
}

/** The trip a photo belongs to, if any. */
export function tripOf(photo: Photo): Trip | undefined {
  return trips.find((trip) => tripPhotos(trip).some((p) => p.src === photo.src));
}

/** A photo's place on its trip page, or undefined if it isn't on a trip. */
export function tripHref(photo: Photo): string | undefined {
  const trip = tripOf(photo);
  return trip && `${tripPath(trip)}#${photoId(photo)}`;
}

/** Section anchor for a stop: 'Huayna Potosí' → 'huayna-potosi'. */
export function stopId(stop: TripStop): string {
  return stop.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
