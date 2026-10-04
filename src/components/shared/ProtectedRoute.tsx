"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLocale } from "@/contexts/LocaleContext";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { translate } = useLocale();

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
        <Button
          icon={LogIn}
          onClick={() => router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`)}
        >
          {translate("auth.protected.login_btn")}
        </Button>
      </div>
    );
  }

  return children;
}
