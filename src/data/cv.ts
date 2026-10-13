import type { CvData } from '../types';

export const cv: CvData = {
  profile: {
    name: 'Hélder Gonçalves',
    title: 'Lead Software Engineer',
    photo: '/portrait.jpg',
    paragraphs: [
      'Over 10 years building developer tools used daily by thousands of enterprise engineers. Nearly all of it on one product — the OutSystems IDE — across four eras: its migration off Windows-only WPF onto web technologies, the reliability turnaround that followed, its adaptation into ODC Studio for the company’s cloud platform, and now Mentor, the platform’s agentic AI, inside that visual IDE.',
      'What stayed constant is changing a live product without interrupting the people who depend on it: replacing it underneath them a piece at a time behind feature toggles, and building the telemetry that says what a failure actually costs them.',
    ],
    contacts: [
      { label: 'helder@hgoncalves.uk', href: 'mailto:helder@hgoncalves.uk', icon: 'email' },
      { label: 'linkedin.com/in/helderjgoncalves', href: 'https://linkedin.com/in/helderjgoncalves', icon: 'linkedin' },
      { label: 'github.com/helderjgoncalves', href: 'https://github.com/helderjgoncalves', icon: 'github' },
    ],
  },

  work: {
    company: 'OutSystems',
    primaryTitle: 'Lead Software Engineer',
    history: [
      { title: 'Lead SWE', period: '2023 – Present' },
      { title: 'Senior SWE', period: '2020 – 2023' },
      { title: 'SWE', period: '2018 – 2020' },
      { title: 'Junior SWE', period: '2016 – 2018' },
    ],
    groups: [
      {
        heading: 'AI & Technical Direction',
        bullets: [
          {
            label: 'Mentor in ODC Studio',
            description:
              'Leading the integration of Mentor — the platform’s agentic AI — into ODC Studio: a conversational workflow inside the visual IDE, generally available since March 2026.',
          },
          {
            label: 'Architecture Guidance',
            description:
              'Guide architecture for two teams — twelve engineers — and advise engineering groups beyond them on design.',
          },
        ],
      },
      {
        heading: 'Reliability & Quality Engineering',
        bullets: [
          {
            label: 'Stability & Metrics',
            description:
              'Led a targeted initiative that cut crash ratio by roughly 80%, and built the telemetry that pinpoints high-impact failures — since extended to hangs and freezes.',
          },
          {
            label: 'SRE Practices',
            description:
              'Introduced Site Reliability Engineering practices and dark launches, so new features reach production switched off and roll out gradually.',
          },
        ],
      },
      {
        heading: 'Developer Experience',
        bullets: [
          {
            label: 'Design System Modernization',
            description:
              'Led the implementation of the 2026 modernization that took a company-wide Design System live — setting up its infrastructure, and sending designs back to UX for rework when they would not hold up in code.',
          },
          {
            label: 'Granular Merge',
            description:
              'Made merge much more granular, so edits to different parts of the same screen no longer conflict. A team initiative added text merge for what remains — from fully manual to hands-off most of the time, with a redesigned UI when a human is still needed.',
          },
          {
            label: 'Desktop Notifications',
            description:
              'Brought desktop notifications into the IDE from scratch, so it can reach developers when it is not the focused window.',
          },
        ],
      },
      {
        heading: 'Technical Architecture & Cloud Integration',
        bullets: [
          {
            label: 'Cloud Platform Client',
            description:
              'Re-architected the desktop IDE’s client integration with the OutSystems cloud platform for ODC Studio, moving it off a single backend dependency onto distributed services.',
          },
          {
            label: 'Incremental Platform Migration',
            description:
              'The WPF-to-web migration shipped component by component behind feature toggles — a React UI in an embedded WebView — so the product kept shipping instead of forking into a rewrite. Multi-year team effort; that unlocked macOS support.',
          },
        ],
      },
    ],
    techPills: ['React', 'TypeScript', '.NET', 'AWS', 'Snowflake'],
  },

  internships: [
    {
      title: 'Software Developer Internship',
      organisation: 'TU Darmstadt',
      period: 'January – August 2016',
      paragraphs: [
        'Selected for an Erasmus+ exchange at TU Darmstadt’s Institute for Scientific Computing, developing optimised software modules for post-quantum cryptography research, including an Arithmetic Multiple Precision library that outperformed the GMP library in key operations.',
        'Parallelised and optimised lattice basis reduction algorithms (LLL and Qiao’s Jacobi method) to accelerate cryptographic computations.',
        'Work formed the basis of my MSc thesis at Universidade do Minho.',
      ],
      techPills: ['C', 'Intel Intrinsics', 'OpenMP', 'Assembly'],
    },
    {
      title: 'Summer Internship in Advanced Computing Research',
      organisation: 'UT Austin',
      period: 'July – August 2015',
      paragraphs: [
        'Built a multithreaded C++ framework for the GUIDE project (Graph Unified Irregular Distributed Environment), enabling parallel and distributed operations over complex graph structures.',
      ],
      techPills: ['C++', 'Multithreading'],
    },
  ],

  education: {
    degree: 'BSc. and MSc. in Informatics Engineering',
    institution: 'Universidade do Minho',
    period: '2011 – 2016',
    coursework:
      'Parallel and Distributed Computing, Distributed Systems & Cryptography, Computer Graphics.',
    thesis: {
      title: 'Towards an efficient lattice basis reduction implementation',
      advisors: 'Prof. Alberto Proença, Artur Mariano',
    },
  },

  sideProjects: [
    {
      title: 'Self-Hosted Home Lab',
      subtitle: 'Personal infrastructure (ongoing)',
      description:
        'NAS-based private cloud serving the whole family — photos, files and media (Immich, OpenCloud, Plex), running in Docker. No inbound ports: traffic arrives through Cloudflare Tunnel and a Traefik reverse proxy, with zero-trust access at the edge (OAuth, mTLS, service tokens), DNS over HTTPS, and layered monitoring with alerting. The whole stack is declared in Git, so it redeploys onto fresh hardware.',
      techPills: [
        'Docker',
        'Cloudflare Zero Trust',
        'Traefik',
        'mTLS',
        'OAuth',
        'DNS over HTTPS',
        'Configuration-as-Code',
      ],
      caseStudyHref: '/homelab/',
    },
  ],

  languages: ['Portuguese (native)', 'English (fluent)'],

  certifications: [
    { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', code: 'CLF-C01' },
    { name: 'Certified SCRUM Developer', issuer: 'Scopphu', code: 'CSD' },
  ],

  awards: [
    {
      title: 'Top Performer Award',
      context: 'OutSystems',
      year: 2023,
      description: 'Company-wide recognition for delivering high-impact technical results.',
    },
  ],
};
