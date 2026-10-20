"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/Skeleton";
import AuthGateShell from "@/components/shared/AuthGateShell";
import LoginPrompt from "@/components/shared/LoginPrompt";

/**
 * Client-side auth gate for protected routes. While the session restore runs
 * it shows a skeleton; once it settles, unauthenticated visitors see
 * `LoginPrompt`. Server layouts/pages pre-gate with `hasSession()` so this
 * component only ever handles the "cookie present but session invalid" case.
 *
 * Both branches share `AuthGateShell`, so the skeleton sits in the very card
 * the prompt swaps into and nothing shifts when the restore settles.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <AuthGateShell>
        <Skeleton className="h-16 w-16 rounded-full md:h-20 md:w-20 md:rounded-2xl" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-12 w-48 rounded-2xl" />
      </AuthGateShell>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return children;
}
