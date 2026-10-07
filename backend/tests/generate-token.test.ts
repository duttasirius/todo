import * as process from "node:process";
import jwt from "jsonwebtoken";
import { afterEach, describe, expect, it } from "vitest";
import { generateToken } from "../utils/generate-token.js";

describe("generateToken", () => {
  const originalSecret = process.env.JWT_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  it("creates a valid JWT containing the user id", () => {
    process.env.JWT_SECRET = "unit-test-secret";

    const token = generateToken("user-123");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded).toHaveProperty("userId", "user-123");
  });

  it("throws when JWT_SECRET is not configured", () => {
    delete process.env.JWT_SECRET;

    expect(() => generateToken("user-123")).toThrow(
      "JWT_SECRET is not configured",
    );
  });
});
