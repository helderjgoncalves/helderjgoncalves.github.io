import { offTheClock } from '../data/offTheClock';
import { photoId } from '../data/photos';
import { tripHref } from '../data/trips';
import { PhotoGrid } from './PhotoGrid';
import { Section } from './Section';

export function OffTheClockGlance() {
  return (
    <Section id="off-the-clock" title="Off the clock" icon="globe">
      <PhotoGrid
        photos={offTheClock.glance}
        variant="glance"
        linkTo={(photo) => tripHref(photo) ?? `/off-the-clock/#${photoId(photo)}`}
      />
      <div className="project__actions">
        <a className="project__link project__link--primary" href="/off-the-clock/">
          More off the clock
        </a>
      </div>
    </Section>
  );
}
