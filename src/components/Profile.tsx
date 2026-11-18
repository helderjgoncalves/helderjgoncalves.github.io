import type { ProfileData } from '../types';
import { Highlights } from './Highlights';
import { Section } from './Section';

interface ProfileProps {
  profile: ProfileData;
}

export function Profile({ profile }: ProfileProps) {
  return (
    <Section id="profile" title="Profile" icon="user">
      <div className="profile">
        {profile.paragraphs.map((paragraph, index) => (
          <p key={index} className="profile__paragraph">
            {paragraph}
          </p>
        ))}
      </div>
      <Highlights items={profile.highlights} />
    </Section>
  );
}
