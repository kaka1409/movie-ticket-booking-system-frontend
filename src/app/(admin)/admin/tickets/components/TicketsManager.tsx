"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ticket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";
import AdminPagination from "@/app/(admin)/admin/components/shared/AdminPagination";
import AdminTable, {
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import { formatVND } from "@/libs/utils";
import type { AdminPaginationMeta, AdminTicket } from "@/features/admin/types";
import TicketsFiltersCard, {
  type TicketFilterDraft,
} from "./TicketsFiltersCard";
import TicketDetailPanel from "./TicketDetailPanel";
import AdminAvatar from "../../components/shared/AdminAvatar";
import AdminPoster from "../../components/shared/AdminPoster";

interface TicketsManagerProps {
  tickets: AdminTicket[];
  pagination: AdminPaginationMeta;
  filters: TicketFilterDraft;
}

function ticketBadgeVariant(status: string) {
  if (status === "active") return "gold" as const;
  if (status === "used") return "success" as const;
  if (status === "cancelled" || status === "expired" || status === "refunded")
    return "neutral" as const;
  return "neutral" as const;
}

/**
 * Ticket (entitlement) table plus its expandable-row detail. Backend-paginated
 * like the users list: filters and page live in the URL.
 */
export default function TicketsManager({
  tickets,
  pagination,
  filters,
}: TicketsManagerProps) {
  const { translate, locale } = useLocale();
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();

  const buildHref = (draft: TicketFilterDraft, page = 1) => {
    const params = new URLSearchParams();
    if (draft.search !== "") params.set("search", draft.search);
    if (draft.status !== "") params.set("status", draft.status);
    if (draft.dateFrom !== "") params.set("dateFrom", draft.dateFrom);
    if (draft.dateTo !== "") params.set("dateTo", draft.dateTo);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query === "" ? "/admin/tickets" : `/admin/tickets?${query}`;
  };

  const isFiltered = Object.values(filters).some((value) => value !== "");

  const columns: AdminTableColumn<AdminTicket>[] = [
    {
      id: "ticket",
      headerKey: "admin.tickets.column_ticket",
      cell: (row) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <AdminPoster
            src={row.showtime.movie.posterUrl}
            alt={row.showtime.movie.title}
            className="h-10 w-16"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-(--color-text-primary)">
              {row.showtime.movie.title}
            </p>
            <p className="truncate text-[11px] text-(--color-text-muted)">
              {row.showtime.date} · {row.showtime.startTime} · {row.showtime.cinemaName}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "owner",
      headerKey: "admin.tickets.column_owner",
      cell: (row) => (
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-(--color-text-primary)">
            <AdminAvatar
              name={row.owner.fullname ?? row.owner.email}
              avatarUrl={row.owner.avatarUrl}
              size={18}
            />
            {row.owner.fullname ?? row.owner.email}
          </p>
          <p className="truncate text-[11px] text-(--color-text-muted)">
            {translate("admin.tickets.buyer")}: {row.buyer.fullname ?? row.buyer.email}
            {row.hasOpenTransfer && ` · ${translate("admin.tickets.open_transfer")}`}
          </p>
        </div>
      ),
    },
    {
      id: "status",
      headerKey: "admin.tickets.column_status",
      className: "w-28",
      cell: (row) => (
        <Badge variant={ticketBadgeVariant(row.status)} size="xs">
          {translate(`admin.tickets.status_${row.status}`)}
        </Badge>
      ),
    },
    {
      id: "seats",
      headerKey: "admin.tickets.column_seats",
      className: "w-20",
      align: "right",
      cell: (row) => <span className="tabular-nums">{row.seatCount}</span>,
    },
    {
      id: "booking",
      headerKey: "admin.tickets.column_booking",
      className: "w-28",
      cell: (row) => (
        <div className="min-w-0">
          <Badge
            variant={
              row.booking.status === "paid"
                ? "success"
                : row.booking.status === "pending"
                  ? "gold"
                  : "neutral"
            }
            size="xs"
          >
            {translate(`admin.transactions.status_${row.booking.status}`)}
          </Badge>
          <p className="mt-1 tabular-nums text-[11px] text-(--color-text-muted)">
            {formatVND(row.booking.totalPrice, locale)}
          </p>
        </div>
      ),
    },
    {
      id: "issued",
      headerKey: "admin.tickets.column_issued",
      className: "w-32",
      cell: (row) => (
        <span className="text-[11px]">
          {new Date(row.issuedAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <>
      <TicketsFiltersCard
        filters={filters}
        total={pagination.total}
        isFiltered={isFiltered}
        onApply={(draft) =>
          startNavigation(() => router.push(buildHref({ ...filters, ...draft })))
        }
        onClear={() => startNavigation(() => router.push("/admin/tickets"))}
      />

      <div className={isNavigating ? "pointer-events-none opacity-60 transition-opacity" : ""}>
        <AdminTable
          columns={columns}
          rows={tickets}
          getRowId={(row) => row.id}
          emptyIcon={Ticket}
          emptyTitleKey={isFiltered ? "admin.common.no_results" : "admin.tickets.empty_title"}
          emptyDescriptionKey={
            isFiltered ? "admin.common.no_results_body" : "admin.tickets.empty_body"
          }
          captionKey="admin.tickets.title"
          renderExpanded={(row) => <TicketDetailPanel key={row.id} ticket={row} />}
        />

        <AdminPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          hrefFor={(page) => buildHref(filters, page)}
        />
      </div>
    </>
  );
}
