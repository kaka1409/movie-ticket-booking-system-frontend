import AdminDataError from "@/app/(admin)/admin/components/shared/AdminDataError";
import { getAdminTickets } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import type { AdminTicketStatus } from "@/features/admin/types";
import TicketsManager from "./components/TicketsManager";

const TICKET_STATUSES: AdminTicketStatus[] = [
  "active",
  "used",
  "expired",
  "cancelled",
  "refunded",
];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface AdminTicketsQuery {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  sort: string;
  dir: string;
  page: number;
}

export async function TicketsManagerSection({
  search,
  status,
  dateFrom,
  dateTo,
  sort,
  dir,
  page,
}: AdminTicketsQuery) {
  const validStatus = TICKET_STATUSES.includes(status as AdminTicketStatus)
    ? (status as AdminTicketStatus)
    : "";
  const validDateFrom = DATE_PATTERN.test(dateFrom) ? dateFrom : "";
  const validDateTo = DATE_PATTERN.test(dateTo) ? dateTo : "";

  const result = await getAdminTickets({
    page,
    limit: 15,
    ownerSearch: search,
    status: validStatus,
    dateFrom: validDateFrom,
    dateTo: validDateTo,
    sort,
    dir: dir === "asc" ? "asc" : "desc",
  });
  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;

  return (
    <TicketsManager
      tickets={result.data.tickets}
      pagination={result.meta!}
      filters={{
        search,
        status: validStatus,
        dateFrom: validDateFrom,
        dateTo: validDateTo,
      }}
      sort={sort}
      dir={dir}
    />
  );
}
