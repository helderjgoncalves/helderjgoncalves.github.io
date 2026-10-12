import { cv } from '../data/cv';
import { frontDoor } from '../data/frontDoor';
import { CvDownload } from './CvDownload';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { ThemeToggle } from './ThemeToggle';
import { OffTheClockGlance } from './OffTheClockGlance';

const LINKS = [
  { href: '/cv/', label: 'Curriculum vitae' },
  { href: '/homelab/', label: 'Home lab' },
  { href: '/off-the-clock/', label: 'Off the clock' },
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
              <a key={door.href} className="door" href={door.href}>
                <span className="door__eyebrow">{door.eyebrow}</span>
                <h2 className="door__title">{door.title}</h2>
                <span className="door__line">{door.line}</span>
                <span className="door__cta">{door.cta}</span>
              </a>
            ))}
          </div>
        </div>

        <OffTheClockGlance />
      </main>

      <Footer />
    </>
  );
}
