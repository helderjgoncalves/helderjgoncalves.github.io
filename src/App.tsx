import { CvPage } from './components/CvPage';
import { HomePage } from './components/HomePage';
import { HomelabPage } from './components/HomelabPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TripPage } from './components/TripPage';
import { TripsPage } from './components/TripsPage';
import { tripForPath } from './data/trips';

export function normalizePath(path: string): string {
  if (!path || path === '/') return '/';
  const trimmed = path.replace(/\/+$/, '');
  return trimmed || '/';
}

export function isHomelabPath(path: string): boolean {
  return normalizePath(path) === '/homelab';
}

export function isTripsPath(path: string): boolean {
  return normalizePath(path) === '/trips';
}

export function isCvPath(path: string): boolean {
  return normalizePath(path) === '/cv';
}

export function isPrivacyPath(path: string): boolean {
  return normalizePath(path) === '/privacy';
}

interface AppProps {
  /** Pathname used for SSR / prerender; client falls back to location. */
  path?: string;
}

export default function App({ path }: AppProps) {
  const pathname =
    path ?? (typeof window !== 'undefined' ? window.location.pathname : '/');

  if (isHomelabPath(pathname)) {
    return <HomelabPage />;
  }

  if (isCvPath(pathname)) {
    return <CvPage />;
  }

  if (isTripsPath(pathname)) {
    return <TripsPage />;
  }

  if (isPrivacyPath(pathname)) {
    return <PrivacyPage />;
  }

  const trip = tripForPath(normalizePath(pathname));
  if (trip) {
    return <TripPage trip={trip} />;
  }

  return <HomePage />;
}
