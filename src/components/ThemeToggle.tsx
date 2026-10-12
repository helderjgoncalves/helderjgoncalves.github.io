import { useEffect } from 'react';

const STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

type Theme = 'light' | 'dark';

function systemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

// A saved choice exists only to differ from the system. Once the system comes
// round to the same theme (e.g. it turns dark at night after the visitor picked
// dark by day), the choice is redundant — drop it so the page follows the OS
// again tomorrow morning. Nothing on screen changes.
function forgetChoiceIfSystemMatches() {
  try {
    if (window.localStorage.getItem(STORAGE_KEY) === systemTheme()) {
      window.localStorage.removeItem(STORAGE_KEY);
      document.documentElement.removeAttribute('data-theme');
    }
  } catch {
    // localStorage may be disabled; there is then nothing saved to forget.
  }
}

function shownTheme(): Theme {
  const explicit = document.documentElement.getAttribute('data-theme');
  return explicit === 'light' || explicit === 'dark' ? explicit : systemTheme();
}

// Two states, not three: a click always flips what is on screen. Landing back
// on the system's theme forgets the choice, so the page follows the OS again
// (e.g. dark at night) instead of pinning a theme the user never asked to pin.
function toggleTheme() {
  const next: Theme = shownTheme() === 'dark' ? 'light' : 'dark';
  const root = document.documentElement;
  try {
    if (next === systemTheme()) {
      root.removeAttribute('data-theme');
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      root.setAttribute('data-theme', next);
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  } catch {
    // localStorage may be disabled (private mode, etc.); the attribute still
    // switches the theme for this page view.
    root.setAttribute('data-theme', next);
  }
}

// Both icons are rendered and CSS shows the one for the theme you'd switch to,
// using the same selectors as the palette. The markup is therefore identical on
// the server and the client, and the icon is right before hydration.
export function ThemeToggle() {
  // On load (the system may have changed since the last visit) and whenever
  // the system switches while the page is open.
  useEffect(() => {
    forgetChoiceIfSystemMatches();
    const query = window.matchMedia(DARK_QUERY);
    query.addEventListener('change', forgetChoiceIfSystemMatches);
    return () => query.removeEventListener('change', forgetChoiceIfSystemMatches);
  }, []);

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Switch between light and dark theme"
      title="Switch between light and dark theme"
      onClick={toggleTheme}
    >
      <svg className="theme-toggle__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg className="theme-toggle__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
