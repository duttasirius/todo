import type { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { generateToken } from "../utils/generate-token.js";

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
