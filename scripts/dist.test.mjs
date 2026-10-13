// Verifies that the built site in dist/ describes the routes it claims to, and
// that the bundled stylesheet still reaches every engine.
//
// `tsc -b` proves the source compiles and the SSR build proves <App /> renders
// without throwing. Neither notices when a route ships another route's
// canonical, when the root div comes out empty, when sitemap.xml disagrees
// with the pages sitting next to it, or when the CSS minifier drops a
// declaration one browser needs. Those ship green and only surface weeks
// later in Search Console or in a screenshot from someone else's browser, so
// they get asserted here instead.
//
// Runs against build output, so `npm run build` must come first (see `npm test`
// and the deploy workflow). No dependencies beyond node:test.

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

// GitHub Pages serves 404.html for unmatched paths. It is a standalone static
// file rather than a pre-rendered route, so none of the metadata rules apply.
const NOT_A_ROUTE = new Set(['404.html']);

const ROOT_OPEN = '<div id="root">';
const EMPTY_ROOT = '<div id="root"></div>';

/** @param {string} file */
function readDist(file) {
  return fs.readFile(path.join(distDir, file), 'utf-8');
}

/**
 * @param {string} dir
 * @param {string} prefix
 * @returns {Promise<string[]>} dist-relative paths, POSIX separators
 */
async function htmlFiles(dir = distDir, prefix = '') {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      out.push(...(await htmlFiles(path.join(dir, entry.name), rel)));
    } else if (entry.name.endsWith('.html') && !NOT_A_ROUTE.has(rel)) {
      out.push(rel);
    }
  }
  return out;
}

/** `index.html` → `/`, `homelab/index.html` → `/homelab/`. */
function urlPathFor(file) {
  return `/${file.replace(/(^|\/)index\.html$/, '$1')}`;
}

/**
 * Extract the single capture of `pattern`, asserting the tag appears exactly
 * once. A duplicate means a rewrite in prerender.mjs appended instead of
 * replacing, which leaves crawlers picking between two contradictory values.
 *
 * @param {{ file: string, html: string }} page
 * @param {RegExp} pattern global regex with one capture group
 * @param {string} label
 */
function tag(page, pattern, label) {
  const matches = [...page.html.matchAll(pattern)];
  assert.equal(
    matches.length,
    1,
    `${page.file}: expected exactly one ${label} tag, found ${matches.length}`,
  );
  return matches[0][1];
}

const TAGS = {
  title: /<title>([^<]*)<\/title>/g,
  canonical: /<link rel="canonical" href="([^"]*)" \/>/g,
  description: /<meta name="description" content="([^"]*)" \/>/g,
  'og:url': /<meta property="og:url" content="([^"]*)" \/>/g,
  'og:title': /<meta property="og:title" content="([^"]*)" \/>/g,
  'og:description': /<meta property="og:description" content="([^"]*)" \/>/g,
  'og:type': /<meta property="og:type" content="([^"]*)" \/>/g,
  'og:image': /<meta property="og:image" content="([^"]*)" \/>/g,
  'og:image:alt': /<meta property="og:image:alt" content="([^"]*)" \/>/g,
  'twitter:title': /<meta name="twitter:title" content="([^"]*)" \/>/g,
  'twitter:description': /<meta name="twitter:description" content="([^"]*)" \/>/g,
  'twitter:image': /<meta name="twitter:image" content="([^"]*)" \/>/g,
};

/** Everything the prerender step injected in place of the root placeholder. */
function rootMarkup(html) {
  const start = html.indexOf(ROOT_OPEN);
  const end = html.indexOf('</body>', start);
  if (start === -1 || end === -1) return '';
  return html.slice(start + ROOT_OPEN.length, end);
}

try {
  await fs.access(path.join(distDir, 'index.html'));
} catch {
  throw new Error('dist/index.html is missing — run `npm run build` before `npm test`.');
}

// The domain comes from dist/CNAME, which is what GitHub Pages actually serves
// the site on. Deriving it here rather than hard-coding keeps the metadata
// honest against the real host instead of against a second copy of the same
// guess: point the CNAME elsewhere without updating the URLs and this fails.
const site = `https://${(await readDist('CNAME')).trim()}`;

const pages = await Promise.all(
  (await htmlFiles()).sort().map(async (file) => ({
    file,
    url: urlPathFor(file),
    html: await readDist(file),
  })),
);

describe('pre-rendered routes', () => {
  test('at least the home route was built', () => {
    assert.ok(
      pages.some((p) => p.url === '/'),
      `no page mapped to "/" (found: ${pages.map((p) => p.url).join(', ') || 'none'})`,
    );
  });

  for (const page of pages) {
    describe(`${page.url} (${page.file})`, () => {
      test('canonical matches the path it is served from', () => {
        assert.equal(tag(page, TAGS.canonical, 'canonical'), `${site}${page.url}`);
      });

      test('og:url agrees with the canonical', () => {
        assert.equal(
          tag(page, TAGS['og:url'], 'og:url'),
          tag(page, TAGS.canonical, 'canonical'),
        );
      });

      test('title and description are present and mirrored into og/twitter', () => {
        const title = tag(page, TAGS.title, 'title');
        const description = tag(page, TAGS.description, 'description');

        assert.notEqual(title.trim(), '', 'title is empty');
        // Search engines truncate well before this; a description longer than
        // ~200 characters is a sign copy was pasted in rather than written.
        assert.ok(
          description.length >= 50 && description.length <= 200,
          `description should be 50–200 characters, got ${description.length}`,
        );

        assert.equal(tag(page, TAGS['og:title'], 'og:title'), title);
        assert.equal(tag(page, TAGS['twitter:title'], 'twitter:title'), title);
        assert.equal(tag(page, TAGS['og:description'], 'og:description'), description);
        assert.equal(
          tag(page, TAGS['twitter:description'], 'twitter:description'),
          description,
        );
      });

      test('social card is an absolute URL that exists in dist', async () => {
        const image = tag(page, TAGS['og:image'], 'og:image');
        assert.equal(tag(page, TAGS['twitter:image'], 'twitter:image'), image);
        assert.ok(image.startsWith(`${site}/`), `og:image is not on ${site}: ${image}`);
        assert.notEqual(tag(page, TAGS['og:image:alt'], 'og:image:alt').trim(), '');

        const asset = new URL(image).pathname.replace(/^\//, '');
        await fs.access(path.join(distDir, asset));
      });

      test('profile:* metadata only accompanies og:type=profile', () => {
        const isProfile = tag(page, TAGS['og:type'], 'og:type') === 'profile';
        const hasProfileTags = /<meta property="profile:/.test(page.html);
        assert.equal(
          hasProfileTags,
          isProfile,
          isProfile
            ? 'og:type is profile but no profile:* tags survived'
            : 'profile:* tags describe this page as a person',
        );
      });

      test('markup was pre-rendered into the root element', () => {
        assert.ok(
          !page.html.includes(EMPTY_ROOT),
          'root placeholder is still empty — prerender did not inject markup',
        );
        const markup = rootMarkup(page.html);
        assert.ok(
          markup.length > 1000,
          `only ${markup.length} characters of markup inlined; crawlers would see a near-blank page`,
        );
        assert.match(markup, /<nav\b/, 'rendered markup has no <nav>');
      });

      test('structured data parses and points at this page', () => {
        const blocks = [
          ...page.html.matchAll(
            /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
          ),
        ];
        assert.equal(blocks.length, 1, `expected one JSON-LD block, found ${blocks.length}`);

        const data = JSON.parse(blocks[0][1]);
        assert.ok(
          JSON.stringify(data).includes(`${site}${page.url}`),
          'JSON-LD never references this page’s own canonical',
        );
      });
    });
  }

  test('every route is distinct', () => {
    for (const [label, values] of [
      ['canonical', pages.map((p) => tag(p, TAGS.canonical, 'canonical'))],
      ['title', pages.map((p) => tag(p, TAGS.title, 'title'))],
      // Catches render(path) ignoring its argument and returning the home page
      // for every route — metadata would still look correct.
      ['rendered markup', pages.map((p) => rootMarkup(p.html))],
    ]) {
      assert.equal(
        new Set(values).size,
        pages.length,
        `two routes share the same ${label}`,
      );
    }
  });
});

describe('sitemap.xml', () => {
  test('lists exactly the canonicals of the built routes', async () => {
    const xml = await readDist('sitemap.xml');
    const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
    const canonicals = pages.map((p) => tag(p, TAGS.canonical, 'canonical'));

    assert.deepEqual([...locs].sort(), [...canonicals].sort());
  });

  test('lastmod is a plausible date', async () => {
    const xml = await readDist('sitemap.xml');
    const dates = [...xml.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1]);
    assert.equal(dates.length, pages.length, 'every URL needs a lastmod');

    // A day of slack: commit timestamps carry an offset, the build clock is UTC.
    const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
    for (const date of dates) {
      assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `lastmod is not a W3C date: ${date}`);
      assert.ok(Date.parse(date) <= tomorrow, `lastmod is in the future: ${date}`);
    }
  });
});

describe('photos', () => {
  // Grid tiles link to /photos/<trip>/2048/<name>; a missing large copy builds
  // cleanly and only shows up as a broken photo viewer.
  test('every /photos/ file the pages reference exists', async () => {
    for (const page of pages) {
      const refs = new Set(
        [...page.html.matchAll(/(?:src|href)="(\/photos\/[^"#?]+)"/g)].map((m) => m[1]),
      );
      for (const ref of refs) {
        await assert.doesNotReject(
          fs.access(path.join(distDir, ref)),
          `${page.url} references ${ref}, which is not in dist/`,
        );
      }
    }
  });
});

describe('robots.txt', () => {
  test('points crawlers at the generated sitemap', async () => {
    const robots = await readDist('robots.txt');
    assert.ok(
      robots.includes(`Sitemap: ${site}/sitemap.xml`),
      `robots.txt does not advertise ${site}/sitemap.xml`,
    );
  });
});

// Non-standard properties with no unprefixed counterpart to look for.
const PREFIX_ONLY = new Set(['-webkit-font-smoothing', '-moz-osx-font-smoothing']);

/** True if `prop` appears as a declaration rather than as part of a longer name. */
function declares(css, prop) {
  return new RegExp(`[{;\\s]${prop}\\s*:`).test(css);
}

describe('bundled stylesheet', () => {
  test('every vendor-prefixed declaration ships its standard property too', async () => {
    const assets = path.join(distDir, 'assets');
    const sheets = (await fs.readdir(assets)).filter((f) => f.endsWith('.css'));
    assert.ok(sheets.length > 0, 'no stylesheet in dist/assets');

    for (const sheet of sheets) {
      const css = await fs.readFile(path.join(assets, sheet), 'utf-8');
      const prefixed = new Set(
        [...css.matchAll(/[{;\s](-(?:webkit|moz|ms)-[a-z-]+)\s*:/g)].map((m) => m[1]),
      );

      for (const prop of prefixed) {
        if (PREFIX_ONLY.has(prop)) continue;
        const standard = prop.replace(/^-(?:webkit|moz|ms)-/, '');
        // Lightning CSS treats a hand-written prefix as the authored value and
        // collapses the pair, so authoring both can ship only the prefixed one.
        // Chromium implements no -webkit- aliases, so it then gets nothing.
        assert.ok(
          declares(css, standard),
          `${sheet} declares ${prop} but never ${standard} — engines without ` +
            `that prefix get no declaration at all. Author the standard ` +
            `property alone and let Lightning CSS add prefixes.`,
        );
      }
    }
  });
});
