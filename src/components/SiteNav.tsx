import { CvDownload } from './CvDownload';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { href: '/cv/', label: 'Curriculum vitae' },
  { href: '/homelab/', label: 'Home lab' },
  { href: '/off-the-clock/', label: 'Off the clock' },
];

interface SiteNavProps {
  /** Path of the page being rendered, e.g. '/homelab/'. '/' for the front page. */
  current: string;
}

export function SiteNav({ current }: SiteNavProps) {
  const isHome = current === '/';

  return (
    <nav className="nav" aria-label="Site navigation">
      <div className="container nav__inner">
        <a
          href="/"
          className="nav__brand"
          aria-label={isHome ? undefined : 'Home'}
          aria-current={isHome ? 'page' : undefined}
        >
          HG.
        </a>
        <div className="nav__links">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.href === current ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
        <CvDownload />
        <ThemeToggle />
      </div>
    </nav>
  );
}
