import { useState } from 'react';
import { largeSrc, type Photo } from '../data/photos';
import { photoSections, routeSteps, stopId, tripPath, tripPhotos, type Trip } from '../data/trips';
import { Footer } from './Footer';
import { PhotoGrid } from './PhotoGrid';
import { PhotoViewer } from './PhotoViewer';
import { Section } from './Section';
import { TripHelp } from './TripHelp';
import { TripHero } from './TripHero';
import { SiteNav } from './SiteNav';

export function TripPage({ trip }: { trip: Trip }) {
  const photos = tripPhotos(trip);
  const [viewing, setViewing] = useState<number | null>(null);
  const open = (photo: Photo) => setViewing(photos.indexOf(photo));
  return (
    <>
      <SiteNav current={tripPath(trip)} section="/trips/" />

      <TripHero trip={trip} />

      <main>
        {trip.highlights && (
          <Section id="why-go" title="Why go" icon="star">
            <ul className="trip-highlights">
              {trip.highlights.map((highlight) => (
                <li key={highlight.title} className="trip-highlights__item">
                  <h3 className="trip-highlights__title">{highlight.title}</h3>
                  <p className="trip-highlights__text">{highlight.text}</p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section id="route" title="The route" icon="globe">
          <ol className="trip-route">
            {routeSteps(trip).map((step) => (
              <li key={step.name} className="trip-route__stop">
                <span className="trip-route__name">{step.name}</span>
                <span className="trip-route__country">
                  {step.trails.length > 0 ? `${step.country} · ${step.trails.length} trails` : step.country}
                </span>
              </li>
            ))}
          </ol>
        </Section>

        {photoSections(trip).map((section, index) => (
          <Section
            key={section.name}
            id={stopId(section)}
            title={section.name}
            icon={section.stops[0].icon ?? 'globe'}
          >
            {section.stops.map((stop) => (
              <div key={stop.name} className="trip-stop">
                {section.trails && (
                  <h3 id={stopId(stop)} className="trip-stop__title">
                    {stop.name}
                  </h3>
                )}
                {stop.note && <p className="gallery__intro">{stop.note}</p>}
                <PhotoGrid
                  photos={stop.photos}
                  variant="full"
                  eager={index === 0}
                  linkTo={largeSrc}
                  onOpen={open}
                />
              </div>
            ))}
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
