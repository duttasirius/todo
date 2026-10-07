import type {
  CreateTodoInput,
  Todo,
  UpdateTodoInput,
  User,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const authApi = {
  register: (payload: { name: string; email: string; password: string }) =>
    request<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request<null>("/api/auth/logout", {
      method: "POST",
    }),

  me: () => request<User>("/api/auth/me"),
};

export const todoApi = {
  list: () => request<Todo[]>("/api/todos"),

  get: (id: string) => request<Todo>(`/api/todos/${id}`),

  create: (payload: CreateTodoInput) =>
    request<Todo>("/api/todos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateTodoInput) =>
    request<Todo>(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    request<null>(`/api/todos/${id}`, {
      method: "DELETE",
    }),
};
