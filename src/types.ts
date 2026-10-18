// Shared type definitions for the CV data model.

export interface ContactLink {
  label: string;
  href: string;
  icon: 'email' | 'phone' | 'linkedin' | 'github' | 'website';
}

export interface ProfileData {
  name: string;
  title: string;
  photo: string;
  paragraphs: string[];
  contacts: ContactLink[];
}

export interface ExperienceGroup {
  heading: string;
  bullets: { label: string; description: string }[];
}

export interface RoleHistoryEntry {
  title: string;
  period: string;
}

export interface WorkExperience {
  company: string;
  logo?: string;
  primaryTitle: string;
  history: RoleHistoryEntry[];
  groups: ExperienceGroup[];
  techPills: string[];
}

export interface Internship {
  title: string;
  organisation: string;
  period: string;
  paragraphs: string[];
  techPills: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  coursework: string;
  thesis?: {
    title: string;
    advisors?: string;
  };
}

export interface SideProject {
  title: string;
  subtitle: string;
  period: string;
  description: string;
  techPills: string[];
  /** Primary CTA — typically the case-study page on this site. */
  caseStudyHref?: string;
  /** Secondary CTA — typically the source repository. */
  href?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year?: number;
  code?: string;
}

export interface Award {
  title: string;
  context: string;
  year?: number;
  description?: string;
}

export interface CvData {
  profile: ProfileData;
  work: WorkExperience;
  internships: Internship[];
  education: EducationEntry;
  sideProjects: SideProject[];
  languages: string[];
  certifications: Certification[];
  awards: Award[];
}
