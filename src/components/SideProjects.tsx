import type { SideProject } from '../types';
import { Pills } from './Pill';
import { Section } from './Section';

interface SideProjectsProps {
  items: SideProject[];
}

export function SideProjects({ items }: SideProjectsProps) {
  return (
    <Section id="side-projects" title="Side Projects" icon="code">
      {items.map((project) => (
        <article key={project.title} className="project">
          <h3 className="project__title">{project.title}</h3>
          <p className="project__subtitle">{project.subtitle}</p>
          <p className="project__description">{project.description}</p>
          <div className="project__pills">
            <Pills items={project.techPills} />
          </div>
          {(project.caseStudyHref || project.href) && (
            <div className="project__actions">
              {project.caseStudyHref && (
                <a className="project__link project__link--primary" href={project.caseStudyHref} draggable={false}>
                  View case study
                </a>
              )}
              {project.href && (
                <a
                  className="project__link"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                >
                  View on GitHub
                </a>
              )}
            </div>
          )}
        </article>
      ))}
    </Section>
  );
}
