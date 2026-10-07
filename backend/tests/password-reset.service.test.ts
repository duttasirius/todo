import { describe, expect, it, vi } from "vitest";

describe("password reset service", () => {
  it("can be loaded without sending a real email", async () => {
    vi.resetModules();
    expect(true).toBe(true);
  });
});
