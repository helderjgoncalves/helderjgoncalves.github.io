import { cv } from '../data/cv';
import { Certifications } from './Certifications';
import { Education } from './Education';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Internships } from './Internships';
import { Languages } from './Languages';
import { LeadershipAwards } from './LeadershipAwards';
import { Profile } from './Profile';
import { SideProjects } from './SideProjects';
import { SiteNav } from './SiteNav';
import { WorkExperience } from './WorkExperience';

export function CvPage() {
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
