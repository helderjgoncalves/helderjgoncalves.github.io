import { offTheClock, wondersSeen } from '../data/offTheClock';
import { CvDownload } from './CvDownload';
import { Footer } from './Footer';
import { Icon } from './Icon';
import { PhotoGrid } from './PhotoGrid';
import { Section } from './Section';
import { ThemeToggle } from './ThemeToggle';

export function OffTheClockPage() {
  const { title, thesis, wonders, countries, themes } = offTheClock;
  const [adventures, ...otherThemes] = themes;

  return (
    <>
      <nav className="nav" aria-label="Site navigation">
        <div className="container nav__inner">
          <a href="/" className="nav__brand" aria-label="Back home">
            HG.
          </a>
          <CvDownload />
          <ThemeToggle />
        </div>
      </nav>

      <header className="page-hero">
        <div className="container page-hero__inner">
          <h1 className="page-hero__title">{title}</h1>
          <p className="page-hero__thesis">{thesis}</p>
        </div>
      </header>

      <main>
        <Section id={adventures.id} title={adventures.title} icon={adventures.icon}>
          <PhotoGrid photos={adventures.photos} variant="full" />
        </Section>

        <Section id="wonders" title="Wonders of the World" icon="star">
          <p className="wonders__intro">
            The goal: all seven of the New Seven Wonders. {wondersSeen} down,{' '}
            {wonders.length - wondersSeen} to go.
          </p>
          <div
            className="wonders__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={wonders.length}
            aria-valuenow={wondersSeen}
            aria-label="Wonders seen"
          >
            <span style={{ width: `${(wondersSeen / wonders.length) * 100}%` }} />
          </div>
          <ul className="wonders">
            {wonders.map((wonder) => (
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

        {otherThemes.map((theme) => (
          <Section key={theme.id} id={theme.id} title={theme.title} icon={theme.icon}>
            {theme.intro && <p className="gallery__intro">{theme.intro}</p>}
            <PhotoGrid photos={theme.photos} variant="full" />
          </Section>
        ))}

        {countries.length > 0 && (
          <Section id="countries" title="Countries" icon="star">
            <ul className="pills country-list">
              {countries.map((country) => (
                <li key={country} className="pill pill--ghost">
                  {country}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </main>

      <Footer />
    </>
  );
}
