import { apiFetch, type ApiResponse } from "@/libs/api";
import type { AdminCombo } from "../types";
import { ADMIN_NO_STORE, adminCookie } from "./shared";

export async function getAdminCombos(): Promise<ApiResponse<AdminCombo[]>> {
  return apiFetch<AdminCombo[]>("/admin/combos", ADMIN_NO_STORE, undefined, await adminCookie());
}
