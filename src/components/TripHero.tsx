import type { CSSProperties } from 'react';
import { avifSrc, hasAvif, largeSrc, largeSrcSet } from '../data/photos';
import type { Trip } from '../data/trips';
import { tripEyebrow } from '../data/tripsPage';
import { TripFacts } from './TripFacts';

/** A trip page's hero: its cover photo full-bleed, the title and summary over its foot. */
export function TripHero({ trip }: { trip: Trip }) {
  const { photo, focus, phoneZoom } = trip.cover;
  // Every layer picks the same copy from the same srcset, so the photo downloads once.
  const layer = (className: string, alt: string) => (
    <picture>
      {hasAvif(photo) && (
        <source type="image/avif" srcSet={largeSrcSet(photo)?.srcSet ?? avifSrc(largeSrc(photo))} sizes="100vw" />
      )}
      <img
        className={className}
        draggable={false}
        src={largeSrc(photo)}
        alt={alt}
        width={photo.width}
        height={photo.height}
        fetchPriority="high"
        decoding="async"
        style={focus ? { objectPosition: focus } : undefined}
      />
    </picture>
  );
  return (
    <header
      className="page-hero trip-cover"
      style={phoneZoom ? ({ '--phone-zoom': phoneZoom } as CSSProperties) : undefined}
    >
      <div className="trip-cover__extend" aria-hidden="true">
        {layer('trip-cover__copy trip-cover__copy--left', '')}
        {layer('trip-cover__copy', '')}
        {layer('trip-cover__copy trip-cover__copy--right', '')}
      </div>
      {layer('trip-cover__img', photo.alt)}
      <div className="trip-cover__band">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">{tripEyebrow(trip)}</p>
          <h1 className="page-hero__title">{trip.title}</h1>
          <p className="page-hero__thesis">{trip.summary}</p>
          {trip.facts && <TripFacts facts={trip.facts} />}
        </div>
      </div>
    </header>
  );
}
