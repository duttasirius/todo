import { apiRequest } from "./apiClient";
import type { Todo, UpdateTodoInput } from "../types";

export const updateTodoApi = (id: string, payload: UpdateTodoInput) =>
  apiRequest<Todo>(`/api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
