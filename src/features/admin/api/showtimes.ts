import { apiFetch, type ApiResponse } from "@/libs/api";
import type {
  AdminScheduleDayCount,
  AdminScheduleResult,
  AdminShowtimeBoard,
  AdminSlotTemplate,
} from "../types";
import { ADMIN_NO_STORE, adminCookie, buildAdminQuery } from "./shared";

export async function getAdminShowtimeBoard(params: {
  movieSlug: string;
  date: string;
}): Promise<ApiResponse<AdminShowtimeBoard>> {
  return apiFetch<AdminShowtimeBoard>(
    `/showtimes${buildAdminQuery({ movieSlug: params.movieSlug, date: params.date })}`,
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}

export async function getAdminSchedule(date: string): Promise<ApiResponse<AdminScheduleResult>> {
  return apiFetch<AdminScheduleResult>(
    `/admin/showtimes/schedule${buildAdminQuery({ date })}`,
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}

export async function getAdminScheduleSummary(
  from: string,
  to: string,
): Promise<ApiResponse<AdminScheduleDayCount[]>> {
  return apiFetch<AdminScheduleDayCount[]>(
    `/admin/showtimes/schedule/summary${buildAdminQuery({ from, to })}`,
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}

export async function getAdminSlotTemplates(): Promise<ApiResponse<AdminSlotTemplate[]>> {
  return apiFetch<AdminSlotTemplate[]>(
    "/admin/showtimes/slot-templates",
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}
