"use server";

import { cookies } from "next/headers";
import { apiMutation, toActionFailure, type ActionFailure } from "@/libs/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshResponse,
} from "./types";

// HttpOnly keeps the token away from JS (XSS), Secure restricts it to HTTPS,
// SameSite=Strict blocks cross-site sends (CSRF); 30 days matches backend TTL.
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
};

/* ─── Shared helpers ────────────────────────────────────── */

function parseRefreshToken(setCookieHeader: string | null): string | null {
  if (!setCookieHeader) return null;
  const match = setCookieHeader.match(/refreshToken=([^;]+)/);
  return match?.[1] ?? null;
}

async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value;
}

async function setRefreshToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("refreshToken", token, COOKIE_OPTIONS);
}

async function deleteRefreshToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("refreshToken");
}

function cookieHeader(value: string): string {
  return `refreshToken=${value}`;
}

/* ─── Register ──────────────────────────────────────────── */

/** POST /auth/register — returns `{ data: { message } }` or a failure union with the HTTP status. */
export type RegisterActionResult =
  { success: true; data: RegisterResponse } | ActionFailure;

export async function registerAction(
  prevState: RegisterActionResult,
  data: RegisterRequest,
): Promise<RegisterActionResult> {
  try {
    const result = await apiMutation<{ data: RegisterResponse }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { success: true, data: result.data };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}

/* ─── Login ─────────────────────────────────────────────── */

/**
 * POST /auth/login with `raw: true` so the `Set-Cookie` header can be read:
 * the backend's refresh token is re-issued as our HttpOnly cookie, while the
 * access token + user go to the client for AuthContext (RAM only).
 */
export type LoginActionResult =
  { success: true; data: LoginResponse } | ActionFailure;

export async function loginAction(
  prevState: LoginActionResult,
  data: LoginRequest,
): Promise<LoginActionResult> {
  try {
    const response = await apiMutation(
      "/auth/login",
      { method: "POST", body: JSON.stringify(data) },
      undefined,
      undefined,
      true,
    );

    const result = await response.json();

    const token = parseRefreshToken(response.headers.get("set-cookie"));
    if (token) await setRefreshToken(token);

    return { success: true, data: result.data };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}

/* ─── Refresh ───────────────────────────────────────────── */

/**
 * POST /auth/refresh — exchanges the HttpOnly cookie for a new access token.
 * Token rotation: every successful refresh returns a NEW refresh token in
 * `Set-Cookie`, which we overwrite the old one with (the backend revokes the
 * previous value). Called on mount by AuthContext to restore a session; a
 * failure just means the user must log in again.
 */
export type RefreshActionResult =
  { success: true; data: RefreshResponse } | ActionFailure;

export async function refreshAction(): Promise<RefreshActionResult> {
  try {
    const refreshToken = await getRefreshToken();

    const response = await apiMutation(
      "/auth/refresh",
      { method: "POST" },
      undefined,
      refreshToken ? cookieHeader(refreshToken) : undefined,
      true,
    );

    const result = await response.json();

    const token = parseRefreshToken(response.headers.get("set-cookie"));
    if (token) await setRefreshToken(token);

    return { success: true, data: result.data };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}

/* ─── Logout ────────────────────────────────────────────── */

/** POST /auth/logout — revokes the refresh token server-side, then clears the cookie. */
export type LogoutActionResult = { success: true } | ActionFailure;

export async function logoutAction(): Promise<LogoutActionResult> {
  try {
    const refreshToken = await getRefreshToken();

    await apiMutation(
      "/auth/logout",
      { method: "POST" },
      undefined,
      refreshToken ? cookieHeader(refreshToken) : undefined,
    );

    await deleteRefreshToken();
    return { success: true };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}
