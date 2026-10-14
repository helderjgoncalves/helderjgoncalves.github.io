import { useState } from 'react';
import { offTheClock } from '../data/offTheClock';
import { largeSrc, type Photo } from '../data/photos';
import { tripLink } from '../data/trips';
import { PhotoGrid } from './PhotoGrid';
import { PhotoViewer } from './PhotoViewer';
import { Section } from './Section';

// Same as the Off the clock page: a tile opens the viewer in place, whose
// caption links to the photo's trip. Without JavaScript it opens the photo.
export function OffTheClockGlance() {
  const { glance } = offTheClock;
  const [viewing, setViewing] = useState<number | null>(null);
  const open = (photo: Photo) => setViewing(glance.indexOf(photo));

  return (
    <>
      <Section id="off-the-clock" title="Off the clock" icon="globe">
        <PhotoGrid photos={glance} variant="glance" linkTo={largeSrc} onOpen={open} />
        <div className="project__actions">
          <a className="project__link project__link--primary" href="/off-the-clock/" draggable={false}>
            More off the clock
          </a>
        </div>
      </Section>
      <PhotoViewer photos={glance} index={viewing} onChange={setViewing} linkFor={tripLink} />
    </>
  );
}
