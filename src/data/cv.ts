import type { CvData } from '../types';

export const cv: CvData = {
  profile: {
    name: 'Hélder Gonçalves',
    title: 'Lead Software Engineer',
    photo: '/portrait.jpg',
    paragraphs: [
      'Lead Software Engineer with 10+ years building developer tools in React, TypeScript and .NET, used daily by thousands of enterprise developers. I lead architecture and mentoring for 2 teams (12 engineers) and shape technical direction for other engineering groups.',
      'I lead long-running, product-wide initiatives: a reliability programme that cut the OutSystems IDE’s crash ratio from ~15% to ~3%, the company-wide Design System modernization, the IDE’s move onto OutSystems Developer Cloud (ODC) services, and the Generative AI integration of Mentor, OutSystems’ LLM-based agentic AI, generally available in ODC Studio since March 2026.',
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
        heading: 'AI & Technical Leadership',
        bullets: [
          {
            label: 'Generative AI Integration',
            description:
              'Led the integration of Mentor, OutSystems’ LLM-based agentic AI, into ODC Studio: conversational, AI-assisted development in the visual IDE, live since March 2026.',
          },
          {
            label: 'Architecture & Mentoring',
            description:
              'Own the architecture of 2 teams (12 engineers) and mentor their engineers; guide other engineering groups through architecture, design and code reviews.',
          },
        ],
      },
      {
        heading: 'Reliability & Quality Engineering',
        bullets: [
          {
            label: 'Stability & Observability',
            description:
              'Built the telemetry that pinpoints the IDE’s high-impact failures and led the fixes: crash ratio from ~15% to ~3% (80% lower). The approach now covers hangs and freezes.',
          },
          {
            label: 'SRE & Progressive Delivery',
            description:
              'Introduced Site Reliability Engineering (SRE) practices and dark launches, so the teams ship to production continuously behind feature flags and roll out gradually.',
          },
        ],
      },
      {
        heading: 'Developer Experience',
        bullets: [
          {
            label: 'Design System Modernization',
            description:
              'Led the 2026 company-wide Design System modernization from design to production: built its infrastructure and set the bar for what could ship, sending designs back to UX when they would not hold up in code.',
          },
          {
            label: 'Merge & Conflict Resolution',
            description:
              'Made merge granular, so edits to different parts of the same screen no longer conflict; automatic text merge now resolves over 50% of the rest, in a redesigned merge UI.',
          },
          {
            label: 'Desktop Notifications',
            description:
              'Designed and built desktop notifications into the IDE from scratch, giving it a channel to reach developers outside its own window.',
          },
        ],
      },
      {
        heading: 'Technical Architecture & Cloud Integration',
        bullets: [
          {
            label: 'Cloud Platform Client',
            description:
              'Re-architected the desktop IDE’s integration with OutSystems Developer Cloud (ODC), from a single backend dependency to distributed cloud services.',
          },
          {
            label: 'Incremental Platform Migration',
            description:
              'With the wider team, made the multi-year move off Windows-only WPF to React and TypeScript in an embedded Chromium WebView, component by component behind feature flags, never forking; it gained macOS.',
          },
        ],
      },
    ],
    techPills: [
      'React',
      'TypeScript',
      'Node.js',
      '.NET',
      'C#',
      'Generative AI',
      'LLMs',
      'Jest',
      'Feature Flags',
      'Telemetry',
      'AWS',
      'Snowflake',
    ],
  },

  internships: [
    {
      title: 'Software Developer Internship',
      organisation: 'TU Darmstadt',
      period: 'Jan 2016 – Aug 2016',
      paragraphs: [
        'Selected for an Erasmus+ exchange at TU Darmstadt’s Institute for Scientific Computing. Developed optimised software modules for post-quantum cryptography research, including an Arithmetic Multiple Precision library that outperformed GMP in key operations.',
        'Parallelised and optimised lattice basis reduction algorithms (LLL and Qiao’s Jacobi method) to accelerate cryptographic computations.',
        'Formed the basis of the MSc thesis at Universidade do Minho.',
      ],
      techPills: ['C', 'Intel Intrinsics', 'OpenMP', 'Assembly'],
    },
    {
      title: 'Summer Internship in Advanced Computing Research',
      organisation: 'UT Austin',
      period: 'Jul 2015 – Aug 2015',
      paragraphs: [
        'Built a multithreaded C++ framework at UT Austin for the GUIDE project (Graph Unified Irregular Distributed Environment), enabling parallel and distributed operations over complex graph structures.',
      ],
      techPills: ['C++', 'Multithreading'],
    },
  ],

  education: {
    degree: 'MSc and BSc in Informatics Engineering',
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
      title: 'Personal Website and Travel Guide (hgoncalves.uk)',
      subtitle: 'Product, design and infrastructure, built solo',
      period: '2026 – Present',
      description:
        'React and TypeScript, pre-rendered to static HTML for SEO, with post-build tests in CI that block a broken deploy. Serverless backend on Cloudflare Workers: a contact form with layered spam protection, and media on R2 behind WAF rules and a cost guard that cuts it off before it leaves the free tier.',
      techPills: [
        'React',
        'TypeScript',
        'Vite',
        'GitHub Actions',
        'Cloudflare Workers',
        'Cloudflare R2',
        'WAF',
      ],
      href: 'https://github.com/helderjgoncalves/helderjgoncalves.github.io',
    },
    {
      title: 'Self-Hosted Home Lab',
      subtitle: 'Personal infrastructure',
      period: '2023 – Present',
      description:
        'Private cloud for the family’s photos, files and media, in Docker on a NAS. No inbound ports: Cloudflare Tunnel and Traefik, with zero-trust access at the edge (OAuth, mTLS). Monitored with alerting, and declared in Git, so it redeploys onto fresh hardware.',
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
      href: 'https://github.com/helderjgoncalves/Homelab-Infrastructure',
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
