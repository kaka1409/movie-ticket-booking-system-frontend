"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import type { FilterKey, MyReview } from "@/features/reviews/types";
import { useLocale } from "@/contexts/LocaleContext";
import { useAppendReveal } from "@/hooks/useAppendReveal";
import EmptyState from "@/components/ui/EmptyState";
import Tabs from "@/components/ui/Tabs";
import LoadMoreButton from "../mobile/LoadMoreButton";
import ReviewRow from "./ReviewRow";
import { useMyReviews } from "@/features/reviews/hooks/useMyReviews";
import AccountShell from "@/features/profile/components/desktop/AccountShell";

export default function ReviewContent({
  initialReviews,
  total,
  filters,
}: {
  initialReviews: MyReview[];
  total: number;
  filters: readonly { key: string; label: string }[];
}) {
  const { translate } = useLocale();
  const {
    reviews,
    totalCount,
    activeFilter,
    isLoadingMore,
    deletingId,
    hasMore,
    handleFilterChange,
    handleLoadMore,
    handleDelete,
  } = useMyReviews(initialReviews, total);

  const { containerRef: listRef, animThreshold } = useAppendReveal<HTMLDivElement>({
    count: reviews.length,
    cardSelector: "[data-review-card]",
  });

  const tabItems = filters.map((filter) => ({
    key: filter.key,
    label: translate(`reviews.filters.${filter.key}`),
  }));

  if (reviews.length === 0) {
    return (
      <AccountShell
        title={translate("profile.review_rating")}
        description={translate("profile.pages.reviews_desc")}
      >
        <EmptyState
          icon={Star}
          title={translate("profile.myreviews.empty_title")}
          description={translate("profile.myreviews.empty_desc")}
        >
          <Link
            href="/movies"
            className="rounded-xl bg-(--color-gold) px-6 py-3 text-sm font-extrabold tracking-wide text-black"
          >
            {translate("profile.myreviews.browse")}
          </Link>
        </EmptyState>
      </AccountShell>
    );
  }

  return (
    <AccountShell
      title={translate("profile.review_rating")}
      description={translate("profile.pages.reviews_desc")}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-(--color-text-muted)">
          {translate("profile.myreviews.count_prefix")}{" "}
          <span className="font-bold text-(--color-text-primary)">{totalCount}</span>{" "}
          {translate("profile.myreviews.count_suffix")}
        </p>
        <Tabs
          tabs={tabItems}
          activeTab={activeFilter}
          ariaLabel={translate("profile.review_rating")}
          onTabChange={(key) => handleFilterChange(key as FilterKey)}
          stretch={false}
        />
      </div>

      <div ref={listRef} className="mt-5 space-y-3">
        {reviews.map((review, index) => (
          <div key={review.id} className={index >= animThreshold ? "animate-fade-in" : ""}>
            <ReviewRow
              review={review}
              isDeleting={deletingId === review.id}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-5">
          <LoadMoreButton onClick={handleLoadMore} disabled={isLoadingMore} />
        </div>
      )}
    </AccountShell>
  );
}
