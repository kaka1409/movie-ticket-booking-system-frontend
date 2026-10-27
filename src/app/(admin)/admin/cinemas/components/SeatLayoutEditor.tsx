"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Plus, Trash2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import AdminButton from "@/features/admin/components/AdminButton";
import AdminFormField from "@/features/admin/components/AdminFormField";
import AdminFormModal from "@/features/admin/components/AdminFormModal";
import { ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import {
  getAdminRoomSeatLayoutAction,
  getAdminSeatTypesAction,
  setRoomSeatLayoutAction,
} from "@/features/admin/actions/cinemas.action";
import type {
  AdminCinemaRoom,
  AdminSeatLayout,
  AdminSeatLayoutInput,
  AdminSeatType,
} from "@/features/admin/types";

interface SegmentDraft {
  start: string;
  end: string;
  seatTypeId: string;
}

interface RowDraft {
  rowLabel: string;
  segments: SegmentDraft[];
}

const EMPTY_SEGMENT: SegmentDraft = { start: "1", end: "1", seatTypeId: "" };

function toDraft(layout: AdminSeatLayout | null): RowDraft[] {
  if (!layout || layout.rows.length === 0) {
    return [{ rowLabel: "A", segments: [{ ...EMPTY_SEGMENT }] }];
  }

  return layout.rows.map((row) => ({
    rowLabel: row.rowLabel,
    segments: row.segments.map((segment) => ({
      start: String(segment.start),
      end: String(segment.end),
      seatTypeId: segment.seatTypeId,
    })),
  }));
}

/** Validate the builder state; returns the first human-readable problem. */
function validateRows(rows: RowDraft[], translate: (key: string) => string): string | null {
  const labels = new Set<string>();

  for (const row of rows) {
    const label = row.rowLabel.trim();
    if (label === "") return translate("admin.seatLayout.row_label_required");
    if (label.length > 4) return translate("admin.seatLayout.row_label_too_long");
    if (labels.has(label)) return translate("admin.seatLayout.row_label_duplicate");
    labels.add(label);

    if (row.segments.length === 0) return translate("admin.seatLayout.segment_required");

    const seen = new Set<number>();
    for (const segment of row.segments) {
      const start = Number(segment.start);
      const end = Number(segment.end);

      if (!Number.isInteger(start) || start < 1) {
        return translate("admin.seatLayout.range_invalid");
      }
      if (!Number.isInteger(end) || end < start) {
        return translate("admin.seatLayout.range_invalid");
      }
      if (segment.seatTypeId === "") {
        return translate("admin.seatLayout.type_required");
      }

      for (let seat = start; seat <= end; seat += 1) {
        if (seen.has(seat)) return translate("admin.seatLayout.overlap");
        seen.add(seat);
      }
    }
  }

  if (rows.length === 0) return translate("admin.seatLayout.row_required");

  return null;
}

function buildPayload(rows: RowDraft[]): AdminSeatLayoutInput {
  return {
    rows: rows.map((row) => ({
      rowLabel: row.rowLabel.trim(),
      segments: row.segments.map((segment) => ({
        start: Number(segment.start),
        end: Number(segment.end),
        seatTypeId: segment.seatTypeId,
      })),
    })),
  };
}

export default function SeatLayoutEditor({
  isOpen,
  room,
  onClose,
}: {
  isOpen: boolean;
  room: AdminCinemaRoom | null;
  onClose: () => void;
}) {
  const { translate } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [seatTypes, setSeatTypes] = useState<AdminSeatType[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [rows, setRows] = useState<RowDraft[]>([{ rowLabel: "A", segments: [{ ...EMPTY_SEGMENT }] }]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 740px)").matches;
  });

  const roomId = room?.id ?? "";

  const formSignature = `${isOpen}-${roomId}`;
  const [syncedFormSignature, setSyncedFormSignature] = useState(formSignature);
  if (formSignature !== syncedFormSignature) {
    setSyncedFormSignature(formSignature);
    setSeatTypes(null);
    setLoadError(null);
    setRows([{ rowLabel: "A", segments: [{ ...EMPTY_SEGMENT }] }]);
    setSubmitError(null);
  }

  const isLoading = isOpen && seatTypes === null && loadError === null;

  useEffect(() => {
    if (!isOpen || !roomId || !token) return;

    let cancelled = false;

    Promise.all([
      getAdminSeatTypesAction(token),
      getAdminRoomSeatLayoutAction(token, roomId),
    ]).then(([typesResult, layoutResult]) => {
      if (cancelled) return;

      if (!typesResult.success) {
        setLoadError(typesResult.error);
        return;
      }
      if (!layoutResult.success) {
        setLoadError(layoutResult.error);
        return;
      }

      setSeatTypes(typesResult.data);
      setRows(toDraft(layoutResult.data));
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, roomId, token]);

  const updateRowLabel = (rowIndex: number, value: string) => {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex ? { ...row, rowLabel: value } : row,
      ),
    );
  };

  const addRow = () => {
    setRows((current) => [
      ...current,
      { rowLabel: String.fromCharCode(65 + (current.length % 26)), segments: [{ ...EMPTY_SEGMENT }] },
    ]);
  };

  const removeRow = (rowIndex: number) => {
    setRows((current) => current.filter((_, index) => index !== rowIndex));
  };

  const addSegment = (rowIndex: number) => {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex
          ? { ...row, segments: [...row.segments, { ...EMPTY_SEGMENT }] }
          : row,
      ),
    );
  };

  const removeSegment = (rowIndex: number, segmentIndex: number) => {
    setRows((current) =>
      current.map((row, index) =>
        index === rowIndex
          ? { ...row, segments: row.segments.filter((_, segIndex) => segIndex !== segmentIndex) }
          : row,
      ),
    );
  };

  const updateSegment = (
    rowIndex: number,
    segmentIndex: number,
    field: keyof SegmentDraft,
    value: string,
  ) => {
    setRows((current) =>
      current.map((row, rIndex) =>
        rIndex === rowIndex
          ? {
              ...row,
              segments: row.segments.map((segment, sIndex) =>
                sIndex === segmentIndex ? { ...segment, [field]: value } : segment,
              ),
            }
          : row,
      ),
    );
  };

  const handleSubmit = () => {
    if (!token || !room) return;

    const problem = validateRows(rows, translate);
    if (problem) {
      setSubmitError(problem);
      return;
    }

    const payload = buildPayload(rows);

    startTransition(async () => {
      const result = await setRoomSeatLayoutAction(token, room.id, payload);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      notify(translate("admin.common.saved"), { variant: "success" });
      onClose();
      router.refresh();
    });
  };

  const seatTypeById = new Map((seatTypes ?? []).map((type) => [type.id, type]));

  const previewRows = rows.map((row) => {
    const seats: { number: number; typeId: string; typeName: string }[] = [];

    for (const segment of row.segments) {
      const start = Number(segment.start);
      const end = Number(segment.end);

      if (!Number.isInteger(start) || !Number.isInteger(end) || end < start) continue;
      if (segment.seatTypeId === "") continue;

      const type = seatTypeById.get(segment.seatTypeId);

      for (let number = start; number <= end; number += 1) {
        seats.push({
          number,
          typeId: segment.seatTypeId,
          typeName: type?.name ?? segment.seatTypeId,
        });
      }
    }

    return { label: row.rowLabel.trim(), seats };
  });

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      titleKey="admin.seatLayout.title"
      descriptionKey="admin.seatLayout.description"
      submitLabelKey="admin.common.save"
      error={submitError ?? loadError}
      isPending={isPending}
      size="xl"
    >
      {isLoading ? (
        <p className="text-[12px] text-(--color-text-muted)">{translate("admin.common.loading")}</p>
      ) : (
        <>
          <div className="space-y-3">
            {rows.map((row, rowIndex) => (
              <fieldset
                key={rowIndex}
                className="space-y-2 rounded-xl border border-(--color-border) bg-(--color-surface-2) p-3"
              >
                <div className="flex items-center gap-2">
                  <AdminFormField labelKey="admin.seatLayout.row_label" className="flex-1">
                    <input
                      type="text"
                      maxLength={4}
                      value={row.rowLabel}
                      onChange={(event) => updateRowLabel(rowIndex, event.target.value)}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </AdminFormField>

                  <AdminButton
                    size="icon"
                    variant="ghost"
                    icon={Trash2}
                    label={translate("admin.common.delete")}
                    onClick={() => removeRow(rowIndex)}
                    disabled={rows.length <= 1}
                  />
                </div>

                <div className="space-y-2">
                  {row.segments.map((segment, segmentIndex) => (
                    <div key={segmentIndex} className="grid gap-2 sm:grid-cols-[1fr_1fr_2fr_auto]">
                      <AdminFormField labelKey="admin.seatLayout.start">
                        <input
                          type="number"
                          min={1}
                          value={segment.start}
                          onChange={(event) =>
                            updateSegment(rowIndex, segmentIndex, "start", event.target.value)
                          }
                          className={ADMIN_INPUT_CLASS}
                        />
                      </AdminFormField>

                      <AdminFormField labelKey="admin.seatLayout.end">
                        <input
                          type="number"
                          min={1}
                          value={segment.end}
                          onChange={(event) =>
                            updateSegment(rowIndex, segmentIndex, "end", event.target.value)
                          }
                          className={ADMIN_INPUT_CLASS}
                        />
                      </AdminFormField>

                      <AdminFormField labelKey="admin.seatLayout.type">
                        <select
                          value={segment.seatTypeId}
                          onChange={(event) =>
                            updateSegment(rowIndex, segmentIndex, "seatTypeId", event.target.value)
                          }
                          className={ADMIN_INPUT_CLASS}
                        >
                          <option value="">{translate("admin.common.none")}</option>
                          {(seatTypes ?? []).map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </AdminFormField>

                      <div className="flex items-end">
                        <AdminButton
                          size="icon"
                          variant="ghost"
                          icon={X}
                          label={translate("admin.common.delete")}
                          onClick={() => removeSegment(rowIndex, segmentIndex)}
                          disabled={row.segments.length <= 1}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <AdminButton
                  size="sm"
                  variant="ghost"
                  icon={Plus}
                  onClick={() => addSegment(rowIndex)}
                >
                  {translate("admin.seatLayout.add_segment")}
                </AdminButton>
              </fieldset>
            ))}
          </div>

          <AdminButton size="sm" variant="ghost" icon={Plus} onClick={addRow}>
            {translate("admin.seatLayout.add_row")}
          </AdminButton>

          <div className="border-t border-(--color-border) pt-3">
            <div className="mb-2 flex items-center gap-2">
              <p className="text-[11px] font-bold tracking-wider text-(--color-text-muted) uppercase">
                {translate("admin.seatLayout.preview")}
              </p>
              <AdminButton
                size="sm"
                variant="ghost"
                icon={isPreviewOpen ? EyeOff : Eye}
                onClick={() => setIsPreviewOpen((current) => !current)}
              >
                {translate(isPreviewOpen ? "admin.seatLayout.hide_preview" : "admin.seatLayout.show_preview")}
              </AdminButton>
            </div>

            {isPreviewOpen && (
              <div className="space-y-1.5 overflow-x-auto rounded-xl border border-(--color-border) bg-(--color-surface-2) p-3">
                {previewRows.map((previewRow, rowIndex) => (
                  <div key={rowIndex} className="flex items-center gap-2">
                    <span className="w-6 shrink-0 text-center text-[10px] font-bold text-(--color-text-muted)">
                      {previewRow.label || "—"}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {previewRow.seats.map((seat) => (
                        <span
                          key={seat.number}
                          title={seat.typeName}
                          className="flex h-6 w-6 items-center justify-center rounded text-[9px] font-bold text-(--color-on-accent)"
                          style={{
                            backgroundColor: seat.typeName.toLowerCase().includes("sweet")
                              ? "var(--color-gold)"
                              : "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            color: seat.typeName.toLowerCase().includes("sweet")
                              ? "var(--color-on-accent)"
                              : "var(--color-text-secondary)",
                          }}
                        >
                          {seat.number}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-(--color-text-muted)">
                  {(seatTypes ?? []).map((type) => (
                    <span key={type.id} className="flex items-center gap-1">
                      <span
                        className="inline-block h-3 w-3 rounded"
                        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                      />
                      {type.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </AdminFormModal>
  );
}
