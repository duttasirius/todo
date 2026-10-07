import { apiRequest } from "./apiClient";
import type { User } from "../types";

export const getCurrentUserApi = () =>
  apiRequest<User>("/api/auth/me");
