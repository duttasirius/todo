import { apiRequest } from "./apiClient";
import type { CreateTodoInput, Todo } from "../types";

export const createTodoApi = (payload: CreateTodoInput) =>
  apiRequest<Todo>("/api/todos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
