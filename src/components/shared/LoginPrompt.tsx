"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import Button from "@/components/ui/Button";
import AuthGateShell from "@/components/shared/AuthGateShell";
import { useLocale } from "@/contexts/LocaleContext";
import { buildLoginUrl, buildRegisterUrl } from "@/libs/utils";

/**
 * Login prompt shown in place of protected content when the visitor has no
 * active session. Server gates (`hasSession()`) return it from protected
 * layouts/pages before any data fetch; `ProtectedRoute` renders it as the
 * client-side fallback. Both CTAs carry the current pathname as `returnUrl`
 * so the visitor lands back where they came from — the register page signs
 * the new account in, so "sign up instead" costs no extra step.
 *
 * Both CTAs are real `<Link>`s (prefetch, middle-click) rather than
 * programmatic pushes. The card layout comes from `AuthGateShell`.
 */
export default function LoginPrompt() {
  const pathname = usePathname();
  const { translate } = useLocale();

  return (
    <AuthGateShell>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-surface) md:h-20 md:w-20 md:rounded-2xl">
        <LogIn size={28} className="text-(--color-text-muted) md:text-(--color-gold)" />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-(--color-text-primary) md:text-2xl">
          {translate("auth.protected.title")}
        </p>
        <p className="mt-1 text-sm text-(--color-text-muted)">
          {translate("auth.protected.description")}
        </p>
      </div>
      <Button href={buildLoginUrl(pathname)} icon={LogIn}>
        {translate("auth.protected.login_btn")}
      </Button>
      <p className="text-xs text-(--color-text-muted)">
        {translate("auth.login.no_account")}{" "}
        <Link
          href={buildRegisterUrl(pathname)}
          className="font-bold text-(--color-gold) hover:underline"
        >
          {translate("auth.login.register_link")}
        </Link>
      </p>
    </AuthGateShell>
  );
}
