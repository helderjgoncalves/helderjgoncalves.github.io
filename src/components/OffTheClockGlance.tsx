import { allPhotos, offTheClock, photoId } from '../data/offTheClock';
import { PhotoGrid } from './PhotoGrid';
import { Section } from './Section';

export function OffTheClockGlance() {
  const photos = offTheClock.glance
    .map((src) => allPhotos.find((photo) => photo.src === src))
    .filter((photo) => photo !== undefined);

  return (
    <Section id="off-the-clock" title="Off the clock" icon="globe">
      <PhotoGrid
        photos={photos}
        variant="glance"
        linkTo={(photo) => `/off-the-clock/#${photoId(photo)}`}
      />
      <div className="project__actions">
        <a className="project__link project__link--primary" href="/off-the-clock/">
          See all photos
        </a>
      </div>
    </Section>
  );
}
