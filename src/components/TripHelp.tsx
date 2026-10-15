import { tripsPage } from '../data/tripsPage';
import { Icon } from './Icon';

interface TripHelpProps {
  title?: string;
  /** Trip pages end here, so the way back to /trips/ sits beside the offer. */
  back?: boolean;
}

export function TripHelp({ title = tripsPage.help.title, back = false }: TripHelpProps) {
  const { email, text, cta } = tripsPage.help;
  return (
    <aside className="container trip-help" aria-labelledby="trip-help-title">
      <div className="trip-help__card">
        <h2 id="trip-help-title" className="trip-help__title">
          {title}
        </h2>
        <p className="trip-help__text">{text}</p>
        <a className="trip-help__email" href={`mailto:${email}`} draggable={false}>
          <Icon name="email" />
          {cta}
        </a>
        {back && (
          <p className="trip-help__back">
            <a href="/trips/" draggable={false}>
              <Icon name="chevronLeft" />
              All trips
            </a>
          </p>
        )}
      </div>
    </aside>
  );
}
