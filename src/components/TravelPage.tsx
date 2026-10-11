import { travel } from '../data/travel';
import { CvDownload } from './CvDownload';
import { Footer } from './Footer';
import { Section } from './Section';
import { ThemeToggle } from './ThemeToggle';
import { TravelPhotos } from './TravelPhotos';

export function TravelPage() {
  const { title, thesis, intro, countryCount, countries, photos } = travel;

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
          <p className="page-hero__eyebrow">Off the clock</p>
          <h1 className="page-hero__title">{title}</h1>
          <p className="page-hero__thesis">{thesis}</p>
          <p className="page-hero__intro">{intro}</p>
          <p className="travel-count">
            <span className="travel-count__number">{countryCount}</span>
            <span className="travel-count__label">countries visited</span>
          </p>
        </div>
      </header>

      <main>
        <Section id="photos" title="Photos" icon="globe">
          <TravelPhotos photos={photos} variant="full" />
        </Section>

        {countries.length > 0 && (
          <Section id="countries" title="Countries" icon="star">
            <ul className="pills travel-countries">
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
