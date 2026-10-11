import { cv } from './data/cv';
import { Nav } from './components/Nav';
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
import { TravelGlance } from './components/TravelGlance';
import { TravelPage } from './components/TravelPage';
import { Footer } from './components/Footer';

export function normalizePath(path: string): string {
  if (!path || path === '/') return '/';
  const trimmed = path.replace(/\/+$/, '');
  return trimmed || '/';
}

export function isHomelabPath(path: string): boolean {
  return normalizePath(path) === '/homelab';
}

export function isTravelPath(path: string): boolean {
  return normalizePath(path) === '/travel';
}

interface AppProps {
  /** Pathname used for SSR / prerender; client falls back to location. */
  path?: string;
}

function HomePage() {
  return (
    <>
      <Nav />
      <Hero profile={cv.profile} />

      <main>
        <Profile profile={cv.profile} />
        <WorkExperience data={cv.work} />
        <Internships items={cv.internships} />
        <SideProjects items={cv.sideProjects} />
        <Education data={cv.education} />
        <Languages items={cv.languages} />
        <Certifications items={cv.certifications} />
        <LeadershipAwards items={cv.awards} />
        <TravelGlance />
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

  if (isTravelPath(pathname)) {
    return <TravelPage />;
  }

  return <HomePage />;
}
