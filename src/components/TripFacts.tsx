import type { TripFacts as Facts } from '../data/trips';
import { tripsPage } from '../data/tripsPage';

export function TripFacts({ facts }: { facts: Facts }) {
  const { difficulty, comfort } = tripsPage.facts;
  const items = [
    { label: difficulty, value: facts.difficulty },
    { label: comfort, value: facts.comfort },
  ];
  return (
    <ul className="trip-facts">
      {items.map(({ label, value }) => (
        <li key={label} className="trip-facts__badge">
          <span className="trip-facts__label">{label}</span>
          <span className="trip-facts__meter" role="img" aria-label={`${value} out of 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={n <= value ? 'trip-facts__step trip-facts__step--on' : 'trip-facts__step'} />
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}
