# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The BetterCallSal Multiverse: **one Next.js 16 codebase that builds and deploys ten separate
websites**, each on its own `bettercallsal.*` domain (biz, rocks, fit, art, games, construction,
gallery, world, wtf, fans). Which site a build produces is decided at build time, not at runtime.

Stack: Next.js 16 (app router, static export, Turbopack) · React 19 · styled-components v6 ·
three.js/GLSL · GSAP · Unity WebGL · zod · Firebase Hosting · Google Cloud Storage.

Package manager is **pnpm** (`pnpm-lock.yaml`). Node is `22` in `.nvmrc`, `>=22` in `package.json`.

## Commands

```bash
pnpm dev            # dev server
pnpm build          # next build
pnpm static         # next build (output: 'export' writes out/)
pnpm lint           # biome lint
pnpm format         # biome format --write
pnpm check          # biome check --write (format + lint + organize imports)
pnpm clean          # rm -rf out dist
./deploy.sh         # build + deploy ALL ten sites (see Deploy below)
./deploy.sh biz wtf # build + deploy just those two
./deploy.sh --dry-run  # build every site into dist/, deploy nothing
```

Content-pipeline scripts are ts-node and **require the commonjs override**:

```bash
TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' pnpm ts-node scripts/<script>.ts
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

### Routing

`next.config.js` sets `output: 'export'`. Routes are directories under `src/app`:

- `app/layout.tsx` — root layout. Calls `buildSite()` for the build's key, derives every
  `metadata` field and favicon from it, and loads that site's content with `readSiteContent()`
  to pass into `Providers` as `defaultContent`.
- `app/(app)/` — route group, so it adds no URL segment. Its layout wraps children in `<Shell>`
  (`src/app/shell.tsx`), the persistent header/nav/footer chrome. `(app)/page.tsx` returns `null`
  on purpose: the home grid belongs to Shell and stays mounted behind every route.
- `app/(app)/[type]/[slug]/` — one route for video/art/game, since `URL_MAP` already collapses the
  five content types into those three segments.
- `app/(app)/category/[category]/`, `audio/`, `e-cards/` — the remaining in-app routes.
- `app/linktree/`, `app/privacy/` — outside the group, so they render their own chrome.

Adding a route means adding a directory under `src/app`. A dynamic one also needs
`generateStaticParams`: under `output: 'export'` a param that isn't listed has no HTML to serve,
and `next dev` throws on it outright.

### Every build carries every site's routes

A hotkey swaps the rendered site without a rebuild, so `generateStaticParams` calls
`readAllContent()` — every site's slugs and categories, not just the build's. So all ten sites emit
HTML for the same ~143 slugs; what differs per build is the *content baked in*, not the routes.

A cold deep link to a slug belonging to a different site therefore finds a page, looks the slug up
in the current site's `contentMap`, misses, and redirects to `/`. That is intended — don't try to
resolve the slug back to its owning site.

Those redirects **must run in an effect, not during render**: prerendering has no `location`, and
calling `router.push` at render time throws for every exported page. See the DOC comments in
`components/video`, `components/art`, and `components/list/client-list`.

The DOC comments in `src/lib/content.ts` are the authority on param generation — read them first.

### Server vs client components

Server components do the build-time work: `app/layout.tsx` reads content off disk, the dynamic
routes generate params. Everything interactive is a client component (`'use client'`), and several
areas are split in two — `server-list`/`client-list`, `server-nav`/`client-nav`,
`server-footer`/`client-footer`. The server half is what lands in the exported HTML, so
**anything that must be in the static markup (SEO, above-the-fold) belongs in the server half.**

### Content: baked vs fetched

- The **default site's** content is read from `content/content-{site}.json` at build time by
  `readSiteContent()` in `src/lib/content.ts`, called from `app/layout.tsx` (a server component)
  and passed into `Providers` as `defaultContent`.
- **Every other site's** content is fetched at runtime by `providers/sites.tsx` from
  `${config.contentUrl}/content-{site}.json` — a _versioned_ GCS path
  (`https://storage.googleapis.com/bcs-assets/content/v8`), cached in `contentMap` after first load.

So editing `content/content-art.json` only affects a build whose `selectedSite` is `art`. For every
other site to see it, the JSON has to be uploaded to the GCS content bucket. Bumping the content
version means changing `contentUrl` and redeploying all ten sites.

`construction` is special-cased everywhere — it has no content list and renders `<Construction />`.

### Content generation

`content/` holds the generated JSON. The CSV sources these scripts read are **not in the repo** —
`loadSheet` in `scripts/csv.ts` resolves names against `content/`, so you have to put them there
before any of the parse scripts will run.

| Script               | Reads                                 | Writes                                             |
| -------------------- | ------------------------------------- | -------------------------------------------------- |
| `parse-content.ts`   | `content-biz.csv`                     | `content/content-biz.json`                         |
| `parse-structure.ts` | `site-structure.csv`, `nav-{key}.csv` | `content/sites.json` (see gotcha)                  |
| `wtf-generator.ts`   | `content/sites.next.json`             | `content/sites.next.json`, with the `wtf` entry    |
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

All in `src/app/providers.tsx`, outermost first:
`ThemeProvider` → `SitesDataProvider` (selected site, per-site content map, fullScreen) →
`AnimationsProvider` (bizerk mode, grid/nav animation counters) → `SoundProvider` (Web Audio
buffers, analyzer) → `WindowSizeProvider` → `PathProvider` (prevPath, pathStack).

Mounted once in the root layout, above `{children}`, which is what lets client state survive
navigation between routes.

### Interaction model

- **Hotkeys** (`src/app/shell.tsx`): `a b f r g c y w t` switch site; **space** toggles between
  hotkey mode and audio-preview mode (same keys then play that site's audio via a GSAP tween);
  **Escape** exits fullscreen. The map and its `isHotKey` type guard live in `src/constants.ts` —
  go through the guard, so a raw `KeyboardEvent.key` narrows to a real `SiteKey` before any lookup.
- **"Bizerk"**: clicking `#bizerk-icon` (or anywhere on `construction`) screenshots the DOM with
  html-to-image and feeds the PNG into the GLSL `ParticleSystem` in `components/glfx`.
- Below 768px, navigating anywhere other than `/` or `/category/*` forces fullscreen.

## Deploy

All ten sites are **hosting targets of one Firebase project** (`api-project-992432653598`), and both
halves of that mapping live in this repo:

- `.firebaserc` — the project id plus the ten `target → site id` pairs (`biz` → `bettercallsal-biz`).
- `firebase.json` — a `hosting` **array**, one entry per target, each serving `dist/<site>`.

`./deploy.sh` builds each requested site into `dist/<site>`, then ships them in a **single**
`firebase deploy --only hosting:biz,hosting:art,…`. With no arguments it does all ten; pass site
keys to do a subset, or `--dry-run` to build without deploying.

Per-build config is passed as **real env vars** (`selectedSite=… spotifyEnabled=true
gtagEnabled=true localImages=false pnpm static`). `next.config.js` overlays `process.env` onto
`next.config.env.json`, so deploys never write to the tracked file and the working tree stays clean.
Only keys already present in the JSON are read. `deploy.sh` maps the `fans` target onto
`selectedSite: 'biz'` (`fans` is a deploy target, not a `SiteKey`).

`experiments` is *not* pinned by `deploy.sh` — it ships whatever `next.config.env.json` has
committed.

Cache headers are set per target: `/_next/**` is immutable for a year, `/scripts/**` for a day, and
`**/*.@(html|txt)` is `no-cache` so pages and RSC route payloads never outlive a deploy. The three
globs are deliberately disjoint — Firebase does not document precedence when two header rules match
one path, so don't add an overlapping `**` rule.

## Conventions

- **Biome** (`biome.json`) is the only formatter and linter — prettier and eslint are gone. 4-space,
  single quotes, semicolons, 150 width, trailing comma `es5`; `assist.organizeImports` handles import
  order, and `suspicious/noExplicitAny` errors via the recommended preset.
- **Style biome does not enforce, but match anyway**: single-statement `if`s have no braces (the old
  `curly: multi`), and components are arrow functions.
- **`useExhaustiveDependencies` is off** in `biome.json`. Effects here deliberately omit deps (see
  the `dont add images as a dep!` note in `components/art`), and a dep array is load-bearing — it
  decides when the effect re-runs. Don't add deps to satisfy a linter; don't turn the rule back on.
- **Imports**: `@/*` → `src/*`. Scripts import across the boundary with relative paths
  (`../src/types`), since they run outside Next's alias resolution.
- **Types are zod-first**: `src/types/` defines `XValidator` schemas and infers the TS type from
  them. Content and site structure are parsed through these at both build and runtime — adding a
  field means updating the validator, the CSV, and the generated JSON together.
- **Don't index a map with an unvalidated string.** `SiteMap`/`contentMap` are keyed by `SiteKey`;
  anything arriving as a bare `string` (a keypress, a route param) goes through a zod validator or
  a type guard first. `Record<string, SiteKey>` looks safe and isn't — it claims every string is a
  hit, so an `!== undefined` check narrows nothing.

## Gotchas

- **`next.config.env.json` is the local-dev default, not a deploy input.** Deploys override it with
  env vars and leave it untouched. Edit it to change what `pnpm dev` picks up; nothing rewrites it.
- **`.nvmrc` says 22, which may not be installed.** If the shell has an nvm auto-switch hook, `cd`
  into this repo fails with `N/A: version "v22" is not yet installed` and takes the whole command
  with it. Either `nvm install 22` or use absolute paths / `git -C` instead of `cd`.
- **`SiteKey` has 9 values; there are 10 deploy targets.** `fans` builds from `biz`.
- **`config.localImages` is wired to the wrong env var** — `src/constants.ts:11` reads
  `process.env.spotifyEnabled`. Nothing consumes `config.localImages` today (only `next.config.js`
  reads `env.localImages`, correctly), so it's latent, but don't trust that field.
- **`parse-structure.ts` writes `content/sites.json`, but the app reads `content/sites.next.json`**
  (via `src/constants.ts`, and `wtf-generator.ts` reads *and* rewrites it). `sites.json` isn't in
  the repo, so regenerating site structure is not a one-script job — check where the output has to
  land before running it.
- **`buildSiteSlugs` in `src/lib/content.ts` is unused.** Both dynamic routes use `readAllContent`
  instead. Left in place deliberately; don't wire it up without reading its DOC comment first.
- **`pnpm clean` only removes `out/` and `dist/`,** not `.next/`.
