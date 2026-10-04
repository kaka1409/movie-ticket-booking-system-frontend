"use server";

import { cookies } from "next/headers";
import { apiMutation } from "@/libs/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshResponse,
} from "./types";

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

export type RegisterActionResult =
  { success: true; data: RegisterResponse } | { success: false; error: string; status?: number };

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
    const status = (error as { status?: number }).status;
    return { success: false, error: (error as Error).message, status };
  }
}

/* ─── Login ─────────────────────────────────────────────── */

export type LoginActionResult =
  { success: true; data: LoginResponse } | { success: false; error: string; status?: number };

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
    const status = (error as { status?: number }).status;
    return { success: false, error: (error as Error).message, status };
  }
}

/* ─── Refresh ───────────────────────────────────────────── */

export type RefreshActionResult =
  { success: true; data: RefreshResponse } | { success: false; error: string };

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
    return { success: false, error: (error as Error).message };
  }
}

/* ─── Logout ────────────────────────────────────────────── */

export type LogoutActionResult = { success: true } | { success: false; error: string };

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
    return { success: false, error: (error as Error).message };
  }
}
