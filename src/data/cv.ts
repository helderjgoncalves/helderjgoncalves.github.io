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
              'Led the integration of Mentor, OutSystems’ agentic AI built on large language models (LLMs), into ODC Studio, bringing an AI-assisted, conversational development workflow into the visual IDE; generally available since March 2026.',
          },
          {
            label: 'Architecture & Mentoring',
            description:
              'Own the architecture of 2 teams (12 engineers) and mentor their engineers; shape technical direction for other engineering groups through architecture guidance, design reviews and code reviews.',
          },
        ],
      },
      {
        heading: 'Reliability & Quality Engineering',
        bullets: [
          {
            label: 'Stability & Observability',
            description:
              'Led the stability programme across the IDE: built the telemetry that pinpoints high-impact failures and drove the fixes, cutting crash ratio from ~15% to ~3% (an 80% reduction); the same approach now covers hang and freeze ratios.',
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
              'Led the 2026 company-wide Design System modernization from design to production. Built its infrastructure and set the bar for what could ship, sending designs back to UX when they would not hold up in code.',
          },
          {
            label: 'Merge & Conflict Resolution',
            description:
              'Made merge granular, so edits to different parts of the same screen no longer conflict, and built automatic text merge, taking the remaining conflicts from fully manual to over 50% resolved without user intervention, with a redesigned merge UI.',
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
              'Re-architected how the desktop IDE integrates with OutSystems Developer Cloud (ODC), replacing a single backend dependency with distributed cloud services.',
          },
          {
            label: 'Incremental Platform Migration',
            description:
              'Delivered the multi-year move off Windows-only WPF with the wider team, component by component behind feature flags. The new React and TypeScript UI runs in an embedded Chromium WebView; the product never forked and gained macOS support.',
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
        'Designed and built the site end to end: UX, visual design, front end and infrastructure. React and TypeScript, pre-rendered to static HTML for SEO and shipped through a GitHub Actions pipeline that tests every build before it deploys. Photos ship as responsive AVIF, and HDR video as AV1 and HEVC, with encoder settings picked by VMAF score. The video is served from Cloudflare R2 behind cache rules and WAF rules that block hotlinking. A scheduled Cloudflare Worker trips a kill switch before storage reads leave the free tier.',
      techPills: [
        'React',
        'TypeScript',
        'Vite',
        'GitHub Actions',
        'Cloudflare R2',
        'Cloudflare Workers',
        'WAF',
        'AV1 / HEVC',
      ],
    },
    {
      title: 'Self-Hosted Home Lab',
      subtitle: 'Personal infrastructure',
      period: '2023 – Present',
      description:
        'NAS-based private cloud serving the whole family — photos, files and media (Immich, OpenCloud, Plex), running in Docker. No inbound ports: traffic arrives through Cloudflare Tunnel and a Traefik reverse proxy, with zero-trust access at the edge (OAuth, mTLS, service tokens). It also runs DNS over HTTPS and layered monitoring with alerting. The whole stack is declared in Git, so it redeploys onto fresh hardware.',
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
