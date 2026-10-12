import { cv } from '../data/cv';
import { frontDoor } from '../data/frontDoor';
import { CvDownload } from './CvDownload';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { ThemeToggle } from './ThemeToggle';
import { TravelGlance } from './TravelGlance';

const LINKS = [
  { href: '/cv/', label: 'Curriculum vitae' },
  { href: '/homelab/', label: 'Home lab' },
  { href: '/travel/', label: 'Travel' },
];

export function FrontDoor() {
  return (
    <>
      <nav className="nav" aria-label="Site navigation">
        <div className="container nav__inner">
          <a href="/" className="nav__brand" aria-current="page">
            HG.
          </a>
          <div className="nav__links">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <CvDownload />
          <ThemeToggle />
        </div>
      </nav>

      <Hero profile={cv.profile} />

      <main>
        <div className="container front">
          <p className="front__intro">{frontDoor.intro}</p>
          <div className="doors">
            {frontDoor.doors.map((door) => (
              <article key={door.href} className="door">
                <p className="door__eyebrow">{door.eyebrow}</p>
                <h2 className="door__title">{door.title}</h2>
                <p className="door__line">{door.line}</p>
                <a className="door__link" href={door.href}>
                  {door.cta}
                </a>
              </article>
            ))}
          </div>
        </div>

        <TravelGlance />
      </main>

      <Footer />
    </>
  );
}
