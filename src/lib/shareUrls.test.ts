import { describe, it, expect } from "vitest";
import {
  buildTwitterShareUrl,
  buildLinkedInShareUrl,
  buildDevToShareUrl,
} from "./shareUrls";

describe("buildTwitterShareUrl", () => {
  it("encodes title and url", () => {
    const result = buildTwitterShareUrl(
      "Hello World",
      "https://example.com/article",
    );
    expect(result).toBe(
      "https://twitter.com/intent/tweet?text=Hello%20World&url=https%3A%2F%2Fexample.com%2Farticle",
    );
  });

  it("encodes special characters", () => {
    const result = buildTwitterShareUrl(
      "C++ & Rust",
      "https://example.com/a?b=1",
    );
    expect(result).toContain("text=C%2B%2B%20%26%20Rust");
    expect(result).toContain("url=https%3A%2F%2Fexample.com%2Fa%3Fb%3D1");
  });
});

describe("buildLinkedInShareUrl", () => {
  it("includes mini=true and encodes params", () => {
    const result = buildLinkedInShareUrl(
      "My Article",
      "https://example.com/post",
    );
    expect(result).toBe(
      "https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fexample.com%2Fpost&title=My%20Article",
    );
  });
});

describe("buildDevToShareUrl", () => {
  it("builds prefill content with frontmatter", () => {
    const result = buildDevToShareUrl("My Post", "https://example.com/post");
    expect(result.startsWith("https://dev.to/new?prefill=")).toBe(true);
    const prefill = decodeURIComponent(result.split("prefill=")[1]);
    expect(prefill).toContain("title: My Post");
    expect(prefill).toContain("published: false");
    expect(prefill).toContain("Originally posted at https://example.com/post");
  });
});
