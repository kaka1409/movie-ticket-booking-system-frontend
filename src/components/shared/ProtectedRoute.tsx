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
 * Both branches share `AuthGateShell`, mirroring the container-less mobile stack
 * and tablet/desktop 50/50 split showcase so nothing shifts when the restore settles.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <AuthGateShell>
        {/* Mobile skeleton (< md): Container-less chrome-less stack */}
        <div className="surface-raised flex w-full max-w-xs flex-col items-center gap-4 text-center md:hidden">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-3 w-44" />
        </div>

        {/* Tablet & Desktop skeleton (>= md) */}
        <div className="surface-raised mx-auto hidden w-full max-w-7xl overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card) md:block md:rounded-3xl">
          <div className="grid min-h-[580px] grid-cols-2 lg:min-h-[640px]">
            {/* Left Art Skeleton (Clean, no text) */}
            <div className="flex items-center justify-center border-r border-(--color-border) bg-[#151515] p-8 lg:p-10">
              <Skeleton className="h-64 w-64 rounded-full" />
            </div>

            {/* Right Action Skeleton (Header + CTAs + 3 Accordion items) */}
            <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14">
              <div>
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="mt-3 h-9 w-64" />
                <Skeleton className="mt-3 h-4 w-80" />
                <div className="mt-8 flex gap-3">
                  <Skeleton className="h-10 w-36 rounded-xl" />
                  <Skeleton className="h-10 w-36 rounded-xl" />
                </div>
              </div>

              <div className="mt-10 border-t border-(--color-border) pt-6">
                <Skeleton className="mb-3 h-3 w-40" />
                <div className="flex flex-col gap-2.5">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGateShell>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return children;
}
