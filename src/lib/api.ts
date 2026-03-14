const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
  const url = `${base}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: { ...getAuthHeaders(), ...(options.headers as Record<string, string>) },
  };

  const res = await fetch(url, config);
  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
    }
    throw new Error(`API Error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, { method: "PATCH", body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: "DELETE" }),
};

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  limit: number;
};

export { ApiError } from "./api-error";
