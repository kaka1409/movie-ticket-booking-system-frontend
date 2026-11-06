"use client";

import { LoaderCircle } from "lucide-react";
import AuthGateShell from "@/components/shared/AuthGateShell";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Shared "restoring session" panel. Used by every auth gate (`ProtectedRoute`
 * and the admin console shell) so the loading state is one source of truth.
 */
export default function AuthenticatingPanel({ className = "" }: { className?: string }) {
  const { translate } = useLocale();

  return (
    <AuthGateShell className={className}>
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-40 flex-col items-center justify-center gap-4 text-center"
      >
        <LoaderCircle aria-hidden className="h-8 w-8 animate-spin text-(--color-gold)" />
        <p className="text-sm font-medium text-(--color-text-secondary)">
          {translate("auth.protected.authenticating")}
        </p>
      </div>
    </AuthGateShell>
  );
}
