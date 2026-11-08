"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import { ADMIN_INPUT_CLASS, ADMIN_LABEL_CLASS } from "@/features/admin/constants";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { seedShowtimesAction } from "@/features/admin/actions/showtimes.action";
import type {
  AdminSeedShowtimesInput,
  AdminSeedShowtimesResult,
  AdminSlotTemplate,
} from "@/features/admin/types";

type ModalStage = "config" | "preview" | "done";

/** Config → dry-run preview → generate → result for `POST /admin/showtimes/seed`. */
export default function SeedScheduleModal({
  isOpen,
  onClose,
  templates,
}: {
  isOpen: boolean;
  onClose: () => void;
  templates: AdminSlotTemplate[];
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [template, setTemplate] = useState(templates[0]?.key ?? "standard");
  const [horizonDays, setHorizonDays] = useState(7);
  const [runDays, setRunDays] = useState(3);
  const [dryRun, setDryRun] = useState(true);
  const [stage, setStage] = useState<ModalStage>("config");
  const [preview, setPreview] = useState<AdminSeedShowtimesResult | null>(null);
  const [result, setResult] = useState<AdminSeedShowtimesResult | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const input = (): AdminSeedShowtimesInput => ({
    template,
    horizonDays,
    runDays,
    dryRun,
  });

  const run = async (asDryRun: boolean) => {
    if (!token) return;
    setIsPending(true);
    setError(null);
    const response = await seedShowtimesAction(token, { ...input(), dryRun: asDryRun });
    setIsPending(false);
    if (!response.success || !response.data) {
      setError(response.success ? translate("admin.common.load_failed") : response.error);
      return;
    }
    if (asDryRun) {
      setPreview(response.data);
      setStage("preview");
    } else {
      setResult(response.data);
      setStage("done");
      notify(translate("admin.showtimes.seed_done"), { variant: "success" });
      router.refresh();
    }
  };

  const reset = () => {
    setStage("config");
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const stats = (data: AdminSeedShowtimesResult) => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {(
        [
          ["admin.showtimes.seed_planned", data.planned],
          ["admin.showtimes.seed_exists", data.skipped.exists],
          ["admin.showtimes.seed_conflict", data.skipped.conflict],
          ["admin.showtimes.seed_past", data.skipped.past],
        ] as const
      ).map(([key, value]) => (
        <div
          key={key}
          className="rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-center"
        >
          <p className="text-lg font-bold tabular-nums text-(--color-gold)">{value}</p>
          <p className="text-[10px] font-bold tracking-wider text-(--color-text-muted) uppercase">
            {translate(key)}
          </p>
        </div>
      ))}
    </div>
  );

  const skippedList = (data: AdminSeedShowtimesResult) =>
    data.skippedSample.length > 0 && (
      <div className="rounded-xl border border-(--color-border) bg-(--color-surface-2) p-3">
        <p className="mb-1 text-[10px] font-bold tracking-wider text-(--color-text-muted) uppercase">
          {translate("admin.showtimes.seed_skipped")}
        </p>
        <div className="max-h-36 space-y-1 overflow-y-auto">
          {data.skippedSample.map((item, index) => (
            <p key={index} className="font-mono text-[10px] text-(--color-text-muted)">
              {item.date} · {item.startTime} · {item.reason}
            </p>
          ))}
        </div>
      </div>
    );

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={() => {}}
      titleKey={
        stage === "config"
          ? "admin.showtimes.seed_title"
          : stage === "preview"
            ? "admin.showtimes.seed_preview_title"
            : "admin.showtimes.seed_done_title"
      }
      submitLabelKey=""
      error={error}
      isPending={false}
      size="lg"
      hideFooter
    >
      <div className="space-y-4">
        {error && <ErrorAlert message={error} />}
        {stage === "config" && (
          <>
            <p className="text-[12px] text-(--color-text-muted)">
              {translate("admin.showtimes.seed_body")}
            </p>

            <div>
              <p className={ADMIN_LABEL_CLASS}>{translate("admin.showtimes.seed_template")}</p>
              <div className="mt-1 space-y-1.5">
                {templates.map((item) => (
                  <label
                    key={item.key}
                    className={`flex cursor-pointer items-start gap-2 rounded-xl border p-2.5 text-[12px] ${
                      template === item.key
                        ? "border-(--color-gold)/60 bg-(--color-gold)/10"
                        : "border-(--color-border) bg-(--color-surface-2)"
                    }`}
                  >
                    <input
                      type="radio"
                      name="seed-template"
                      checked={template === item.key}
                      onChange={() => setTemplate(item.key)}
                      className="mt-0.5 accent-(--color-gold)"
                    />
                    <span>
                      <span className="font-bold text-(--color-text-primary)">
                        {translate(`admin.showtimes.template_${item.key}`)}
                      </span>
                      <span className="block text-[10px] text-(--color-text-muted)">
                        {item.weekday.map((slot) => slot.startTime).join(" · ")}
                        {item.weekend.length !== item.weekday.length &&
                          ` / wknd +${item.weekend[item.weekend.length - 1].startTime}`}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={ADMIN_LABEL_CLASS}>
                  {translate("admin.showtimes.seed_horizon")}
                </span>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={horizonDays}
                  onChange={(event) =>
                    setHorizonDays(Math.min(14, Math.max(1, Number(event.target.value) || 1)))
                  }
                  className={`${ADMIN_INPUT_CLASS} mt-1`}
                />
              </label>
              <label className="block">
                <span className={ADMIN_LABEL_CLASS}>{translate("admin.showtimes.seed_run")}</span>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={runDays}
                  onChange={(event) =>
                    setRunDays(Math.min(7, Math.max(1, Number(event.target.value) || 1)))
                  }
                  className={`${ADMIN_INPUT_CLASS} mt-1`}
                />
              </label>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-[12px] text-(--color-text-primary)">
              <input
                type="checkbox"
                checked={dryRun}
                onChange={(event) => setDryRun(event.target.checked)}
                className="accent-(--color-gold)"
              />
              {translate("admin.showtimes.seed_dry_run")}
            </label>

            <div className="flex items-center justify-end gap-2 border-t border-(--color-border) pt-3">
              <AdminButton size="md" variant="ghost" type="button" onClick={handleClose}>
                {translate("admin.common.cancel")}
              </AdminButton>
              <AdminButton
                size="md"
                variant="primary"
                type="button"
                isLoading={isPending}
                onClick={() => void run(true)}
              >
                {translate("admin.showtimes.seed_preview")}
              </AdminButton>
            </div>
          </>
        )}

        {stage === "preview" && preview && (
          <>
            <p className="text-[12px] text-(--color-text-muted)">
              {translate(`admin.showtimes.template_${preview.template}`)} ·{" "}
              {preview.horizonDays}d · {preview.runDays}d/run
            </p>
            {stats(preview)}
            <p className="text-[11px] text-(--color-text-muted)">
              {preview.moviesScheduled} {translate("admin.showtimes.seed_movies")} ·{" "}
              {preview.roomsUsed} {translate("admin.showtimes.seed_rooms")}
            </p>
            {skippedList(preview)}
            <div className="flex items-center justify-between gap-2 border-t border-(--color-border) pt-3">
              <AdminButton size="md" variant="ghost" type="button" onClick={reset}>
                {translate("admin.showtimes.seed_back")}
              </AdminButton>
              <AdminButton
                size="md"
                variant="primary"
                type="button"
                isLoading={isPending}
                onClick={() => void run(false)}
              >
                {translate("admin.showtimes.seed_generate")} {preview.planned}
              </AdminButton>
            </div>
          </>
        )}

        {stage === "done" && result && (
          <>
            <p className="text-sm font-bold text-(--color-text-primary)">
              {result.created} {translate("admin.showtimes.seed_created_label")}
            </p>
            {stats(result)}
            {skippedList(result)}
            <div className="flex items-center justify-end border-t border-(--color-border) pt-3">
              <AdminButton size="md" variant="primary" type="button" onClick={handleClose}>
                {translate("admin.showtimes.seed_close")}
              </AdminButton>
            </div>
          </>
        )}
      </div>
    </AdminFormModal>
  );
}
