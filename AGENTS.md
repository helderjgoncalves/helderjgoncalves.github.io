# AGENTS.md

Guidance for AI coding agents working in this repo.

## What this is

Personal landing page for Hélder Gonçalves — a single-page React + TypeScript
site that mirrors the printed CV. Deployed as static HTML to GitHub Pages at
[helderjgoncalves.github.io](https://helderjgoncalves.github.io). The home
page is pre-rendered to static markup at build time so search engines and
crawlers see real content before hydration.

## Stack

- **React 19** + **TypeScript 7** (strict; `tsc -b` is the lint step)
- **Vite 8** (dev server, client build, SSR build)
- **SASS** with the modern `@use` module system — never reintroduce `node-sass`
  or `@import` for partials
- **Inline SVG** icons via `src/components/Icon.tsx` — do not add an icon library
- **Node ≥ 24** (matches CI; `package.json` `engines.node`)

TypeScript 7 is the native compiler: `tsc` is a Go binary delivered through
per-platform `@typescript/typescript-<os>-<arch>` optional dependencies. Never
install with `--no-optional` or `--omit=optional` — that leaves no `tsc` to run,
and CI resolves `typescript-linux-x64` from the lockfile. The old JavaScript
compiler API is also gone: `import 'typescript'` now yields only version fields,
with the real surface behind `typescript/unstable/*` subpaths. Nothing here uses
it, and it shouldn't need to.

## Common commands

```bash
npm install
npm run dev      # vite dev server at http://localhost:5173 (CSR-only)
npm run build    # tsc -b → vite build → vite SSR build → prerender → dist/
npm run preview  # serve ./dist at http://localhost:4173 (matches production)
npm run lint     # tsc -b --noEmit (no ESLint configured)
npm test         # node --test scripts/dist.test.mjs — checks ./dist (after build)
npm run cards    # re-render public/og-*.jpg from scripts/og-cards/ (manual)
```

`npm test` asserts the *build output*, not the source: per-route agreement
between canonical, `og:url` and the path the file is served from; non-empty
pre-rendered markup; one parseable JSON-LD block per page; distinct markup per
route; `sitemap.xml` listing exactly the built canonicals; `robots.txt`
advertising it; and that no vendor-prefixed CSS declaration ships without its
standard counterpart (see "Styling rules" — this one is about what the *minifier*
emits, which no source-level check can see).
The domain is read from `dist/CNAME` rather than hard-coded, so
metadata is checked against the host Pages actually serves. It needs
`npm run build` to have run first. There is no unit-test runner and no ESLint —
verification is `npm run lint`, `npm run build && npm test`, and a manual
`npm run preview` check after non-trivial changes.

## Build pipeline (important)

`npm run build` runs four steps in order — preserve this order if you touch
`package.json` or `scripts/prerender.mjs`:

1. `tsc -b` — type-check the project references
2. `vite build` — client bundle into `dist/`
3. `vite build --ssr src/entry-server.tsx --outDir dist/server` — SSR bundle
4. `node scripts/prerender.mjs` — imports `dist/server/entry-server.js`,
   renders `<App />` to a string, and replaces the literal
   `<div id="root"></div>` placeholder in `dist/index.html` with the rendered
   markup, then deletes `dist/server/`

Step 4 also owns all per-route `<head>` metadata and **generates
`dist/sitemap.xml`** from its own `pages` table — that table is the single
source of truth for which routes exist, so there is no committed sitemap to
keep in step. Its tag rewrites throw if a tag they target disappears from
`index.html`, rather than silently shipping a page that describes the wrong
route. The CI checkout uses `fetch-depth: 0` because `lastmod` and the case
study's `dateModified` come from commit dates.

`src/main.tsx` checks `rootElement.hasChildNodes()` and calls `hydrateRoot`
in production (markup present) or `createRoot().render()` in dev (root empty).
Don't break that branching when editing `main.tsx`.

## Repository layout

```
src/
  App.tsx                 # routes: / front page, /cv/, /homelab/, /off-the-clock/, /trips/, /trips/<slug>/
  main.tsx                # client entry; hydrate-or-render based on root contents
  entry-server.tsx        # SSR entry; renderToString(<App />)
  types.ts                # CvData and related interfaces
  data/cv.ts              # CV content (the /cv/ page and the front page hero)
  data/frontDoor.ts       # front page intro, door cards and meta
  data/homelab.ts         # home-lab case study
  data/photos.ts          # every photo, described once (src, alt, caption, place, size)
  data/offTheClock.ts     # hobby themes, wonders, glance and meta for /off-the-clock/
  data/tripsPage.ts       # /trips/: title and meta (the cards come from trips/)
  data/trips/             # one file per trip + index.ts (the list, checks and helpers)
  components/             # one component per CV section + page components (FrontDoor,
                          # HomelabPage, OffTheClockPage, TripsPage, TripPage), PhotoGrid, PhotoViewer,
                          # SiteNav, Hero, Icon, Section…
  hooks/useReveal.ts      # IntersectionObserver scroll-reveal
  styles/                 # SASS partials (see below)
  vite-env.d.ts
public/                   # static assets copied verbatim (favicon, portrait, og cards, robots, 404)
scripts/prerender.mjs     # post-build SSR injection + head metadata + sitemap
scripts/dist.test.mjs     # post-build assertions on dist/ (`npm test`)
scripts/og-cards/         # HTML sources for the social cards + `npm run cards`
scripts/media-worker.js   # Cloudflare Worker serving the clips from R2 (dashboard, not built)
.github/workflows/deploy.yml  # GitHub Pages deploy on push to main
index.html                # source entry (loaded by `vite dev`); pre-rendered at build
vite.config.ts            # base = '/' (user/org GitHub Pages site)
```

`dist/` is the build output and is git-ignored. Never edit it by hand.

## Editing content

**All CV copy lives in `src/data/cv.ts`** as a single typed `CvData` object.
To update a bullet, tag, role, award, etc., edit only that file. Each other
page has its own data file in `src/data/` (see the layout above). The
components in `src/components/` are presentation-only and shouldn't carry
hard-coded copy.

### Off the clock and trips

Off the clock is an overview of hobbies — travel, riding, photography — a few
photos each. Travel is one of them, so its depth lives elsewhere: `/trips/`
(`TripsPage.tsx`) is the travel index, and each trip has its own page
(`/trips/<slug>/`, `TripPage.tsx`). Don't grow Off the clock's themes into a
camera roll — add the photos to a trip instead. Trips is in the top bar and
has a front-page card; Off the clock's Travel section links to it.

- **Photos** are described once, in `src/data/photos.ts`. Pages pick from that
  catalogue, so a photo shown in two places can't drift apart.
- **A trip** is a file in `src/data/trips/` registered in `trips/index.ts`
  (oldest first). That's all: routing, prerendering (with `TouristTrip`
  JSON-LD), the sitemap, the cards on `/trips/` and the front-page card's
  counts follow from the list. A bigger trip's title describes it ("From the
  glacier to the towers") and sets `place` to the name people plan by
  ("Patagonia"): that fills "Heading to …?", the viewer's trip link and the
  front of `meta.title`. The eyebrow lists countries only. Titles use "and",
  not "&".
- **One page per destination** someone would plan as a trip: a region that
  spans borders stays one page (Patagonia), while one journey through two
  rich countries becomes two (Peru, Bolivia). Trip pages don't link to each
  other; each leads back to `/trips/`.
- **Stops** are in travel order. A base with several day hikes gives each
 trail its own stop, with the base as its `area` (El Chaltén's three trails):
 the route folds consecutive trails into one ordinary card for the area
 (`Country · 3 trails`), so every card keeps the same size; below, the
 area gets one photo section with each trail under its own heading; and
 the cards on `/trips/` show only the area's name. A stop without photos still shows on the
  numbered route but gets no section. `note` and the trip's `practical` notes
  are hidden while empty — leave them empty rather than invent copy.
- **Curiosities** (a stop's `note`) are one to three per trip, never on
  neighbouring stops: something about the place that makes people want to
  go, never logistics (those stay in the email offer). `PhotoGrid` sets one as a labelled card: on desktop in the
  cells a short last row leaves open, level with the photo's top edge; as a
  band under the photos when the row is full and on phones. Facts are
  checked and the wording is fresh, like every other line.
- **Why go** (`highlights`) sits between a trip's hero and its route: about
 four short reasons to go, each a title and a sentence or two. They may cover
 places without photos (the trips went further than the photos show), and
 they follow the never-copy rule below. Hidden while absent.
- **`/trips/`** is an informative index, not another photo wall. Trips marked
  `featured` get a big card (cover, countries, summary, route); keep that to
  a couple. Every other trip gets a compact card under "More trips" — cover,
  countries, title — grouped by the trip's `region` (order set by `regions`
  in `trips/types.ts`; add a region there when a trip needs one), so the page
  still scans with dozens of trips. Within a region, cards follow the list. The cover is the trip's own `cover` (one of its stop
  photos, with a `focus` for the 3:2 crop) — the build throws if it isn't.
 The same cover opens the trip page full-bleed (`TripHero.tsx`), with the
 title and summary on a frosted band that blurs the photo behind them; the
 band is sized by the text, so a long summary on a phone stays legible. On
 screens wider than 2.1:1 the photo stops widening and sits centred, each
 side carrying it on with a softly blurred mirror of itself (the seam's
 pixels match, so it reads as the picture continuing), so ultra-wide
 monitors don't crop a portrait cover to a thin slice. Pick a cover with its subject in the upper half, since the
 band covers the foot.
  The page is for people planning a trip; the **wonder goals** (the New Seven
  Wonders and the classic Seven Natural Wonders, `offTheClock.goals`) are
  personal, so they stay on Off the clock. Each goal's `after` names the
  photo theme it follows (Wonders after Travel, Natural Wonders after Ride),
  so photo and text sections alternate.
- **Travel** on Off the clock is a handful of favourites ending in an "All
  trips" link — the trips themselves live on `/trips/`, so don't rebuild a
  per-country grid there. Arrange photos by hand: wide first, similar poses
  (like the two open-arms shots) not side by side. A photo may appear only
  once per page (its tile id is the file name).
- Theme photos on Off the clock, and the front-page glance, open the viewer
  in place (no navigation), whose caption links to the photo's trip when it
  has one.
- `/trips/` and every trip page close with `TripHelp`, a quiet offer of free
  tips by email (copy and its own address, `travel@`, in `tripsPage.help`). Trip pages
  also say it once under the route, a single line, so a long run of photos
  doesn't hide the offer. Keep it a friend's offer: no form, no pricing,
  nothing in the top bar.
- Never copy or closely paraphrase other sites' travel copy (tour operators,
  guides, blogs), even translated. Their pages may inform which stops exist,
  never the wording or the images in it; every line here is written fresh.
- Trips carry no dates — no months, years or "last spring". Durations
  ("three weeks") are fine.
- **Sample photos** (`sample: true` in `photos.ts`, gradient JPEGs named
  `sample-*.jpg`) hold a trip's place until its real photos arrive; the
  build prints a ⚠ line listing those trips. While any remain, `/trips/`
  shows a "Work in progress" badge and those trips add "Photos soon" to their
  eyebrow (`tripsPage.wip`, `tripEyebrow`); both disappear on their own once
  the last sample is replaced.

Each photo ships at several sizes, all made from the phone original, as AVIF
(`avifSrc`, taken through `<picture>`), plus a JPEG at 800 and 2048 px only.
The JPEGs are for Safari before macOS 13 (which can't decode AVIF), crawlers,
the JSON-LD and the no-JS link; phones and big screens all get AVIF, so the
other sizes don't need one:

| Path | Long side | Used by |
| --- | --- | --- |
| `public/photos/<trip>/800/<name>` | ≤800 px | grid tile (`src`) |
| `public/photos/<trip>/1280/<name>.avif` | 1280 px, AVIF only | viewer, phones |
| `public/photos/<trip>/2048/<name>` | 2048 px | viewer, laptops; the tile's link (`largeSrc`) |
| `public/photos/<trip>/2880/<name>.avif` | 2880 px, AVIF only | viewer, 4K/5K |

Photos are filed by trip, then by size: `<trip>` is the trip's slug, or
`other` for a photo no trip shows (the hobby shots), and each size folder is
named for its long side (`sizedSrc`). The build throws if a photo's folder
doesn't match the trip whose stops list it, so moving a photo to another trip
means moving its files too (which changes its URL). A lowRes photo or sample
keeps its one viewer copy in `2048/` even though it's smaller.

The viewer (`PhotoViewer.tsx`) offers its sizes through `srcset`
(`largeSrcSet`), so each screen fetches the one it needs. It sizes each photo
from its shape (`--aspect`), not from the file, and shows the grid tile —
usually already in the browser's cache — as the background until the full
copy arrives, so it never opens empty on a slow network. When the visitor has
turned on Save-Data (`navigator.connection.saveData`), it offers nothing over
1280 px, skips preloading the neighbours and doesn't auto-play clips. It
deliberately doesn't guess from connection speed: Safari doesn't report it,
and the estimates are unreliable.

- **JPEG:** `sips -s format jpeg -s formatOptions 82 -Z <size>`, then strip
 as below.
- **AVIF:** from a lossless PNG (`sips -s format png`, resized), encoded with
 `avifenc -q 80 -d 10 -y 444 -s 4 --ignore-exif --ignore-xmp -a tune=ssim`
 (Homebrew `libavif`). That keeps the JPEG's detail at about a third less
 size, with full-resolution colour; `avifenc` turns the Display P3 profile
 into AVIF's colour tags. ffmpeg's SVT-AV1 is built for video and keeps
 visibly less texture in stills.
- **Orientation:** iPhone HEICs often store their pixels sideways with
 `Orientation: 6`. `sips` keeps that tag while writing sideways pixels, and
 stripping drops it, so rotate with `sips -r 90` first — then strip the tag
 from the PNG too, or ffmpeg and `avifenc` will rotate it a second time.
- **Exceptions:** a photo with no original keeps the one JPEG it has in
 `2048/` and is marked `lowRes` (no AVIF, no other sizes); one whose
 original is under 2880 px sets `originalLong` and skips the 2880 copy.

The build throws if any of these copies is missing, and `npm test` fails if a
page references a `/photos/` file that isn't in `dist/`. The viewer is a native `<dialog>` with
previous/next, arrow keys, swipe and Esc — deliberately no auto-advance.

**Videos** are photos with a `video` (a clip at `media('<name>.mp4')`): the
photo is the grid tile and poster, and the clip downloads only once it is the
item on screen in the viewer — never on scroll — and plays muted, with the
sound one tap away in the controls. While it plays on its own the controls
stay off the picture; a tap, a mouse move or keyboard focus brings them back,
and they show whenever it isn't playing (loading, autoplay blocked, ended). If the clip fails to load (say the
Worker's daily limit is spent), the viewer shows the still with a quiet note
(`videoUnavailable`) instead of a dead player; moving away and back retries.
A browser that can play neither copy (`canPlayType`) gets the still straight
away, with `videoUnsupported` instead, since retrying won't help.
The poster's AVIF (`avifSrc`) is HDR, cut from the clip, so it matches it.

Each clip ships twice, both made from the phone original (never from an
earlier encode) and both 1080p, 10-bit HLG HDR with the original's colour tags:

| Copy | Encoder | Plays on |
| --- | --- | --- |
| `<trip>/av1/<name>.mp4` | `libsvtav1 -preset 4 -crf 32 -svtav1-params tune=0` | Chrome, Edge, Firefox; Safari on M3+ Macs and iPhone 15 Pro+ |
| `<trip>/hevc/<name>.mp4` | `libx265 -preset slow -crf 24 -tag:v hvc1` | every Apple device, Chrome/Edge with hardware HEVC |

The viewer lists AV1 first and HEVC second as `<source>`s with codec strings,
so each browser downloads only the one it can play. Don't drop either: AV1
alone leaves M1/M2 Macs and most iPhones without the clip, and HEVC alone
leaves Firefox and many Chrome installs without it. The settings were picked
on `paine-massif` by VMAF against the original (about 95 for both, half the
phone's bitrate); the phone's own 21 Mbps encode buffered on slow
connections. Clips are 60 fps by default; drop to 30 only when Hélder asks
for it on a specific clip (so far only `paine-massif`, a slow scene). Keep a
60 fps clip's own timestamps (`-fps_mode passthrough`): iPhone clips stretch
one frame by a tick every ~217 frames, and ffmpeg's default constant-rate
output then doubles one frame and drops another, a visible stutter. When
scoring with VMAF, pair frames by number (`setpts=N/(60*TB)` on both inputs),
not by timestamp, or the scorer misaligns them and reports a false loss. Drop all metadata
(`-map_metadata -1`, video and audio streams only: iPhone clips carry GPS in
data tracks); `ffmpeg` turns sideways portrait clips upright when it
re-encodes. Dolby Vision's extra layer isn't kept; HLG is the HDR every
screen understands. `compare/originals.tsv` (local, not committed) maps every
published photo and clip to its phone original, with each clip's cut.

Clips are **not in the repo**. Cloudflare's terms forbid serving video through
its proxy unless it comes from R2, so they sit in the private R2 bucket
`videos`, filed like the photos (`<trip>/<codec>/<name>.mp4`; `photo.video` is
just the name, and the trip comes from the photo's folder), served at
`media.hgoncalves.uk` by a Worker whose source is
`scripts/media-worker.js` (pasted into the dashboard, bucket bound as `MEDIA`;
not part of the build). To add a clip, upload it to the bucket by hand. The
Worker stays on the Workers Free plan so that past its daily request limit
it fails rather than bills, and the bucket must stay private (no `r2.dev`
URL, no custom domain on the bucket) so the Worker is the only way in. Clips
are cached for a week, not forever, because a re-encode keeps its name.

Photo captions on Off the clock follow one format: `caption` is the place's
proper name, `place` is `Country · one short detail`. Omit `place` rather than
fill it with something else. `PhotoGrid` stretches a stranded last photo across
both columns on phones, so any count works, but desktop (three columns) reads
best when each section fills its rows — a `wide` photo counts as two.

The shape is defined in `src/types.ts` — the compiler will catch missing
fields when adding new entries. If you genuinely need a new field, update
`types.ts` first, then `cv.ts`, then the component that renders it.

### Downloadable CV (`public/helder-goncalves-cv.pdf`)

The `/cv/` hero has a "Download CV" link (`CvDownload.tsx`, `<Hero showDownload />`;
the front page leaves it to its CV card) — a pill under the title from md up,
one more round icon in the contacts row on phones — that links to
`/helder-goncalves-cv.pdf`, served verbatim from `public/`. **`cv.ts` is the
canonical source**; the PDF is a printable mirror of it. When the content of
`cv.ts` changes in any user-visible way, regenerate or replace the PDF so
both stay in sync. Keep the filename stable (`helder-goncalves-cv.pdf`) —
versioned names like `CV-2026-v2.pdf` would break the saved download URL.

### Social cards (`public/og-*`)

Every page has its own 1200×630 card, committed. The photo cards mirror
`TripHero`: the photo full-bleed, cropped at its `focus`, the words on the
same frosted band over its foot. Home, CV and home lab have no photo to
lead with, so they keep their fuller copy (role, focus, stack) over a
generic blurred backdrop — soft colour light in the hero's blue, not a
photo — which gives them the photo cards' depth without inventing a picture:

| Card | Template | Page |
| --- | --- | --- |
| `og-home.jpg` | `home.html?tag=…` (the four pages) | `/` |
| `og-cv.jpg` | `home.html?eyebrow=…` | `/cv/` |
| `og-homelab.jpg` | `homelab.html` | `/homelab/` |
| `og-off-the-clock.jpg` | `photo.html` | `/off-the-clock/` (`offTheClock.meta.card`) |
| `og-trips.jpg` | `photo.html` | `/trips/` (`tripsPage.meta.card`) |
| `og-trip-<slug>.jpg` | `photo.html` | each trip, with its `cover` |

The sources are plain HTML in `scripts/og-cards/`, rendered by `npm run
cards`, which screenshots them with an already-installed Chrome (override
with `CHROME=/path/to/binary`) and re-encodes the photo cards as JPEG with
`sips`. This is deliberately *not* part of `npm run build`: no
headless-browser dependency gets added for an asset that changes a few times
a year. Instead the build throws when a page's card is missing, so a new trip
fails until `npm run cards` has run. Re-run it when a trip's title, countries
or cover changes, too — the build can't tell a card is stale.

`photo.html` takes its copy and photo from the data files (through a
throwaway SSR bundle), so trips need nothing in the script. The photos on
Off the clock and `/trips/` are never a trip's cover, so no two cards match.
Sample trips get a sample card until their photos arrive. The home, CV and
home-lab copy is in their templates and duplicates a little of `cv.ts` /
`homelab.ts` — when a name, role, or thesis changes there, update the
template too.

Photos under `public/photos/` are resized for display and stripped of all
metadata except the colour profile before they are committed
(`exiftool -all= -tagsfromfile @ -icc_profile`), so no GPS or camera data ships.

## Styling rules

SASS partials in `src/styles/`:

- `_variables.scss` — raw palette + theme tokens as CSS custom properties
  (light by default, dark via `[data-theme='dark']` or `prefers-color-scheme`)
- `_mixins.scss`, `_reset.scss`, `_layout.scss`, `_components.scss`
- `main.scss` — entry; uses `@use` for partials

Conventions:

- Use `@use 'variables' as *;` at the top of partials. Do not use `@import`.
- **Never hand-write vendor prefixes.** Vite minifies with Lightning CSS and
  adds the prefixes required by `build.target` (currently chrome111, edge111,
  firefox114, safari16.4, ios16.4). Authoring a prefix yourself makes Lightning
  CSS treat the pair as one declaration and keep only the prefixed form — that
  is how `.nav`'s `backdrop-filter` shipped as `-webkit-` only, which Chromium
  does not alias, so the nav blur worked in Safari and not in Chrome. Write the
  standard property alone; `npm test` fails if a prefixed declaration reaches
  `dist/` without its standard counterpart. `-webkit-font-smoothing`,
  `-moz-osx-font-smoothing`, and `-webkit-user-drag` are the exception — they
  have no standard form. The last one is what stops Safari dragging a link;
  `draggable="false"` is enough for an image, and Safari ignores it on `<a>`.
- Colours that change with theme should reference the CSS custom properties
  (e.g. `var(--color-text)`) or the SASS aliases at the bottom of
  `_variables.scss` (`$color-text`, `$color-accent`, …). Reach for raw palette
  vars (`$blue-700`, `$ink-900`, …) only when the colour is intentionally
  fixed across themes (hero gradient, focus-ring `rgba()`, `::selection`,
  print overrides).
- The brand blue is `$blue-600` (primary) / `$blue-700` (accent-dark) — change
  these to rebrand; the rest cascades.
- Print stylesheet (in `main.scss`) forces the light palette regardless of
  `data-theme`. Don't break that when adjusting dark-mode tokens.

### Interaction vocabulary

Every interactive element belongs to one of seven named families, each a mixin
in `_mixins.scss`. **Never invent an eighth at the call site** — that is how the
same affordance ended up with three different hover states across two pages.
Reach for the mixin; if nothing fits, add a family here and document why.

| Family | Mixin | Used by | Hover |
| --- | --- | --- | --- |
| Action link | `action-link` (+ `action-link-primary`) | "View case study", "Live status page" | accent text + accent rule |
| Prose link | `prose-link` | `.homelab-stack__note a`, `.footer a`, `.trip-help__back a` | accent → accent-dark |
| Nav control | `nav-control` | `.theme-toggle`, `.nav__menu` | accent tint deepens, border firms, press scales |
| Hero button | `hero-button` | `.hero__contact`, `.hero__download`, `.homelab-cta`, `.viewer__button`, `.viewer__link` | white glass brightens, lifts 1px |
| Nav link | — (`.nav__links a`) | `SiteNav` page links (every page; below md they live in the ☰ panel, which closes on Esc, an outside tap or a link) | soft → accent; the current page rests in accent |
| Card link | `card-link` | `.door` (front-page cards), `.trip-card` (`/trips/`), `.gallery__link` (photo tiles) | card lifts 2px, shadow deepens, inner action line turns accent |
| Primary button | `primary-button` | `.trip-help__email` ("Email me" closing the trip pages) | fill deepens to accent-dark, lifts 1px, gains a shadow |

`card-link` exists because the front-page doors are whole-surface targets: a
lone underlined link inside a card left most of the card dead to clicks. Its
action line is a `<span>` styled with `action-link`, never a nested `<a>`.

#### Buttons

Every button is a pill (`$radius-pill`), `$fs-sm` at weight 600, usually with
an icon before the label. What changes is colour, and **the surface picks
it, not the importance**: a primary button is the inverse of what it sits on.

| Surface | Primary | Secondary |
| --- | --- | --- |
| Blue hero (brand blue in both themes) | `.homelab-cta--primary`: solid white, `$blue-700` text | `hero-button`: white glass (`.homelab-cta`, `.hero__contact`, `.hero__download`) |
| Themed page (`--color-bg`) | `primary-button`: solid brand blue, the pill pair | a link (`action-link` or `prose-link`), never a second button |

So the home lab's white pill and the trips' blue pill are the same role in
the same shape. They differ because their backgrounds do:

- On the blue hero, white is the strongest mark there is. A blue button would
  sink into the gradient, which is also why the hero's glass buttons use
  `rgba($white, …)` instead of accent tokens.
- On the page, white is no mark at all in the light theme (white on
  `#f7f9fc`) and a glaring slab in the dark one, so the strongest mark is the
  brand blue. `primary-button` takes it from the pill pair (`--pill-bg` and
  `--pill-text`) rather than a new colour: `$blue-600` with white text in
  light (5.3:1), `$blue-400` with `$ink-900` in dark (6:1), the same
  combination the tag pills already use. Hover deepens it to
  `--color-accent-dark`, which keeps the contrast in both themes.

`primary-button` exists because the email offer closing `/trips/` and each
trip page is the one thing those pages ask of the reader, and an underlined
link beside another couldn't say so: a muted second link read as disabled.
Rules for both primaries:

- One per view, or it stops meaning "this one".
- On the hero, a glass secondary can sit beside the white primary (the home
  lab's row): glass against solid is a clear enough difference. On the page,
  the primary stands alone. Its secondary goes on its own line below as a link
  (the trip page's "‹ All trips"), because there is no outline or glass button
  for themed surfaces, and adding one would start a second, competing button
  style.
- Don't use a white pill on the page or a blue pill on a hero, even to "match"
  the other page. Each one only works on its own surface.

The families own *interaction*, not geometry: callers keep their own size,
padding, radius, and resting colour. Two rules that follow from that:

- `nav-control` deliberately doesn't set text colour. The theme toggle and
  menu button add their own accent-on-hover because they rest muted.
- The top bar is identical on every page — no page-specific buttons. A control
  that appears on some pages and not others shifts its neighbours as you move
  between pages, which reads as a glitch.
- `hero-button` uses `rgba($white, …)` rather than accent tokens. Both heroes
  stay brand-blue in either theme, so a themed accent would sink into the
  background — this is one of the sanctioned uses of raw palette values.
- `prose-link` doesn't set `font-weight` either. Add `600` when the link sits
  mid-sentence and has to be findable in body copy (the stack note); leave it
  alone in a row that is mostly links (the footer), where bolding every one
  makes a deliberately quiet line shout.

## Theming

- `index.html` runs a tiny synchronous script in `<head>` that reads
  `localStorage.theme` and sets `data-theme` on `<html>` **before first paint**
  to avoid a flash of the wrong theme. Don't move it out of `<head>` or make
  it async.
- `ThemeToggle.tsx` is a two-state toggle: a click always flips the theme on
  screen. A first visit follows the system; a choice that differs from the
  system is saved to `localStorage`, and flipping back to the system's theme
  clears it so the page follows the OS again. The saved choice is also cleared
  whenever the system comes round to match it (on load, and live via a
  `prefers-color-scheme` listener), so picking dark by day doesn't pin dark
  the next morning for someone whose OS switches automatically. Don't reintroduce a third "auto"
  click — a click that changes nothing visible reads as a bug. The icon is
  chosen in CSS (same selectors as the palette), so it is right before
  hydration and the component holds no state.
- The hero gradient stays brand-blue across themes by design.

## Deployment

`.github/workflows/deploy.yml` builds on push to `main` (or
`workflow_dispatch`), runs `npm test` against the freshly built `dist/`, and
publishes it via the GitHub Pages action. The test step sits between the build
and the upload deliberately: the deploy goes straight to production, so a page
that describes the wrong route has to be caught before the artifact exists.
Repo Pages source must be **GitHub Actions** (not "Deploy from a branch") —
the legacy mode would serve the source `index.html` referencing `/src/main.tsx`,
which only resolves under `vite dev`, producing a blank page in production.

`vite.config.ts` has `base: '/'` because this is a user/org GitHub Pages
repo (`helderjgoncalves.github.io`). Only change `base` if migrating to a
project-page repo.

## Conventions for agents

- Prefer editing existing files over creating new ones.
- Components are functional, typed, and named-export (`export function Foo`).
- Keep components presentation-only; data flows from `cv.ts` through `App.tsx`.
- Don't add runtime dependencies casually — the bundle is intentionally tiny
  (React + ReactDOM only). No icon libraries, no CSS-in-JS, no UI kits.
- Run `npm run lint` after non-trivial TypeScript edits.
- Run `npm run build && npm test` before claiming a change is production-ready
  — the SSR step fails loudly if `<App />` throws during render (e.g.
  browser-only APIs accessed at module top level), and the tests catch output
  that builds cleanly but describes the wrong route.
- Adding a route means adding it to the `pages` table in `prerender.mjs`; the
  tests then cover it automatically, since they discover routes by walking
  `dist/` rather than from a list of their own.
- Respect `prefers-reduced-motion` when adding animations (see `useReveal`
  and existing CSS for the pattern).
