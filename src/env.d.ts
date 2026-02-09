/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

interface Env {
  [key: string]: unknown;
}

declare namespace App {
  interface Locals extends Runtime {}
}
