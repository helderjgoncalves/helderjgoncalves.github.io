import { regions, routeNames, sampleTrips, tripPath, trips, type Trip } from '../data/trips';
import { tripEyebrow, tripsPage } from '../data/tripsPage';
import { Footer } from './Footer';
import { HeroGlow } from './HeroAccents';
import { Section } from './Section';
import { SiteNav } from './SiteNav';
import { TripHelp } from './TripHelp';

interface TripCardProps {
  trip: Trip;
  /** Compact cards drop the summary and route so many fit on a screen. */
  compact?: boolean;
  eager?: boolean;
}

function TripCard({ trip, compact = false, eager = false }: TripCardProps) {
  const { photo, focus } = trip.cover;
  // Compact cards sit under "More trips" (h2) and their region (h3).
  const Title = compact ? 'h4' : 'h2';
  return (
    <a className={compact ? 'trip-card trip-card--compact' : 'trip-card'} href={tripPath(trip)} draggable={false}>
      <img
        className="trip-card__img"
        draggable={false}
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={focus ? { objectPosition: focus } : undefined}
      />
      <div className="trip-card__body">
        <span className="trip-card__eyebrow">{tripEyebrow(trip)}</span>
        <Title className="trip-card__title">{trip.title}</Title>
        {!compact && (
          <>
            <span className="trip-card__summary">{trip.summary}</span>
            <span className="trip-card__route">{routeNames(trip).join(' · ')}</span>
            <span className="trip-card__cta">View trip</span>
          </>
        )}
      </div>
    </a>
  );
}

export function TripsPage() {
  const { title, thesis, intro } = tripsPage;
  const featured = trips.filter((trip) => trip.featured);
  // Grouped by region in `regions` order; within one, the list's north-to-south order.
  const groups = regions
    .map((region) => ({
      region,
      trips: trips.filter((trip) => !trip.featured && trip.region === region),
    }))
    .filter((group) => group.trips.length > 0);

  return (
    <>
      <SiteNav current="/trips/" />

      <header className="page-hero">
        <HeroGlow soft />
        <div className="container page-hero__inner">
          <h1 className="page-hero__title">{title}</h1>
          <p className="page-hero__thesis">{thesis}</p>
          <p className="page-hero__intro">{intro}</p>
          {sampleTrips.length > 0 && <p className="page-hero__note">{tripsPage.wip.note}</p>}
        </div>
      </header>

      <main>
        {featured.length > 0 && (
          <div className="container trip-cards">
            {featured.map((trip) => (
              <TripCard key={trip.slug} trip={trip} eager />
            ))}
          </div>
        )}

        {groups.length > 0 && (
          <Section id="more-trips" title={featured.length ? 'More trips' : 'Every trip'} icon="globe">
            {groups.map((group) => (
              <div key={group.region} className="trip-region">
                <h3 className="trip-region__title">{group.region}</h3>
                <div className="trip-cards trip-cards--compact">
                  {group.trips.map((trip) => (
                    <TripCard key={trip.slug} trip={trip} compact />
                  ))}
                </div>
              </div>
            ))}
          </Section>
        )}

        <TripHelp />
      </main>

      <Footer />
    </>
  );
}
