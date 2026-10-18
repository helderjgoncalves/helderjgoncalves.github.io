import type { Internship } from '../types';
import { Pills } from './Pill';
import { Section } from './Section';

interface InternshipsProps {
  items: Internship[];
}

export function Internships({ items }: InternshipsProps) {
  return (
    <Section id="internships" title="Internships" icon="lab">
      <div className="timeline">
        {items.map((item) => (
          <div key={item.title} className="timeline__item">
            <div className="entry">
              <div className="entry__head">
                <div>
                  <div className="entry__title">{item.title}</div>
                  <div className="entry__org">{item.organisation}</div>
                </div>
                <div className="entry__period">{item.period}</div>
              </div>

              {item.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="entry__paragraph">
                  {paragraph}
                </p>
              ))}

              <div style={{ marginTop: '1rem' }}>
                <Pills items={item.techPills} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
