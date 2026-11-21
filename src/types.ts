// Shared type definitions for the CV data model.

import type { IconName } from './components/Icon';

/** A hero button that jumps to one of the page's sections. */
export interface HeroJump {
  href: string;
  label: string;
  icon: IconName;
}

export interface ContactLink {
  label: string;
  href: string;
  icon: 'email' | 'phone' | 'linkedin' | 'github' | 'website';
}

export interface ProfileData {
  name: string;
  title: string;
  /** Under the title in the PDF; the page leaves it out to keep the hero short. */
  tagline: string;
  location: string;
  /** Working hours: the PDF adds them to the location; the hero stays short without them. */
  hours: string;
  photo: string;
  paragraphs: string[];
  /** The card of figures under the profile, and the PDF's strip. */
  highlights: { value: string; label: string }[];
  contacts: ContactLink[];
}

export interface ExperienceGroup {
  heading: string;
  /**
   * `id` names a bullet so a tailored PDF can pick it.
   * `hidden` keeps a bullet on record without showing it on the site or in any PDF.
   * `links` maps a phrase of the description to a page; its first occurrence becomes the link.
   */
  bullets: { id?: string; label: string; description: string; links?: Record<string, string>; hidden?: boolean }[];
}

export interface RoleHistoryEntry {
  title: string;
  period: string;
}

export interface WorkExperience {
  company: string;
  logo?: string;
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

/** `hidden` keeps a certification on record without showing it on the site or in any PDF. */
export interface Certification {
  name: string;
  issuer: string;
  year?: number;
  code?: string;
  hidden?: boolean;
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
