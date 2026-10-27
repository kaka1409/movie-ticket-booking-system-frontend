"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setAdminThemeAction } from "../actions/preferences.action";
import type { AdminTheme } from "../types";

/**
 * Console theme state. The pick paints from this value (the `data-admin-theme`
 * attribute on the shell), so switching is instant; the server action then
 * writes the cookie and `router.refresh()` re-renders the segments that read
 * the theme at render time (server-side chart palettes, the viewport colour).
 *
 * When the refresh lands it hands back a new `initialTheme`; adopting it during
 * render is React's documented "adjust state when a prop changes" pattern and
 * keeps the optimistic value from drifting away from the cookie.
 */
export function useAdminTheme(initialTheme: AdminTheme): {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
} {
  const router = useRouter();
  const [theme, setThemeValue] = useState(initialTheme);
  const [syncedTheme, setSyncedTheme] = useState(initialTheme);
  const [, startTransition] = useTransition();

  if (initialTheme !== syncedTheme) {
    setSyncedTheme(initialTheme);
    setThemeValue(initialTheme);
  }

  const setTheme = useCallback(
    (nextTheme: AdminTheme) => {
      setThemeValue(nextTheme);
      startTransition(async () => {
        await setAdminThemeAction(nextTheme);
        router.refresh();
      });
    },
    [router],
  );

  return { theme, setTheme };
}
