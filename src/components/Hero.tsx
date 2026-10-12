import type { ProfileData } from '../types';
import { CvDownload } from './CvDownload';
import { Icon } from './Icon';

interface HeroProps {
  profile: ProfileData;
  /** Show Download CV (pill on desktop, contact icon on phones). Only the CV page does. */
  showDownload?: boolean;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Hero({ profile, showDownload = false }: HeroProps) {
  return (
    <header id="top" className="hero">
      <div className="container hero__inner">
        <div className="hero__photo" aria-hidden={profile.photo ? undefined : true}>
          {profile.photo ? (
            <img src={profile.photo} alt={`${profile.name} portrait`} />
          ) : (
            <span>{getInitials(profile.name)}</span>
          )}
        </div>

        <div>
          <h1 className="hero__name">{profile.name}</h1>
          <p className="hero__title">{profile.title}</p>
          {showDownload && <CvDownload variant="pill" />}
        </div>

        <div className="hero__contacts">
          {profile.contacts.map((contact) => (
            <a
              key={contact.href}
              className="hero__contact"
              href={contact.href}
              target={contact.href.startsWith('http') ? '_blank' : undefined}
              rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <Icon name={contact.icon} />
              <span>{contact.label}</span>
            </a>
          ))}
          {showDownload && <CvDownload variant="icon" />}
        </div>
      </div>
    </header>
  );
}
