"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eraser } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFormField from "@/app/(admin)/admin/components/shared/AdminFormField";
import AdminFormModal from "@/app/(admin)/admin/components/shared/AdminFormModal";
import { ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import {
  ADMIN_EDITOR_GRID_EMPTY_CLASS,
  ADMIN_SEAT_KIND_GRID_CLASS,
  ADMIN_SEAT_KIND_SWATCH_CLASS,
} from "@/features/admin/utils/seat-kind";
import {
  applyBrushToGrid,
  buildSeatLayoutPayload,
  gridKey,
  gridToEditorRows,
  mapsFromSeatTypes,
  seatKindOfTypeId,
  seatTypeNameById,
  type EditorGrid,
  type SeatEditorMaps,
} from "@/features/admin/utils/seat-editor";
import {
  getAdminRoomSeatLayoutAction,
  getAdminSeatTypesAction,
  setRoomSeatLayoutAction,
} from "@/features/admin/actions/cinemas.action";
import type { AdminCinemaRoom, AdminSeatLayout, AdminSeatType } from "@/features/admin/types";

const MAX_ROWS = 30;
const MAX_COLS = 40;
const DEFAULT_ROWS = 8;
const DEFAULT_COLS = 12;

const EMPTY_MAPS: SeatEditorMaps = {
  kindById: new Map(),
  typeById: new Map(),
};

// ADMIN_INPUT_CLASS carries `w-full`, which would override the fixed widths the
// grid inputs need — strip it once here instead of fighting utility order.
const GRID_INPUT_CLASS = ADMIN_INPUT_CLASS.replace("w-full ", "");

/** Spreadsheet-style row labels: A…Z, AA… — backend caps labels at 4 chars. */
function toRowLabel(index: number): string {
  let label = "";
  let value = index;
  do {
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);
  return label;
}

function clampGridSize(value: number, max: number): number {
  return Math.min(Math.max(Number.isFinite(value) ? value : 1, 1), max);
}

/** Drop painted cells that fall outside a shrunken grid. */
function pruneGrid(cells: EditorGrid, rowCount: number, colCount: number): EditorGrid {
  const next = new Map<string, string>();
  for (const [key, typeId] of cells) {
    const [row, col] = key.split(":").map(Number);
    if (row < rowCount && col < colCount) next.set(key, typeId);
  }
  return next;
}

/**
 * Visual seat-map painter: a fixed rows×cols grid where click or drag fills
 * cells with the selected type (eraser removes). SweetBox paints its aligned
 * column pair so no lone SweetBox seat can be produced. On save the painted
 * cells are compacted into packed rows → backend segments.
 */
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

  const [rowCount, setRowCount] = useState(DEFAULT_ROWS);
  const [colCount, setColCount] = useState(DEFAULT_COLS);
  const [rowLabels, setRowLabels] = useState<string[]>([]);
  const [cells, setCells] = useState<EditorGrid>(new Map());
  /** `null` = eraser brush. */
  const [brushId, setBrushId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isPaintingRef = useRef(false);
  const roomId = room?.id ?? "";

  const maps = useMemo(
    () => (seatTypes ? mapsFromSeatTypes(seatTypes) : EMPTY_MAPS),
    [seatTypes],
  );

  const formSignature = `${isOpen}-${roomId}`;
  const [syncedFormSignature, setSyncedFormSignature] = useState(formSignature);
  if (formSignature !== syncedFormSignature) {
    setSyncedFormSignature(formSignature);
    setSeatTypes(null);
    setLoadError(null);
    setRowCount(DEFAULT_ROWS);
    setColCount(DEFAULT_COLS);
    setRowLabels([]);
    setCells(new Map());
    setBrushId(null);
    setSubmitError(null);
  }

  const isLoading = isOpen && seatTypes === null && loadError === null;

  /** Stored segments → grid cells; segment seat numbers become grid columns. */
  function hydrateFromLayout(types: AdminSeatType[], layout: AdminSeatLayout | null) {
    const layoutRows = layout?.rows ?? [];
    const maxSegmentEnd = Math.max(
      DEFAULT_COLS,
      ...layoutRows.flatMap((row) => row.segments.map((segment) => segment.end)),
    );

    const nextCells: EditorGrid = new Map();
    layoutRows.forEach((layoutRow, rowIndex) => {
      for (const segment of layoutRow.segments) {
        for (let seat = segment.start; seat <= segment.end; seat += 1) {
          nextCells.set(gridKey(rowIndex, seat - 1), segment.seatTypeId);
        }
      }
    });

    setRowCount(Math.max(DEFAULT_ROWS, layoutRows.length));
    setColCount(maxSegmentEnd);
    setRowLabels(layoutRows.map((layoutRow) => layoutRow.rowLabel));
    setCells(nextCells);
    setBrushId(types[0]?.id ?? null);
  }

  useEffect(() => {
    if (!isOpen || !roomId || !token) return;

    let cancelled = false;

    Promise.all([getAdminSeatTypesAction(token), getAdminRoomSeatLayoutAction(token, roomId)]).then(
      ([typesResult, layoutResult]) => {
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
        hydrateFromLayout(typesResult.data, layoutResult.data);
      },
    );

    return () => {
      cancelled = true;
    };
    // hydrateFromLayout only writes state; the effect keys off the fetch inputs.
  }, [isOpen, roomId, token]);

  useEffect(() => {
    const stopPainting = () => {
      isPaintingRef.current = false;
    };
    window.addEventListener("pointerup", stopPainting);
    window.addEventListener("pointercancel", stopPainting);
    return () => {
      window.removeEventListener("pointerup", stopPainting);
      window.removeEventListener("pointercancel", stopPainting);
    };
  }, []);

  const paintedCount = cells.size;

  /* ── painting ─────────────────────────────────────────────────── */

  const paintAt = (row: number, col: number) => {
    if (row < 0 || row >= rowCount || col < 0 || col >= colCount) return;
    setCells((current) => applyBrushToGrid(current, row, col, brushId, maps, colCount));
  };

  const startPaint = (row: number, col: number) => {
    isPaintingRef.current = true;
    paintAt(row, col);
  };

  /* ── grid / label editing ─────────────────────────────────────── */

  const updateGridSize = (nextRows: number, nextCols: number) => {
    const rows = clampGridSize(nextRows, MAX_ROWS);
    const cols = clampGridSize(nextCols, MAX_COLS);
    setRowCount(rows);
    setColCount(cols);
    setCells((current) => pruneGrid(current, rows, cols));
  };

  const updateRowLabel = (rowIndex: number, label: string) => {
    setRowLabels((current) => {
      const next = [...current];
      next[rowIndex] = label;
      return next;
    });
  };

  const clearAll = () => {
    setCells(new Map());
  };

  /* ── save: painted grid → packed segments ─────────────────────── */

  const handleSubmit = () => {
    if (!token || !room) return;

    const resolvedLabels = Array.from({ length: rowCount }, (_, row) =>
      rowLabels[row]?.trim() ? rowLabels[row].trim() : toRowLabel(row),
    );
    const editorRows = gridToEditorRows(cells, rowCount, colCount, resolvedLabels);
    const result = buildSeatLayoutPayload(editorRows, maps);

    if (!result.ok) {
      setSubmitError(translate(`admin.seatLayout.${result.error}`));
      return;
    }

    startTransition(async () => {
      const actionResult = await setRoomSeatLayoutAction(token, room.id, result.payload);

      if (!actionResult.success) {
        setSubmitError(actionResult.error);
        return;
      }

      notify(translate("admin.common.saved"), { variant: "success" });
      onClose();
      router.refresh();
    });
  };

  /* ── render ───────────────────────────────────────────────────── */

  const seatSwatchClassByTypeId = new Map(
    (seatTypes ?? []).map((type) => [
      type.id,
      ADMIN_SEAT_KIND_SWATCH_CLASS[maps.kindById.get(type.id) ?? "available"],
    ]),
  );

  const middle = Math.ceil(colCount / 2);
  const leftCols = Array.from({ length: middle }, (_, col) => col);
  const rightCols = Array.from({ length: colCount - middle }, (_, col) => middle + col);

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
        <div className="space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <AdminFormField labelKey="admin.seatLayout.rows">
              <input
                type="number"
                name="rows"
                min={1}
                max={MAX_ROWS}
                value={rowCount}
                onChange={(event) => updateGridSize(Number(event.target.value), colCount)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.preventDefault();
                }}
                className={`${GRID_INPUT_CLASS} w-20`}
              />
            </AdminFormField>
            <AdminFormField labelKey="admin.seatLayout.cols">
              <input
                type="number"
                name="cols"
                min={1}
                max={MAX_COLS}
                value={colCount}
                onChange={(event) => updateGridSize(rowCount, Number(event.target.value))}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.preventDefault();
                }}
                className={`${GRID_INPUT_CLASS} w-20`}
              />
            </AdminFormField>

            <div className="flex flex-1 flex-wrap items-center gap-1.5">
              {(seatTypes ?? []).map((type) => {
                const selected = brushId === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setBrushId(type.id)}
                    aria-pressed={selected}
                    className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-bold transition ${
                      selected
                        ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-text-primary)"
                        : "border-(--color-border) text-(--color-text-muted) hover:border-(--color-border-strong)"
                    }`}
                  >
                    <span
                      className={`h-3.5 w-3.5 rounded-sm ${seatSwatchClassByTypeId.get(type.id) ?? ""}`}
                    />
                    {type.name}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setBrushId(null)}
                aria-pressed={brushId === null}
                className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-bold transition ${
                  brushId === null
                    ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-text-primary)"
                    : "border-(--color-border) text-(--color-text-muted) hover:border-(--color-border-strong)"
                }`}
              >
                <Eraser size={12} aria-hidden />
                {translate("admin.seatLayout.eraser")}
              </button>
            </div>

            <AdminButton size="sm" variant="ghost" icon={Eraser} onClick={clearAll} disabled={paintedCount === 0}>
              {translate("admin.seatLayout.clear_all")}
            </AdminButton>
          </div>

          <p className="text-[11px] text-(--color-text-muted)">
            {translate("admin.seatLayout.paint_hint")}
            {paintedCount > 0 && ` · ${paintedCount} ${translate("admin.seatLayout.seats_count")}`}
          </p>

          <div className="select-none overflow-x-auto overscroll-x-contain rounded-xl border border-(--color-border) bg-(--color-surface-2) p-3 scrollbar-hide">
            <div className="mx-auto mb-4 flex max-w-2xl flex-col items-center gap-1.5">
              <span className="text-2xs font-bold tracking-[0.2em] text-(--color-gold) uppercase">
                {translate("admin.seatLayout.screen")}
              </span>
              <svg width={300} height={24} viewBox="0 0 300 24" fill="none" aria-hidden>
                <path
                  d="M 2 20 Q 150 0 298 20"
                  stroke="rgba(255,204,77,0.8)"
                  strokeWidth="5"
                />
              </svg>
            </div>

            <div className="mx-auto max-w-4xl space-y-1.5">
              {Array.from({ length: rowCount }, (_, row) => {
                const renderCell = (col: number) => {
                  const typeId = cells.get(gridKey(row, col));
                  const kind = typeId ? seatKindOfTypeId(typeId, maps) : "available";
                  const seatLabel = String(col + 1);
                  const title = typeId
                    ? `${toRowLabel(row)}${seatLabel} · ${seatTypeNameById(typeId, maps)}`
                    : `${toRowLabel(row)}${seatLabel} · ${translate("admin.seatLayout.empty_slot")}`;

                  return (
                    <button
                      key={col}
                      type="button"
                      onPointerDown={(event) => {
                        event.preventDefault();
                        startPaint(row, col);
                      }}
                      onPointerEnter={() => {
                        if (isPaintingRef.current) paintAt(row, col);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          paintAt(row, col);
                        }
                      }}
                      title={title}
                      className={`flex shrink-0 items-center justify-center transition active:scale-[0.95] ${
                        typeId ? ADMIN_SEAT_KIND_GRID_CLASS[kind] : ADMIN_EDITOR_GRID_EMPTY_CLASS
                      }`}
                    >
                      {seatLabel}
                    </button>
                  );
                };

                return (
                  <div key={row} className="flex w-max min-w-full items-center gap-1.5">
                    <input
                      name="rowLabel"
                      value={rowLabels[row] ?? toRowLabel(row)}
                      onChange={(event) => updateRowLabel(row, event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") event.preventDefault();
                      }}
                      maxLength={4}
                      aria-label={translate("admin.seatLayout.row_label")}
                      className={`${GRID_INPUT_CLASS} h-8 w-12 shrink-0 px-1.5 text-center text-[11px] font-bold uppercase`}
                    />
                    <div className="flex shrink-0 gap-1">{leftCols.map(renderCell)}</div>
                    <div className="w-3 shrink-0" />
                    <div className="flex shrink-0 gap-1">{rightCols.map(renderCell)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AdminFormModal>
  );
}
