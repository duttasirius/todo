import { apiRequest } from "./apiClient";
import type { User } from "../types";

export const loginApi = (payload: { email: string; password: string }) =>
  apiRequest<User>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
