import type { WorkExperience as WorkExperienceData } from '../types';
import { Pills } from './Pill';
import { Section } from './Section';

interface WorkExperienceProps {
  data: WorkExperienceData;
}

export function WorkExperience({ data }: WorkExperienceProps) {
  return (
    <Section id="experience" title="Work Experience" icon="briefcase">
      <div className="timeline">
        <div className="timeline__item">
          <div className="entry">
            <div className="entry__head">
              <div>
                <div className="entry__title">{data.primaryTitle}</div>
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
                      {bullet.description}
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
