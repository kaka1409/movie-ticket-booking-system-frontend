export type AdminCatalogKind = "genres" | "formats" | "age-ratings";

/**
 * One row of any of the three lookup catalogs. The backend counts usage against
 * a different relation per catalog (`movieCount` / `showtimeCount`), so the read
 * layer normalises it to `usageCount` and the screen stays generic.
 */
export interface AdminCatalogEntry {
  id: string;
  name: string;
  nameVi: string | null;
  sortOrder: number;
  isActive: boolean;
  usageCount: number;
}

export interface AdminCatalogInput {
  /** Required on create; every other field is a partial update. */
  name?: string;
  nameVi?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}
