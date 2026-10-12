import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
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
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <nav ref={navRef} className={open ? 'nav nav--open' : 'nav'} aria-label="Site navigation">
      <div className="container nav__inner">
        <a
          href="/"
          className="nav__brand"
          aria-label={isHome ? undefined : 'Home'}
          aria-current={isHome ? 'page' : undefined}
        >
          HG.
        </a>
        <div id="site-nav-links" className="nav__links">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.href === current ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
        <ThemeToggle />
        <button
          ref={buttonRef}
          type="button"
          className="nav__menu"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="site-nav-links"
          onClick={() => setOpen((wasOpen) => !wasOpen)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
    </nav>
  );
}
