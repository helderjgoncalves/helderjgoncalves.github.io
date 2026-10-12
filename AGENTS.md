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
npm run cards    # re-render public/og-*.png from scripts/og-cards/ (manual)
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
  App.tsx                 # routes: / front page, /cv/, /homelab/, /off-the-clock/
  main.tsx                # client entry; hydrate-or-render based on root contents
  entry-server.tsx        # SSR entry; renderToString(<App />)
  types.ts                # CvData and related interfaces
  data/cv.ts              # CV content (the /cv/ page and the front page hero)
  data/frontDoor.ts       # front page intro, door cards and meta
  data/homelab.ts         # home-lab case study
  data/offTheClock.ts     # photos, captions, wonders and meta for /off-the-clock/
  components/             # one component per CV section + page components (FrontDoor,
                          # HomelabPage, OffTheClockPage), PhotoGrid, Nav, Hero, Icon, Section…
  hooks/useReveal.ts      # IntersectionObserver scroll-reveal
  styles/                 # SASS partials (see below)
  vite-env.d.ts
public/                   # static assets copied verbatim (favicon, portrait, og cards, robots, 404)
scripts/prerender.mjs     # post-build SSR injection + head metadata + sitemap
scripts/dist.test.mjs     # post-build assertions on dist/ (`npm test`)
scripts/og-cards/         # HTML sources for the social cards + `npm run cards`
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

Photo captions on Off the clock follow one format: `caption` is the place's
proper name, `place` is `Country · one short detail`. Omit `place` rather than
fill it with something else. `PhotoGrid` stretches a stranded last photo across
both columns on phones, so any count works, but desktop (three columns) reads
best when each section fills its rows — a `wide` photo counts as two.

The shape is defined in `src/types.ts` — the compiler will catch missing
fields when adding new entries. If you genuinely need a new field, update
`types.ts` first, then `cv.ts`, then the component that renders it.

### Downloadable CV (`public/helder-goncalves-cv.pdf`)

The Nav exposes a "Download CV" button that links to
`/helder-goncalves-cv.pdf`, served verbatim from `public/`. **`cv.ts` is the
canonical source**; the PDF is a printable mirror of it. When the content of
`cv.ts` changes in any user-visible way, regenerate or replace the PDF so
both stay in sync. Keep the filename stable (`helder-goncalves-cv.pdf`) —
versioned names like `CV-2026-v2.pdf` would break the saved download URL.

### Social cards (`public/og-home.png`, `public/og-homelab.png`)

Both are 1200×630 and committed. Their sources are plain HTML in
`scripts/og-cards/`, rendered by `npm run cards`, which screenshots them with
an already-installed Chrome (override with `CHROME=/path/to/binary`). This is
deliberately *not* part of `npm run build`: no headless-browser dependency gets
added for an asset that changes a few times a year. The card copy duplicates a
little of `cv.ts` / `homelab.ts` by necessity — when a name, role, or thesis
changes there, update the template and re-run `npm run cards`.

`public/og-off-the-clock.jpg` is the exception: a 1200×630 crop of a photo rather than
a rendered template. Photos under `public/photos/` are resized for display and
stripped of all metadata except the colour profile before they are committed
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
  `dist/` without its standard counterpart. `-webkit-font-smoothing` and
  `-moz-osx-font-smoothing` are the exception — they have no standard form.
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

Every interactive element belongs to one of six named families, each a mixin
in `_mixins.scss`. **Never invent a sixth at the call site** — that is how the
same affordance ended up with three different hover states across two pages.
Reach for the mixin; if nothing fits, add a family here and document why.

| Family | Mixin | Used by | Hover |
| --- | --- | --- | --- |
| Action link | `action-link` (+ `action-link-primary`) | "View case study", "Live status page" | accent text + accent rule |
| Prose link | `prose-link` | `.homelab-stack__note a`, `.footer a` | accent → accent-dark |
| Nav control | `nav-control` | `.nav__cv`, `.theme-toggle` | accent tint deepens, border firms, press scales |
| Hero button | `hero-button` | `.hero__contact`, `.homelab-cta` | white glass brightens, lifts 1px |
| Nav link | — (`.nav__links a`) | in-nav section links | soft → accent |
| Card link | `card-link` | `.door` (front-page cards) | card lifts 2px, shadow deepens, inner action line turns accent |

`card-link` exists because the front-page doors are whole-surface targets: a
lone underlined link inside a card left most of the card dead to clicks. Its
action line is a `<span>` styled with `action-link`, never a nested `<a>`.

The families own *interaction*, not geometry: callers keep their own size,
padding, radius, and resting colour. Two rules that follow from that:

- `nav-control` deliberately doesn't set text colour. The CV pill's
  `accent-dark` label is a contrast decision against its tinted background
  (see the note in `_variables.scss`) and must survive the hover; the theme
  toggle adds its own accent-on-hover because it rests muted.
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
- `ThemeToggle.tsx` cycles auto → light → dark and persists to `localStorage`.
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
