import AdminDataError from "@/app/(admin)/admin/components/shared/AdminDataError";
import { getAdminTransactions } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import type {
  AdminBookingStatus,
  AdminPaymentMethodCode,
  AdminPaymentStatus,
} from "@/features/admin/types";
import TransactionsManager from "./components/TransactionsManager";

const BOOKING_STATUSES: AdminBookingStatus[] = [
  "pending",
  "paid",
  "expired",
  "cancelled",
];
const PAYMENT_STATUSES: AdminPaymentStatus[] = [
  "pending",
  "success",
  "failed",
  "expired",
];
const PAYMENT_METHODS: AdminPaymentMethodCode[] = ["vnpay", "momo", "simulated"];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface AdminTransactionsQuery {
  search: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  dateFrom: string;
  dateTo: string;
  sort: string;
  dir: string;
  page: number;
}

export async function TransactionsManagerSection({
  search,
  status,
  paymentStatus,
  paymentMethod,
  dateFrom,
  dateTo,
  sort,
  dir,
  page,
}: AdminTransactionsQuery) {
  const validStatus = BOOKING_STATUSES.includes(status as AdminBookingStatus)
    ? (status as AdminBookingStatus)
    : "";
  const validPaymentStatus = PAYMENT_STATUSES.includes(
    paymentStatus as AdminPaymentStatus,
  )
    ? (paymentStatus as AdminPaymentStatus)
    : "";
  const validPaymentMethod = PAYMENT_METHODS.includes(
    paymentMethod as AdminPaymentMethodCode,
  )
    ? (paymentMethod as AdminPaymentMethodCode)
    : "";
  const validDateFrom = DATE_PATTERN.test(dateFrom) ? dateFrom : "";
  const validDateTo = DATE_PATTERN.test(dateTo) ? dateTo : "";

  const result = await getAdminTransactions({
    page,
    limit: 15,
    search,
    status: validStatus,
    paymentStatus: validPaymentStatus,
    paymentMethod: validPaymentMethod,
    dateFrom: validDateFrom,
    dateTo: validDateTo,
    sort,
    dir: dir === "asc" ? "asc" : "desc",
  });
  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;

  return (
    <TransactionsManager
      transactions={result.data.transactions}
      pagination={result.meta!}
      filters={{
        search,
        status: validStatus,
        paymentStatus: validPaymentStatus,
        paymentMethod: validPaymentMethod,
        dateFrom: validDateFrom,
        dateTo: validDateTo,
      }}
      sort={sort}
      dir={dir}
    />
  );
}
