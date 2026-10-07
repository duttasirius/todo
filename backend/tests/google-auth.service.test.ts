import { describe, expect, it, vi } from "vitest";

describe("google authentication service", () => {
  it("creates a MongoDB user when the verified Google account is new", async () => {
    vi.resetModules();

    const findOne = vi
      .fn()
      .mockReturnValueOnce({
        select: vi.fn().mockResolvedValue(null),
      })
      .mockReturnValueOnce({
        select: vi.fn().mockResolvedValue(null),
      });

    const create = vi.fn().mockResolvedValue({
      _id: "user-123",
      name: "Sagnik Dutta",
      email: "sagnik@example.com",
      firebaseUid: "firebase-123",
    });

    vi.doMock("../models/user.model.js", () => ({
      User: { findOne, create },
    }));

    vi.doMock("../utils/firebase-admin.js", () => ({
      getFirebaseAuth: vi.fn().mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: "firebase-123",
          email: "sagnik@example.com",
          email_verified: true,
          name: "Sagnik Dutta",
        }),
      }),
    }));

    const { loginWithGoogle } = await import(
      "../services/google-auth.service.js"
    );

    const user = await loginWithGoogle("firebase-id-token");

    expect(create).toHaveBeenCalledWith({
      name: "Sagnik Dutta",
      email: "sagnik@example.com",
      firebaseUid: "firebase-123",
      authProvider: "google",
    });
    expect(user.email).toBe("sagnik@example.com");
  });

  it("rejects a Google token without a verified email", async () => {
    vi.resetModules();

    const findOne = vi.fn();

    vi.doMock("../models/user.model.js", () => ({
      User: { findOne, create: vi.fn() },
    }));

    vi.doMock("../utils/firebase-admin.js", () => ({
      getFirebaseAuth: vi.fn().mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: "firebase-123",
          email: "sagnik@example.com",
          email_verified: false,
        }),
      }),
    }));

    const { loginWithGoogle } = await import(
      "../services/google-auth.service.js"
    );

    await expect(loginWithGoogle("firebase-id-token")).rejects.toThrow(
      "A verified Google email is required",
    );
    expect(findOne).not.toHaveBeenCalled();
  });
});
