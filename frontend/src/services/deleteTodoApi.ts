import { apiRequest } from "./apiClient";

export const deleteTodoApi = (id: string) =>
  apiRequest<null>(`/api/todos/${id}`, {
    method: "DELETE",
  });
