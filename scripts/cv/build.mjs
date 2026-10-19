// ATS-safe CV PDFs built from src/data/cv.ts: single column, real text,
// standard headings, no images.
//
// - web: the site's download, public/helder-goncalves-cv.pdf (no phone).
// - staff, lead: tailored for applications, written to out/ (git-ignored),
//   with the phone number from phone.local (git-ignored); skipped without it.
//
// Usage: npm run cv

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cv } from '../../src/data/cv.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const phoneFile = path.join(here, 'phone.local');
const phone = fs.existsSync(phoneFile) ? fs.readFileSync(phoneFile, 'utf8').trim() : '';
const website = 'hgoncalves.uk';

const skills = {
  web: [
    ['Architecture', 'Software architecture, system design, distributed systems integration, REST APIs, embedded Chromium WebView (CEF / CefGlue), design systems, incremental migration'],
    ['Reliability', 'Site Reliability Engineering (SRE), telemetry and observability, crash, hang and freeze metrics, feature flags, dark launches, progressive delivery'],
    ['Languages & frameworks', 'TypeScript, JavaScript, React, Node.js, C#, .NET, Avalonia, HTML, CSS, SCSS, C, C++'],
    ['Testing', 'Jest, React Testing Library, unit and component testing'],
    ['Leadership', 'Technical leadership, cross-team direction, mentoring, design and code reviews, Product and UX partnership'],
    ['AI', 'Generative AI, LLM integration, agentic AI, AI-assisted developer tools'],
    ['Cloud & delivery', 'AWS, Snowflake, Cloudflare (R2, Workers, WAF, Zero Trust), CI/CD with GitHub Actions, Docker, Git'],
  ],
  staff: [
    ['Architecture', 'Software architecture, system design, distributed systems integration, REST APIs, desktop and web applications, embedded Chromium WebView (CEF / CefGlue), design systems, incremental migration'],
    ['Reliability', 'Site Reliability Engineering (SRE), telemetry and observability, crash, hang and freeze metrics, feature flags, dark launches, progressive delivery, automated testing (Jest, React Testing Library)'],
    ['AI', 'Generative AI, LLM integration, agentic AI, AI-assisted developer tools'],
    ['Languages & frameworks', 'TypeScript, JavaScript, React, Node.js, C#, .NET, Avalonia, HTML, CSS, SCSS, C, C++'],
    ['Leadership', 'Technical leadership, cross-team technical direction, mentoring, design and code reviews'],
    ['Cloud & delivery', 'AWS, Snowflake, Cloudflare (R2, Workers, WAF, Zero Trust), CI/CD with GitHub Actions, Docker, Git'],
  ],
  lead: [
    ['Languages & frameworks', 'TypeScript, JavaScript, React, Node.js, C#, .NET, Avalonia, HTML, CSS, SCSS, C, C++'],
    ['Testing', 'Jest, React Testing Library, unit and component testing'],
    ['Leadership', 'Technical leadership, team leadership, mentoring, design and code reviews, cross-team collaboration with Product and UX'],
    ['AI', 'Generative AI, LLM integration, agentic AI, AI-assisted developer tools'],
    ['Engineering practices', 'Software architecture, REST APIs, embedded Chromium WebView (CEF / CefGlue), design systems, Site Reliability Engineering (SRE), telemetry and observability, feature flags, dark launches, incremental migration'],
    ['Cloud & delivery', 'AWS, Snowflake, Cloudflare (R2, Workers, WAF, Zero Trust), CI/CD with GitHub Actions, Docker, Git'],
  ],
};

const variants = {
  web: {
    photo: true,
    file: path.join(here, '../../public/helder-goncalves-cv.pdf'),
    page2: 'earlier',
    tagline: 'Software Architecture · Technical Leadership · Reliability · Generative AI',
    summary:
      'Lead Software Engineer with 10+ years building developer tools in React, TypeScript and .NET, used daily by thousands of enterprise developers. Lead architecture and mentoring for 2 teams (12 engineers) and shape technical direction for other engineering groups. Led product-wide initiatives: a reliability programme that cut the IDE’s crash ratio from ~15% to ~3%, the company-wide Design System modernization, the IDE’s move onto OutSystems Developer Cloud (ODC) services, and the Generative AI integration of Mentor into ODC Studio (generally available March 2026).',
    // The site's own bullets, so the download mirrors the /cv/ page.
    bullets: cv.work.groups.flatMap((g) => g.bullets.map((b) => b.description)),
    labels: cv.work.groups.flatMap((g) => g.bullets.map((b) => b.label)),
  },
  staff: {
    photo: true,
    file: path.join(here, 'out/helder-goncalves-cv-staff.pdf'),
    page2: 'earlier',
    tagline: 'Software Architecture · Developer Platforms · Reliability · Generative AI',
    summary:
      'Lead Software Engineer with 10+ years shaping the architecture of developer tools used daily by thousands of enterprise developers. Core stack: React, TypeScript and .NET. Own the architecture of 2 teams (12 engineers) and guide design for other engineering groups. Led product-wide initiatives: a reliability programme that cut crash ratio from ~15% to ~3%, a company-wide Design System, and the IDE’s move onto distributed cloud services. Led the Generative AI integration of Mentor, OutSystems’ LLM-based agentic AI, into ODC Studio (generally available March 2026).',
    labels: ['Architecture Ownership', 'Stability Programme', 'Cloud Platform Client', 'Generative AI', 'Platform Migration', 'Design System', 'SRE & Progressive Delivery', 'Granular Merge'],
    bullets: [
      'Own the architecture of 2 teams (12 engineers) and shape technical direction for other engineering groups through architecture guidance, design reviews and code reviews.',
      'Led the stability programme across the IDE, building the telemetry that pinpoints high-impact failures; crash ratio fell from ~15% to ~3% (80% reduction), and the same approach now covers hang and freeze ratios.',
      'Re-architected how the desktop IDE integrates with OutSystems Developer Cloud (ODC), replacing a single backend dependency with distributed cloud services.',
      'Led the integration of Mentor, OutSystems’ agentic AI built on large language models (LLMs), into ODC Studio, bringing an AI-assisted, conversational development workflow into the visual IDE; generally available since March 2026.',
      'Delivered the multi-year move off Windows-only WPF with the wider team, component by component behind feature flags. The new React and TypeScript UI runs in an embedded Chromium WebView; the product never forked and gained macOS support.',
      'Led the 2026 company-wide Design System modernization from design to production. Built its infrastructure and set the bar for what could ship, sending designs back to UX when they would not hold up in code.',
      'Introduced Site Reliability Engineering (SRE) practices and dark launches to the product, so features reach production behind feature flags and roll out gradually.',
      'Redesigned merge to work at a finer grain, so edits to different parts of the same screen no longer conflict; automatic text merge now resolves over 50% of the remaining conflicts without user intervention.',
    ],
  },
  lead: {
    photo: true,
    file: path.join(here, 'out/helder-goncalves-cv-lead.pdf'),
    page2: 'earlier',
    tagline: 'Technical Leadership · React · TypeScript · .NET · Generative AI',
    summary:
      'Lead Software Engineer with 10+ years building developer tools used daily by thousands of enterprise developers. Core stack: React, TypeScript and .NET. Lead architecture and mentoring for 2 teams (12 engineers), shipping continuously behind feature flags. Led the stability programme that cut the OutSystems IDE’s crash ratio from ~15% to ~3%. Led the integration of Mentor, OutSystems’ LLM-based agentic AI, into ODC Studio (generally available March 2026). Grew from Junior to Lead at OutSystems; Top Performer Award 2023.',
    labels: ['Team Leadership', 'Generative AI', 'Stability Programme', 'SRE & Progressive Delivery', 'Design System', 'Merge & Conflict Resolution', 'Desktop Notifications', 'Platform Migration', 'Cloud Platform Client'],
    bullets: [
      'Lead architecture and mentoring for 2 teams (12 engineers): review designs and code, grow engineers, and advise other engineering groups on design.',
      'Led the integration of Mentor, OutSystems’ agentic AI built on large language models (LLMs), into ODC Studio, shipping an AI-assisted, conversational workflow in the visual IDE; generally available since March 2026.',
      'Led the stability programme that cut the IDE’s crash ratio from ~15% to ~3% (80% reduction). Built the telemetry that pinpoints high-impact failures and drove the fixes; later extended it to hang and freeze ratios.',
      'Introduced Site Reliability Engineering (SRE) practices and dark launches, so the teams ship to production continuously behind feature flags and roll out gradually.',
      'Led the implementation of the 2026 company-wide Design System: built its infrastructure and worked with UX to rework designs that would not hold up in code.',
      'Built automatic text merge: conflicts went from fully manual to over 50% resolved without user intervention. Made merge granular, so edits to different parts of a screen no longer conflict, and redesigned the merge UI.',
      'Designed and built desktop notifications into the IDE from scratch, giving it a channel to reach developers outside its own window.',
      'Migrated the IDE from Windows-only WPF to a React and TypeScript UI in an embedded Chromium WebView. Shipped component by component behind feature flags: a multi-year team effort that unlocked macOS.',
      'Re-architected the desktop IDE’s client integration with OutSystems Developer Cloud (ODC), moving it from a single backend dependency to distributed cloud services.',
    ],
  },
};

const highlights = [
  ['10+ years', 'building developer tools'],
  ['~15% → ~3%', 'IDE crash ratio'],
  ['50%+', 'merge conflicts auto-resolved'],
  ['2 teams', '12 engineers led'],
];

// The site's icon set (src/components/Icon.tsx), as plain SVG.
const iconPaths = {
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v8M8 7v.01M12 18v-5a2 2 0 0 1 4 0v5M12 13v5"/>',
  github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  code: '<path d="M8 7l-5 5 5 5"/><path d="M16 7l5 5-5 5"/><path d="M14 4l-4 16"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18"/>',
  lab: '<path d="M9 3h6M10 3v6L4 19a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 19l-6-10V3"/>',
  graduationCap: '<path d="M2 9l10-4 10 4-10 4z"/><path d="M6 11v4a6 6 0 0 0 12 0v-4M22 9v5"/>',
  badge: '<circle cx="12" cy="9" r="6"/><path d="M9 13l-1.5 8L12 18l4.5 3L15 13"/>',
  star: '<path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z"/>',
  spark: '<path d="M12 3.2l1.15 5.15L18.3 9.5l-5.15 1.15L12 15.8l-1.15-5.15L5.7 9.5l5.15-1.15z"/><path d="M17.6 14.8l.55 2.15 2.15.55-2.15.55-.55 2.15-.55-2.15-2.15-.55 2.15-.55z"/>',
  languages: '<path d="M4 5h7M7.5 5v2c0 4-3.5 7-3.5 7"/><path d="M5 11c1 2 4 4 7 4M13 21l5-12 5 12M14.5 17h7"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fullTitle = (t) => t.replace(/\bSWE\b/, 'Software Engineer');
const role = (what, org, when) =>
  `<div class="role"><span class="what">${esc(what)}</span><span class="when">${esc(when)}</span></div>` +
  (org ? `<div class="org">${esc(org)}</div>` : '');
const projectWithLink = (p) => {
  const url = `https://${website}${p.caseStudyHref}`;
  const shown = url.replace(/^https:\/\//, '').replace(/\/$/, '');
  return `<div class="role"><span class="what">${esc(p.title)} (<a href="${url}">${esc(shown)}</a>)</span><span class="when">${esc(p.period)}</span></div>`;
};
const yearOnly = (p) => [...new Set(p.match(/\d{4}/g))].join(' – ');
const h2 = (name, title) => `<h2><span class="ico">${icon(name)}</span>${esc(title)}</h2>`;
const pills = (items) => `<p class="pills">${items.map((t) => `<span class="pill">${esc(t)}</span>`).join(' ')}</p>`;
const portrait = pathToFileURL(path.join(here, '../../public/portrait.jpg')).href;

function render(key) {
  const v = variants[key];

  const [current, ...earlier] = cv.work.history;
  const email = cv.profile.contacts.find((c) => c.icon === 'email').label;
  const linkedin = cv.profile.contacts.find((c) => c.icon === 'linkedin').label;
  const github = cv.profile.contacts.find((c) => c.icon === 'github').label;
  const ed = cv.education;
  const contacts = [
    [['email', email], ...(key === 'web' ? [] : [['phone', phone]]), ['website', website]],
    [['linkedin', linkedin], ['github', github]],
  ];
  const contact = ([i, t]) =>
    `<span class="c"><span class="i">${icon(i)}</span>${i === 'email' || i === 'phone' ? esc(t) : `<a href="https://${esc(t)}">${esc(t)}</a>`}</span>`;
  // Parsers that join pages glue page 2's first line onto page 1's last one,
  // so page 2 opens with a running header that can absorb it. It is two lines
  // so the next heading sits a measurable gap below a line on its own page.
  const page2 = (at) =>
    v.page2 === at
      ? `<div class="page2"><p class="running"><b>${esc(cv.profile.name)}</b> · Page 2</p><p class="running">${esc(email)}</p></div>`
      : '';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(cv.profile.name)} — ${esc(cv.profile.title)} CV</title>
<meta name="author" content="${esc(cv.profile.name)}">
<style>
  @page { size: A4; margin: 0 0 11mm; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0; padding: 0 14mm; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 9.2pt; line-height: 1.4;
    color: #2f3947; font-variant-ligatures: none; font-feature-settings: 'liga' 0, 'calt' 0;
  }
  a { color: inherit; text-decoration: none; }
  b, strong { font-weight: 600; color: #1c2330; }
  p { margin: 0 0 4pt; }
  svg { display: block; width: 100%; height: 100%; }

  header {
    margin: 0 -14mm; padding: 8mm 14mm 6.5mm; display: flex; align-items: center; gap: 6mm; color: #fff;
    background: linear-gradient(115deg, #234a73 0%, #3a6ea5 58%, #5a93cc 100%);
  }
  header img { width: 25mm; height: 25mm; border-radius: 6pt; object-fit: cover; flex: none; border: 1.5pt solid rgba(255,255,255,0.55); }
  h1 { font-size: 25pt; font-weight: 700; letter-spacing: -0.3pt; line-height: 1.05; margin: 0; color: #fff; }
  .title { font-size: 12pt; font-weight: 500; margin: 3pt 0 1pt; color: #fff; }
  .tagline { margin: 0 0 6pt; color: #cfe0f3; font-size: 8.8pt; }
  .contact { margin: 0 0 1.5pt; font-size: 8.4pt; color: #fff; }
  .contact .c { display: inline-flex; align-items: center; gap: 2.5pt; margin-right: 10pt; white-space: nowrap; }
  .contact .c span.i { width: 9pt; height: 9pt; color: #bcd5ee; flex: none; }

  .running { text-align: right; font-size: 7.5pt; color: #8e98ab; margin: 0; }
  .running b { color: #3a6ea5; }
  .page2 { break-before: page; padding-top: 11mm; margin-bottom: 8pt; }

  h2 {
    display: flex; align-items: center; gap: 6pt; margin: 9pt 0 4.5pt; break-after: avoid;
    font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7pt; color: #2c557f;
  }
  h2::after { content: ''; flex: 1; height: 1pt; background: #d6dbe4; }
  h2 .ico { width: 15pt; height: 15pt; border-radius: 50%; background: #3a6ea5; color: #fff; padding: 3.2pt; flex: none; }

  .highlights { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5pt; margin: 7pt 0 0; }
  .hl { background: #eef4fb; border-left: 2.5pt solid #3a6ea5; border-radius: 3pt; padding: 4pt 7pt; }
  .hl b { display: block; font-size: 12pt; font-weight: 700; color: #2c557f; line-height: 1.2; }
  .hl span { font-size: 7.8pt; color: #54627a; }

  .skills p { margin: 0 0 2.5pt; }
  .skills b { color: #2c557f; }

  ul { margin: 2pt 0 4pt; padding-left: 11pt; }
  li { margin: 0 0 1.8pt; padding-left: 2pt; }
  li::marker { color: #4a85c2; }
  li b { color: #1c2330; }

  .tl { margin-left: 4pt; padding-left: 13pt; border-left: 1.4pt solid #cfdcec; }
  /* Positioned elements are painted, and so written to the PDF, after everything
     else, which moves their text out of reading order; the dots stay in flow. */
  .tl .role::before {
    content: ''; flex: none; align-self: center; width: 8pt; height: 8pt; margin: 0 8.9pt 0 -16.9pt;
    border-radius: 50%; background: #fff; border: 2.2pt solid #3a6ea5; box-sizing: border-box;
  }
  .ladder .role::before { width: 5pt; height: 5pt; margin: 0 10.4pt 0 -15.4pt; border: none; background: #8fb2d8; }
  .role { display: flex; align-items: baseline; margin-top: 7pt; break-after: avoid; }
  .role .what { margin-right: auto; }  .tl > .role:first-child { margin-top: 0; }
  .role .what { font-weight: 600; color: #1c2330; font-size: 10.2pt; }
  .role .when { white-space: nowrap; padding-left: 10pt; color: #54627a; font-size: 8.6pt; font-weight: 500; font-variant-numeric: tabular-nums; }
  .org { color: #3a6ea5; font-weight: 600; margin: 0 0 1pt; font-size: 8.9pt; }
  .sub { margin: 2pt 0 2pt; color: #54627a; }

  .pills { margin: 1pt 0 3pt; line-height: 1.8; }
  .pill { background: #e6eff9; color: #2c557f; border-radius: 8pt; padding: 1.2pt 6pt; font-size: 7.6pt; font-weight: 600; white-space: nowrap; }

  .keep { break-inside: avoid; }
</style></head>
<body>
<header>
${v.photo ? `<img src="${portrait}" alt="">` : ''}
<div>
<h1>${esc(cv.profile.name)}</h1>
<p class="title">${esc(cv.profile.title)}</p>
<p class="tagline">${esc(v.tagline)}</p>
${contacts.map((row) => `<p class="contact">${row.map(contact).join(' ')}</p>`).join('\n')}
</div>
</header>

${h2('user', 'Summary')}
<p>${esc(v.summary)}</p>
<div class="highlights">${highlights.map(([n, l]) => `<div class="hl"><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join(' ')}</div>

${h2('code', 'Skills')}
<div class="skills">
${skills[key].map(([k, s]) => `<p><b>${esc(k)}:</b> ${esc(s)}</p>`).join('\n')}
</div>

${h2('briefcase', 'Experience')}
<div class="tl">
${role(fullTitle(current.title), cv.work.company, current.period)}
<ul>
${v.bullets.map((b, i) => `<li><b>${esc(v.labels[i])}:</b> ${esc(b)}</li>`).join('\n')}
</ul>
</div>
${page2('earlier')}
<div class="keep tl ladder">
${earlier.map((r) => role(fullTitle(r.title), cv.work.company, r.period)).join('\n')}</div>
${page2('internships')}
<div class="keep">
${h2('lab', 'Internships')}
<div class="tl">
${cv.internships
  .map(
    (i) => `${role(i.title, i.organisation, yearOnly(i.period))}
<ul>${i.paragraphs.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`,
  )
  .join('\n')}
</div>
</div>

<div class="keep">
${h2('graduationCap', 'Education')}
<div class="tl">
${role(`${ed.institution} (University of Minho)`, '', ed.period)}
<div class="org">Master’s (MSc) and Bachelor’s (BSc) in Informatics Engineering</div>
<p class="sub">Thesis: ${esc(ed.thesis.title)}. Coursework: ${esc(ed.coursework)}</p>
</div>
</div>

<div class="keep">
${h2('spark', 'Projects')}
${cv.sideProjects
  .map(
    (p) => `${p.caseStudyHref ? projectWithLink(p) : role(p.title, '', p.period)}
<p>${esc(p.description)}</p>
${pills(p.techPills)}`,
  )
  .join('\n')}
</div>

<div class="keep">
${h2('badge', 'Certifications')}
<ul>${cv.certifications.map((c) => `<li>${esc(c.name)} (${esc(c.code)}), ${esc(c.issuer)}</li>`).join('')}</ul>
</div>

<div class="keep">
${h2('star', 'Awards')}
<ul>${cv.awards.map((a) => `<li><b>${esc(a.title)}</b>, ${esc(a.context)}, ${a.year}: ${esc(a.description)}</li>`).join('')}</ul>
</div>

<div class="keep">
${h2('languages', 'Languages')}
<p>${esc(cv.languages.join(', '))}</p>
</div>
</body></html>`;
}

fs.mkdirSync(path.join(here, 'out'), { recursive: true });
for (const key of Object.keys(variants)) {
  if (key !== 'web' && !phone) {
    console.warn(`⚠ skipped ${key}: put the phone number in ${path.relative(process.cwd(), phoneFile)}`);
    continue;
  }
  const html = path.join(os.tmpdir(), `cv-${key}.html`);
  const pdf = variants[key].file;
  const markup = render(key);
  if (key === 'web' && phone && markup.includes(phone)) throw new Error('the public CV must not carry the phone number');
  fs.writeFileSync(html, markup);
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdf}`,
    pathToFileURL(html).href,
  ], { stdio: 'ignore' });
  const pages = (fs.readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
  if (pages !== 2) throw new Error(`${path.basename(pdf)} (${key}) is ${pages} pages; it must be exactly 2`);
  console.log('wrote', path.relative(process.cwd(), pdf), `(${pages} pages)`);
}
