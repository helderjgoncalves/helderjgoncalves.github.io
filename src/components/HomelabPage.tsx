import { homelab } from '../data/homelab';
import { Footer } from './Footer';
import { HeroGlow, Highlighted } from './HeroAccents';
import { HomelabArchitecture } from './HomelabArchitecture';
import { Icon } from './Icon';
import { Section } from './Section';
import { SiteNav } from './SiteNav';

export function HomelabPage() {
  const { title, highlight, thesis, intro, decisions, stack, ctas } = homelab;

  return (
    <>
      <SiteNav current="/homelab/" />

      <header className="page-hero">
        <HeroGlow tone="cool" />
        <div className="container page-hero__inner">
          <h1 className="page-hero__title">
            <Highlighted text={title} word={highlight} tone="cool" />
          </h1>
          <p className="page-hero__thesis">{thesis}</p>
          <p className="page-hero__intro">{intro}</p>
          <div className="page-hero__actions">
            {ctas.map((cta) => (
              <a
                key={cta.href + cta.label}
                className={
                  cta.primary ? 'homelab-cta homelab-cta--primary' : 'homelab-cta'
                }
                href={cta.href}
                draggable={false}
                target={cta.external ? '_blank' : undefined}
                rel={cta.external ? 'noopener noreferrer' : undefined}
              >
                {cta.primary && <Icon name="github" />}
                <span>{cta.label}</span>
              </a>
            ))}
          </div>
        </div>
      </header>

      <main>
        <Section id="architecture" title="Architecture" icon="globe">
          <HomelabArchitecture />
        </Section>

        <Section id="decisions" title="Design decisions" icon="lab">
          <ol className="homelab-decisions">
            {decisions.map((decision, index) => (
              <li key={decision.title} className="homelab-decisions__item">
                <span className="homelab-decisions__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="homelab-decisions__title">{decision.title}</h3>
                  <p className="homelab-decisions__desc">{decision.description}</p>
                  {decision.evidence && (
                    <a
                      className="homelab-decisions__evidence"
                      href={decision.evidence.href}
                      draggable={false}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {decision.evidence.label}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="stack" title="Stack" icon="code">
          <ul className="homelab-stack">
            {stack.map((item) => (
              <li key={item.name} className="homelab-stack__item">
                <strong className="homelab-stack__name">{item.name}</strong>
                <span className="homelab-stack__purpose">{item.purpose}</span>
              </li>
            ))}
          </ul>
          <p className="homelab-stack__note">
            Depth lives in the{' '}
            <a
              href="https://github.com/helderjgoncalves/Homelab-Infrastructure"
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
            >
              Homelab Infrastructure
            </a>{' '}
            README — this page is the portfolio view.
          </p>
        </Section>
      </main>

      <Footer />
    </>
  );
}
