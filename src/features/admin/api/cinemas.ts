import { apiFetch, type ApiResponse } from "@/libs/api";
import type { AdminCinema } from "../types";
import { ADMIN_NO_STORE, adminCookie } from "./shared";

export async function getAdminCinemas(): Promise<ApiResponse<AdminCinema[]>> {
  return apiFetch<AdminCinema[]>("/admin/cinemas", ADMIN_NO_STORE, undefined, await adminCookie());
}
