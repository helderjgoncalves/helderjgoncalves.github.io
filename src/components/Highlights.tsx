import type { ProfileData } from '../types';

interface HighlightsProps {
  items: ProfileData['highlights'];
}

export function Highlights({ items }: HighlightsProps) {
  return (
    <dl className="highlights">
      {items.map((item) => (
        <div key={item.label} className="highlights__item">
          <dt className="highlights__label">{item.label}</dt>
          <dd className="highlights__value">
            {item.value.split(' → ').map((part, index) => (
              <span key={index}>
                {index > 0 && <span className="highlights__arrow"> → </span>}
                {part}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
