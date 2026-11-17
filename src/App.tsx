import { cv } from './data/cv';
import { SiteNav } from './components/SiteNav';
import { Hero } from './components/Hero';
import { Profile } from './components/Profile';
import { WorkExperience } from './components/WorkExperience';
import { Internships } from './components/Internships';
import { Education } from './components/Education';
import { SideProjects } from './components/SideProjects';
import { Languages } from './components/Languages';
import { Certifications } from './components/Certifications';
import { LeadershipAwards } from './components/LeadershipAwards';
import { HomelabPage } from './components/HomelabPage';
import { TripPage } from './components/TripPage';
import { TripsPage } from './components/TripsPage';
import { tripForPath } from './data/trips';
import { HomePage } from './components/HomePage';
import { Footer } from './components/Footer';

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

interface AppProps {
  /** Pathname used for SSR / prerender; client falls back to location. */
  path?: string;
}

function CvPage() {
  return (
    <>
      <SiteNav current="/cv/" />
      <Hero profile={cv.profile} showDownload />

      <main>
        <Profile profile={cv.profile} />
        <WorkExperience data={cv.work} />
        <Internships items={cv.internships} />
        <SideProjects items={cv.sideProjects} />
        <Education data={cv.education} />
        <Languages items={cv.languages} />
        <Certifications items={cv.certifications} />
        <LeadershipAwards items={cv.awards} />
      </main>

      <Footer />
    </>
  );
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

  const trip = tripForPath(normalizePath(pathname));
  if (trip) {
    return <TripPage trip={trip} />;
  }

  return <HomePage />;
}
