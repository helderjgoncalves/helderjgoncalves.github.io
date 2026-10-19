// Renders each route to static HTML and injects it into the matching
// dist/*.html so visitors (and crawlers) see real markup before hydration.
// Also emits dist/sitemap.xml from the same route table.
//
// Pipeline (driven by `npm run build`):
//   1. vite build                                    → dist/ (client assets + index.html)
//   2. vite build --ssr src/entry-server.tsx ...     → dist/server/entry-server.js
//   3. node scripts/prerender.mjs                    → patches HTML per route, removes dist/server

import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const ssrDir = path.join(distDir, 'server');
const ssrEntry = path.join(ssrDir, 'entry-server.js');
const templatePath = path.join(distDir, 'index.html');

const ROOT_PLACEHOLDER = '<div id="root"></div>';
const SITE = 'https://hgoncalves.uk';
const PERSON_ID = `${SITE}/#person`;

const {
  render,
  homelab,
  offTheClock,
  allPhotos,
  tripsPage,
  frontDoor,
  trips,
  sampleTrips,
  tripPath,
  tripPhotos,
  tripCountries,
  photos,
  largeSrcSet,
  hasAvif,
  avifSrc,
  largeSrc,
} = await import(pathToFileURL(ssrEntry).href);

// Photos are filed by trip (/photos/<slug>/<size>/<name>), or under other/
// when no trip shows them. The folder must agree with the trips' stops.
const tripOf = new Map();
for (const trip of trips) for (const photo of tripPhotos(trip)) tripOf.set(photo, trip.slug);
for (const [key, photo] of Object.entries(photos)) {
  const folder = tripOf.get(photo) ?? 'other';
  if (!photo.src.startsWith(`/photos/${folder}/800/`)) {
    throw new Error(`photos.${key} (${photo.src}) belongs in /photos/${folder}/: move all its sizes there.`);
  }
}

// The viewer's copies load only on click, and the AVIFs sit in srcset, so
// nothing `npm test` reads from the pre-rendered HTML would show one missing.
for (const [key, photo] of Object.entries(photos)) {
  const files = (largeSrcSet(photo)?.srcSet.split(', ') ?? []).map((candidate) => candidate.split(' ')[0]);
  if (hasAvif(photo)) files.push(avifSrc(photo.src), avifSrc(largeSrc(photo)));
  for (const file of files) {
    try {
      await fs.access(path.join(distDir, file));
    } catch {
      throw new Error(`photos.${key} has no ${file}. Make every size from the original, or mark it lowRes.`);
    }
  }
}

/**
 * Last commit date touching any of `paths`, as an ISO string. Falls back to the
 * build time when git is unavailable or the checkout is too shallow to know —
 * a slightly late `lastmod` is harmless, a missing one costs crawl scheduling.
 *
 * @param {string[]} paths
 * @returns {string}
 */
function lastModified(paths) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...paths], {
      cwd: projectRoot,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (out) return out;
  } catch {
    // Not a git checkout (e.g. a tarball build) — fall through.
  }
  return new Date().toISOString();
}

/**
 * Structured data for the case study. Derived from src/data/homelab.ts so the
 * copy still has a single home; only the schema shape lives here.
 *
 * `author`/`publisher` point at the same @id the ProfilePage on /cv/ assigns to
 * the Person, which is what ties the pages into one entity rather than
 * unrelated documents.
 *
 * @param {string} dateModified
 */
function homelabJsonLd(dateModified) {
  const url = homelab.meta.canonical;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline: homelab.title,
        name: homelab.meta.title,
        description: homelab.meta.description,
        abstract: homelab.thesis,
        url,
        image: homelab.meta.image,
        datePublished: homelab.meta.datePublished,
        dateModified,
        inLanguage: 'en-GB',
        keywords: homelab.stack.map((item) => item.name).join(', '),
        author: {
          '@type': 'Person',
          '@id': PERSON_ID,
          name: 'Hélder Gonçalves',
          url: `${SITE}/cv/`,
        },
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: homelab.title, item: url },
        ],
      },
    ],
  };
}

/**
 * ProfilePage for /cv/. The Person @id is shared with the front door and the
 * case study; the page URL is the CV, which is the profile.
 */
function profileJsonLd() {
  const url = `${SITE}/cv/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#profilepage`,
    url,
    name: 'Hélder Gonçalves — Lead Software Engineer',
    inLanguage: 'en-GB',
    mainEntity: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Hélder Gonçalves',
      alternateName: ['Helder Goncalves', 'Helder J. Goncalves'],
      givenName: 'Hélder',
      familyName: 'Gonçalves',
      jobTitle: 'Lead Software Engineer',
      description:
        'Lead Software Engineer at OutSystems: 10+ years on developer tools in React, TypeScript and .NET, IDE crash ratio cut by 80%, and Generative AI in ODC Studio.',
      url,
      image: `${SITE}/portrait.jpg`,
      email: 'mailto:helder@hgoncalves.uk',
      sameAs: [
        'https://www.linkedin.com/in/helderjgoncalves',
        'https://github.com/helderjgoncalves',
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'OutSystems',
        url: 'https://www.outsystems.com',
      },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Universidade do Minho',
        url: 'https://www.uminho.pt',
      },
      knowsAbout: [
        'Developer Tools',
        'Agentic AI',
        'Large Language Models',
        'React',
        'TypeScript',
        '.NET',
        'AWS',
        'Site Reliability Engineering',
        'Software Architecture',
        'Design Systems',
        'Technical Direction',
      ],
      knowsLanguage: [
        { '@type': 'Language', name: 'Portuguese' },
        { '@type': 'Language', name: 'English' },
      ],
    },
  };
}

/**
 * Structured data for the off-the-clock page: a photo gallery by the same
 * Person the other pages describe. Copy comes from src/data/offTheClock.ts.
 *
 * @param {string} dateModified
 */
function offTheClockJsonLd(dateModified) {
  const page = offTheClock;
  const url = page.meta.canonical;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ImageGallery',
        '@id': `${url}#gallery`,
        name: page.meta.title,
        description: page.meta.description,
        url,
        image: `${SITE}/og-off-the-clock.jpg`,
        dateModified,
        inLanguage: 'en-GB',
        author: { '@id': PERSON_ID },
        associatedMedia: allPhotos.map((photo) => ({
          '@type': 'ImageObject',
          contentUrl: `${SITE}${photo.src}`,
          caption: photo.place ? `${photo.caption} — ${photo.place}` : photo.caption,
          description: photo.alt,
          width: photo.width,
          height: photo.height,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: page.title, item: url },
        ],
      },
    ],
  };
}

/**
 * The trips index: a CollectionPage listing every trip page, by the same Person.
 * Copy comes from src/data/tripsPage.ts.
 *
 * @param {string} dateModified
 */
function tripsJsonLd(dateModified) {
  const page = tripsPage;
  const url = page.meta.canonical;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        name: page.meta.title,
        description: page.meta.description,
        url,
        image: `${SITE}/og-trips.jpg`,
        dateModified,
        inLanguage: 'en-GB',
        author: { '@id': PERSON_ID },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: trips.map((trip, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: trip.title,
            url: `${SITE}${tripPath(trip)}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: page.title, item: url },
        ],
      },
    ],
  };
}

/**
 * A trip page: a TouristTrip whose itinerary is the stops in travel order,
 * by the same Person, filed under Trips in the breadcrumb.
 *
 * @param {string} dateModified
 * @param {(typeof pages)[number]} page
 */
function tripJsonLd(dateModified, page) {
  const trip = page.trip;
  const url = page.canonical;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristTrip',
        '@id': `${url}#trip`,
        name: trip.title,
        description: page.description,
        url,
        image: tripPhotos(trip).map((photo) => `${SITE}${photo.src}`),
        dateModified,
        inLanguage: 'en-GB',
        author: { '@id': PERSON_ID },
        touristType: 'Independent traveller',
        itinerary: {
          '@type': 'ItemList',
          itemListElement: trip.stops.map((stop, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'TouristDestination',
              name: stop.name,
              containedInPlace: stop.area
                ? { '@type': 'Place', name: stop.area, containedInPlace: { '@type': 'Country', name: stop.country } }
                : { '@type': 'Country', name: stop.country },
            },
          })),
        },
        about: tripCountries(trip).map((name) => ({ '@type': 'Country', name })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: tripsPage.title, item: tripsPage.meta.canonical },
          { '@type': 'ListItem', position: 3, name: trip.title, item: url },
        ],
      },
    ],
  };
}

/** Front door. Names the person and the pages behind it; lists no services. */
function homeJsonLd() {
  const url = `${SITE}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: frontDoor.meta.title,
    description: frontDoor.meta.description,
    inLanguage: 'en-GB',
    mainEntity: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Hélder Gonçalves',
      url: `${SITE}/cv/`,
      jobTitle: 'Lead Software Engineer',
    },
  };
}

// Routing (output path, structured data, social card) belongs to the build; the
// copy belongs to the data layer. Front-door and homelab strings come from
// their data files. The CV description still lives here, beside its ProfilePage.
/**
 * @type {{
 *   path: string, out: string, title: string, description: string,
 *   canonical: string, ogType: string, image: string, imageAlt: string,
 *   sources: string[], jsonLd?: unknown, trip?: any,
 * }[]}
 */
const pages = [
  {
    path: '/',
    out: 'index.html',
    title: frontDoor.meta.title,
    description: frontDoor.meta.description,
    canonical: `${SITE}/`,
    ogType: 'website',
    image: `${SITE}/og-home.jpg`,
    imageAlt: 'Hélder Gonçalves — Lead Software Engineer at OutSystems',
    sources: [
      'src/data/frontDoor.ts',
      'src/data/trips',
      'src/components/FrontDoor.tsx',
      'public/photos',
      'index.html',
    ],
    jsonLd: 'home',
  },
  {
    path: '/cv',
    out: path.join('cv', 'index.html'),
    title: 'Hélder Gonçalves — Lead Software Engineer | Developer Tools',
    description:
      'Lead Software Engineer at OutSystems: 10+ years on developer tools in React, TypeScript and .NET, IDE crash ratio cut by 80%, and Generative AI in ODC Studio.',
    canonical: `${SITE}/cv/`,
    ogType: 'profile',
    image: `${SITE}/og-cv.jpg`,
    imageAlt: 'Curriculum vitae of Hélder Gonçalves, Lead Software Engineer at OutSystems',
    sources: ['src/data/cv.ts', 'src/components', 'src/App.tsx'],
    jsonLd: 'profile',
  },
  {
    path: '/homelab',
    out: path.join('homelab', 'index.html'),
    title: homelab.meta.title,
    description: homelab.meta.description,
    canonical: homelab.meta.canonical,
    ogType: 'article',
    image: homelab.meta.image,
    imageAlt:
      'Self-Hosted Home Lab case study — a NAS private cloud with no inbound ports and zero-trust access at the edge',
    sources: [
      'src/data/homelab.ts',
      'src/components/HomelabPage.tsx',
      'src/components/HomelabArchitecture.tsx',
    ],
    jsonLd: 'homelab',
  },
  {
    path: '/off-the-clock',
    out: path.join('off-the-clock', 'index.html'),
    title: offTheClock.meta.title,
    description: offTheClock.meta.description,
    canonical: offTheClock.meta.canonical,
    ogType: 'website',
    image: `${SITE}/og-off-the-clock.jpg`,
    imageAlt: `${offTheClock.title}. ${offTheClock.meta.card.photo.alt}`,
    sources: [
      'src/data/offTheClock.ts',
      'src/data/photos.ts',
      'src/data/trips',
      'src/components/OffTheClockPage.tsx',
      'src/components/PhotoGrid.tsx',
      'public/photos',
    ],
    jsonLd: 'offTheClock',
  },
  {
    path: '/trips',
    out: path.join('trips', 'index.html'),
    title: tripsPage.meta.title,
    description: tripsPage.meta.description,
    canonical: tripsPage.meta.canonical,
    ogType: 'website',
    image: `${SITE}/og-trips.jpg`,
    imageAlt: `${tripsPage.title}. ${tripsPage.meta.card.photo.alt}`,
    sources: [
      'src/data/tripsPage.ts',
      'src/data/trips',
      'src/data/photos.ts',
      'src/components/TripsPage.tsx',
      'public/photos',
    ],
    jsonLd: 'trips',
  },
  // One page per entry in src/data/trips/index.ts — adding a trip there is all
  // it takes for it to be built, described and listed in the sitemap.
  ...trips.map((trip) => ({
    path: tripPath(trip),
    out: path.join('trips', trip.slug, 'index.html'),
    title: trip.meta.title,
    description: trip.meta.description,
    canonical: `${SITE}${tripPath(trip)}`,
    ogType: 'article',
    image: `${SITE}/og-trip-${trip.slug}.jpg`,
    imageAlt: `${trip.title}. ${trip.cover.photo.alt}`,
    sources: [
      `src/data/trips/${trip.slug}.ts`,
      'src/data/photos.ts',
      'src/components/TripPage.tsx',
      'public/photos',
    ],
    jsonLd: 'trip',
    trip,
  })),
];

// Social cards are committed assets made by `npm run cards`, so a new trip
// has none until that runs; fail here rather than ship a broken preview.
for (const page of pages) {
  const card = path.join(distDir, new URL(page.image).pathname);
  try {
    await fs.access(card);
  } catch {
    throw new Error(`${page.path}: no social card at public${new URL(page.image).pathname}. Run \`npm run cards\`.`);
  }
}

const template = await fs.readFile(templatePath, 'utf-8');

if (!template.includes(ROOT_PLACEHOLDER)) {
  throw new Error(
    `Expected ${ROOT_PLACEHOLDER} placeholder in dist/index.html. ` +
      'Did the client build skip the root div, or did its markup change?',
  );
}

/**
 * Replace a single meta/link tag, failing loudly if the tag it targets has been
 * renamed in index.html. A silent no-op here would ship a page describing the
 * wrong route, which is the exact class of bug this script exists to avoid.
 *
 * @param {string} html
 * @param {RegExp} pattern
 * @param {string} replacement
 * @param {string} label
 */
function replaceTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`prerender: no ${label} tag matched in index.html`);
  }
  // Replacer function, not a string: copy legitimately contains `$`-prefixed
  // sequences that String.replace would otherwise treat as capture references.
  return html.replace(pattern, () => replacement);
}

/**
 * @param {string} html
 * @param {(typeof pages)[number]} meta
 * @param {string} dateModified
 */
function applyMeta(html, meta, dateModified) {
  let next = html;

  next = replaceTag(next, /<title>[^<]*<\/title>/, `<title>${meta.title}</title>`, 'title');
  next = replaceTag(
    next,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${meta.canonical}" />`,
    'canonical',
  );
  next = replaceTag(
    next,
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${meta.description}" />`,
    'description',
  );
  next = replaceTag(
    next,
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${meta.canonical}" />`,
    'og:url',
  );
  next = replaceTag(
    next,
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${meta.title}" />`,
    'og:title',
  );
  next = replaceTag(
    next,
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${meta.description}" />`,
    'og:description',
  );
  next = replaceTag(
    next,
    /<meta property="og:type" content="[^"]*" \/>/,
    `<meta property="og:type" content="${meta.ogType}" />`,
    'og:type',
  );
  next = replaceTag(
    next,
    /<meta property="og:image" content="[^"]*" \/>/,
    `<meta property="og:image" content="${meta.image}" />`,
    'og:image',
  );
  next = replaceTag(
    next,
    /<meta property="og:image:alt" content="[^"]*" \/>/,
    `<meta property="og:image:alt" content="${meta.imageAlt}" />`,
    'og:image:alt',
  );
  next = replaceTag(
    next,
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${meta.title}" />`,
    'twitter:title',
  );
  next = replaceTag(
    next,
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${meta.description}" />`,
    'twitter:description',
  );
  next = replaceTag(
    next,
    /<meta name="twitter:image" content="[^"]*" \/>/,
    `<meta name="twitter:image" content="${meta.image}" />`,
    'twitter:image',
  );
  next = replaceTag(
    next,
    /<meta name="twitter:image:alt" content="[^"]*" \/>/,
    `<meta name="twitter:image:alt" content="${meta.imageAlt}" />`,
    'twitter:image:alt',
  );

  // profile:* is only meaningful alongside og:type="profile". Leaving it on the
  // case study would describe that page as a person.
  if (meta.ogType !== 'profile') {
    next = next.replace(/\s*<meta property="profile:[^"]*" content="[^"]*" \/>/g, '');
  }

  if (meta.jsonLd) {
    // Replace the ProfilePage block (and its own comment) with this route's
    // structured data. Do not match from an earlier <!-- … --> — a greedy or
    // cross-comment match would delete the theme anti-FOIT script and the rest
    // of <head>.
    const block =
      /\s*<!--\s*\n\s*JSON-LD[\s\S]*?-->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/;
    if (!block.test(next)) {
      throw new Error('prerender: could not find the JSON-LD block to replace');
    }
    const builders = {
      home: homeJsonLd,
      profile: profileJsonLd,
      homelab: homelabJsonLd,
      offTheClock: offTheClockJsonLd,
      trips: tripsJsonLd,
      trip: tripJsonLd,
    };
    const data = JSON.stringify(builders[meta.jsonLd](dateModified, meta), null, 2);
    const script = `\n    <script type="application/ld+json">\n${data}\n    </script>`;
    next = next.replace(block, () => script);
  }

  return next;
}

const sitemapEntries = [];

for (const page of pages) {
  const dateModified = lastModified(page.sources);
  const appHtml = render(page.path);
  const withMeta = applyMeta(template, page, dateModified);
  const html = withMeta.replace(ROOT_PLACEHOLDER, `<div id="root">${appHtml}</div>`);
  const outPath = path.join(distDir, page.out);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, html);

  sitemapEntries.push({ loc: page.canonical, lastmod: dateModified.slice(0, 10) });

  const sizeKb = (Buffer.byteLength(appHtml, 'utf-8') / 1024).toFixed(1);
  console.log(`✓ Pre-rendered ${page.out} (${sizeKb} KB of inlined markup)`);
}

// Generated rather than committed so the route list has one source of truth and
// lastmod stays honest. changefreq/priority are omitted: Google has ignored
// both for years, and a wrong hint is worse than none.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </url>`)
  .join('\n')}
</urlset>
`;
await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap);
console.log(`✓ Wrote sitemap.xml (${sitemapEntries.length} URLs)`);

if (sampleTrips.length) {
  console.warn(
    `⚠ ${sampleTrips.length} trip(s) still use sample photos: ${sampleTrips.map((t) => t.slug).join(', ')}`,
  );
}

await fs.rm(ssrDir, { recursive: true, force: true });
