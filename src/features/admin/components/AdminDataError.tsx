"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { ADMIN_CARD_CLASS } from "../constants";
import AdminButton from "./AdminButton";

/**
 * In-place failure panel for a read that came back `{ error }`. Console reads
 * never throw (see `libs/api.ts`), so the route's `error.tsx` never sees them —
 * this keeps the page and its filters alive instead of blanking the route.
 */
export default function AdminDataError({ message }: { message: string }) {
  const { translate } = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className={`${ADMIN_CARD_CLASS} flex flex-col items-center gap-3 px-4 py-12 text-center`}>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertTriangle size={20} aria-hidden />
      </span>

      <div>
        <p className="text-sm font-bold text-(--color-text-primary)">
          {translate("admin.common.load_failed")}
        </p>
        <p className="mt-1 max-w-md text-[12px] text-(--color-text-muted)">{message}</p>
      </div>

      <AdminButton
        icon={RotateCcw}
        isLoading={isPending}
        onClick={() => startTransition(() => router.refresh())}
      >
        {translate("admin.common.retry")}
      </AdminButton>
    </div>
  );
}
