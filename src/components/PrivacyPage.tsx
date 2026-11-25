import { privacy, type PrivacyText } from '../data/privacy';
import { Footer } from './Footer';
import { HeroGlow } from './HeroAccents';
import { SiteNav } from './SiteNav';

function Paragraph({ parts }: { parts: PrivacyText[] }) {
  return (
    <p>
      {parts.map((part, index) => {
        if (typeof part === 'string') return part;
        if ('strong' in part) return <strong key={index}>{part.strong}</strong>;
        return (
          <a
            key={index}
            href={part.href}
            draggable={false}
            {...(part.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
          >
            {part.label}
          </a>
        );
      })}
    </p>
  );
}

export function PrivacyPage() {
  const { title, thesis, sections } = privacy;

  return (
    <>
      <SiteNav current="/privacy/" />

      <header className="page-hero">
        <HeroGlow />
        <div className="container page-hero__inner">
          <h1 className="page-hero__title">{title}</h1>
          <p className="page-hero__thesis">{thesis}</p>
        </div>
      </header>

      <main className="container privacy">
        <nav className="privacy__toc" aria-label="On this page">
          <p className="privacy__toc-title">On this page</p>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} draggable={false}>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="privacy__body">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="privacy__section">
              <h2 className="privacy__heading">
                <span className="privacy__number">{index + 1}.</span>
                {section.title}
              </h2>
              {section.paragraphs.map((parts, paragraph) => (
                <Paragraph key={paragraph} parts={parts} />
              ))}
            </section>
          ))}
        </article>
      </main>

      <Footer />
    </>
  );
}
