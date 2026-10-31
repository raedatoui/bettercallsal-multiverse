# Repository Guidelines

## Project Structure & Module Organization

This Next.js 16 / React 19 application exports ten Firebase sites; nine `SiteKey` values serve them because `fans` builds from `biz`.

- `src/app/`: App Router routes, layouts, and persistent `shell.tsx`.
- `src/components/`, `src/providers/`, `src/styles/`: UI, shared state, and styled-components.
- `src/types/`: Zod schemas and inferred types; `src/lib/content.ts`: build-time content loading.
- `content/`: generated JSON; `scripts/`: content tools. Source CSVs are not tracked.
- Assets live on GCS; most `public/` asset directories are ignored.

## Build, Test, and Development Commands

Use Node 24 (`nvm use`) and the pinned pnpm version.

- `pnpm install`: install dependencies.
- `pnpm dev`: start local development.
- `pnpm build` / `pnpm static`: export into `out/`.
- `pnpm lint`: Biome lint; `pnpm format`: rewrite formatting.
- `pnpm check`: rewrite formatting, lint fixes, and imports.
- `pnpm clean`: remove `out/` and `dist/`, retaining `.next/`.
- `./deploy.sh biz wtf`: build and deploy selected targets; no arguments deploys all ten. `--dry-run` builds without deploying.

Run content scripts with `TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' pnpm ts-node scripts/<script>.ts`.

## Architecture & Configuration

Change `selectedSite` in `next.config.env.json` and restart for local development. Deployments override selected settings through environment variables; other JSON values, including `experiments`, remain inputs. These values enter client bundles: never store secrets there.

Read `config` from `src/constants.ts` in components. Default-site content is bundled; hotkey-selected sites fetch GCS JSON. Local JSON edits therefore require upload for other builds.

Dynamic routes must generate parameters from `readAllContent()`. Keep missing-content redirects in effects. The unused `buildSiteSlugs()` helper has obsolete routing comments.

Known pitfalls: `config.localImages` incorrectly reads `spotifyEnabled`; `parse-structure.ts` writes `sites.json`, while the app reads `sites.next.json`.

## Coding Style & Naming Conventions

Use four spaces, single quotes, semicolons, ES5 trailing commas, and Biome's 150-column width. Match kebab-case filenames, PascalCase components, and arrow components. Import source through `@/*`; scripts use relative imports. Define `XValidator` schemas before inferred types. Validate string keys before map access. Preserve intentional effect dependencies; exhaustive-dependency linting is disabled.

## Testing Guidelines

No automated test suite, test command, or coverage requirement exists. Playwright supports crawling. Run verification only when explicitly requested; report checks performed or skipped.

## Commit & Pull Request Guidelines

Use short, imperative commit subjects, such as `fix cold deep links`. Keep changes focused; omit AI attribution. PRs should explain behavior, affected sites, validation, and relevant issues; include screenshots for visual changes.
