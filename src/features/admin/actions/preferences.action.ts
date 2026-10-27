"use server";

import { cookies } from "next/headers";
import {
  ADMIN_PREFERENCE_MAX_AGE_SECONDS,
  ADMIN_SIDEBAR_COOKIE,
  ADMIN_THEME_COOKIE,
} from "../constants";
import type { AdminSidebarMode, AdminTheme } from "../types";

/**
 * Preferences are not secrets, but nothing in the browser needs to read them:
 * the server resolves both on every admin render, and the toggle keeps its own
 * optimistic copy. `httpOnly` therefore costs nothing and keeps the cookie out
 * of reach of injected scripts.
 */
const PREFERENCE_COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: ADMIN_PREFERENCE_MAX_AGE_SECONDS,
};

/** Persists the console theme (`dark | light | system`). */
export async function setAdminThemeAction(theme: AdminTheme): Promise<void> {
  if (theme !== "dark" && theme !== "light" && theme !== "system") return;
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_THEME_COOKIE, theme, PREFERENCE_COOKIE_OPTIONS);
}

/** Persists the sidebar width (`expanded | collapsed`) for later visits. */
export async function setAdminSidebarAction(mode: AdminSidebarMode): Promise<void> {
  if (mode !== "expanded" && mode !== "collapsed") return;
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SIDEBAR_COOKIE, mode, PREFERENCE_COOKIE_OPTIONS);
}
