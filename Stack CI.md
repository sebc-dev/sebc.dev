### Formatage & Lint

|Outil|Rôle|
|---|---|
|**Prettier** + `prettier-plugin-astro`|Formatage (TS, JS, JSON, CSS, Astro, MD/MDX)|
|**ESLint 9** + `eslint-plugin-astro` + `typescript-eslint`|Lint TS/JS/Astro|
|**markdownlint-cli2**|Lint contenu éditorial MD/MDX|
|**astro check**|Type-check composants Astro|

### Tests

|Couche|Outil|Scope|
|---|---|---|
|**Unit**|Vitest|Helpers i18n, slug, reading time, filtres taxonomie, navigation série|
|**Component**|Vitest + Testing Library|Composants interactifs (filtres, search, language switch)|
|**Integration**|Playwright (Chromium)|Parcours critiques : i18n, hub recherche, navigation série|
|**Mutation**|Stryker (Vitest runner)|**Local uniquement** — validation qualité des tests écrits par Claude Code|

### Sécurité & Qualité

|Outil|Rôle|
|---|---|
|**npm audit**|Vulnérabilités dépendances|
|**knip**|Code mort, dépendances inutilisées, exports orphelins|
|**Lighthouse CI**|Performance, accessibilité, SEO (pilier 3)|

---

## GitHub Actions

### Quality Gate (PR)

```yaml
# .github/workflows/quality.yml
name: Quality Gate
on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci

      # Formatage
      - run: npx prettier --check .

      # Lint
      - run: npx eslint .
      - run: npx markdownlint-cli2 "src/content/**/*.{md,mdx}"
      - run: npx astro check

      # Code mort
      - run: npx knip

      # Tests unitaires + composants
      - run: npx vitest run --coverage

      # Sécurité
      - run: npm audit --audit-level=moderate

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install chromium --with-deps
      - run: npx playwright test

  lighthouse:
    runs-on: ubuntu-latest
    needs: [check]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v12
        with:
          configPath: ./lighthouserc.json
          uploadArtifacts: true
```

### Deploy (push main)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          command: pages deploy dist --project-name=sebc-dev
```

---

## Config fichiers

### Lighthouse CI

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run preview",
      "url": [
        "http://localhost:4321/en/",
        "http://localhost:4321/fr/",
        "http://localhost:4321/en/search"
      ],
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }]
      }
    }
  }
}
```

### ESLint

```javascript
// eslint.config.js
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.strict,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // overrides
    }
  }
];
```

### Prettier

```javascript
// prettier.config.mjs
export default {
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: { parser: "astro" }
    }
  ]
};
```

### Stryker (local uniquement)

```javascript
// stryker.config.mjs
export default {
  testRunner: "vitest",
  reporters: ["clear-text", "html"],
  mutate: [
    "src/utils/**/*.ts",
    "src/lib/**/*.ts",
    "src/content/**/*.ts",
    "!src/**/*.astro",
    "!src/**/*.d.ts"
  ],
  mutator: {
    excludedMutations: ["StringLiteral"]
  },
  thresholds: {
    high: 80,
    low: 60,
    break: 50
  }
};
```

---

## DX locale

### Scripts

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint .",
    "lint:content": "markdownlint-cli2 'src/content/**/*.{md,mdx}'",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:mutation": "npx stryker run",
    "test:e2e": "playwright test"
  }
}
```

### Pre-commit (lefthook)

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    prettier:
      glob: "*.{ts,tsx,js,jsx,json,css,astro,md,mdx}"
      run: npx prettier --check {staged_files}
    eslint:
      glob: "*.{ts,tsx,js,jsx,astro}"
      run: npx eslint {staged_files}
    content:
      glob: "*.{md,mdx}"
      run: npx markdownlint-cli2 {staged_files}
```

---

## Progression recommandée

|Quand|Quoi|
|---|---|
|**Jour 1**|Prettier + ESLint + astro check + Vitest + lefthook|
|**Semaine 1**|Playwright sur parcours critiques (i18n, search hub, série)|
|**Semaine 2**|Lighthouse CI + knip + markdownlint-cli2|
|**En continu**|Stryker en local après chaque session de tests avec Claude Code|