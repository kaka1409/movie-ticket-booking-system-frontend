"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { refreshAction } from "@/features/auth/action";
import { registerAccessTokenRefresher, UNAUTHORIZED_EVENT } from "@/libs/api-contract";
import type { User } from "@/features/auth/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Bumped on every explicit login/logout so a slow mount-time refresh cannot
  // resurrect a session the user just replaced or cleared.
  const sessionEpochRef = useRef(0);

  useEffect(() => {
    const epoch = sessionEpochRef.current;
    refreshAction()
      .then((result) => {
        if (epoch !== sessionEpochRef.current) return;
        if (result.success) {
          setToken(result.data.accessToken);
          setUser(result.data.user);
        }
      })
      .catch((error: unknown) => {
        console.warn("Session restore failed:", error);
      })
      .finally(() => {
        if (epoch === sessionEpochRef.current) setIsLoading(false);
      });
  }, []);

  const setAuth = useCallback((user: User, token: string) => {
    sessionEpochRef.current += 1;
    setToken(token);
    setUser(user);
  }, []);

  const clearAuth = useCallback(() => {
    sessionEpochRef.current += 1;
    setToken(null);
    setUser(null);
  }, []);

  // apiFetch's 401 path calls this to trade the refresh cookie for a new
  // access token before giving up — concurrent 401s share one rotation.
  useEffect(() => {
    registerAccessTokenRefresher(async () => {
      const epoch = sessionEpochRef.current;
      const result = await refreshAction();
      if (!result.success) return null;
      // A login/logout that landed mid-refresh owns the session now.
      if (epoch !== sessionEpochRef.current) return null;
      setToken(result.data.accessToken);
      setUser(result.data.user);
      return result.data.accessToken;
    });
    return () => registerAccessTokenRefresher(null);
  }, []);

  // Backend answered 401 on an authenticated request — the session is gone
  // (revoked/expired refresh, rejected access token). Just reset state:
  // `ProtectedRoute` swaps to the login prompt in place, so the visitor stays
  // on the protected URL instead of being yanked to /login mid-use.
  useEffect(() => {
    const handleUnauthorized = () => clearAuth();
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [clearAuth]);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((previous) => (previous ? { ...previous, ...patch } : previous));
  }, []);

  const isAuthenticated = Boolean(token && user);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      setAuth,
      clearAuth,
      updateUser,
    }),
    [user, token, isAuthenticated, isLoading, setAuth, clearAuth, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
