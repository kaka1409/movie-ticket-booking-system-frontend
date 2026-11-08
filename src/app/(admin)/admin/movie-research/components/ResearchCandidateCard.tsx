"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import type { MovieResearchCandidate } from "@/features/admin/types";

/** Roughly four rendered lines of synopsis; longer text earns the toggle. */
const COLLAPSE_THRESHOLD = 220;

/**
 * One research suggestion card: identity row, the AI review verdict, the
 * AI-enriched synopsis (clamped until expanded), then the action footer.
 */
export default function ResearchCandidateCard({
  candidate,
  actionsDisabled,
  onReject,
  onImport,
  onReopen,
  onDelete,
}: {
  candidate: MovieResearchCandidate;
  actionsDisabled: boolean;
  onReject: () => void;
  onImport: () => void;
  onReopen: () => void;
  onDelete: () => void;
}) {
  const { translate } = useLocale();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);

  const synopsis = candidate.synopsisVi ?? "";
  const isCollapsible = synopsis.length > COLLAPSE_THRESHOLD;
  const review = candidate.aiReason ?? "";

  return (
    <article className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)">
      <div className="flex gap-4 p-4">
        {candidate.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external poster hosts are outside the next/image allowlist
          <img
            src={candidate.posterUrl}
            alt=""
            loading="lazy"
            className="h-20 aspect-[3/2] shrink-0 rounded-lg object-cover"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{candidate.title}</h3>
              {candidate.originalTitle && candidate.originalTitle !== candidate.title && (
                <p className="text-xs text-(--color-text-muted)">{candidate.originalTitle}</p>
              )}
            </div>
            <span className="rounded-full bg-(--color-surface-2) px-2 py-1 text-xs">
              {translate(
                `admin.research.${
                  candidate.status === "pending"
                    ? "pending"
                    : candidate.status === "rejected"
                      ? "rejected"
                      : "imported"
                }`,
              )}
            </span>
          </div>
          <p className="mt-2 text-xs text-(--color-text-muted)">
            {candidate.releaseDate ?? translate("admin.research.date_unknown")} ·{" "}
            {candidate.duration ? `${candidate.duration}′` : "—"} · {candidate.language ?? "—"}
          </p>
          <p className="mt-1 text-xs text-(--color-text-muted)">
            {candidate.genres.join(", ") || "—"} ·{" "}
            {candidate.markets
              .map((market) => market.split(":")[0])
              .filter((value, index, values) => values.indexOf(value) === index)
              .join(", ")}
          </p>
        </div>
      </div>

      {(candidate.aiReason || candidate.synopsisVi) && (
        <div className="space-y-2 px-4 pb-3">
          {candidate.aiReason && (
            <div className="overflow-hidden rounded-xl border border-(--color-gold)/25 bg-(--color-gold)/5">
              <button
                type="button"
                onClick={() => setIsReviewExpanded((open) => !open)}
                aria-expanded={isReviewExpanded}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
              >
                <Sparkles size={15} className="shrink-0 text-(--color-gold)" aria-hidden />
                <span className="flex-1 text-sm font-bold text-(--color-text-primary)">
                  {translate("admin.research.ai_review")}
                </span>
                <ChevronDown
                  size={15}
                  aria-hidden
                  className={`shrink-0 text-(--color-text-muted) transition-transform ${
                    isReviewExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isReviewExpanded && (
                <div className="border-t border-(--color-gold)/15 px-3 pb-3 pt-2.5">
                  <p className="text-sm text-white">{review}</p>
                  {candidate.aiConfidence !== null && (
                    <p className="mt-1.5 text-xs text-(--color-text-muted)">
                      {translate("admin.research.confidence")}: {candidate.aiConfidence}%
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          {candidate.synopsisVi && (
            <div>
              <p
                className={`text-sm text-white ${isCollapsible && !isExpanded ? "line-clamp-4" : ""}`}
              >
                {synopsis}
              </p>
              {isCollapsible && (
                <button
                  type="button"
                  onClick={() => setIsExpanded((open) => !open)}
                  className="mt-1 text-xs font-bold text-(--color-gold) hover:underline"
                >
                  {translate(isExpanded ? "common.show_less" : "common.show_more")}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-(--color-border) p-3">
        <a
          href={candidate.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mr-auto inline-flex items-center gap-1 text-xs text-(--color-text-muted) hover:text-(--color-text-primary)"
        >
          {translate("admin.research.source")} <ExternalLink size={13} />
        </a>
        {candidate.status === "pending" && (
          <>
            <AdminButton disabled={actionsDisabled} onClick={onReject}>
              {translate("admin.research.reject")}
            </AdminButton>
            <AdminButton
              icon={Sparkles}
              variant="primary"
              disabled={actionsDisabled}
              onClick={onImport}
            >
              {translate("admin.research.create_draft")}
            </AdminButton>
          </>
        )}
        {candidate.status === "rejected" && (
          <AdminButton icon={RotateCcw} disabled={actionsDisabled} onClick={onReopen}>
            {translate("admin.research.reopen")}
          </AdminButton>
        )}
        {(candidate.status === "pending" || candidate.status === "rejected") && (
          <AdminButton
            icon={Trash2}
            variant="danger"
            disabled={actionsDisabled}
            onClick={onDelete}
          >
            {translate("admin.common.delete")}
          </AdminButton>
        )}
      </div>
    </article>
  );
}
