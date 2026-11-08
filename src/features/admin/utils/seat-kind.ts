/** Canonical seat-type vocabulary shared by the admin diagram and editor. */
export type AdminSeatKind = "available" | "vip" | "sweetbox";

const KIND_FROM_TYPE_NAME: Record<string, AdminSeatKind> = {
  standard: "available",
  vip: "vip",
  sweetbox: "sweetbox",
};

/** Maps a seat-type name (`Standard`/`VIP`/`SweetBox`) to its public kind. */
export function seatKindOfTypeName(name: string): AdminSeatKind {
  return KIND_FROM_TYPE_NAME[name.trim().toLowerCase()] ?? "available";
}

/** Full cell paint for the read-only diagram (size included) — matches booking desktop `xl`. */
export const ADMIN_SEAT_KIND_CELL_CLASS: Record<AdminSeatKind, string> = {
  available:
    "h-14 w-14 rounded-sm border border-(--color-border) bg-(--color-surface-2) text-[11px] font-bold text-(--color-text-secondary)",
  vip: "h-14 w-14 rounded-sm bg-amber-700 text-[11px] font-bold text-white",
  sweetbox: "h-14 w-32 rounded-sm bg-pink-500 text-[11px] font-bold tracking-wide text-white",
};

/** Colour-only swatch for legends and brush pickers. */
export const ADMIN_SEAT_KIND_SWATCH_CLASS: Record<AdminSeatKind, string> = {
  available: "border border-(--color-border) bg-(--color-surface-2)",
  vip: "bg-amber-700",
  sweetbox: "bg-pink-500",
};

/** Fill for painted editor cells — geometry matches the diagram cells. */
export const ADMIN_SEAT_KIND_PAINT_CLASS: Record<AdminSeatKind, string> = {
  available:
    "h-14 w-14 rounded-sm border border-(--color-border) bg-(--color-surface-2) text-(--color-text-secondary)",
  vip: "h-14 w-14 rounded-sm bg-amber-700 text-white",
  sweetbox: "h-14 w-32 rounded-sm bg-pink-500 text-white",
};

/** Empty cell placeholder in editor — dashed border, clickable to paint. */
export const ADMIN_EDITOR_EMPTY_CELL_CLASS =
  "h-14 w-14 rounded-sm border border-dashed border-(--color-border) text-[11px] font-bold text-(--color-text-muted) hover:border-(--color-border-strong)";

/** Square fill for grid-painter cells — same kind colours, fixed geometry. */
export const ADMIN_SEAT_KIND_GRID_CLASS: Record<AdminSeatKind, string> = {
  available:
    "h-11 w-11 rounded-sm border border-(--color-border) bg-(--color-surface-2) text-[11px] font-bold text-(--color-text-secondary)",
  vip: "h-11 w-11 rounded-sm bg-amber-700 text-[11px] font-bold text-white",
  sweetbox: "h-11 w-11 rounded-sm bg-pink-500 text-[11px] font-bold text-white",
};

/** Empty placeholder for the grid painter — smaller cells than the segment editor. */
export const ADMIN_EDITOR_GRID_EMPTY_CLASS =
  "h-11 w-11 rounded-sm border border-dashed border-(--color-border) text-[11px] font-bold text-(--color-text-muted) hover:border-(--color-border-strong)";

export interface EditorDisplayCell {
  key: string;
  kind: AdminSeatKind;
  label: string;
  /** 0-based column index. */
  col: number;
  /** 0-based row index. */
  rowIndex: number;
  /** True if this cell is empty (not painted yet). */
  isEmpty: boolean;
}

export interface EditorDisplayRow {
  label: string;
  rowIndex: number;
  left: EditorDisplayCell[];
  right: EditorDisplayCell[];
}

/**
 * Convert painted cells (0-based cols) into display rows matching the diagram:
 * - Group contiguous same-type columns into runs.
 * - SweetBox runs chunk into pairs: [0,1,2,3] → [{0,1}, {2,3}].
 * - SweetBox pair renders as one wide cell with label "start+1-end+1".
 * - Standard/VIP runs expand to single cells.
 * - Split at midpoint for two half-rows with aisle.
 */
export function cellsToDisplayRows(
  cells: Map<string, string>,
  rowLabels: string[],
  colCount: number,
  seatKindById: Map<string, AdminSeatKind>,
): EditorDisplayRow[] {
  const rows: EditorDisplayRow[] = [];

  for (let row = 0; row < rowLabels.length; row += 1) {
    const rowLabel = rowLabels[row];
    const paintedCols: number[] = [];
    for (let col = 0; col < colCount; col += 1) {
      if (cells.has(`${row}:${col}`)) paintedCols.push(col);
    }
    if (paintedCols.length === 0) {
      // Empty row: emit empty left/right so editor can render placeholders.
      rows.push({ label: rowLabel, rowIndex: row, left: [], right: [] });
      continue;
    }

    // Group contiguous same-type columns.
    const runs: { kind: AdminSeatKind; cols: number[] }[] = [];
    for (const col of paintedCols) {
      const typeId = cells.get(`${row}:${col}`)!;
      const kind = seatKindById.get(typeId) ?? "available";
      const lastRun = runs[runs.length - 1];
      if (lastRun && lastRun.kind === kind && lastRun.cols[lastRun.cols.length - 1] === col - 1) {
        lastRun.cols.push(col);
      } else {
        runs.push({ kind, cols: [col] });
      }
    }

    // Convert runs to display cells.
    const segmentCells: EditorDisplayCell[][] = [];
    for (const run of runs) {
      if (run.kind === "sweetbox") {
        // Chunk into pairs.
        for (let i = 0; i < run.cols.length; i += 2) {
          const a = run.cols[i];
          const b = run.cols[i + 1];
          if (b === undefined) break; // Odd tail dropped.
          segmentCells.push([
            {
              key: `${rowLabel}-${a}-${b}`,
              kind: "sweetbox",
              label: `${a + 1}-${b + 1}`,
              col: a,
              rowIndex: row,
              isEmpty: false,
            },
          ]);
        }
      } else {
        // Standard/VIP: one cell per column.
        for (const col of run.cols) {
          segmentCells.push([
            {
              key: `${rowLabel}-${col}`,
              kind: run.kind,
              label: String(col + 1),
              col,
              rowIndex: row,
              isEmpty: false,
            },
          ]);
        }
      }
    }

    // Split at midpoint for two half-rows.
    const middle = Math.ceil(segmentCells.length / 2);
    const left = segmentCells.slice(0, middle).flat();
    const right = segmentCells.slice(middle).flat();
    rows.push({ label: rowLabel, rowIndex: row, left, right });
  }

  return rows;
}

/**
 * Editor-specific display rows: render full grid with empty cells,
 * merge SweetBox pairs, and split at midpoint for aisle.
 * - Empty cells: dashed border, clickable to paint.
 * - Standard/VIP painted: solid color.
 * - SweetBox painted: check adjacent cell and merge into one wide cell.
 */
export function editorGridToDisplayRows(
  cells: Map<string, string>,
  rowLabels: string[],
  colCount: number,
  seatKindById: Map<string, AdminSeatKind>,
): EditorDisplayRow[] {
  const rows: EditorDisplayRow[] = [];

  for (let row = 0; row < rowLabels.length; row += 1) {
    const rowLabel = rowLabels[row];
    const segmentCells: EditorDisplayCell[][] = [];
    let col = 0;

    while (col < colCount) {
      const key = `${row}:${col}`;
      const typeId = cells.get(key);
      const kind = typeId ? seatKindById.get(typeId) : null;

      if (kind === "sweetbox") {
        // Check if next col is also SweetBox (pair).
        const nextKey = `${row}:${col + 1}`;
        const nextTypeId = cells.get(nextKey);
        const nextKind = nextTypeId ? seatKindById.get(nextTypeId) : null;

        if (nextKind === "sweetbox") {
          // Merge into one wide cell.
          segmentCells.push([
            {
              key: `${rowLabel}-${col}-${col + 1}`,
              kind: "sweetbox",
              label: `${col + 1}-${col + 2}`,
              col,
              rowIndex: row,
              isEmpty: false,
            },
          ]);
          col += 2;
        } else {
          // Lone SweetBox: render as single cell (odd tail).
          segmentCells.push([
            {
              key: `${rowLabel}-${col}`,
              kind: "sweetbox",
              label: String(col + 1),
              col,
              rowIndex: row,
              isEmpty: false,
            },
          ]);
          col += 1;
        }
      } else if (kind) {
        // Standard/VIP painted.
        segmentCells.push([
          {
            key: `${rowLabel}-${col}`,
            kind,
            label: String(col + 1),
            col,
            rowIndex: row,
            isEmpty: false,
          },
        ]);
        col += 1;
      } else {
        // Empty cell: placeholder for painting.
        segmentCells.push([
          {
            key: `${rowLabel}-${col}`,
            kind: "available",
            label: String(col + 1),
            col,
            rowIndex: row,
            isEmpty: true,
          },
        ]);
        col += 1;
      }
    }

    // Split at midpoint for two half-rows.
    const middle = Math.ceil(segmentCells.length / 2);
    const left = segmentCells.slice(0, middle).flat();
    const right = segmentCells.slice(middle).flat();
    rows.push({ label: rowLabel, rowIndex: row, left, right });
  }

  return rows;
}
