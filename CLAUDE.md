# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The BetterCallSal Multiverse: **one Next.js 13 codebase that builds and deploys ten separate
websites**, each on its own `bettercallsal.*` domain (biz, rocks, fit, art, games, construction,
gallery, world, wtf, fans). Which site a build produces is decided at build time, not at runtime.

Stack: Next.js 13 (pages router) · styled-components v5 · react-router-dom (client-side) ·
three.js/GLSL · GSAP · Unity WebGL · zod · Firebase Hosting · Google Cloud Storage.

Package manager is **yarn** (`yarn.lock`). Node is pinned to **20.7.0** in `.nvmrc`.

## Commands

```bash
yarn dev            # dev server
yarn build          # next build
yarn static         # next build && next export → out/
yarn lint           # biome lint
yarn format         # biome format --write
yarn check          # biome check --write (format + lint + organize imports)
yarn clean          # rm -rf out
./deploy.sh         # build + deploy ALL ten sites (see Deploy below)
```

Content-pipeline scripts are ts-node and **require the commonjs override**:

```bash
TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' yarn ts-node scripts/<script>.ts
```

There is no test suite.

## Architecture

### One codebase, ten sites

`next.config.env.json` at the repo root is the build-time switch:

```json
{
    "selectedSite": "biz",
    "cdnUrl": "...",
    "contentUrl": "...",
    "spotifyEnabled": "false",
    "localImages": "false",
    "gtagEnabled": "false",
    "experiments": "false"
}
```

`next.config.js` spreads that whole object into `env`, so every value lands on `process.env.*` in
app code and is baked into the bundle. `src/constants.ts` parses it once through `ConfigValidator`
into the exported `config` object — **read `config`, not `process.env`, from components.**

**To work on a different site locally, edit `selectedSite` in `next.config.env.json` and restart.**
There is no runtime site switcher for the _default_ site; the in-app hotkeys (below) swap the
rendered site but the build's `selectedSite` still determines metadata, favicons, and the
server-rendered first paint.

### Everything routes through `/`

`next.config.js` rewrites `/:path*` → `/`. There is exactly one real page (`src/pages/index.tsx`,
plus `linktree` and `privacy`). All in-app routing is **react-router-dom** inside
`components/main/layouts/client-app.tsx` — routes for `e-cards`, `game/:gameId`, `video/:videoId`,
`art/:artId`, `category/:category`, and a `*` that redirects to `/`.

Adding a route means editing that `RouteObject`, not adding a file under `pages/`.

### The SSR → CSR swap

`components/main/index.tsx` holds an `isSSR` state that starts `true` and flips in a `useEffect`.
First paint renders `ServerAppLayout`; after hydration it swaps to `ClientAppLayout`. This exists
because `createBrowserRouter` can't run during static export. **Anything that must appear in the
exported HTML (SEO, above-the-fold markup) has to live in the server layout**, and the two layouts
have to be kept visually in sync by hand.

### Content: baked vs fetched

- The **default site's** content is read from `content/content-{site}.json` at build time in
  `getStaticProps` and passed in as `defaultContent`.
- **Every other site's** content is fetched at runtime by `providers/sites.tsx` from
  `${config.contentUrl}/content-{site}.json` — a _versioned_ GCS path
  (`https://storage.googleapis.com/bcs-assets/content/v8`), cached in `contentMap` after first load.

So editing `content/content-art.json` only affects a build whose `selectedSite` is `art`. For every
other site to see it, the JSON has to be uploaded to the GCS content bucket. Bumping the content
version means changing `contentUrl` and redeploying all ten sites.

`construction` is special-cased everywhere — it has no content list and renders `<Construction />`.

### Content generation

`content/` holds both the generated JSON and the CSV sources the scripts read (`loadSheet` in
`scripts/csv.ts` resolves names against `content/`):

| Script               | Reads                                 | Writes                                             |
| -------------------- | ------------------------------------- | -------------------------------------------------- |
| `parse-content.ts`   | `content-biz.csv`                     | `content/content-biz.json`                         |
| `parse-structure.ts` | `site-structure.csv`, `nav-{key}.csv` | `content/sites.next.json`                          |
| `wtf-generator.ts`   | `content/sites.next.json`             | the `wtf` entry (shuffles the other sites' pieces) |
| `crawl.ts`           | the live sites (Playwright/crawlee)   | crawl dataset                                      |
| `social-bot.ts`      | content JSON + mariadb                | social posts                                       |

`wtf` is **procedurally generated** by mixing headers/footers/navs from the real sites — it isn't
authored. Note `wtf-generator.ts` declares its own local `SiteMapValidator` (8 keys, no `wtf`)
rather than importing the 9-key one from `src/types`.

### Assets are all on GCS

`image-loader.js` is a custom `next/image` loader that rewrites **every** src to
`https://storage.googleapis.com/bcs-assets{dir}/{name}.webp`, forcing `.webp` for everything except
`.webm` and `.gif`. `public/{images,audio,fonts,videos,unity,content}` are gitignored — only
`robots.txt` and `public/scripts/` (html-to-image, textfit) are tracked.

Set `localImages: "true"` in `next.config.env.json` to switch back to the default loader and serve
from `public/`.

### Providers

Nested in `pages/index.tsx`, outermost first:
`ThemeProvider` → `SitesDataProvider` (selected site, per-site content map, fullScreen) →
`AnimationsProvider` (bizerk mode, grid/nav animation counters) → `SoundProvider` (Web Audio
buffers, analyzer) → `WindowSizeProvider`. `PathProvider` (prevPath, pathStack) is mounted lower, in
`ClientAppLayout`.

### Interaction model

- **Hotkeys** (`client-app.tsx`): `a b f r g c y w t` switch site; **space** toggles between
  hotkey mode and audio-preview mode (same keys then play that site's audio via a GSAP tween);
  **Escape** exits fullscreen.
- **"Bizerk"**: clicking `#bizerk-icon` (or anywhere on `construction`) screenshots the DOM with
  html-to-image and feeds the PNG into the GLSL `ParticleSystem` in `components/glfx`.
- Below 768px, navigating anywhere other than `/` or `/category/*` forces fullscreen.

## Deploy

`./deploy.sh` loops over all ten site keys. For each: `yarn clean` → `scripts/config.ts <site>`
(rewrites `next.config.env.json`) → `yarn static` → move `out/` to `../firebase/<site>/out` →
`firebase deploy` from there.

This depends on a **sibling checkout at `../firebase/`** with one directory per site, each holding
its own Firebase project config. That directory is outside this repo.

`config.ts` also force-sets `spotifyEnabled: true`, `localImages: false`, `gtagEnabled: true` for
every deploy, and maps the `fans` target onto `selectedSite: 'biz'` (`fans` is a deploy target, not
a `SiteKey`). `deploy.sh` restores `next.config.env.json` to its committed defaults at the end.

## Conventions

- **Biome** (`biome.json`) is the only formatter and linter — prettier and eslint are gone. 4-space,
  single quotes, semicolons, 150 width, trailing comma `es5`; `assist.organizeImports` handles import
  order, and `suspicious/noExplicitAny` errors via the recommended preset.
- **Style biome does not enforce, but match anyway**: single-statement `if`s have no braces (the old
  `curly: multi`), and components are arrow functions.
- **`useExhaustiveDependencies` is noisy here on purpose** — several effects deliberately omit deps
  (see the `dont add images as a dep!` note in `components/art`). Don't let `biome check` "fix" an
  effect's dep array without reading why it's short.
- **Imports**: `@/*` → `src/*`. Scripts import across the boundary with relative paths
  (`../src/types`), since they run outside Next's alias resolution.
- **Types are zod-first**: `src/types/` defines `XValidator` schemas and infers the TS type from
  them. Content and site structure are parsed through these at both build and runtime — adding a
  field means updating the validator, the CSV, and the generated JSON together.

## Gotchas

- **`next.config.env.json` is tracked but machine-written.** `scripts/config.ts` and `deploy.sh`
  both rewrite it, so builds and deploys dirty the working tree. Check `git diff` on it before
  committing.
- **`.nvmrc` pins 20.7.0, which may not be installed.** If the shell has an nvm auto-switch hook,
  `cd` into this repo fails with `N/A: version "v20.7.0" is not yet installed` and takes the whole
  command with it. Either `nvm install 20.7.0` or use absolute paths / `git -C` instead of `cd`.
- **`SiteKey` has 9 values; there are 10 deploy targets.** `fans` builds from `biz`.
- **`config.localImages` is wired to the wrong env var** — `src/constants.ts:11` reads
  `process.env.spotifyEnabled`. Nothing consumes `config.localImages` today (only `next.config.js`
  reads `env.localImages`, correctly), so it's latent, but don't trust that field.
- **`yarn static` uses `next export`**, which is deprecated in Next 13 in favour of
  `output: 'export'`. It still works here; be aware if upgrading.
- **`.next/` is stale and committed to disk** (not to git) from a Feb 2024 build — `yarn clean` only
  removes `out/`.
