const BASE_URL = process.env.BACKEND_URL ?? "http://localhost:8080";
const API_PREFIX = process.env.API_PREFIX ?? "/api/v1";

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
  
  const response = await fetch(`${BASE_URL}${API_PREFIX}${path}`, {
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
