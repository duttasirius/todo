import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { sendPasswordResetOtp } from "../utils/send-email.js";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000;

const generateOtp = (): string =>
  crypto.randomInt(0, 1_000_000).toString().padStart(OTP_LENGTH, "0");

export const requestPasswordReset = async (email: string): Promise<void> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetVerified");

  if (!user) {
    return;
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  user.passwordResetOtpHash = otpHash;
  user.passwordResetOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
  user.passwordResetVerified = false;
  await user.save();

  try {
    await sendPasswordResetOtp(normalizedEmail, otp);
  } catch (error) {
    user.passwordResetOtpHash = undefined;
    user.passwordResetOtpExpiresAt = undefined;
    user.passwordResetVerified = false;
    await user.save();
    throw error;
  }
};

export const verifyPasswordResetOtp = async (
  email: string,
  otp: string,
): Promise<void> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (
    !user ||
    !user.passwordResetOtpHash ||
    !user.passwordResetOtpExpiresAt ||
    user.passwordResetOtpExpiresAt.getTime() < Date.now()
  ) {
    throw new Error("Invalid or expired reset code");
  }

  const valid = await bcrypt.compare(otp, user.passwordResetOtpHash);

  if (!valid) {
    throw new Error("Invalid or expired reset code");
  }

  user.passwordResetVerified = true;
  user.passwordResetOtpHash = undefined;
  user.passwordResetOtpExpiresAt = undefined;

  await user.save();
};

export const resetPassword = async (
  email: string,
  password: string,
): Promise<void> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password +passwordResetVerified");

  if (!user || !user.passwordResetVerified) {
    throw new Error("Reset code verification is required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  user.password = await bcrypt.hash(password, 12);
  user.passwordResetVerified = false;

  await user.save();
};
