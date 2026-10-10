import type { CvData } from '../types';

export const cv: CvData = {
  profile: {
    name: 'Hélder Gonçalves',
    title: 'Lead Software Engineer',
    photo: '/portrait.jpg',
    paragraphs: [
      'Over 10 years building developer tools used daily by thousands of enterprise engineers. Nearly all of it on one product — the OutSystems IDE — across four eras: migrating it off Windows-only WPF onto web technologies, the reliability turnaround that followed, re-architecting it as ODC Studio, a client of the company’s cloud platform, and bringing Mentor, the platform’s agentic AI, into that visual IDE.',
      'What stayed constant is changing a live product without interrupting the people who depend on it: replacing it underneath them a piece at a time behind feature toggles, and building the telemetry that says what a failure actually costs them.',
    ],
    contacts: [
      { label: 'helderjgoncalves@proton.me', href: 'mailto:helderjgoncalves@proton.me', icon: 'email' },
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
            label: 'Team Architecture',
            description:
              'Advise two teams — twelve engineers — on architecture and technical direction.',
          },
          {
            label: 'Cross-Team Architecture',
            description:
              'Advise other engineering groups on architecture and design, beyond the teams I sit on.',
          },
        ],
      },
      {
        heading: 'Reliability & Quality Engineering',
        bullets: [
          {
            label: 'Stability & Metrics',
            description:
              'Led a targeted initiative that cut crash ratio by roughly 80%, and built the telemetry that pinpoints high-impact failures.',
          },
          {
            label: 'Hang & Freeze Signals',
            description:
              'Extended that telemetry to hang and freeze ratios, so the product treats those as reliability signals beyond outright crashes.',
          },
          {
            label: 'SRE Practices',
            description:
              'Introduced Site Reliability Engineering practices and dark launches, balancing feature velocity with a resilient core product.',
          },
        ],
      },
      {
        heading: 'Developer Experience',
        bullets: [
          {
            label: 'Bridging UX & Engineering',
            description:
              'Review designs for technical feasibility and propose architectural alternatives that keep the user experience without inflating engineering cost.',
          },
          {
            label: 'Design System Modernization',
            description:
              'Led a modernization initiative that took a company-wide Design System live in 2026, preparing the infrastructure behind it so teams share reusable components across the product.',
          },
          {
            label: 'Granular Merge',
            description:
              'Made merge much more granular, so edits to different parts of the same screen no longer conflict. A team initiative added text merge for remaining cases — from fully manual to hands-off in most cases, with a redesigned UI when a human is still needed.',
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
        'NAS-based private cloud serving the whole family with self-hosted services (Immich, Plex / Plexamp, OpenCloud), most running in Docker containers managed via Dockge, exposed through Cloudflare Tunnel and a Traefik reverse proxy. Custom DNS via AdGuard Home, resolving upstream over DoH, with local rewrites mapping public hostnames to internal services. Zero-trust access enforced with mTLS, OAuth, service tokens, and Cloudflare Access policies; HTTPS everywhere; uptime monitoring and alerting. Full stack declaratively configured and versioned in Git for reproducibility.',
      techPills: [
        'Docker',
        'Cloudflare Zero Trust',
        'AdGuard Home',
        'DNS over HTTPS',
        'mTLS',
        'OAuth',
        'Traefik',
        'Configuration-as-Code',
        'Self-Hosted',
        'Observability',
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
      description: 'Company-wide recognition for delivering high-impact technical results.',
    },
  ],
};
