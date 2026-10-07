const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function apiRequest<T>(
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

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? ((await response.json()) as ApiResponse<T>)
    : ({ success: response.ok, message: await response.text() } as ApiResponse<T>);

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
