import { apiFetch } from "@/libs/api";
import type {
  LoginRequest, LoginResponse,
  RegisterRequest, RegisterResponse,
  LogoutResponse,
  RefreshResponse,
} from "./types";

export async function login(data: LoginRequest) {
  const response = await apiFetch<{ data: LoginResponse }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function register(data: RegisterRequest) {
  const response = await apiFetch<{ data: RegisterResponse }>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(data) },
  );
  return response.data;
}

export async function logout() {
  const response = await apiFetch<{ data: LogoutResponse }>("/auth/logout", {
    method: "POST",
    credentials: "include", // Send cookies with the request
  });
  return response.data;
}

export async function refresh() {
  const response = await apiFetch<{ data: RefreshResponse }>("/auth/refresh", {
    method: "POST",
    credentials: "include" // Send cookies with the request
  });
  return response.data;
}

