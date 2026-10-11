import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { useReveal } from '../hooks/useReveal';

interface SectionProps {
  id: string;
  title: string;
  icon: 'briefcase' | 'graduationCap' | 'lab' | 'code' | 'star' | 'badge' | 'user' | 'languages' | 'globe';
  children: ReactNode;
}

export function Section({ id, title, icon, children }: SectionProps) {
  const ref = useReveal();
  return (
    <section id={id} className="section reveal" ref={ref}>
      <div className="container">
        <div className="section__header">
          <Icon name={icon} className="section__icon" />
          <h2 className="section__title">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}
