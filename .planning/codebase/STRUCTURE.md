# Codebase Structure

**Analysis Date:** 2026-02-09

## Directory Layout

```
sebc.dev/
├── src/                          # Source code
│   ├── pages/                    # File-based routing (Astro)
│   │   ├── index.astro           # Root redirect → /en/
│   │   ├── en/                   # English locale
│   │   │   ├── index.astro       # Home page /en/
│   │   │   └── articles/         # Article pages /en/articles/[slug]
│   │   └── fr/                   # French locale
│   │       ├── index.astro       # Home page /fr/
│   │       └── articles/         # Article pages /fr/articles/[slug]
│   ├── layouts/                  # Reusable page layouts
│   │   └── BaseLayout.astro      # Default layout (HTML, head, body wrapper)
│   ├── components/               # UI components
│   │   ├── about/                # About section components
│   │   ├── article/              # Article-specific components
│   │   ├── layout/               # Layout building blocks
│   │   ├── shared/               # Shared UI components
│   │   └── ui/                   # Atomic UI elements
│   ├── content/                  # Content collections
│   │   └── articles/             # Article content (MDX files)
│   ├── styles/                   # Global styles
│   │   └── global.css            # Tailwind setup, theme, animations, prose
│   ├── assets/                   # Static assets (images, fonts, etc.)
│   ├── lib/                      # Utility libraries (empty - ready for shared code)
│   ├── utils/                    # Helper functions (empty - ready for utilities)
│   ├── types/                    # TypeScript type definitions (empty - ready for types)
│   ├── content.config.ts         # Content collection schema definition
│   └── env.d.ts                  # Type definitions for Astro environment
├── public/                       # Static files (favicon, robots.txt, etc.)
│   └── .assetsignore             # Assets to exclude from optimization
├── e2e/                          # End-to-end tests (empty - ready for Playwright)
├── astro.config.mjs              # Astro framework configuration
├── vitest.config.ts              # Unit test runner configuration
├── eslint.config.js              # ESLint linting rules
├── prettier.config.mjs           # Code formatter configuration
├── playwright.config.ts          # E2E test configuration (generated/auto)
├── stryker.config.mjs            # Mutation testing configuration
├── tsconfig.json                 # TypeScript compilation settings
├── package.json                  # Node dependencies and scripts
├── pnpm-lock.yaml                # Dependency lock file
├── wrangler.toml                 # Cloudflare Pages deployment config
└── dist/                         # Build output (generated, not committed)
```

## Directory Purposes

**`src/pages/`:**
- Purpose: File-based routing—each `.astro` file becomes a route
- Contains: `.astro` page templates with frontmatter and HTML
- Key files: `index.astro` (root), `en/index.astro`, `fr/index.astro`, `[locale]/articles/[...slug].astro` (dynamic)

**`src/layouts/`:**
- Purpose: Reusable page wrapper templates
- Contains: `.astro` layout components (typically with `<slot />` for content injection)
- Key files: `BaseLayout.astro` (main layout with HTML structure, head metadata, fonts, global styles)

**`src/components/`:**
- Purpose: Reusable UI components (Astro components, not JS frameworks)
- Contains: `.astro` component files, organized by feature
- Key directories:
  - `about/`: About page components
  - `article/`: Article rendering components
  - `layout/`: Layout primitives (header, footer, navigation)
  - `shared/`: Shared components across sections
  - `ui/`: Atomic UI elements (buttons, cards, etc.)

**`src/content/`:**
- Purpose: Content data and collection definitions
- Contains: MDX and Markdown article files with frontmatter
- Key files: `articles/` subdirectory with individual article files

**`src/styles/`:**
- Purpose: Global styles and design system
- Contains: CSS files (Tailwind v4 with `@theme` block)
- Key files: `global.css` (theme tokens, animations, prose styles, code block styling)

**`src/assets/`:**
- Purpose: Image, font, and media assets
- Contains: Images, SVGs, and other binary assets
- Key files: (empty—ready for asset organization)

**`src/lib/`:**
- Purpose: Shared utility libraries and helper modules
- Contains: TypeScript modules for reusable logic
- Key files: (empty—ready for library code)

**`src/utils/`:**
- Purpose: Helper functions and utility modules
- Contains: TypeScript utility functions
- Key files: (empty—ready for utility code)

**`src/types/`:**
- Purpose: TypeScript type definitions and interfaces
- Contains: Type definition files (.d.ts or .ts)
- Key files: (empty—ready for type definitions)

**`public/`:**
- Purpose: Static files served as-is (no optimization)
- Contains: Files like favicon.ico, robots.txt, sitemap.xml (auto-generated)
- Key files: `.assetsignore` (excludes assets from Astro optimization)

**`e2e/`:**
- Purpose: End-to-end tests
- Contains: Playwright test files
- Key files: (empty—ready for E2E tests)

## Key File Locations

**Entry Points:**
- `src/pages/index.astro`: Root redirect to default locale
- `src/pages/en/index.astro`: English home page
- `src/pages/fr/index.astro`: French home page

**Configuration:**
- `astro.config.mjs`: Astro framework setup (i18n, adapters, integrations)
- `vitest.config.ts`: Unit test runner configuration
- `eslint.config.js`: Linting rules
- `prettier.config.mjs`: Code formatting rules
- `wrangler.toml`: Cloudflare Pages deployment configuration
- `tsconfig.json`: TypeScript compilation options
- `src/content.config.ts`: Content collection schema definition

**Core Logic:**
- `src/layouts/BaseLayout.astro`: HTML structure wrapper for all pages
- `src/styles/global.css`: Design tokens, animations, typography, code block styling
- `src/content.config.ts`: Zod schema validation for article metadata

**Testing:**
- `e2e/`: Playwright E2E test files (empty, ready to use)
- Test files: `src/**/*.{test,spec}.ts` (co-located with source)

## Naming Conventions

**Files:**
- PascalCase for `.astro` components: `BaseLayout.astro`, `ArticleCard.astro`
- camelCase for TypeScript utilities: `formatDate.ts`, `validateArticle.ts`
- kebab-case for Markdown articles: `my-article-title.mdx`

**Directories:**
- camelCase for feature directories: `src/components/about/`, `src/components/article/`
- lowercase plural for collections: `src/content/articles/`, `src/pages/`

**Locale Handling:**
- Two-letter ISO codes: `en`, `fr`
- Directory structure: `src/pages/[locale]/`, `src/pages/en/`, `src/pages/fr/`

**CSS Classes (Tailwind):**
- Utility-first via Tailwind classes: `max-w-6xl`, `mx-auto`, `px-6`, `py-16`
- Custom classes for animations: `.fade-up`, `.section-title`, `.prose`
- CSS custom properties for tokens: `var(--color-teal)`, `var(--font-code)`

## Where to Add New Code

**New Feature:**
- Primary code: `src/components/[feature-name]/`
- Page route: `src/pages/[locale]/[feature-name]/index.astro`
- Tests: `src/components/[feature-name]/Component.test.ts`
- Styles: Import Tailwind utilities in `.astro` files; shared styles in `src/styles/global.css`

**New Component/Module:**
- Implementation: `src/components/[category]/ComponentName.astro` (if UI) or `src/lib/moduleName.ts` (if logic)
- Exports: Export as default or named export
- Usage: Import with path alias `@/components/...` or `@/lib/...`

**Utilities:**
- Shared helpers: `src/utils/` for helper functions (e.g., date formatting, string utilities)
- Validation logic: `src/lib/` for domain-specific logic (e.g., article filtering, content enrichment)
- Types: `src/types/` for TypeScript definitions

**New Article:**
- Location: `src/content/articles/[language]/my-article.mdx` or language-agnostic naming with `lang` frontmatter field
- Frontmatter required: `title`, `description`, `date`, `category`, `tags`, `pillarTags`, `lang`
- Optional: `image`, `readingTime`, `featured`, `draft`, `translationSlug`, `series`

**Styles:**
- Global/theme: Update `src/styles/global.css` (Tailwind `@theme` block, animations, prose)
- Component-specific: Use Tailwind utility classes in `.astro` `class=` attributes; use `<style>` blocks for component scoping

## Special Directories

**`.astro/`:**
- Purpose: Generated Astro build artifacts (types, virtual modules)
- Generated: Yes
- Committed: No (in `.gitignore`)

**`dist/`:**
- Purpose: Build output (generated HTML, CSS, JS)
- Generated: Yes
- Committed: No (in `.gitignore`)

**`.wrangler/`:**
- Purpose: Wrangler (Cloudflare) build cache
- Generated: Yes
- Committed: No (in `.gitignore`)

**`.stryker-tmp/`:**
- Purpose: Stryker mutation testing temporary files
- Generated: Yes
- Committed: No (in `.gitignore`)

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes
- Committed: No (in `.gitignore`)

**`.claude/`:**
- Purpose: Claude AI tooling configuration and commands
- Generated: No
- Committed: Yes (IDE-like local configuration)

**`.planning/`:**
- Purpose: GSD (Get Shit Done) planning documents
- Generated: Yes (by GSD orchestrator)
- Committed: Yes (planning artifacts)

**`docs/`:**
- Purpose: Documentation and guides
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-02-09*
