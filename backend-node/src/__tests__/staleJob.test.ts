import { describe, it, expect } from "vitest";
import { isStaleTimestamp } from "@/middleware/checkStaleJob";

// Simulate env threshold
process.env.STALE_JOB_DAYS = "30";

describe("isStaleTimestamp", () => {
  it("returns false for freshly updated job", () => {
    expect(isStaleTimestamp(Date.now())).toBe(false);
  });

  it("returns true for job older than threshold", () => {
    const thirtyOneDaysMs = 31 * 24 * 60 * 60 * 1000;
    expect(isStaleTimestamp(Date.now() - thirtyOneDaysMs)).toBe(true);
  });
});
