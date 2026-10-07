import { apiRequest } from "./apiClient";

export const logoutApi = () =>
  apiRequest<null>("/api/auth/logout", {
    method: "POST",
  });
