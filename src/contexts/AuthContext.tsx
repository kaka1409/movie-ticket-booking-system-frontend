"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { refreshAction } from "@/features/auth/action";
import { UNAUTHORIZED_EVENT } from "@/libs/api";
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
  const router = useRouter();

  useEffect(() => {
    refreshAction()
      .then((result) => {
        if (result.success) {
          setToken(result.data.accessToken);
          setUser(result.data.user);
        }
      })
      .catch((error: unknown) => {
        console.warn("Session restore failed:", error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setAuth = useCallback((user: User, token: string) => {
    setToken(token);
    setUser(user);
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  // Backend answered 401 on an authenticated request — the session is gone
  // (revoked/expired refresh, rejected access token). Reset state and bounce
  // to login, remembering where the user was.
  useEffect(() => {
    const handleUnauthorized = () => {
      const currentPath = window.location.pathname;
      if (currentPath === "/login" || currentPath === "/register") return;
      const returnUrl = currentPath + window.location.search;
      clearAuth();
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    };
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [clearAuth, router]);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
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
