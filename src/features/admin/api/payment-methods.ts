import { apiFetch, type ApiResponse } from "@/libs/api";
import type { AdminPaymentMethod } from "../types";
import { ADMIN_NO_STORE, adminCookie } from "./shared";

export async function getAdminPaymentMethods(): Promise<ApiResponse<AdminPaymentMethod[]>> {
  return apiFetch<AdminPaymentMethod[]>(
    "/admin/payment-methods",
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}
