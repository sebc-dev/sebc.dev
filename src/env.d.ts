/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly INCLUDE_DEMO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
