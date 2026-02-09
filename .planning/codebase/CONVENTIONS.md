# Coding Conventions

**Analysis Date:** 2026-02-09

## Naming Patterns

**Files:**
- PascalCase for Astro components: `BaseLayout.astro`, `Layout.astro`
- camelCase for TypeScript configuration and utility files: `content.config.ts`, `env.d.ts`
- kebab-case for directories organizing feature areas: `src/components/shared/`, `src/pages/en/articles/`
- Import aliases use `@/` prefix mapping to `src/` root via `tsconfig.json` baseUrl

**Functions & Variables:**
- camelCase for all JavaScript/TypeScript functions and variables
- Observable in `astro.config.mjs`: `defineConfig()`, `defineCollection()`
- Example from `src/content.config.ts`: `articles` collection with schema properties like `pillarTags`, `readingTime`

**Types & Interfaces:**
- PascalCase for interfaces: `Props`, `Env` (in `src/env.d.ts`)
- Example: `interface Props { title: string; description?: string; }`
- Zod schema validation with lowercase keys matching content frontmatter

**Constants & Enums:**
- Enum values use uppercase: `["IA", "Ingénierie", "UX"]` for pillarTags (French technical terms)
- Configuration values use UPPERCASE with hyphens: `teal`, `void`, `canvas` for CSS color names

## Code Style

**Formatting:**
- Prettier 3.8.1 with `prettier-plugin-astro` for `.astro` file support
- Config file: `prettier.config.mjs`
- Excluded files in `.prettierignore`: `*.md`, `.claude/`, `design-research/`, `node_modules/`, `dist/`
- Default Prettier settings: 2-space indentation, single quotes (inferred), line length 80 (default)

**Linting:**
- ESLint 9.39.2 with `eslint-plugin-astro` and `typescript-eslint/8.54.0`
- Config: `eslint.config.js` using flat config format (ESLint 9+)
- Base config: `tseslint.configs.strict` + `eslintPluginAstro.configs.recommended`
- Single exception: `@typescript-eslint/no-empty-object-type` disabled
- Ignored paths: `dist/`, `.astro/`, `.wrangler/`, `node_modules/`, `public/pagefind/`, `.stryker-tmp/`, `worker-configuration.d.ts`

## Import Organization

**Order:**
1. External dependencies from npm packages (e.g., `import { defineConfig } from "astro/config"`)
2. Astro-specific imports (e.g., `from "astro/zod"`, `from "astro:content"`)
3. Integration imports (e.g., `import mdx from "@astrojs/mdx"`)
4. Internal project imports using path aliases (e.g., `from "@/layouts/BaseLayout.astro"`, `from "@/styles/global.css"`)

**Path Aliases:**
- `@/*` maps to `src/*` (configured in `tsconfig.json` paths)
- Used consistently across Astro pages and components: `import BaseLayout from "@/layouts/BaseLayout.astro"`

**Astro-Specific Imports:**
- Use `from "astro/zod"` NOT `from "zod"` (per Astro 5 rules in project memory)
- Use `import { render } from 'astro:content'` for content processing
- Use `loader: glob()` for content collection patterns (not `type: 'content'`)

## Error Handling

**Current Status:**
- No explicit error handling patterns observed in current codebase (project in early stage with minimal utility code)
- Astro build errors caught by `astro check` in linting pipeline

**Recommended Pattern (based on tooling):**
- Use TypeScript strict mode for null safety: `strictNullChecks: true` in `tsconfig.json`
- Zod schema validation for content safety: `z.string()`, `z.enum()`, `z.array()`, `z.object()` in `src/content.config.ts`
- Browser script errors use `new IntersectionObserver()` with fallback handling in `BaseLayout.astro`

## Logging

**Framework:**
- `console` methods for development (no structured logging library detected)
- Logs are inline in scripts, e.g., `console` used implicitly in intersection observer callback

**Patterns:**
- No explicit logging observed in production code
- CI/CD uses GitHub Actions output via workflow steps in `.github/workflows/`

## Comments

**When to Comment:**
- JSDoc comments absent in current codebase (early stage project)
- Code is self-documenting through schema definitions and type safety

**TSDoc/JSDoc:**
- Not currently used; TypeScript types provide documentation
- Example: `interface Props { title: string; description?: string; }` is self-explanatory

## Function Design

**Size:**
- Minimal functions in current codebase; components handle single responsibilities
- Page components are thin wrappers: `en/index.astro` wraps content in `BaseLayout` with title/description props

**Parameters:**
- Astro component props use typed interfaces: `interface Props { title: string; description?: string; }`
- Default values use destructuring: `const { title, description = "..." } = Astro.props;`
- Optional fields marked with `?`: `description?: string`

**Return Values:**
- Astro components return JSX-like template syntax
- Content queries return strongly-typed collections via Astro Content API
- Example: `const articles = defineCollection({ schema: z.object({ ... }) })`

## Module Design

**Exports:**
- Named exports preferred: `export const collections = { articles };`
- Default exports for Astro configuration files: `export default defineConfig({...})`
- Content collection pattern: single `collections` object with typed entries

**Barrel Files:**
- Not currently used (project structure is flat with directories organizing by feature)
- Would be used in `src/components/` if components were organized into submodules

## Astro-Specific Patterns

**Frontmatter Structure:**
- Astro frontmatter (server-side) separated with `---` delimiters
- Imports placed in frontmatter: `import BaseLayout from "@/layouts/BaseLayout.astro"`
- Props destructured from `Astro.props`: `const { title, description = "..." } = Astro.props`
- Locale detection: `const lang = Astro.currentLocale ?? "en"`

**Layout Pattern:**
- `BaseLayout.astro` serves as master template with `<slot />`
- All pages extend BaseLayout with title and description props
- Uses CSS `@reference` for Tailwind v4 `@apply` support: `@reference "../styles/global.css"`

**Content Schema:**
- Strict Zod validation in `src/content.config.ts`
- Multilingual support with `lang` enum: `z.enum(["fr", "en"])`
- Pillar tags as mandatory enum: `z.array(z.enum(["IA", "Ingénierie", "UX"])).min(1, "...")`
- Optional fields for series and translations: `series: z.object({...}).optional()`

---

*Convention analysis: 2026-02-09*
