"use client";

import { useAuth } from "@/contexts/AuthContext";
import AuthenticatingPanel from "@/components/shared/AuthenticatingPanel";
import LoginPrompt from "@/components/shared/LoginPrompt";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthenticatingPanel />;
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return children;
}
