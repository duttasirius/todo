import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import type { LoginData, RegisterData } from "../types/auth.types.js";

export const registerUser = async ({ name, email, password }: RegisterData) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 12);

  return User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    authProvider: "local",
  });
};

export const loginUser = async ({ email, password }: LoginData) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user || !user.password) throw new Error("Invalid email or password");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid email or password");

  return user;
};
