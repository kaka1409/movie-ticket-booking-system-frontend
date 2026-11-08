import { apiFetch, type ApiResponse } from "@/libs/api";
import type { AdminFoodItem } from "../types";
import { ADMIN_NO_STORE, adminCookie } from "./shared";

export async function getAdminFoodItems(): Promise<ApiResponse<AdminFoodItem[]>> {
  return apiFetch<AdminFoodItem[]>(
    "/admin/food-items",
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}
