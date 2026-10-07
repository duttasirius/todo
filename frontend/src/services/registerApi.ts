import { apiRequest } from "./apiClient";
import type { User } from "../types";

export const registerApi = (payload: {
  name: string;
  email: string;
  password: string;
}) =>
  apiRequest<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
