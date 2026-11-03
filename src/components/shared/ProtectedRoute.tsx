"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LoaderCircle } from "lucide-react";
import AuthGateShell from "@/components/shared/AuthGateShell";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { useLocale } from "@/contexts/LocaleContext";

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
  const { translate } = useLocale();

  if (isLoading) {
    return (
      <AuthGateShell>
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-40 flex-col items-center justify-center gap-4 text-center"
        >
          <LoaderCircle aria-hidden="true" className="h-8 w-8 animate-spin text-(--color-gold)" />
          <p className="text-sm font-medium text-(--color-text-secondary)">
            {translate("auth.protected.authenticating")}
          </p>
        </div>
      </AuthGateShell>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return children;
}
