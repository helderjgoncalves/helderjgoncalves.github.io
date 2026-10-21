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
  if (!trip.cover.photo.preview) {
    throw new Error(`trips/${trip.slug}: cover ${trip.cover.photo.src} has no preview. Run \`npm run previews\`.`);
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

/** One numbered place on the route: a stop, or an area with its trails in travel order. */
export interface RouteStep {
  name: string;
  country: string;
  trails: string[];
}

/** The route with consecutive stops in one area folded into it. */
export function routeSteps(trip: Trip): RouteStep[] {
  const steps: RouteStep[] = [];
  for (const stop of trip.stops) {
    const last = steps[steps.length - 1];
    if (stop.area && last?.name === stop.area) last.trails.push(stop.name);
    else steps.push({ name: stop.area ?? stop.name, country: stop.country, trails: stop.area ? [stop.name] : [] });
  }
  return steps;
}

/**
 * The trip page's photo sections: one per stop with photos, except that
 * consecutive trails in one area share the area's section, each under its
 * own heading (`trails`).
 */
export function photoSections(trip: Trip): { name: string; stops: TripStop[]; trails: boolean }[] {
  const sections: { name: string; stops: TripStop[]; trails: boolean }[] = [];
  for (const stop of trip.stops.filter((s) => s.photos.length > 0)) {
    const last = sections[sections.length - 1];
    if (stop.area && last?.trails && last.name === stop.area) last.stops.push(stop);
    else sections.push({ name: stop.area ?? stop.name, stops: [stop], trails: stop.area !== undefined });
  }
  return sections;
}

/** The route in a line: the cards on /trips/. */
export function routeNames(trip: Trip): string[] {
  return routeSteps(trip).map((step) => step.name);
}

export function tripCountries(trip: Trip): string[] {
  return [...new Set(trip.stops.map((stop) => stop.country))];
}

export function tripPlace(trip: Trip): string {
  return trip.place ?? trip.title;
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

/** The photo viewer's link under the caption, to the photo on its trip page. */
export function tripLink(photo: Photo): { href: string; label: string } | undefined {
  const trip = tripOf(photo);
  const href = tripHref(photo);
  return trip && href ? { href, label: `${tripPlace(trip)} trip` } : undefined;
}

/**
 * Section anchor for a stop or area: 'Huayna Potosí' → 'stop-huayna-potosi'.
 * Prefixed because photo anchors are bare file names, and a stop is often
 * named like one of its photos (Lago Grey, lago-grey).
 */
export function stopId(stop: { name: string }): string {
  return 'stop-' + stop.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
