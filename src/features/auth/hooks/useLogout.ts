"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { logoutAction } from "../action";

/**
 * Sign-out, shared by the mobile profile menu and the desktop account popup.
 *
 * Clears the session state first so the UI drops straight to its logged-out
 * shell, then revokes the refresh cookie on the server and lands on home. The
 * local clear is not rolled back on failure: the backend revoke is
 * best-effort, and a stale cookie is re-validated by `refreshAction` anyway.
 */
export function useLogout(): { logout: () => Promise<void>; isLoggingOut: boolean } {
  const { clearAuth } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    clearAuth();
    await logoutAction();
    router.push("/");
    setIsLoggingOut(false);
  }, [clearAuth, router]);

  return { logout, isLoggingOut };
}
