"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Receipt } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";
import AdminPagination from "@/app/(admin)/admin/components/shared/AdminPagination";
import AdminTable, {
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import { formatVND } from "@/libs/utils";
import type {
  AdminPaginationMeta,
  AdminTransaction,
} from "@/features/admin/types";
import TransactionsFiltersCard, {
  type TransactionFilterDraft,
} from "./TransactionsFiltersCard";
import TransactionDetailPanel from "./TransactionDetailPanel";
import AdminAvatar from "../../components/shared/AdminAvatar";
import AdminPoster from "../../components/shared/AdminPoster";

interface TransactionsManagerProps {
  transactions: AdminTransaction[];
  pagination: AdminPaginationMeta;
  filters: TransactionFilterDraft;
  /** Committed header sort — `sort` is the wire field, `dir` its direction. */
  sort: string;
  dir: string;
}

function bookingBadgeVariant(status: string) {
  if (status === "paid") return "success" as const;
  if (status === "pending") return "gold" as const;
  if (status === "cancelled" || status === "expired") return "error" as const;
  return "neutral" as const;
}

function paymentBadgeVariant(status: string | null | undefined) {
  if (status === "success") return "success" as const;
  if (status === "pending") return "gold" as const;
  if (status === "failed" || status === "expired") return "error" as const;
  return "neutral" as const;
}

/**
 * Transaction table plus its expandable-row detail. Backend-paginated like the
 * users list: filters and page live in the URL, one navigation per Apply.
 */
export default function TransactionsManager({
  transactions,
  pagination,
  filters,
  sort,
  dir,
}: TransactionsManagerProps) {
  const { translate, locale } = useLocale();
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();

  const buildHref = (
    draft: TransactionFilterDraft,
    page = 1,
    sortState: { sort: string; dir: string } | null = sort ? { sort, dir } : null,
  ) => {
    const params = new URLSearchParams();
    if (draft.search !== "") params.set("search", draft.search);
    if (draft.status !== "") params.set("status", draft.status);
    if (draft.paymentStatus !== "") params.set("paymentStatus", draft.paymentStatus);
    if (draft.paymentMethod !== "") params.set("paymentMethod", draft.paymentMethod);
    if (draft.dateFrom !== "") params.set("dateFrom", draft.dateFrom);
    if (draft.dateTo !== "") params.set("dateTo", draft.dateTo);
    if (sortState?.sort) {
      params.set("sort", sortState.sort);
      params.set("dir", sortState.dir === "asc" ? "asc" : "desc");
    }
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query === "" ? "/admin/transactions" : `/admin/transactions?${query}`;
  };

  /** First click on a column sorts ascending; clicking it again flips. */
  const handleSort = (key: string) => {
    const currentDir = dir === "asc" ? "asc" : "desc";
    const nextDir = sort === key ? (currentDir === "asc" ? "desc" : "asc") : "asc";
    startNavigation(() =>
      router.push(buildHref(filters, 1, { sort: key, dir: nextDir })),
    );
  };

  const isFiltered = Object.values(filters).some((value) => value !== "");

  const columns: AdminTableColumn<AdminTransaction>[] = [
    {
      id: "transaction",
      headerKey: "admin.transactions.column_transaction",
      sortKey: "showtimeDate",
      cell: (row) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <AdminPoster
            src={row.movie.posterUrl}
            alt={row.movie.title}
            className="h-10 aspect-[3/2]"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-(--color-text-primary)">
              {row.movie.title}
            </p>
            <p className="truncate text-[11px] text-(--color-text-muted)">
              {row.showtime.date} · {row.showtime.startTime} · {row.showtime.cinemaName}
            </p>
            <p className="flex items-center gap-1.5 truncate text-[11px] text-(--color-text-muted)">
              <AdminAvatar
                name={row.customer.fullname ?? row.customer.email}
                avatarUrl={row.customer.avatarUrl}
                size={16}
              />
              {row.customer.fullname ?? row.customer.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "booking_status",
      headerKey: "admin.transactions.column_booking_status",
      sortKey: "status",
      className: "w-28",
      cell: (row) => (
        <Badge variant={bookingBadgeVariant(row.status)} size="xs">
          {translate(`admin.transactions.status_${row.status}`)}
        </Badge>
      ),
    },
    {
      id: "payment",
      headerKey: "admin.transactions.column_payment",
      className: "w-32",
      cell: (row) =>
        row.payment ? (
          <Badge variant={paymentBadgeVariant(row.payment.status)} size="xs">
            {translate(`admin.transactions.pay_${row.payment.status}`)}
          </Badge>
        ) : (
          <span className="text-[11px] text-(--color-text-muted)">—</span>
        ),
    },
    {
      id: "payment_method",
      headerKey: "admin.transactions.column_payment_method",
      className: "w-28",
      cell: (row) =>
        row.payment ? (
          <span className="text-[11px]">
            {translate(`admin.transactions.method_${row.payment.method}`)}
          </span>
        ) : (
          <span className="text-[11px] text-(--color-text-muted)">—</span>
        ),
    },
    {
      id: "ticket",
      headerKey: "admin.transactions.column_ticket",
      className: "w-28",
      cell: (row) =>
        row.ticket ? (
          <Badge
            variant={
              row.ticket.status === "used"
                ? "success"
                : row.ticket.status === "active"
                  ? "gold"
                  : "neutral"
            }
            size="xs"
          >
            {translate(`admin.tickets.status_${row.ticket.status}`)}
          </Badge>
        ) : (
          <span className="text-[11px] text-(--color-text-muted)">—</span>
        ),
    },
    {
      id: "seats",
      headerKey: "admin.transactions.column_seats",
      className: "w-20",
      align: "right",
      cell: (row) => <span className="tabular-nums">{row.seatCount}</span>,
    },
    {
      id: "total",
      headerKey: "admin.transactions.column_total",
      sortKey: "totalPrice",
      className: "w-28",
      align: "right",
      cell: (row) => (
        <span className="tabular-nums font-semibold">
          {formatVND(row.totalPrice, locale)}
        </span>
      ),
    },
    {
      id: "created",
      headerKey: "admin.transactions.column_created",
      sortKey: "createdAt",
      className: "w-32",
      cell: (row) => (
        <span className="text-[11px]">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <>
      <TransactionsFiltersCard
        filters={filters}
        total={pagination.total}
        isFiltered={isFiltered}
        onApply={(draft) =>
          startNavigation(() => router.push(buildHref({ ...filters, ...draft })))
        }
        onClear={() => startNavigation(() => router.push("/admin/transactions"))}
      />

      <div className={isNavigating ? "pointer-events-none opacity-60 transition-opacity" : ""}>
        <AdminTable
          columns={columns}
          rows={transactions}
          getRowId={(row) => row.id}
          emptyIcon={Receipt}
          emptyTitleKey={isFiltered ? "admin.common.no_results" : "admin.transactions.empty_title"}
          emptyDescriptionKey={
            isFiltered ? "admin.common.no_results_body" : "admin.transactions.empty_body"
          }
          captionKey="admin.transactions.title"
          sort={sort ? { key: sort, direction: dir === "asc" ? "asc" : "desc" } : null}
          onSort={handleSort}
          renderExpanded={(row) => <TransactionDetailPanel key={row.id} transactionId={row.id} />}
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
