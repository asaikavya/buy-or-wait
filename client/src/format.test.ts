import { describe, expect, it } from "vitest";
import { formatCurrency, todayIso } from "./format";

describe("formatCurrency", () => {
  it("adds a dollar sign, commas, and cents", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("shows negative amounts with a minus sign", () => {
    expect(formatCurrency(-1000)).toBe("-$1,000.00");
  });
});

describe("todayIso", () => {
  it("returns a date like 2026-10-18", () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});