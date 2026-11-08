import { apiFetch } from "@/libs/api";
import type {
  AdminPaginationMeta,
  AdminTransaction,
  AdminTransactionDetail,
  AdminTransactionQuery,
} from "../types";
import { ADMIN_NO_STORE, adminCookie, buildAdminQuery } from "./shared";

/** Admin transaction table (`GET /admin/transactions`). */
export async function getAdminTransactions(params: AdminTransactionQuery) {
  return apiFetch<{ transactions: AdminTransaction[] }, AdminPaginationMeta>(
    `/admin/transactions${buildAdminQuery({
      page: params.page,
      limit: params.limit,
      search: params.search,
      status: params.status,
      paymentStatus: params.paymentStatus,
      paymentMethod: params.paymentMethod,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      sort: params.sort,
      dir: params.dir,
    })}`,
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}

/** Admin transaction detail (`GET /admin/transactions/:id`). */
export async function getAdminTransactionDetail(id: string) {
  return apiFetch<AdminTransactionDetail>(
    `/admin/transactions/${id}`,
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}
