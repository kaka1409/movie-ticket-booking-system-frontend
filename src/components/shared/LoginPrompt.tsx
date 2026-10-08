"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLocale } from "@/contexts/LocaleContext";
import { buildLoginUrl } from "@/libs/utils";

/**
 * Login prompt shown in place of protected content when the visitor has no
 * active session. Server gates (`hasSession()`) return it from protected
 * layouts/pages before any data fetch; `ProtectedRoute` renders it as the
 * client-side fallback. The CTA carries the current pathname as `returnUrl`
 * so login bounces back to where the visitor came from.
 */
export default function LoginPrompt() {
  const router = useRouter();
  const pathname = usePathname();
  const { translate } = useLocale();

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-24">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-surface)">
        <LogIn size={28} className="text-(--color-text-muted)" />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-(--color-text-primary)">
          {translate("auth.protected.title")}
        </p>
        <p className="mt-1 text-sm text-(--color-text-muted)">
          {translate("auth.protected.description")}
        </p>
      </div>
      <Button icon={LogIn} onClick={() => router.push(buildLoginUrl(pathname))}>
        {translate("auth.protected.login_btn")}
      </Button>
    </div>
  );
}
