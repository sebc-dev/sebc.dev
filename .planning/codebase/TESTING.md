# Testing Patterns

**Analysis Date:** 2026-02-09

## Test Framework

**Runner:**
- Vitest 3.2.4
- Config: `vitest.config.ts`
- Uses `getViteConfig()` from `astro/config` to integrate with Astro's Vite setup
- Environment: Node.js (not browser/jsdom)
- Global test API enabled: `globals: true`

**Assertion Library:**
- Vitest built-in assertions (no external library detected)
- Vitest 3.x enforces compatibility with Astro 5.x (Astro 5.17.1)

**Run Commands:**
```bash
npm run test              # Run all tests once
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report with v8 provider
```

## Test File Organization

**Location:**
- Co-located pattern: tests placed alongside source in same directories
- Pattern from `vitest.config.ts`: `include: ["src/**/*.{test,spec}.ts"]`
- Currently no test files exist in project (e2e tests only)

**Naming:**
- Test files use `.test.ts` or `.spec.ts` suffix
- Example convention: `utils/helper.ts` paired with `utils/helper.test.ts`

**Structure:**
```
src/
├── utils/
│   ├── helper.ts
│   └── helper.test.ts
├── lib/
│   ├── service.ts
│   └── service.test.ts
└── content.config.ts  # No tests (generated code)
```

## Test Structure

**Suite Organization:**
```typescript
// Pattern (not yet implemented in project):
describe('Module Name', () => {
  describe('feature area', () => {
    it('should do specific behavior', () => {
      // Arrange
      const input = 'value'

      // Act
      const result = functionUnderTest(input)

      // Assert
      expect(result).toBe(expected)
    })
  })
})
```

**Patterns:**
- AAA pattern (Arrange-Act-Assert) recommended
- Setup per test suite using `beforeEach()` if needed
- Teardown using `afterEach()` if needed
- Global test API enabled means no imports required for `describe`, `it`, `expect`

## Mocking

**Framework:**
- Vitest has built-in mocking capabilities (no external mocking library configured)
- Supports `vi.mock()`, `vi.fn()`, `vi.spyOn()`

**Patterns:**
```typescript
// Pattern example (not yet in codebase):
import { vi, describe, it, expect } from 'vitest'

describe('Service with dependencies', () => {
  it('should call external API', () => {
    const mockAPI = vi.fn().mockResolvedValue({ data: 'test' })
    // Test implementation
  })
})
```

**What to Mock:**
- External API calls
- File system operations (fs module)
- Date/time dependencies via `vi.useFakeTimers()`
- Module-level side effects via `vi.mock()`

**What NOT to Mock:**
- Pure functions from same module
- Validation functions (test real behavior)
- Zod schema parsing (ensure actual validation works)
- Content configuration loading

## Fixtures and Factories

**Test Data:**
- Currently no test fixtures found
- When needed, create factories in `src/fixtures/` or co-located with tests
- Example pattern for content testing:
```typescript
const createArticle = (overrides = {}) => ({
  title: 'Test Article',
  description: 'Test description',
  date: new Date('2026-01-01'),
  category: 'Testing',
  tags: ['test'],
  pillarTags: ['IA'],
  readingTime: 5,
  featured: false,
  draft: false,
  lang: 'en',
  ...overrides,
})
```

**Location:**
- `src/fixtures/` directory (not yet created)
- Or co-located: `src/utils/__fixtures__/helper.fixtures.ts`

## Coverage

**Requirements:**
- Mutation testing threshold set in `stryker.config.mjs`:
  - High: 80%
  - Low: 60%
  - Break: 50% (CI fails if below)
- Coverage provider: v8 (configured in `vitest.config.ts`)
- Excluded files: `**/*.config.*`, `src/content.config.ts`, `src/env.d.ts`

**View Coverage:**
```bash
npm run test:coverage
# Generates coverage report in `coverage/` directory
```

**Mutation Testing:**
```bash
npm run test:mutation
# Uses Stryker with Vitest runner
# Mutates: src/utils/**/*.ts, src/lib/**/*.ts
# Excludes: .astro files, .d.ts files
# Reports: clear-text + html
```

## Test Types

**Unit Tests:**
- Scope: Individual functions, utilities, pure transformations
- Approach: Test inputs/outputs with `expect()`
- Example targets: functions in `src/utils/`, `src/lib/`
- Should verify behavior without external dependencies

**Integration Tests:**
- Scope: Content collection loading, schema validation, module interactions
- Approach: Use real Zod schemas from `src/content.config.ts`
- Example: Test article schema parsing with valid/invalid frontmatter

**E2E Tests:**
- Framework: Playwright 1.58.2
- Config: `playwright.config.ts`
- Test directory: `e2e/` (currently empty)
- Browser: Chromium (Desktop Chrome device)
- Base URL: `http://localhost:4321` (local Astro dev server)
- Web server setup: Builds and serves via Wrangler Pages Dev
- CI configuration: 2 retries on failure, traces captured on first retry

## Common Patterns

**Async Testing:**
```typescript
// Pattern (Vitest handles async naturally):
it('should fetch data', async () => {
  const result = await fetchData()
  expect(result).toBeDefined()
})

// Or with done callback:
it('should call callback', (done) => {
  fetchData().then(() => done()).catch(done)
})
```

**Error Testing:**
```typescript
// Pattern:
it('should throw on invalid input', () => {
  expect(() => {
    parseArticle({ invalid: true })
  }).toThrow()
})

// Or for async:
it('should reject on error', async () => {
  await expect(fetchArticle('invalid')).rejects.toThrow()
})
```

**Schema Validation Testing:**
```typescript
// Pattern (for content testing):
import { articles } from '@/content.config'

it('should validate correct article schema', async () => {
  const article = {
    title: 'Test',
    description: 'Desc',
    date: new Date(),
    category: 'Tech',
    tags: ['test'],
    pillarTags: ['IA'],
    readingTime: 5,
    lang: 'en',
  }
  // Would need Zod parsing logic to test
})
```

## Quality Gate

**GitHub Actions Quality Pipeline** (`.github/workflows/quality.yml`):
1. **Formatting**: `prettier --check .`
2. **Linting**:
   - `eslint .`
   - `markdownlint-cli2 'src/content/**/*.{md,mdx}'`
   - `astro check` (type checking)
3. **Dead Code**: `knip`
4. **Unit/Component Tests**: `vitest run --coverage`
5. **Security**: `npm audit --audit-level=moderate`
6. **E2E Tests**: Playwright on separate job
7. **Performance**: Lighthouse CI on separate job

**All tests must pass before PR merge.**

---

*Testing analysis: 2026-02-09*
