import { describe, it, expect } from "vitest";
import { formatDate } from "./dates";

describe("formatDate", () => {
  const date = new Date("2025-03-15T00:00:00Z");

  it("formats date in English", () => {
    const result = formatDate(date, "en");
    expect(result).toBe("Mar 15, 2025");
  });

  it("formats date in French", () => {
    const result = formatDate(date, "fr");
    expect(result).toBe("15 mars 2025");
  });

  it("falls back to en-US for unknown locale", () => {
    const result = formatDate(date, "de");
    expect(result).toBe("Mar 15, 2025");
  });

  it("handles different dates correctly", () => {
    const jan1 = new Date("2024-01-01T00:00:00Z");
    expect(formatDate(jan1, "en")).toBe("Jan 1, 2024");
    expect(formatDate(jan1, "fr")).toBe("1 janv. 2024");
  });
});
