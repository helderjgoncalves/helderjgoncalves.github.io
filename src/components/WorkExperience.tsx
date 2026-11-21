import type { ReactNode } from 'react';
import type { WorkExperience as WorkExperienceData } from '../types';
import { Pills } from './Pill';
import { Section } from './Section';

interface WorkExperienceProps {
  data: WorkExperienceData;
  title: string;
}

function linked(text: string, links: Record<string, string> = {}): ReactNode[] {
  const found = Object.entries(links)
    .map(([phrase, href]) => {
      const at = text.indexOf(phrase);
      if (at < 0) throw new Error(`cv.ts links "${phrase}", which its bullet doesn't say`);
      return { phrase, href, at };
    })
    .sort((a, b) => a.at - b.at);
  const parts: ReactNode[] = [];
  let from = 0;
  for (const { phrase, href, at } of found) {
    parts.push(text.slice(from, at));
    parts.push(
      <a key={phrase} href={href} target="_blank" rel="noopener noreferrer">
        {phrase}
      </a>,
    );
    from = at + phrase.length;
  }
  parts.push(text.slice(from));
  return parts;
}

export function WorkExperience({ data, title }: WorkExperienceProps) {
  return (
    <Section id="experience" title="Work Experience" icon="briefcase">
      <div className="timeline">
        <div className="timeline__item">
          <div className="entry">
            <div className="entry__head">
              <div>
                <div className="entry__title">{title}</div>
                <div className="entry__org">{data.company}</div>
              </div>
            </div>

            <div className="entry__history">
              {data.history.map((role, idx) => (
                <span key={idx}>
                  {role.title} ({role.period})
                </span>
              ))}
            </div>

            {data.groups.map((group) => (
              <div key={group.heading} className="group">
                <h3 className="group__heading">{group.heading}</h3>
                <ul className="group__list">
                  {group.bullets.filter((bullet) => !bullet.hidden).map((bullet) => (
                    <li key={bullet.label} className="group__item">
                      <strong>{bullet.label}:</strong>
                      {linked(bullet.description, bullet.links)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div style={{ marginTop: '1.4rem' }}>
              <Pills items={data.techPills} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
