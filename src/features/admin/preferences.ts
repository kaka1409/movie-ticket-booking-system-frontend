import { cookies } from "next/headers";
import {
  ADMIN_SIDEBAR_COOKIE,
  ADMIN_THEME_COOKIE,
  DEFAULT_ADMIN_SIDEBAR_MODE,
  DEFAULT_ADMIN_THEME,
} from "./constants";
import type { AdminSidebarMode, AdminTheme } from "./types";

/**
 * Server reads for the console preference cookies. They live here rather than
 * in `libs/session.ts` because the session helpers are dependency-free and this
 * pair belongs to the admin feature.
 */
export async function getAdminTheme(): Promise<AdminTheme> {
  const value = (await cookies()).get(ADMIN_THEME_COOKIE)?.value;
  return value === "light" || value === "system" ? value : DEFAULT_ADMIN_THEME;
}

export async function getAdminSidebarMode(): Promise<AdminSidebarMode> {
  const value = (await cookies()).get(ADMIN_SIDEBAR_COOKIE)?.value;
  return value === "collapsed" ? "collapsed" : DEFAULT_ADMIN_SIDEBAR_MODE;
}
