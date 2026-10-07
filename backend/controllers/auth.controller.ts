import type { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { generateToken } from "../utils/generate-token.js";
import {
  requestPasswordReset as sendResetCode,
  verifyPasswordResetOtp as verifyResetCode,
  resetPassword as resetUserPassword,
} from "../services/password-reset.service.js";

const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ success: false, message: "Name must be at least 2 characters" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ success: false, message: "Valid email is required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  try {
    const user = await registerUser({ name, email, password });
    const token = generateToken(user._id.toString());
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await loginUser({ email, password });
    const token = generateToken(user._id.toString());
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logout successful" });
};

export const getMe = async (_req: Request, res: Response) => {
  const user = await User.findById(res.locals.userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email },
  });
};


export const requestPasswordReset = async (req: Request, res: Response) => {
  const email = String(req.body?.email || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Valid email is required",
    });
  }

  try {
    await sendResetCode(email);

    return res.status(200).json({
      success: true,
      message: "If an account exists for this email, a reset code has been sent.",
    });
  } catch (error) {
    console.error("Password reset request:", error);

    return res.status(500).json({
      success: false,
      message: "Could not send the reset code right now.",
    });
  }
};

export const verifyPasswordResetOtp = async (req: Request, res: Response) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const otp = String(req.body?.otp || "").trim();

  if (!email || !email.includes("@") || !/^\\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid email and 6-digit reset code.",
    });
  }

  try {
    await verifyResetCode(email, otp);

    return res.status(200).json({
      success: true,
      message: "Reset code verified successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Invalid or expired reset code",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!email || !email.includes("@") || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Valid email and password of at least 6 characters are required.",
    });
  }

  try {
    await resetUserPassword(email, password);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Could not reset password",
    });
  }
};
