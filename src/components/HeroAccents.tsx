import type { HeroJump } from '../types';
import { Icon } from './Icon';

/** Warm on the personal pages, cool on the work ones (CV, home lab). */
type Tone = 'sunrise' | 'cool';

/** Slow-drifting lights behind a hero's text. */
export function HeroGlow({ tone = 'sunrise' }: { tone?: Tone }) {
  return <div className={tone === 'cool' ? 'hero-glow hero-glow--cool' : 'hero-glow'} aria-hidden="true" />;
}

/** `text` with its first `word` set in the tone's colours. Never a person's name. */
export function Highlighted({ text, word, tone = 'sunrise' }: { text: string; word: string; tone?: Tone }) {
  const at = text.indexOf(word);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className={tone === 'cool' ? 'hero-highlight hero-highlight--cool' : 'hero-highlight'}>{word}</span>
      {text.slice(at + word.length)}
    </>
  );
}

/** Glass buttons to the page's own sections. */
export function HeroJumps({ jumps }: { jumps: HeroJump[] }) {
  return (
    <nav className="hero-jumps" aria-label="On this page">
      {jumps.map((jump) => (
        <a key={jump.href} className="hero-jumps__link" href={jump.href} draggable={false}>
          <Icon name={jump.icon} />
          {jump.label}
        </a>
      ))}
    </nav>
  );
}
