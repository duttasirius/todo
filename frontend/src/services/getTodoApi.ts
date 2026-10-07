import { apiRequest } from "./apiClient";
import type { Todo } from "../types";

export const getTodoApi = (id: string) =>
  apiRequest<Todo>(`/api/todos/${id}`);
