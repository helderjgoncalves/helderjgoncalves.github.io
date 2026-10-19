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
    ['Programming', 'TypeScript, JavaScript, React, Node.js, C#, .NET, Avalonia, HTML, CSS, SCSS, C, C++'],
    ['Testing', 'Jest, React Testing Library, unit and component testing'],
    ['Leadership', 'Technical leadership, cross-team direction, mentoring, design and code reviews, Product and UX partnership'],
    ['AI', 'Generative AI, LLM integration, agentic AI, AI-assisted developer tools'],
    ['Cloud & delivery', 'AWS, Snowflake, Cloudflare (R2, Workers, WAF, Zero Trust), CI/CD with GitHub Actions, Docker, Git'],
  ],
  staff: [
    ['Architecture', 'Software architecture, system design, distributed systems integration, REST APIs, desktop and web applications, embedded Chromium WebView (CEF / CefGlue), design systems, incremental migration'],
    ['Reliability', 'Site Reliability Engineering (SRE), telemetry and observability, crash, hang and freeze metrics, feature flags, dark launches, progressive delivery, automated testing (Jest, React Testing Library)'],
    ['AI', 'Generative AI, LLM integration, agentic AI, AI-assisted developer tools'],
    ['Programming', 'TypeScript, JavaScript, React, Node.js, C#, .NET, Avalonia, HTML, CSS, SCSS, C, C++'],
    ['Leadership', 'Technical leadership, cross-team technical direction, mentoring, design and code reviews'],
    ['Cloud & delivery', 'AWS, Snowflake, Cloudflare (R2, Workers, WAF, Zero Trust), CI/CD with GitHub Actions, Docker, Git'],
  ],
  lead: [
    ['Programming', 'TypeScript, JavaScript, React, Node.js, C#, .NET, Avalonia, HTML, CSS, SCSS, C, C++'],
    ['Testing', 'Jest, React Testing Library, unit and component testing'],
    ['Leadership', 'Technical leadership, team leadership, mentoring, design and code reviews, cross-team collaboration with Product and UX'],
    ['AI', 'Generative AI, LLM integration, agentic AI, AI-assisted developer tools'],
    ['Practices', 'Software architecture, REST APIs, embedded Chromium WebView (CEF / CefGlue), design systems, Site Reliability Engineering (SRE), telemetry and observability, feature flags, dark launches, incremental migration'],
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
  ['50%+', 'conflicts auto-resolved'],
  ['2 teams', '12 engineers led'],
];

// The site's contact icons (src/components/Icon.tsx), as plain SVG.
const iconPaths = {
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v8M8 7v.01M12 18v-5a2 2 0 0 1 4 0v5M12 13v5"/>',
  github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fullTitle = (t) => t.replace(/\bSWE\b/, 'Software Engineer');
const yearOnly = (p) => [...new Set(p.match(/\d{4}/g))].join(' – ');
const portrait = pathToFileURL(path.join(here, '../../public/portrait.jpg')).href;

// Every block sits on one grid: a narrow meta column (dates, labels) and the
// content column. Title and company stay on separate lines: parsers need both.
const entry = (meta, body, cls = '') => `<div class="entry ${cls}"><div class="meta">${meta}</div><div class="body">${body}</div></div>`;
const head = (what, org) => `<div class="what">${what}</div>${org ? `<div class="org">${esc(org)}</div>` : ''}`;
const stack = (items) => `<p class="stack"><span>Stack</span> ${items.map(esc).join(' · ')}</p>`;
const projectTitle = (p) => {
  const named = p.title.match(/^(.*) \(([a-z0-9.-]+\.[a-z]+)\)$/);
  const title = named ? named[1] : p.title;
  const url = p.caseStudyHref ? `https://${website}${p.caseStudyHref}` : named && `https://${named[2]}/`;
  if (!url) return esc(title);
  const shown = url.replace(/^https:\/\//, '').replace(/\/$/, '');
  // Parsers drop a space at either edge of the link's run ("Lab(…"), so " (" stays in the title's.
  return `${esc(title)} (<a href="${url}">${esc(shown)}</a>)`;
};

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
      ? `<div class="page2"><p class="running"><b>${esc(cv.profile.name)}</b></p><p class="running">${esc(cv.profile.title)} · Page 2</p></div>`
      : '';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(cv.profile.name)} — ${esc(cv.profile.title)} CV</title>
<meta name="author" content="${esc(cv.profile.name)}">
<style>
  @page { size: A4; margin: 0 0 10mm; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0; padding: 0 13mm; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 8.9pt; line-height: 1.42; color: #2f3947;
    font-variant-ligatures: none; font-feature-settings: 'liga' 0, 'calt' 0;
  }
  a { color: inherit; text-decoration: none; }
  b, strong { font-weight: 600; color: #1c2330; }
  p { margin: 0; }
  svg { display: block; width: 100%; height: 100%; }

  /* Grid: 27mm meta column, 6mm gutter, content. */
  .entry { display: grid; grid-template-columns: 25mm 1fr; column-gap: 5mm; }
  .meta { font-size: 7.9pt; color: #8e98ab; font-variant-numeric: tabular-nums; padding-top: 1.2pt; letter-spacing: 0.1pt; }

  .bar { margin: 0 -13mm; height: 2.4mm; background: linear-gradient(90deg, #2c557f, #3a6ea5 55%, #6fa3da); }
  header { padding: 7.5mm 0 0; }
  header .entry { align-items: center; }
  header img { width: 25mm; height: 25mm; border-radius: 50%; object-fit: cover; display: block; }
  h1 { font-size: 27pt; font-weight: 700; letter-spacing: -0.6pt; line-height: 1; margin: 0; color: #1c2330; }
  .title { font-size: 12pt; font-weight: 500; color: #3a6ea5; margin: 4pt 0 2pt; letter-spacing: -0.1pt; }
  .tagline { font-size: 8.4pt; color: #54627a; margin: 0 0 7pt; }
  .contact { font-size: 8pt; color: #2f3947; line-height: 1.7; }
  .contact .c { display: inline-flex; align-items: center; gap: 3pt; margin-right: 9pt; white-space: nowrap; }
  .contact .i { width: 8.5pt; height: 8.5pt; color: #3a6ea5; flex: none; }

  h2 {
    display: flex; align-items: center; gap: 7pt; margin: 11pt 0 5pt; break-after: avoid;
    /* Over ~1pt of tracking, extractors read capitals as separate words ("S U M M A R Y"). */
    font-size: 8.2pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7pt; color: #3a6ea5;
  }
  h2::after { content: ''; flex: 1; height: 0.6pt; background: #d6dbe4; }

  .summary { font-size: 9.2pt; line-height: 1.47; color: #1c2330; }
  .highlights { display: flex; margin: 8pt 0 0; }
  .hl { flex: 1; padding: 1pt 0 1pt 8pt; border-left: 0.8pt solid #d6dbe4; }
  .hl:first-child { border-left: none; padding-left: 0; }
  .hl b { display: block; font-size: 15pt; font-weight: 300; color: #2c557f; letter-spacing: -0.4pt; line-height: 1.15; }
  .hl span { font-size: 7.4pt; color: #54627a; }

  .skills .entry { margin: 0 0 3pt; }
  .skills .meta { color: #2c557f; font-weight: 600; font-size: 7.9pt; }

  .what { font-size: 10.2pt; font-weight: 600; color: #1c2330; letter-spacing: -0.1pt; }
  .org { font-size: 8.8pt; font-weight: 500; color: #3a6ea5; margin: 0.5pt 0 2pt; }
  .job + .job { margin-top: 8pt; }
  .ladder .entry { margin-top: 7pt; }
  .ladder .entry:first-child { margin-top: 0; }
  .ladder .what { font-size: 9.4pt; }

  ul { margin: 2pt 0 0; padding-left: 9pt; }
  li { margin: 0 0 2pt; padding-left: 1pt; }
  li:last-child { margin-bottom: 0; }
  li::marker { color: #9cc0e8; font-size: 8pt; }
  li b { color: #1c2330; font-weight: 600; }
  .sub { color: #54627a; margin-top: 2pt; }
  .desc { margin-top: 1.5pt; }
  .stack { margin-top: 2.5pt; font-size: 7.8pt; color: #54627a; }
  .stack span { font-size: 6.8pt; font-weight: 700; letter-spacing: 0.5pt; text-transform: uppercase; color: #3a6ea5; margin-right: 3pt; }
  .what a { font-weight: 500; color: #3a6ea5; font-size: 8.8pt; }

  .running { text-align: right; font-size: 7.4pt; color: #8e98ab; }
  .running b { color: #1c2330; }
  .page2 { break-before: page; padding-top: 12mm; margin-bottom: 9pt; }
  .keep { break-inside: avoid; }
</style></head>
<body>
<div class="bar"></div>
<header>
${entry(
  v.photo ? `<img src="${portrait}" alt="">` : '',
  `<h1>${esc(cv.profile.name)}</h1>
<p class="title">${esc(cv.profile.title)}</p>
<p class="tagline">${esc(v.tagline)}</p>
${contacts.map((row) => `<p class="contact">${row.map(contact).join(' ')}</p>`).join('\n')}`,
)}
</header>

<h2>Summary</h2>
${entry('', `<p class="summary">${esc(v.summary)}</p>
<div class="highlights">${highlights.map(([n, l]) => `<div class="hl"><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join(' ')}</div>`)}

<h2>Skills</h2>
<div class="skills">
${skills[key].map(([k, s]) => entry(`${esc(k)}:`, esc(s))).join('\n')}
</div>

<h2>Experience</h2>
${entry(
  esc(current.period),
  `${head(esc(fullTitle(current.title)), cv.work.company)}
<ul>
${v.bullets.map((b, i) => `<li><b>${esc(v.labels[i])}:</b> ${esc(b)}</li>`).join('\n')}
</ul>`,
  'job',
)}
${page2('earlier')}
<div class="keep ladder">
${earlier.map((r) => entry(esc(r.period), head(esc(fullTitle(r.title)), cv.work.company))).join('\n')}
</div>

<div class="keep">
<h2>Internships</h2>
${cv.internships
  .map((i) =>
    entry(
      esc(yearOnly(i.period)),
      `${head(esc(i.title), i.organisation)}
<ul>${i.paragraphs.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`,
      'job',
    ),
  )
  .join('\n')}
</div>

<div class="keep">
<h2>Education</h2>
${entry(
  esc(ed.period),
  `${head(`${esc(ed.institution)} (University of Minho)`, 'Master’s (MSc) and Bachelor’s (BSc) in Informatics Engineering')}
<p class="sub">Thesis: ${esc(ed.thesis.title)}. Coursework: ${esc(ed.coursework)}</p>`,
)}
</div>

<div class="keep">
<h2>Projects</h2>
${cv.sideProjects
  .map((p) =>
    entry(
      esc(p.period),
      `<div class="what">${projectTitle(p)}</div>
<p class="desc">${esc(p.description)}</p>
${stack(p.techPills)}`,
      'job',
    ),
  )
  .join('\n')}
</div>

<div class="keep">
<h2>Certifications &amp; Awards</h2>
${cv.certifications.map((c) => entry(esc(c.code), `${esc(c.name)}, ${esc(c.issuer)}`)).join('\n')}
${cv.awards.map((a) => entry(String(a.year), `<b>${esc(a.title)}</b>, ${esc(a.context)}: ${esc(a.description)}`)).join('\n')}
</div>

<div class="keep">
<h2>Languages</h2>
${entry('', esc(cv.languages.join(', ')))}
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
