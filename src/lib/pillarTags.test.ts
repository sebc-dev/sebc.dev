import { describe, it, expect } from "vitest";
import { getPillarColorClass } from "./pillarTags";

describe("getPillarColorClass", () => {
  it("returns purple classes for IA", () => {
    expect(getPillarColorClass("IA")).toBe(
      "bg-purple-500/15 border-purple-500/30 text-purple-400",
    );
  });

  it("returns teal classes for Ingénierie", () => {
    expect(getPillarColorClass("Ingénierie")).toBe(
      "bg-teal/15 border-teal/30 text-teal-bright",
    );
  });

  it("returns amber classes for UX", () => {
    expect(getPillarColorClass("UX")).toBe(
      "bg-amber-500/15 border-amber-500/30 text-amber-400",
    );
  });
});
