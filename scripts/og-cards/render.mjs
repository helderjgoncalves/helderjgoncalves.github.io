// Renders the social-card templates in this folder to public/og/ at
// 1200x630 (the size LinkedIn, Slack, and X expect for a large image card).
//
// Deliberately shells out to an already-installed Chrome rather than adding
// Playwright/Puppeteer: this runs by hand a few times a year, and the bundle is
// meant to stay React + ReactDOM only. Not part of `npm run build` — the cards
// are committed assets, and the build fails if a page's card is missing.
//
// The photo cards (Off the clock, /trips/, one per trip) read their copy and
// photo from the data files, through a throwaway SSR bundle of entry-server,
// so a new trip needs nothing here: run this and its card appears.
//
// Usage: npm run cards   (override the binary with CHROME=/path/to/chrome)

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const publicDir = path.join(projectRoot, 'public');
const cardsDir = path.join(publicDir, 'og');

const CANDIDATES = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const chrome = CANDIDATES.find((bin) => fs.existsSync(bin));

if (!chrome) {
  console.error(
    'No Chrome/Chromium found. Set CHROME=/path/to/binary and re-run.\nLooked in:\n  ' +
      CANDIDATES.join('\n  '),
  );
  process.exit(1);
}

// Inside the project, so the bundle's bare imports (react) resolve.
const work = path.join(projectRoot, 'node_modules/.cache/og-cards');
fs.rmSync(work, { recursive: true, force: true });
execFileSync(
  path.join(projectRoot, 'node_modules/.bin/vite'),
  ['build', '--ssr', 'src/entry-server.tsx', '--outDir', work, '--logLevel', 'error'],
  { cwd: projectRoot, stdio: 'inherit' },
);
const { offTheClock, tripsPage, trips, tripCountries, largeSrc } = await import(
  pathToFileURL(path.join(work, 'entry-server.js')).href
);

/** The 2048 px JPEG every photo has, as a file URL the template can load. */
const photoUrl = (photo) => pathToFileURL(path.join(publicDir, largeSrc(photo))).href;

/** @param {{ photo: object, focus?: string }} card */
const photoQuery = ({ photo, focus }) => ({ photo: photoUrl(photo), ...(focus ? { focus } : {}) });

/** @type {{ template: string, out: string, query?: Record<string, string> }[]} */
const cards = [
  { template: 'home.html', out: 'home.jpg', query: { tag: 'CV · Home lab\nOff the clock · Trips' } },
  { template: 'home.html', out: 'cv.jpg', query: { eyebrow: 'hgoncalves.uk/cv · Curriculum vitae' } },
  { template: 'homelab.html', out: 'homelab.jpg' },
  {
    template: 'photo.html',
    out: 'off-the-clock.jpg',
    query: {
      eyebrow: 'Life',
      title: offTheClock.title,
      line: offTheClock.thesis,
      ...photoQuery(offTheClock.meta.card),
    },
  },
  {
    template: 'photo.html',
    out: 'trips.jpg',
    query: {
      eyebrow: 'Travel',
      title: tripsPage.title,
      line: tripsPage.meta.card.line,
      ...photoQuery(tripsPage.meta.card),
    },
  },
  // Like the trip page's hero: countries over the title, the cover behind.
  ...trips.map((trip) => {
    const countries = tripCountries(trip).join(' · ');
    return {
      template: 'photo.html',
      out: `trip-${trip.slug}.jpg`,
      query: { eyebrow: countries === trip.title ? '' : countries, title: trip.title, ...photoQuery(trip.cover) },
    };
  }),
];

for (const card of cards) {
  const url = pathToFileURL(path.join(__dirname, card.template));
  if (card.query) url.search = new URLSearchParams(card.query).toString();
  const dest = path.join(cardsDir, card.out);
  // Chrome only writes PNG; every card is re-encoded as JPEG below, since
  // WhatsApp may drop a link image much over 300 KB.
  const shot = path.join(work, card.out.replace(/\.jpg$/, '.png'));
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      // Lets the webfont and the photo arrive before the frame is captured;
      // without it the card can render in a fallback face.
      '--virtual-time-budget=9000',
      `--screenshot=${shot}`,
      url.href,
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] },
  );
  // Text over flat colour shows JPEG ringing sooner than a photo does.
  const quality = card.template === 'photo.html' ? '82' : '92';
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', quality, shot, '--out', dest], {
    stdio: 'ignore',
  });

  const { size } = fs.statSync(dest);
  console.log(`✓ ${card.out} (${(size / 1024).toFixed(0)} KB)`);
}

fs.rmSync(work, { recursive: true, force: true });
