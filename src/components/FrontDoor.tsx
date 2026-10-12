import { cv } from '../data/cv';
import { frontDoor } from '../data/frontDoor';
import { Footer } from './Footer';
import { SiteNav } from './SiteNav';
import { Hero } from './Hero';
import { OffTheClockGlance } from './OffTheClockGlance';

export function FrontDoor() {
  return (
    <>
      <SiteNav current="/" />

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
