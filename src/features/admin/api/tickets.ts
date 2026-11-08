import { apiFetch } from "@/libs/api";
import type {
  AdminPaginationMeta,
  AdminTicket,
  AdminTicketDetail,
  AdminTicketQuery,
} from "../types";
import { ADMIN_NO_STORE, adminCookie, buildAdminQuery } from "./shared";

/** Admin ticket table (`GET /admin/tickets`). */
export async function getAdminTickets(params: AdminTicketQuery) {
  return apiFetch<{ tickets: AdminTicket[] }, AdminPaginationMeta>(
    `/admin/tickets${buildAdminQuery({
      page: params.page,
      limit: params.limit,
      ownerSearch: params.ownerSearch,
      status: params.status,
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

/** Admin ticket detail (`GET /admin/tickets/:id`) — no QR credential. */
export async function getAdminTicketDetail(id: string) {
  return apiFetch<AdminTicketDetail>(
    `/admin/tickets/${id}`,
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}
