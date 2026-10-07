import { describe, expect, it } from "vitest";
import {
  validateLogin,
  validateRegister,
} from "../validators/auth.validator.js";

describe("auth validators", () => {
  describe("validateRegister", () => {
    it("accepts valid registration data", () => {
      expect(
        validateRegister("Sagnik", "sagnik@example.com", "Password123"),
      ).toBeNull();
    });

    it("rejects a name shorter than 2 characters", () => {
      expect(
        validateRegister("S", "sagnik@example.com", "Password123"),
      ).toBe("Name must be at least 2 characters");
    });

    it("rejects an invalid email", () => {
      expect(
        validateRegister("Sagnik", "invalid-email", "Password123"),
      ).toBe("Valid email is required");
    });

    it("rejects a password shorter than 6 characters", () => {
      expect(
        validateRegister("Sagnik", "sagnik@example.com", "12345"),
      ).toBe("Password must be at least 6 characters");
    });
  });

  describe("validateLogin", () => {
    it("accepts valid login data", () => {
      expect(validateLogin("sagnik@example.com", "Password123")).toBeNull();
    });

    it("rejects a missing email", () => {
      expect(validateLogin("", "Password123")).toBe("Valid email is required");
    });

    it("rejects a missing password", () => {
      expect(validateLogin("sagnik@example.com", "")).toBe(
        "Password is required",
      );
    });
  });
});
