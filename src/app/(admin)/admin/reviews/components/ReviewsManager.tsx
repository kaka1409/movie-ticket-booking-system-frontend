"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminPagination from "@/app/(admin)/admin/components/shared/AdminPagination";
import AdminTable, { type AdminTableColumn } from "@/app/(admin)/admin/components/shared/AdminTable";
import { resolveAdminError } from "@/features/admin/errorMessages";
import { restoreAdminReviewAction } from "@/features/admin/actions/reviews.action";
import { formatCalendarDate } from "@/libs/date";
import type { AdminReview } from "@/features/admin/types";

interface ReviewsManagerProps {
  reviews: AdminReview[];
  total: number;
  skip: number;
  limit: number;
}

export default function ReviewsManager({ reviews, total, skip, limit }: ReviewsManagerProps) {
  const { translate, locale } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page = Math.floor(skip / limit) + 1;

  const columns: AdminTableColumn<AdminReview>[] = [
    {
      id: "movie",
      headerKey: "admin.reviews.column_movie",
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-(--color-text-primary)">{r.movie.title}</p>
          <p className="truncate text-[11px] text-(--color-text-muted)">{r.movie.genre}</p>
        </div>
      ),
    },
    {
      id: "rating",
      headerKey: "admin.reviews.column_rating",
      className: "w-20",
      cell: (r) => <span className="tabular-nums">{r.rating}</span>,
    },
    {
      id: "comment",
      headerKey: "admin.reviews.column_comment",
      cell: (r) => <p className="line-clamp-2 text-[12px]">{r.comment}</p>,
    },
    {
      id: "created",
      headerKey: "admin.reviews.column_deleted",
      className: "w-32",
      cell: (r) => (
        <span className="text-[11px]">
          {formatCalendarDate((r.deletedAt ?? r.createdAt).slice(0, 10), locale)}
        </span>
      ),
    },
    {
      id: "actions",
      className: "w-28",
      align: "right",
      cell: (r) => (
        <AdminButton
          size="sm"
          variant="outline"
          icon={RotateCcw}
          disabled={isPending}
          onClick={() => {
            if (!token) return;
            startTransition(async () => {
              const result = await restoreAdminReviewAction(token, r.id);
              if (!result.success) {
                notify(resolveAdminError(result, translate), { variant: "error" });
                return;
              }
              notify(translate("admin.reviews.restored"), { variant: "success" });
              router.refresh();
            });
          }}
        >
          {translate("admin.reviews.restore")}
        </AdminButton>
      ),
    },
  ];

  return (
    <>
      <AdminTable
        columns={columns}
        rows={reviews}
        getRowId={(r) => r.id}
        emptyIcon={MessageSquare}
        emptyTitleKey="admin.reviews.empty_title"
        emptyDescriptionKey="admin.reviews.empty_body"
        captionKey="admin.reviews.title"
      />
      <AdminPagination
        page={page}
        totalPages={totalPages}
        hrefFor={(p) => `/admin/reviews?skip=${(p - 1) * limit}&limit=${limit}`}
      />
    </>
  );
}
