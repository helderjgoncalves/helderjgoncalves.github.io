import type { Certification } from '../types';
import { Section } from './Section';

interface CertificationsProps {
  items: Certification[];
}

export function Certifications({ items }: CertificationsProps) {
  const shown = items.filter((cert) => !cert.hidden);
  if (shown.length === 0) return null;

  return (
    <Section id="certifications" title="Certifications" icon="badge">
      <ul className="certifications">
        {shown.map((cert) => (
          <li key={cert.name} className="certifications__item">
            <strong>{cert.name}</strong>
            {cert.code && <em>({cert.code})</em>}
            <span>· {cert.issuer}</span>
            <em>{cert.year}</em>
          </li>
        ))}
      </ul>
    </Section>
  );
}
