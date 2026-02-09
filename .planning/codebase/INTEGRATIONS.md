# External Integrations

**Analysis Date:** 2026-02-09

## APIs & External Services

**Content Delivery & Fonts:**
- Google Fonts - Connected via `<link>` tags in `src/layouts/BaseLayout.astro`
  - Fonts loaded: Albert Sans (weights: 300, 400, 600, 700) + Fira Code (weights: 400, 500)
  - Preconnect: `fonts.googleapis.com` and `fonts.gstatic.com`

**Search:**
- Pagefind - Client-side search indexing
  - Build-time integration: `pagefind --site dist`
  - Output directory: `public/pagefind/`
  - No external API calls (entirely client-side)

## Data Storage

**Content:**
- File-based MDX articles (no database)
  - Location: `src/content/articles/`
  - Content config: `src/content.config.ts`
  - Schema: Astro Zod schema with title, description, date, category, tags, pillar tags, language

**File Storage:**
- Static assets: `public/` directory (served directly by Cloudflare Pages)
- Images: `src/assets/` (referenced in components/pages)
- Generated search index: `public/pagefind/` (generated at build time)

**Caching:**
- None detected - Static site with no runtime caching

## Authentication & Identity

**Auth Provider:**
- None detected
- Site is public with no user authentication required
- Cloudflare Pages handles deployment authorization via API token

## Monitoring & Observability

**Error Tracking:**
- None detected
- Static site with no runtime error collection

**Logs:**
- GitHub Actions: Deploy and quality gate logs
- Lighthouse CI: Performance metrics captured in CI pipeline
- No persistent error logging

**Performance Monitoring:**
- Lighthouse CI - Integrated in quality gate workflow (`.github/workflows/quality.yml`)
  - Config: `lighthouserc.json`
  - Metrics tracked: Performance, Accessibility, SEO, Best Practices
  - Minimum scores: 0.9 (90%)
  - Runs on: E2E tests completion
  - Upload: Artifacts preserved in GitHub Actions

## CI/CD & Deployment

**Hosting:**
- Cloudflare Pages (static hosting)
- Project name: `sebc-dev`
- Build output directory: `dist/`

**CI Pipeline:**
- GitHub Actions (`.github/workflows/`)

**Deploy Workflow** (`.github/workflows/deploy.yml`):
- Trigger: Push to `main` branch
- Runner: `ubuntu-latest`
- Permissions: `contents: read`, `deployments: write`
- Steps:
  1. Checkout code (actions/checkout@v4)
  2. Setup Node 22 with npm cache (actions/setup-node@v4)
  3. Cache Astro artifacts (`.astro/` directory)
  4. Install dependencies: `npm ci`
  5. Build: `npm run build` with `NODE_OPTIONS: "--max-old-space-size=4096"`
  6. Deploy to Cloudflare Pages via `cloudflare/wrangler-action@v3`
     - Uses secrets: `CF_API_TOKEN`, `CF_ACCOUNT_ID`
     - Command: `pages deploy dist --project-name=sebc-dev`

**Quality Workflow** (`.github/workflows/quality.yml`):
- Trigger: All pull requests
- Three parallel jobs:

**Check Job:**
- Node 22 with npm cache
- Format check: `prettier --check .`
- Linting:
  - ESLint on all files
  - Markdownlint on `src/content/**/*.{md,mdx}`
  - Astro type check: `astro check`
- Dead code detection: `knip`
- Unit + component tests: `vitest run --coverage`
- Security audit: `npm audit --audit-level=moderate`

**E2E Job:**
- Node 22 with npm cache
- Playwright installation: `npm ci && playwright install chromium --with-deps`
- E2E test execution: `playwright test`
- Tests located in: `e2e/` directory (empty in current state)

**Lighthouse Job:**
- Depends on: `check` job completion
- Runs: `npm run build`
- Executes: `treosh/lighthouse-ci-action@v12`
  - Config file: `lighthouserc.json`
  - Upload artifacts: enabled

## Environment Configuration

**Required env vars:**
- `CF_API_TOKEN` - Cloudflare API token (GitHub Actions secret)
- `CF_ACCOUNT_ID` - Cloudflare account ID (GitHub Actions secret)
- `NODE_OPTIONS` - Optional: `--max-old-space-size=4096` (set in CI during build)
- `CI` - Automatically set to `true` in GitHub Actions (used for Playwright retries)

**Secrets location:**
- GitHub Actions Secrets (`.github/workflows/deploy.yml` and `.github/workflows/quality.yml`)
- No `.env` files committed to repository (in `.prettierignore`)
- `wrangler.jsonc` includes compatibility config (no secrets)

## Webhooks & Callbacks

**Incoming:**
- GitHub push/PR webhooks → trigger GitHub Actions workflows
- No custom webhook endpoints detected

**Outgoing:**
- Cloudflare Pages deployment webhooks (optional, not configured)
- GitHub Actions → Cloudflare Pages API calls via wrangler-action
- No external service callbacks detected

## Third-Party Service Accounts

**GitHub:**
- OAuth/PAT required for actions (implicit via GitHub Actions context)

**Cloudflare:**
- API token required: `CF_API_TOKEN`
- Account ID required: `CF_ACCOUNT_ID`
- Service: Cloudflare Pages (static hosting)
- Service: Cloudflare Workers (optional runtime)

---

*Integration audit: 2026-02-09*
