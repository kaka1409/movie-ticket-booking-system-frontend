"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Play, RotateCcw, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import type {
  AdminActionResult,
  MovieResearchCandidate,
  MovieResearchRun,
} from "@/features/admin/types";
import {
  importMovieResearchCandidateAction,
  runMovieResearchAction,
  updateMovieResearchCandidateAction,
} from "@/features/admin/actions/movie-research.action";

export default function MovieResearchManager({
  candidates,
  runs,
}: {
  candidates: MovieResearchCandidate[];
  runs: MovieResearchRun[];
}) {
  const { token } = useAuth();
  const { translate, locale } = useLocale();
  const { notify } = useToast();
  const router = useRouter();
  const [busy, startTransition] = useTransition();
  const [filter, setFilter] = useState("pending");
  const visible =
    filter === "all" ? candidates : candidates.filter((candidate) => candidate.status === filter);
  const dateLocale = locale === "vn" ? "vi-VN" : "en-US";

  const execute = <T,>(operation: () => Promise<AdminActionResult<T>>, successText: string) => {
    startTransition(async () => {
      const result = await operation();
      if (!result.success) {
        notify(result.error, { variant: "error" });
        return;
      }
      notify(successText);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">{translate("admin.research.latest_run")}</h2>
            <p className="mt-1 text-sm text-(--color-text-muted)">
              {translate("admin.research.schedule")}
            </p>
          </div>
          <AdminButton
            icon={Play}
            variant="primary"
            disabled={busy || !token}
            onClick={() =>
              execute(() => runMovieResearchAction(token!), translate("admin.research.run_started"))
            }
          >
            {translate("admin.research.run_now")}
          </AdminButton>
        </div>
        {runs[0] ? (
          <p className="mt-4 text-xs text-(--color-text-muted)">
            {new Date(runs[0].startedAt).toLocaleString(dateLocale)} · {runs[0].status} ·{" "}
            {runs[0].discovered} {translate("admin.research.found")} · {runs[0].error ?? ""}
          </p>
        ) : (
          <p className="mt-4 text-sm text-(--color-text-muted)">
            {translate("admin.research.no_runs")}
          </p>
        )}
      </section>

      <div className="flex items-center gap-2">
        <label htmlFor="research-status" className="text-sm text-(--color-text-muted)">
          {translate("admin.research.filter")}
        </label>
        <select
          id="research-status"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm"
        >
          <option value="pending">{translate("admin.research.pending")}</option>
          <option value="rejected">{translate("admin.research.rejected")}</option>
          <option value="imported">{translate("admin.research.imported")}</option>
          <option value="all">{translate("admin.research.all")}</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--color-border) p-10 text-center text-sm text-(--color-text-muted)">
          {translate("admin.research.empty")}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visible.map((candidate) => (
            <article
              key={candidate.id}
              className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)"
            >
              <div className="flex gap-4 p-4">
                {candidate.posterUrl ? (
                  <img
                    src={candidate.posterUrl}
                    alt=""
                    loading="lazy"
                    className="h-36 w-24 shrink-0 rounded-lg object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{candidate.title}</h3>
                      {candidate.originalTitle && candidate.originalTitle !== candidate.title && (
                        <p className="text-xs text-(--color-text-muted)">
                          {candidate.originalTitle}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full bg-(--color-surface-2) px-2 py-1 text-xs">
                      {translate(
                        `admin.research.${candidate.status === "pending" ? "pending" : candidate.status === "rejected" ? "rejected" : "imported"}`,
                      )}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-(--color-text-muted)">
                    {candidate.releaseDate ?? translate("admin.research.date_unknown")} ·{" "}
                    {candidate.duration ? `${candidate.duration}′` : "—"} ·{" "}
                    {candidate.language ?? "—"}
                  </p>
                  <p className="mt-1 text-xs text-(--color-text-muted)">
                    {candidate.genres.join(", ") || "—"} ·{" "}
                    {candidate.markets
                      .map((market) => market.split(":")[0])
                      .filter((value, index, values) => values.indexOf(value) === index)
                      .join(", ")}
                  </p>
                  {candidate.aiReason && (
                    <p className="mt-3 flex gap-2 text-sm">
                      <Sparkles size={15} className="mt-0.5 shrink-0 text-(--color-gold)" />
                      {candidate.aiReason}
                    </p>
                  )}
                  {candidate.aiConfidence !== null && (
                    <p className="mt-1 text-xs text-(--color-text-muted)">
                      {translate("admin.research.confidence")}: {candidate.aiConfidence}%
                    </p>
                  )}
                </div>
              </div>
              {candidate.synopsisVi && (
                <p className="px-4 pb-3 text-sm text-(--color-text-secondary)">
                  {candidate.synopsisVi}
                </p>
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
                    <AdminButton
                      disabled={busy || !token}
                      onClick={() =>
                        execute(
                          () =>
                            updateMovieResearchCandidateAction(token!, candidate.id, "rejected"),
                          translate("admin.research.rejected_toast"),
                        )
                      }
                    >
                      {translate("admin.research.reject")}
                    </AdminButton>
                    <AdminButton
                      icon={Sparkles}
                      variant="primary"
                      disabled={busy || !token}
                      onClick={() =>
                        execute(
                          () => importMovieResearchCandidateAction(token!, candidate.id),
                          translate("admin.research.imported_toast"),
                        )
                      }
                    >
                      {translate("admin.research.create_draft")}
                    </AdminButton>
                  </>
                )}
                {candidate.status === "rejected" && (
                  <AdminButton
                    icon={RotateCcw}
                    disabled={busy || !token}
                    onClick={() =>
                      execute(
                        () => updateMovieResearchCandidateAction(token!, candidate.id, "pending"),
                        translate("admin.research.reopened_toast"),
                      )
                    }
                  >
                    {translate("admin.research.reopen")}
                  </AdminButton>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
