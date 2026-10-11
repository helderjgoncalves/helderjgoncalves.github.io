import { CvDownload } from './CvDownload';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { href: '#profile', label: 'Profile' },
  { href: '#experience', label: 'Experience' },
  { href: '#side-projects', label: 'Side Projects' },
  { href: '#education', label: 'Education' },
  { href: '#awards', label: 'Awards' },
  { href: '#travel', label: 'Travel' },
];

export function Nav() {
  return (
    <nav className="nav" aria-label="Section navigation">
      <div className="container nav__inner">
        <a href="#top" className="nav__brand">HG.</a>
        <div className="nav__links">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
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
