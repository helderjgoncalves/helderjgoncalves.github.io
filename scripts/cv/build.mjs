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
    ['Leadership', 'Technical leadership, cross-team technical direction, mentoring, design and code reviews, collaboration with Product and UX'],
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
    file: path.join(here, '../../public/helder-goncalves-cv.pdf'),
    page2: 'earlier',
    tagline: 'Software Architecture · Technical Leadership · Reliability · Generative AI',
    summary:
      'Lead Software Engineer with 10+ years building developer tools in React, TypeScript and .NET, used daily by thousands of enterprise developers. Lead architecture and mentoring for 2 teams (12 engineers) and shape technical direction for other engineering groups. Led product-wide initiatives: a reliability programme that cut the IDE’s crash ratio from ~15% to ~2–3%, the company-wide Design System modernization, the IDE’s move onto OutSystems Developer Cloud (ODC) services, and the Generative AI integration of Mentor into ODC Studio (generally available March 2026).',
    // The site's own bullets, so the download mirrors the /cv/ page.
    bullets: cv.work.groups.flatMap((g) => g.bullets.map((b) => b.description)),
  },
  staff: {
    file: path.join(here, 'out/helder-goncalves-cv-staff.pdf'),
    page2: 'earlier',
    tagline: 'Software Architecture · Developer Platforms · Reliability · Generative AI',
    summary:
      'Lead Software Engineer with 10+ years shaping the architecture of developer tools used daily by thousands of enterprise developers. Core stack: React, TypeScript and .NET. Own the architecture of 2 teams (12 engineers) and guide design for other engineering groups. Led product-wide initiatives: a reliability programme that cut crash ratio from ~15% to ~2–3%, a company-wide Design System, and the IDE’s move onto distributed cloud services. Led the Generative AI integration of Mentor, OutSystems’ LLM-based agentic AI, into ODC Studio (generally available March 2026).',
    bullets: [
      'Own the architecture of 2 teams (12 engineers) and shape technical direction for other engineering groups through architecture guidance, design reviews and code reviews.',
      'Led the stability programme across the IDE, building the telemetry that pinpoints high-impact failures; crash ratio fell from ~15% to ~2–3% (80%+ reduction), and the same approach now covers hang and freeze ratios.',
      'Re-architected how the desktop IDE integrates with OutSystems Developer Cloud (ODC), replacing a single backend dependency with distributed cloud services.',
      'Led the integration of Mentor, OutSystems’ agentic AI built on large language models (LLMs), into ODC Studio, bringing an AI-assisted, conversational development workflow into the visual IDE; generally available since March 2026.',
      'Delivered the multi-year move off Windows-only WPF with the wider team, component by component behind feature flags. The new React and TypeScript UI runs in an embedded Chromium WebView; the product never forked and gained macOS support.',
      'Led the 2026 company-wide Design System modernization from design to production. Built its infrastructure and set the bar for what could ship, sending designs back to UX when they would not hold up in code.',
      'Introduced Site Reliability Engineering (SRE) practices and dark launches to the product, so features reach production behind feature flags and roll out gradually.',
      'Redesigned merge to work at a finer grain, so edits to different parts of the same screen no longer conflict; automatic text merge now resolves over 50% of the remaining conflicts without user intervention.',
    ],
  },
  lead: {
    file: path.join(here, 'out/helder-goncalves-cv-lead.pdf'),
    page2: 'earlier',
    tagline: 'Technical Leadership · React · TypeScript · .NET · Generative AI',
    summary:
      'Lead Software Engineer with 10+ years building developer tools used daily by thousands of enterprise developers. Core stack: React, TypeScript and .NET. Lead architecture and mentoring for 2 teams (12 engineers), shipping continuously behind feature flags. Led the stability programme that cut the OutSystems IDE’s crash ratio from ~15% to ~2–3%. Led the integration of Mentor, OutSystems’ LLM-based agentic AI, into ODC Studio (generally available March 2026). Grew from Junior to Lead at OutSystems; Top Performer Award 2023.',
    bullets: [
      'Lead architecture and mentoring for 2 teams (12 engineers): review designs and code, grow engineers, and advise other engineering groups on design.',
      'Led the integration of Mentor, OutSystems’ agentic AI built on large language models (LLMs), into ODC Studio, shipping an AI-assisted, conversational workflow in the visual IDE; generally available since March 2026.',
      'Led the stability programme that cut the IDE’s crash ratio from ~15% to ~2–3% (80%+ reduction). Built the telemetry that pinpoints high-impact failures and drove the fixes; later extended it to hang and freeze ratios.',
      'Introduced Site Reliability Engineering (SRE) practices and dark launches, so the teams ship to production continuously behind feature flags and roll out gradually.',
      'Led the implementation of the 2026 company-wide Design System: built its infrastructure and worked with UX to rework designs that would not hold up in code.',
      'Built automatic text merge: conflicts went from fully manual to over 50% resolved without user intervention. Made merge granular, so edits to different parts of a screen no longer conflict, and redesigned the merge UI.',
      'Designed and built desktop notifications into the IDE from scratch, giving it a channel to reach developers outside its own window.',
      'Migrated the IDE from Windows-only WPF to a React and TypeScript UI in an embedded Chromium WebView. Shipped component by component behind feature flags: a multi-year team effort that unlocked macOS.',
      'Re-architected the desktop IDE’s client integration with OutSystems Developer Cloud (ODC), moving it from a single backend dependency to distributed cloud services.',
    ],
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fullTitle = (t) => t.replace(/\bSWE\b/, 'Software Engineer');
const role = (what, org, when) =>
  `<div class="role"><span class="what">${esc(what)}</span><span class="when">${esc(when)}</span></div>` +
  (org ? `<div class="org">${esc(org)}</div>` : '');
const yearOnly = (p) => {
  const years = [...new Set(p.match(/\d{4}/g))];
  return years.join(' – ');
};

function render(key) {
  const v = variants[key];

  const [current, ...earlier] = cv.work.history;
  const email = cv.profile.contacts.find((c) => c.icon === 'email').label;
  const linkedin = cv.profile.contacts.find((c) => c.icon === 'linkedin').label;
  const github = cv.profile.contacts.find((c) => c.icon === 'github').label;
  const ed = cv.education;
  // Parsers that join pages glue page 2's first line onto page 1's last one,
  // so page 2 opens with a running header that can absorb it. It is two lines
  // so the next heading sits a measurable gap below a line on its own page.
  const page2 = (at) =>
    v.page2 === at
      ? `<div class="page2"><p class="running">${esc(cv.profile.name)} · Page 2</p><p class="running">${esc(email)}</p></div>`
      : '';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(cv.profile.name)} — ${esc(cv.profile.title)} CV</title>
<meta name="author" content="${esc(cv.profile.name)}">
<style>
  @page { size: A4; margin: 12mm 14mm 12mm; }
  .page2 { break-before: page; }
  .running { text-align: right; font-size: 7.5pt; color: #8e98ab; margin: 0; }
  .page2 { margin-bottom: 8pt; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 9.3pt; line-height: 1.4;
    color: #2f3947; font-variant-ligatures: none; font-feature-settings: 'liga' 0, 'calt' 0;
  }
  a { color: inherit; text-decoration: none; }
  b, strong { font-weight: 600; color: #1c2330; }

  header {
    margin: 0 0 4pt; padding: 7mm 8mm 6mm; border-radius: 7pt;
    background: linear-gradient(120deg, #2c557f 0%, #3a6ea5 60%, #4a85c2 100%); color: #fff;
  }
  h1 { font-size: 23pt; font-weight: 800; line-height: 1.1; margin: 0; color: #fff; }
  .title { font-size: 11.5pt; font-weight: 600; margin: 3pt 0 1pt; color: #fff; }
  .tagline { margin: 0 0 7pt; color: #e5edf6; }
  .contact { margin: 0; font-size: 8.6pt; color: #fff; }
  .contact .sep { color: #9cc0e8; padding: 0 4pt; }
  .nowrap { white-space: nowrap; }

  h2 {
    font-size: 10pt; font-weight: 700; text-transform: uppercase; color: #2c557f;
    margin: 9pt 0 4pt; padding-bottom: 2pt; border-bottom: 1.2pt solid #d6dbe4;
    break-after: avoid;
  }
  p { margin: 0 0 4pt; }
  ul { margin: 2pt 0 5pt; padding-left: 11pt; }
  li { margin: 0 0 2pt; padding-left: 2pt; }
  li::marker { color: #4a85c2; }

  .role { display: flex; justify-content: space-between; align-items: baseline; margin-top: 5pt; break-after: avoid; }
  .role .what { font-weight: 600; color: #1c2330; font-size: 10pt; }
  .org { color: #3a6ea5; font-weight: 500; margin: 0 0 1pt; }
  .role .when { white-space: nowrap; padding-left: 10pt; color: #54627a; font-size: 8.6pt; font-weight: 500; font-variant-numeric: tabular-nums; }
  .earlier .role { margin-top: 7pt; }
  .sub { margin: 2pt 0 2pt; color: #54627a; }
  .summary { color: #2f3947; }
  .skills p { margin: 0 0 3pt; }
  .skills b { color: #2c557f; }
  .keep { break-inside: avoid; }
</style></head>
<body>
<header>
<h1>${esc(cv.profile.name)}</h1>
<p class="title">${esc(cv.profile.title)}</p>
<p class="tagline">${esc(v.tagline)}</p>
<p class="contact">${esc(email)}<span class="sep">|</span>${key === 'web' ? '' : `<span class="nowrap">${esc(phone)}</span><span class="sep">|</span>`}<a href="https://${esc(linkedin)}">${esc(linkedin)}</a><span class="sep">|</span><a href="https://${esc(github)}">${esc(github)}</a><span class="sep">|</span><a href="https://${website}">${website}</a></p>
</header>

<h2>Summary</h2>
<p class="summary">${esc(v.summary)}</p>

<h2>Skills</h2>
<div class="skills">
${skills[key].map(([k, s]) => `<p><b>${esc(k)}:</b> ${esc(s)}</p>`).join('\n')}
</div>

<h2>Experience</h2>
${role(fullTitle(current.title), cv.work.company, current.period)}
<ul>
${v.bullets.map((b) => `<li>${esc(b)}</li>`).join('\n')}
</ul>
${page2('earlier')}
<div class="keep earlier">
${earlier.map((r) => role(fullTitle(r.title), cv.work.company, r.period)).join('\n')}</div>
${page2('internships')}
<div class="keep">
<h2>Internships</h2>
${cv.internships
  .map(
    (i) => `${role(i.title, i.organisation, yearOnly(i.period))}
<ul>${i.paragraphs.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`,
  )
  .join('\n')}
</div>

<div class="keep">
<h2>Education</h2>
${role(`${ed.institution} (University of Minho)`, '', ed.period)}
<div class="org">Master’s (MSc) and Bachelor’s (BSc) in Informatics Engineering</div>
<p class="sub">Thesis: ${esc(ed.thesis.title)}. Coursework: ${esc(ed.coursework)}</p>
</div>

<div class="keep">
<h2>Certifications</h2>
<ul>${cv.certifications.map((c) => `<li>${esc(c.name)} (${esc(c.code)}), ${esc(c.issuer)}</li>`).join('')}</ul>
</div>

<div class="keep">
<h2>Awards</h2>
<ul>${cv.awards.map((a) => `<li>${esc(a.title)}, ${esc(a.context)}, ${a.year}: ${esc(a.description)}</li>`).join('')}</ul>
</div>

<div class="keep">
<h2>Projects</h2>
${cv.sideProjects
  .map(
    (p) => `${role(p.title, '', p.period)}
<p>${esc(p.description)}</p>`,
  )
  .join('\n')}
</div>

<div class="keep">
<h2>Languages</h2>
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
