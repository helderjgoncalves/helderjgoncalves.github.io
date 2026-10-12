import { cv } from '../data/cv';
import { tripsPage } from '../data/tripsPage';

const email = cv.profile.contacts.find((contact) => contact.icon === 'email');

interface TripHelpProps {
  title?: string;
  /** Trip pages end here, so the way back to /trips/ sits beside the offer. */
  back?: boolean;
}

export function TripHelp({ title = tripsPage.help.title, back = false }: TripHelpProps) {
  if (!email) return null;
  const { text, cta } = tripsPage.help;
  return (
    <aside className="container trip-help" aria-labelledby="trip-help-title">
      <div className="trip-help__card">
        <h2 id="trip-help-title" className="trip-help__title">
          {title}
        </h2>
        <p className="trip-help__text">{text}</p>
        <div className="project__actions trip-help__actions">
          <a className="project__link project__link--primary" href={email.href}>
            {cta}
          </a>
          {back && (
            <a className="project__link" href="/trips/">
              All trips
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
