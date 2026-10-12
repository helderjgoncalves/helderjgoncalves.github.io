import { travel } from '../data/travel';
import { Section } from './Section';
import { TravelPhotos } from './TravelPhotos';

export function TravelGlance() {
  const photos = travel.glance
    .map((src) => travel.photos.find((photo) => photo.src === src))
    .filter((photo) => photo !== undefined);

  return (
    <Section id="travel" title="Off the clock" icon="globe">
      <TravelPhotos photos={photos} variant="glance" />
      <div className="project__actions">
        <a className="project__link project__link--primary" href="/travel/">
          All travel photos
        </a>
      </div>
    </Section>
  );
}
