"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, Pause, Play, RotateCcw, Sparkles, Square } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import type {
  AdminActionResult,
  MovieResearchCandidate,
  MovieResearchModel,
  MovieResearchRun,
} from "@/features/admin/types";
import {
  controlMovieResearchRunAction,
  importMovieResearchCandidateAction,
  runMovieResearchAction,
  updateMovieResearchCandidateAction,
} from "@/features/admin/actions/movie-research.action";
import ModelPicker from "./ModelPicker";

const ACTIVE_STATUSES = new Set(["running", "paused"]);

type ResearchRunProgress = { processed: number; discovered: number; enriched: number };

type ResearchStreamEvent =
  | { type: "candidate"; runId: string; candidate: MovieResearchCandidate }
  | ({ type: "progress"; runId: string } & ResearchRunProgress)
  | { type: "done"; runId: string; status: string };

const STATUS_BADGE_CLASS: Record<string, string> = {
  running: "bg-(--color-gold)/15 text-(--color-gold)",
  paused: "bg-amber-400/15 text-amber-400",
  completed: "bg-emerald-400/15 text-emerald-400",
  failed: "bg-red-500/15 text-red-400",
  stopped: "bg-(--color-text-muted)/15 text-(--color-text-muted)",
};

export default function MovieResearchManager({
  candidates,
  runs,
  models,
}: {
  candidates: MovieResearchCandidate[];
  runs: MovieResearchRun[];
  models: MovieResearchModel[];
}) {
  const { token } = useAuth();
  const { translate, locale } = useLocale();
  const { notify } = useToast();
  const router = useRouter();
  const [busy, startTransition] = useTransition();
  const [filter, setFilter] = useState("pending");
  const [selectedModel, setSelectedModel] = useState("");
  // The run row is created inside the async job, a beat after POST /runs
  // answers — without this grace window the poll never starts and the page
  // looks frozen until a manual refresh.
  const [awaitingRun, setAwaitingRun] = useState(false);
  const [runClickAt, setRunClickAt] = useState(0);
  // SSE payloads keyed by run id so a stale stream never bleeds into the
  // next run's list; only applied while that run is the active one.
  const [liveRun, setLiveRun] = useState<{
    runId: string;
    candidates: MovieResearchCandidate[];
    progress: ResearchRunProgress | null;
  } | null>(null);
  const dateLocale = locale === "vn" ? "vi-VN" : "en-US";

  const latestRun = runs[0] ?? null;
  const isRunActive = !!latestRun && ACTIVE_STATUSES.has(latestRun.status);
  const effectiveModel = selectedModel || models[0]?.id || "";
  const liveData =
    liveRun && latestRun && liveRun.runId === latestRun.id && isRunActive ? liveRun : null;

  // Awaiting ends once a run row newer than the click shows up (any status —
  // a fast failure must not leave "Starting…" stuck). The poll counter below
  // covers the case where no row ever appears.
  // 15s buffer absorbs client/server clock skew on startedAt.
  const runStartedAfterClick =
    awaitingRun && !!latestRun && new Date(latestRun.startedAt).getTime() >= runClickAt - 15_000;
  const isAwaitingRun = awaitingRun && !runStartedAfterClick;

  // SSE pushes each candidate/progress update the moment the run writes it;
  // the slow refresh below is only a reconcile for events missed mid-reconnect.
  useEffect(() => {
    if (!isRunActive || !latestRun) return;
    const source = new EventSource(
      `/api/v1/admin/movie-research/runs/${latestRun.id}/events`,
    );
    source.onmessage = (message) => {
      let event: ResearchStreamEvent;
      try {
        event = JSON.parse(message.data) as ResearchStreamEvent;
      } catch {
        return;
      }
      if (event.type === "candidate") {
        setLiveRun((previous) => {
          const base =
            previous?.runId === event.runId
              ? previous
              : { runId: event.runId, candidates: [], progress: null };
          return base.candidates.some((item) => item.id === event.candidate.id)
            ? base
            : { ...base, candidates: [...base.candidates, event.candidate] };
        });
      } else if (event.type === "progress") {
        setLiveRun((previous) => ({
          runId: event.runId,
          candidates: previous?.runId === event.runId ? previous.candidates : [],
          progress: {
            processed: event.processed,
            discovered: event.discovered,
            enriched: event.enriched,
          },
        }));
      } else if (event.type === "done") {
        source.close();
        router.refresh();
      }
    };
    return () => source.close();
  }, [isRunActive, latestRun, router]);

  // Awaiting needs a fast poll for the run row to appear; once active, SSE
  // carries the updates and this is just a 15s safety reconcile.
  useEffect(() => {
    if (!isAwaitingRun && !isRunActive) return;
    let polls = 0;
    const interval = setInterval(() => {
      polls += 1;
      // ~60s grace for the run row to appear, then stop fast-polling.
      if (isAwaitingRun && !isRunActive && polls >= 15) setAwaitingRun(false);
      router.refresh();
    }, isAwaitingRun ? 4000 : 15000);
    return () => clearInterval(interval);
  }, [isAwaitingRun, isRunActive, router]);

  // Fresh SSE candidates lead the list (they are the ones just discovered);
  // anything already server-rendered keeps its slot and gets live-overridden.
  const mergedCandidates = useMemo(() => {
    if (!liveData) return candidates;
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
    const fresh: MovieResearchCandidate[] = [];
    for (const live of liveData.candidates) {
      if (byId.has(live.id)) byId.set(live.id, live);
      else fresh.push(live);
    }
    return [...fresh, ...byId.values()];
  }, [candidates, liveData]);

  const visible =
    filter === "all"
      ? mergedCandidates
      : mergedCandidates.filter((candidate) => candidate.status === filter);

  const shownProgress: ResearchRunProgress | null = latestRun
    ? (liveData?.progress ?? {
        processed: latestRun.processed,
        discovered: latestRun.discovered,
        enriched: latestRun.enriched,
      })
    : null;

  const execute = <T,>(
    operation: () => Promise<AdminActionResult<T>>,
    onSuccess?: () => void,
  ) => {
    startTransition(async () => {
      const result = await operation();
      if (!result.success) {
        notify(result.error, { variant: "error" });
        return;
      }
      onSuccess?.();
      router.refresh();
    });
  };

  const runStatusLabel = (status: string) => {
    const key = `admin.research.status_${status}`;
    const label = translate(key);
    return label === key ? status : label;
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
          <div className="flex flex-wrap items-center gap-2">
            <ModelPicker
              models={models}
              value={effectiveModel}
              onChange={setSelectedModel}
              disabled={busy || isRunActive || !token}
            />
            {latestRun && isRunActive && latestRun.status === "running" && (
              <AdminButton
                icon={Pause}
                disabled={busy || !token}
                onClick={() =>
                  execute(() =>
                    controlMovieResearchRunAction(token!, latestRun.id, "pause"),
                  )
                }
              >
                {translate("admin.research.pause")}
              </AdminButton>
            )}
            {latestRun && latestRun.status === "paused" && (
              <AdminButton
                icon={Play}
                variant="primary"
                disabled={busy || !token}
                onClick={() =>
                  execute(() =>
                    controlMovieResearchRunAction(token!, latestRun.id, "resume"),
                  )
                }
              >
                {translate("admin.research.resume")}
              </AdminButton>
            )}
            {latestRun && isRunActive && (
              <AdminButton
                icon={Square}
                variant="danger"
                disabled={busy || !token}
                onClick={() =>
                  execute(() =>
                    controlMovieResearchRunAction(token!, latestRun.id, "stop"),
                  )
                }
              >
                {translate("admin.research.stop")}
              </AdminButton>
            )}
            <AdminButton
              icon={Play}
              variant="primary"
              disabled={busy || !token || isRunActive || !effectiveModel}
              onClick={() =>
                execute(
                  () => runMovieResearchAction(token!, effectiveModel),
                  () => {
                    setRunClickAt(Date.now());
                    setAwaitingRun(true);
                  },
                )
              }
            >
              {translate("admin.research.run_now")}
            </AdminButton>
          </div>
        </div>
        {isAwaitingRun && (
          <p className="mt-4 flex items-center gap-2 text-xs text-(--color-text-muted)">
            <Loader2 size={12} className="animate-spin text-(--color-gold)" aria-hidden />
            {translate("admin.research.starting")}
          </p>
        )}
        {latestRun ? (
          <div className="mt-4 space-y-1.5 text-xs text-(--color-text-muted)">
            <p className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-bold ${STATUS_BADGE_CLASS[latestRun.status] ?? "bg-(--color-surface-2) text-(--color-text-muted)"}`}
              >
                {latestRun.status === "running" && (
                  <Loader2 size={11} className="animate-spin" aria-hidden />
                )}
                {runStatusLabel(latestRun.status)}
              </span>
              <span>
                {new Date(latestRun.startedAt).toLocaleString(dateLocale)}
                {latestRun.finishedAt &&
                  ` → ${new Date(latestRun.finishedAt).toLocaleString(dateLocale)}`}
              </span>
              {latestRun.model && <span>· {latestRun.model}</span>}
            </p>
            <p>
              {shownProgress && shownProgress.processed > 0 &&
                `${translate("admin.research.processed")}: ${shownProgress.processed} · `}
              {shownProgress?.discovered ?? 0} {translate("admin.research.found")} ·{" "}
              {translate("admin.research.enriched")}: {shownProgress?.enriched ?? 0}
              {latestRun.error ? ` · ${latestRun.error}` : ""}
            </p>
          </div>
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
                  // eslint-disable-next-line @next/next/no-img-element -- external poster hosts are outside the next/image allowlist
                  <img
                    src={candidate.posterUrl}
                    alt=""
                    loading="lazy"
                    className="h-20 w-32 shrink-0 rounded-lg object-cover"
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
                        execute(() =>
                          updateMovieResearchCandidateAction(
                            token!,
                            candidate.id,
                            "rejected",
                          ),
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
                        execute(() => importMovieResearchCandidateAction(token!, candidate.id))
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
                      execute(() =>
                        updateMovieResearchCandidateAction(token!, candidate.id, "pending"),
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
