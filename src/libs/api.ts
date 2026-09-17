const BASE_URL = process.env.BACKEND_URL ?? "http://localhost:8080";
const API_PREFIX = process.env.API_PREFIX ?? "/api/v1";

const backendUrl = BASE_URL + API_PREFIX

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  token?: string,
): Promise<T> {
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  }
  
  const response = await fetch(backendUrl + path, {
    ...options,
    headers,
    credentials: options?.credentials ?? "include"
  });
  
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.message ?? `API error: ${response.status}`;
    const error = new Error(message) as Error & { status: number; body: unknown };
    error.status = response.status;
    error.body = body;
    throw error;
  }
  
  return response.json();
}

export async function apiMutation<T>(
  path: string,
  options: RequestInit & { method: "POST" | "PATCH" | "DELETE" },
  token?: string,
  cookie?: string,
  raw?: false,
): Promise<T>;
export async function apiMutation(
  path: string,
  options: RequestInit & { method: "POST" | "PATCH" | "DELETE" },
  token?: string,
  cookie?: string,
  raw?: true,
): Promise<Response>;
export async function apiMutation<T>(
  path: string,
  options: RequestInit & { method: "POST" | "PATCH" | "DELETE" },
  token?: string,
  cookie?: string,
  raw?: boolean,
): Promise<T | Response> {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(cookie ? { Cookie: cookie } : {}),
    ...options.headers,
  };

  const response = await fetch(backendUrl + path, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.message ?? `API error: ${response.status}`;
    const error = new Error(message) as Error & { status: number; body: unknown };
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return raw ? response : response.json();
}
