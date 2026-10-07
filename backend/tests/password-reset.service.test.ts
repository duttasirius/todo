import { describe, expect, it, vi } from "vitest";

describe("password reset service", () => {
  it("does not send email when the account does not exist", async () => {
    vi.resetModules();

    const select = vi.fn().mockResolvedValue(null);

    vi.doMock("../models/user.model.js", () => ({
      User: {
        findOne: vi.fn().mockReturnValue({ select }),
      },
    }));

    const sendPasswordResetOtp = vi.fn();

    vi.doMock("../utils/send-email.js", () => ({
      sendPasswordResetOtp,
    }));

    const { requestPasswordReset } = await import(
      "../services/password-reset.service.js"
    );

    await requestPasswordReset("missing@example.com");

    expect(select).toHaveBeenCalledWith(
      "+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetVerified",
    );
    expect(sendPasswordResetOtp).not.toHaveBeenCalled();
  });
});
