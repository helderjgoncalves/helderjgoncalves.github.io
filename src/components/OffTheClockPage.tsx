import { Fragment, useState } from 'react';
import { allPhotos, offTheClock } from '../data/offTheClock';
import { largeSrc, type Photo } from '../data/photos';
import { tripHref, tripOf } from '../data/trips';
import { Footer } from './Footer';
import { Icon } from './Icon';
import { PhotoGrid } from './PhotoGrid';
import { PhotoViewer } from './PhotoViewer';
import { Section } from './Section';
import { SiteNav } from './SiteNav';

export function OffTheClockPage() {
  const { title, thesis, intro, goals, themes } = offTheClock;

  // allPhotos follows the themes in page order, so the viewer's next/previous
  // walks the page top to bottom.
  const [viewing, setViewing] = useState<number | null>(null);
  const open = (photo: Photo) => setViewing(allPhotos.indexOf(photo));
  const tripLink = (photo: Photo) => {
    const trip = tripOf(photo);
    const href = tripHref(photo);
    return trip && href ? { href, label: `${trip.title} trip` } : undefined;
  };

  const goalSection = (goal: (typeof goals)[number]) => {
    const seen = goal.wonders.filter((wonder) => wonder.seen).length;
    const sorted = [...goal.wonders].sort(
      (a, b) => Number(b.seen) - Number(a.seen) || a.name.localeCompare(b.name, 'en'),
    );
    return (
      <Section key={goal.id} id={goal.id} title={goal.title} icon={goal.icon}>
        <p className="wonders__intro">
          The goal: all seven of {goal.collection}. {seen} down, {goal.wonders.length - seen} to go.
        </p>
        <div
          className="wonders__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={goal.wonders.length}
          aria-valuenow={seen}
          aria-label={`${goal.title} seen`}
        >
          <span style={{ width: `${(seen / goal.wonders.length) * 100}%` }} />
        </div>
        <ul className="wonders">
          {sorted.map((wonder) => (
            <li
              key={wonder.name}
              className={wonder.seen ? 'wonders__item wonders__item--seen' : 'wonders__item'}
            >
              <span className="wonders__mark" aria-hidden="true">
                {wonder.seen && <Icon name="check" />}
              </span>
              <span>
                <span className="wonders__name">{wonder.name}</span>
                <span className="wonders__place">
                  {wonder.place} · {wonder.seen ? 'seen' : 'still to go'}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Section>
    );
  };

  return (
    <>
      <SiteNav current="/off-the-clock/" />

      <header className="page-hero">
        <div className="container page-hero__inner">
          <h1 className="page-hero__title">{title}</h1>
          <p className="page-hero__thesis">{thesis}</p>
          <p className="page-hero__intro">{intro}</p>
        </div>
      </header>

      <main>
        {themes.map((theme, index) => (
          <Fragment key={theme.id}>
            <Section id={theme.id} title={theme.title} icon={theme.icon}>
              {theme.intro && <p className="gallery__intro">{theme.intro}</p>}
              <PhotoGrid
                photos={theme.photos}
                variant="full"
                eager={index === 0}
                linkTo={largeSrc}
                onOpen={open}
              />
              {theme.more && (
                <div className="project__actions">
                  <a className="project__link project__link--primary" href={theme.more.href}>
                    {theme.more.label}
                  </a>
                </div>
              )}
            </Section>
            {goals.filter((goal) => goal.after === theme.id).map(goalSection)}
          </Fragment>
        ))}
      </main>

      <Footer />

      <PhotoViewer photos={allPhotos} index={viewing} onChange={setViewing} linkFor={tripLink} />
    </>
  );
}
