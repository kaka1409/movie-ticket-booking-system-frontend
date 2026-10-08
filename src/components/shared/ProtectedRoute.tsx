"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/Skeleton";
import LoginPrompt from "@/components/shared/LoginPrompt";

/**
 * Client-side auth gate for protected routes. While the session restore runs
 * it shows a skeleton; once it settles, unauthenticated visitors see
 * `LoginPrompt`. Server layouts/pages pre-gate with `hasSession()` so this
 * component only ever handles the "cookie present but session invalid" case.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-24">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-12 w-48 rounded-2xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return children;
}
