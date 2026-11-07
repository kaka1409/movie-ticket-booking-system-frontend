"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminDeleteDialog from "@/app/(admin)/admin/components/shared/AdminDeleteDialog";
import { ADMIN_LABEL_CLASS } from "@/features/admin/constants";
import { resolveAdminError } from "@/features/admin/errorMessages";
import {
  deleteAdminReviewAction,
  restoreAdminReviewAction,
} from "@/features/admin/actions/reviews.action";
import { formatCalendarDate } from "@/libs/date";
import type { AdminReview, AdminActionResult } from "@/features/admin/types";

/**
 * Expanded review row: the moderation surface. Admins cannot edit a member's
 * words, so the panel is a detail view plus the two moderation verbs —
 * soft-delete a live review, restore a removed one.
 */
export default function ReviewInlineEdit({ review }: { review: AdminReview }) {
  const { translate, locale } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isDeleted = review.deletedAt !== undefined && review.deletedAt !== "";

  const runAction = (action: () => Promise<AdminActionResult<unknown>>, messageKey: string) => {
    if (!token) return;
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        notify(resolveAdminError(result, translate), { variant: "error" });
        return;
      }
      notify(translate(messageKey), { variant: "success" });
      router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 text-[12px] sm:grid-cols-3">
        <div>
          <p className={ADMIN_LABEL_CLASS}>{translate("admin.reviews.column_user")}</p>
          <p className="mt-0.5 font-semibold text-(--color-text-primary)">{review.user.fullname}</p>
          <p className="truncate text-(--color-text-muted)">{review.user.email}</p>
        </div>
        <div>
          <p className={ADMIN_LABEL_CLASS}>{translate("admin.reviews.column_movie")}</p>
          <p className="mt-0.5 font-semibold text-(--color-text-primary)">{review.movie.title}</p>
          <p className="truncate text-(--color-text-muted)">{review.movie.genre}</p>
        </div>
        <div>
          <p className={ADMIN_LABEL_CLASS}>{translate("admin.reviews.column_votes")}</p>
          <p className="mt-0.5 tabular-nums text-(--color-text-primary)">
            <span className="text-emerald-400">▲ {review.upvoteCount}</span>
            {" · "}
            <span className="text-rose-400">▼ {review.downvoteCount}</span>
          </p>
          <p className="text-(--color-text-muted)">
            {formatCalendarDate(review.createdAt.slice(0, 10), locale)}
            {isDeleted &&
              ` · ${translate("admin.reviews.status_deleted")} ${formatCalendarDate(
                review.deletedAt!.slice(0, 10),
                locale,
              )}`}
          </p>
        </div>
      </div>

      {review.comment !== "" && (
        <p className="rounded-lg border border-(--color-border) bg-(--color-surface-2) p-3 text-[12px] leading-relaxed text-(--color-text-primary)">
          {review.comment}
        </p>
      )}

      <div className="flex items-center gap-2">
        {isDeleted ? (
          <AdminButton
            size="sm"
            variant="outline"
            icon={RotateCcw}
            disabled={isPending}
            onClick={() =>
              runAction(
                () => restoreAdminReviewAction(token ?? "", review.id),
                "admin.reviews.restored",
              )
            }
          >
            {translate("admin.reviews.restore")}
          </AdminButton>
        ) : (
          <AdminButton
            size="sm"
            variant="outline"
            icon={Trash2}
            disabled={isPending}
            onClick={() => setIsDeleteOpen(true)}
          >
            {translate("admin.common.delete")}
          </AdminButton>
        )}
        {isDeleted && (
          <Badge variant="error" size="xs">
            {translate("admin.reviews.status_deleted")}
          </Badge>
        )}
      </div>

      <AdminDeleteDialog
        isOpen={isDeleteOpen}
        entityName={review.movie.title}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={() => deleteAdminReviewAction(token ?? "", review.id)}
        onDeleted={(message) => {
          setIsDeleteOpen(false);
          notify(message, { variant: "success" });
          router.refresh();
        }}
      />
    </div>
  );
}
