import { useState } from 'react';
import { largeSrc, type Photo } from '../data/photos';
import { stopId, tripPath, tripPhotos, type Trip } from '../data/trips';
import { tripEyebrow } from '../data/tripsPage';
import { Footer } from './Footer';
import { PhotoGrid } from './PhotoGrid';
import { PhotoViewer } from './PhotoViewer';
import { Section } from './Section';
import { TripHelp } from './TripHelp';
import { SiteNav } from './SiteNav';

export function TripPage({ trip }: { trip: Trip }) {
  const photos = tripPhotos(trip);
  const [viewing, setViewing] = useState<number | null>(null);
  const open = (photo: Photo) => setViewing(photos.indexOf(photo));
  const stopsWithPhotos = trip.stops.filter((stop) => stop.photos.length > 0);
  return (
    <>
      <SiteNav current={tripPath(trip)} section="/trips/" />

      <header className="page-hero">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">{tripEyebrow(trip)}</p>
          <h1 className="page-hero__title">{trip.title}</h1>
          <p className="page-hero__thesis">{trip.summary}</p>
        </div>
      </header>

      <main>
        <Section id="route" title="The route" icon="globe">
          <ol className="trip-route">
            {trip.stops.map((stop) => (
              <li key={stop.name} className="trip-route__stop">
                <span className="trip-route__name">{stop.name}</span>
                <span className="trip-route__country">{stop.country}</span>
              </li>
            ))}
          </ol>
        </Section>

        {stopsWithPhotos.map((stop, index) => (
          <Section key={stop.name} id={stopId(stop)} title={stop.name} icon={stop.icon ?? 'globe'}>
            {stop.note && <p className="gallery__intro">{stop.note}</p>}
            <PhotoGrid
              photos={stop.photos}
              variant="full"
              eager={index === 0}
              linkTo={largeSrc}
              onOpen={open}
            />
          </Section>
        ))}

        {trip.practical.length > 0 && (
          <Section id="practical" title="Practical notes" icon="check">
            <dl className="trip-tips">
              {trip.practical.map((tip) => (
                <div key={tip.label} className="trip-tips__item">
                  <dt className="trip-tips__label">{tip.label}</dt>
                  <dd className="trip-tips__text">{tip.text}</dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        <TripHelp title={`Heading to ${trip.title}?`} back />
      </main>

      <Footer />

      <PhotoViewer photos={photos} index={viewing} onChange={setViewing} />
    </>
  );
}
