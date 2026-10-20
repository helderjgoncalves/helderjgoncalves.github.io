# Hélder Gonçalves — Personal Landing Page

A static React + TypeScript + SASS landing page built with Vite, deployed to
GitHub Pages at [helderjgoncalves.github.io](https://helderjgoncalves.github.io).
Mirrors the CV content as a single-page site with a sticky nav, subtle
scroll-reveal animations, and a clean blue/white palette that matches the
printed CV.

## Stack

- React 19 + TypeScript
- Vite (build & dev server)
- SASS (modern `@use` module system, no `node-sass`)
- Inline SVG icons (no icon library dependency)
- Deployed to GitHub Pages via GitHub Actions (Node 24 runner)

## Requirements

- Node.js **>= 24** (matches the version used in CI)
- npm (bundled with Node)

## Quick start

```bash
npm install
npm run dev          # local dev at http://localhost:5173
npm run build        # type-check + production build into ./dist
npm run preview      # serve the production build at http://localhost:4173
npm run lint         # type-check only (tsc -b --noEmit)
npm test             # assert ./dist metadata, sitemap, robots (run after build)
npm run cards        # re-render the social cards into public/ (needs Chrome)
```

## Editing content

All CV content lives in **[`src/data/cv.ts`](src/data/cv.ts)** as a single typed
object. To update a bullet, change a tag, or add a new award, you only edit that
file — the components are presentation-only. The other pages each have their own
data file: [`home.ts`](src/data/home.ts) (the home page: hobbies, photos and
wonder goals), [`homelab.ts`](src/data/homelab.ts) and
[`tripsPage.ts`](src/data/tripsPage.ts) (the `/trips/` index).
Photos are described once in [`photos.ts`](src/data/photos.ts); each trip page
is a file in [`src/data/trips/`](src/data/trips/), listed in its `index.ts`.

The TypeScript types in **[`src/types.ts`](src/types.ts)** describe the shape of
the data, so the compiler will catch missing fields if you add new entries.

## Styling

SASS partials live in `src/styles/`:

- `_variables.scss` — raw palette, theme tokens (CSS custom properties for
  light + dark), typography, breakpoints, motion tokens
- `_mixins.scss` — reusable patterns (pill, focus ring, section rule, media queries)
- `_reset.scss` — minimal CSS reset
- `_layout.scss` — nav, hero, sections, footer, theme-toggle button
- `_components.scss` — pills, profile, timeline, entries, project cards, awards
- `main.scss` — entry point that imports the partials

Change the brand colour by editing `$blue-600` (primary) and `$blue-700`
(accent-dark) in `_variables.scss`. Everything else cascades.

### Theming (light / dark)

Colour tokens are CSS custom properties (e.g. `--color-bg`, `--color-text`)
defined on `:root`. The dark palette is applied either explicitly via
`<html data-theme="dark">` (set by the theme toggle in the nav and persisted
to `localStorage`) or implicitly via `@media (prefers-color-scheme: dark)`
when no explicit preference is stored.

A small inline script in `index.html` runs synchronously in `<head>` to apply
the persisted theme **before** first paint, so users never see a flash of the
wrong theme during hydration. The `ThemeToggle` button flips between light and
dark: a first visit follows the system, and switching back to the system's
theme forgets the saved choice. The brand-blue hero stays consistent across
both themes.

Print stylesheets force the light palette regardless of the chosen theme so
PDF export stays legible on white paper.

## Adding a portrait

By default the hero shows your initials (`HG`) on a tinted circle. To use a
real photo:

1. Drop a square image into `public/`, e.g. `public/portrait.jpg`.
2. In `src/data/cv.ts`, set `profile.photo` to `'/portrait.jpg'`.

The image is rendered with `object-fit: cover`, so any square aspect ratio works.

## Deploying to GitHub Pages

The [`deploy.yml`](.github/workflows/deploy.yml) workflow builds the site and
publishes `./dist` to GitHub Pages on every push to `main` or `master` (and via
manual `workflow_dispatch`). It uses the latest action majors on a Node 24
runner: `actions/checkout@v6`, `actions/setup-node@v6`,
`actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`.

### One-time setup

1. Push this project to your `helderjgoncalves.github.io` repository.
2. Open the repo on GitHub → **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to your default branch (or trigger the workflow manually from the
   **Actions** tab).

> ⚠️ **Don't leave Pages on "Deploy from a branch".** That mode serves the raw
> source `index.html` from the branch root, which references `/src/main.tsx` —
> a path that only exists during `vite dev`. The result is a blank page in
> production. The workflow uploads the built `dist/` as the Pages artifact;
> you must select **GitHub Actions** as the source for that artifact to be
> served.
>
> If your repo is already in legacy mode, you can flip it from the CLI:
>
> ```bash
> gh api -X PUT repos/<owner>/<repo>/pages -f build_type=workflow
> ```

### Project-page repo (alternative)

If you publish under a project repo (e.g. `github.com/you/cv`), edit
`vite.config.ts` and set `base: '/cv/'` so asset URLs resolve correctly.

## Project structure

```
helderjgoncalves.github.io/
├── .github/workflows/deploy.yml
├── public/
│   ├── favicon.svg
│   ├── og/                # 1200x630 social cards (see scripts/og-cards)
│   ├── photos/            # photos/<trip>/<size>/<name>, metadata stripped (800, 1280, 2048, 2880)
│   └── portrait.jpg
├── scripts/
│   ├── og-cards/          # HTML sources for the social cards (`npm run cards`)
│   └── prerender.mjs      # SSR injection, head metadata, sitemap.xml
├── src/
│   ├── components/        # CV sections + page components, PhotoGrid, SiteNav, Hero, Icon…
│   ├── data/              # cv.ts, home.ts, homelab.ts, photos.ts, trips/
│   ├── hooks/useReveal.ts # scroll-reveal hook
│   ├── styles/            # SASS partials
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts           # CV data types
│   └── vite-env.d.ts
├── index.html             # source entry (loads /src/main.tsx in dev)
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Notes

- The page is fully responsive (single-column on mobile, three-column hero on
  desktop).
- Scroll-reveal respects `prefers-reduced-motion`.
- Print styles hide the nav and footer for clean PDF export from the browser.
