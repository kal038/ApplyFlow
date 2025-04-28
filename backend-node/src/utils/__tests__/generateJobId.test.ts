import { generateJobId } from "@/utils/generateJobId";
import { describe, it, expect } from "vitest";
describe("generateJobId", () => {
  it('should start with "job-"', () => {
    const id = generateJobId();
    expect(id.startsWith("job-")).toBe(true);
  });
});

describe("generateJobId", () => {
  it("should not create collision", () => {
    const id1 = generateJobId();
    const id2 = generateJobId();
    expect(id1).not.toEqual(id2);
    expect(id1.startsWith("job-")).toBe(true);
    expect(id2.startsWith("job-")).toBe(true);
    expect(id1.length).toBe(14);
    expect(id2.length).toBe(14);
  });
});
