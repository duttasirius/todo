import { apiRequest } from "./apiClient";
import type { Todo } from "../types";

export const getTodosApi = () =>
  apiRequest<Todo[]>("/api/todos");
