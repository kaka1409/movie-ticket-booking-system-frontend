import { apiFetch, apiMutation, withLang, type ApiResponse, type ErrorResponse } from "@/libs/api";
import type {
  ComboItem,
  FoodItem,
  FoodCategory,
  PaymentCatalog,
  PaymentIntent,
  PaymentMethodOption,
  SeatMapResponse,
  CurrentSeatHoldResponse,
  SeatHoldResponse,
  BookingDetail,
} from "./types";

/* ─── Booking catalogs (LIVE) ──────────────────────────────── */

/**
 * LIVE - `GET /seats?showtimeId=` (contract §4.1) — uncached, holds change every second.
 * Also kept uncached: `/showtimes` slot lists (`features/showtimes/api.ts`) so the
 * booking flow always reads fresh availability; movie detail pages cache them at
 * the page level (ISR) instead.
 */
export function getSeatMap(showtimeId: string): Promise<ApiResponse<SeatMapResponse>> {
  return apiFetch<SeatMapResponse>(`/seats?showtimeId=${encodeURIComponent(showtimeId)}`);
}

/** Wire shape allows nulls that the FE cards render as non-null strings. */
interface WireCombo extends Omit<ComboItem, "description" | "image" | "tag"> {
  description: string | null;
  image: string | null;
  tag: string | null;
}

interface WireFoodItem extends Omit<FoodItem, "image"> {
  image: string | null;
}

/** Static-ish catalogs (prices/names change rarely) — served for 60s. */
const CATALOG_CACHE = { next: { revalidate: 60 } } as const;

/** LIVE - `GET /combos` (contract §4.2). */
export async function getCombos(locale: "en" | "vn" = "en"): Promise<ApiResponse<ComboItem[]>> {
  const result = await apiFetch<WireCombo[]>(withLang("/combos", locale), CATALOG_CACHE);
  if ("error" in result) return result;

  return {
    data: result.data.map(({ description, image, tag, ...rest }) => ({
      ...rest,
      description: description ?? "",
      image: image ?? "",
      ...(tag ? { tag } : {}),
    })),
  };
}

/** LIVE - `GET /food-items` (contract §4.3). */
export async function getFoodItems(locale: "en" | "vn" = "en"): Promise<ApiResponse<FoodItem[]>> {
  const result = await apiFetch<WireFoodItem[]>(withLang("/food-items", locale), CATALOG_CACHE);
  if ("error" in result) return result;

  return {
    data: result.data.map(({ image, ...rest }) => ({ ...rest, image: image ?? "" })),
  };
}

/** LIVE - `GET /food-categories` (contract §4.4). */
export function getFoodCategories(
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<{ id: FoodCategory; label: string }[]>> {
  return apiFetch<{ id: FoodCategory; label: string }[]>(
    withLang("/food-categories", locale),
    CATALOG_CACHE,
  );
}

/**
 * LIVE - `GET /payment-methods` (contract §4.5). The server catalog is the only
 * source: every row is kept (a disabled one is "coming soon", still displayed),
 * and the demo flag is lifted out of the envelope `meta` so the QR page can gate
 * its controls.
 */
export async function getPaymentMethods(
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<PaymentCatalog>> {
  const result = await apiFetch<PaymentMethodOption[]>(
    withLang("/payment-methods", locale),
    CATALOG_CACHE,
  );
  if ("error" in result) return result;

  return { data: { methods: result.data, demo: result.meta?.demo === true } };
}

/**
 * LIVE - `GET /bookings/:id` (contract §4.11) — read-auth: the server passes
 * the incoming cookies (refresh token), the client would pass a Bearer token.
 */
export function getBookingById(
  bookingId: string,
  cookie?: string,
  token?: string,
): Promise<ApiResponse<BookingDetail>> {
  return apiFetch<BookingDetail>(
    `/bookings/${encodeURIComponent(bookingId)}`,
    undefined,
    token,
    cookie,
  );
}

/* ─── Payment intent (LIVE, client-interactive) ────────────── */

/**
 * LIVE - `GET /payments/:bookingId/intent` (contract §4.13) — the QR page polls
 * this with the RAM Bearer token, because the route is JWT-only (the refresh
 * cookie is not accepted). Answers the live attempt, else the newest one; a
 * `404` means the booking has no payment row at all.
 */
export function getPaymentIntent(
  bookingId: string,
  token: string,
): Promise<ApiResponse<PaymentIntent>> {
  return apiFetch<PaymentIntent>(
    `/payments/${encodeURIComponent(bookingId)}/intent`,
    undefined,
    token,
  );
}

/**
 * LIVE - `GET /payments/transfers/:transferId/intent` (contract §4.17) — the
 * recipient's attempt, read with the RAM Bearer token. `404` means no charge was
 * ever opened for this deal, which is where the method picker starts.
 */
export function getTransferPaymentIntent(
  transferId: string,
  token: string,
): Promise<ApiResponse<PaymentIntent>> {
  return apiFetch<PaymentIntent>(
    `/payments/transfers/${encodeURIComponent(transferId)}/intent`,
    undefined,
    token,
  );
}

/* ─── Seat holds (LIVE, client-interactive) ────────────────── */

/**
 * The three hold endpoints are interactive calls from the seats page: the
 * access token lives in RAM only, so the Bearer header is attached here in the
 * browser and the token never reaches the Next.js server (unlike the
 * `action.ts` server actions). They never reject either — failures come back
 * as the `{ error }` arm of the union, same as `apiFetch`.
 */

/** LIVE - `GET /seat-holds?showtimeId=` (contract §4.7) — hard-refresh restore. */
export function getSeatHolds(
  showtimeId: string,
  token: string,
): Promise<ApiResponse<CurrentSeatHoldResponse>> {
  return apiFetch<CurrentSeatHoldResponse>(
    `/seat-holds?showtimeId=${encodeURIComponent(showtimeId)}`,
    undefined,
    token,
  );
}

/** Convert an `apiMutation` throw into the `{ error }` union arm. */
function toErrorUnion(error: unknown): ErrorResponse {
  const failure = error as Error & { status?: number; code?: string };
  return {
    error: {
      status: failure.status ?? 0,
      code: failure.code ?? "UNKNOWN_ERROR",
      message: failure.message,
    },
  };
}

/** LIVE - `PUT /seat-holds` (contract §4.6) — set-replacement created at the seats-step CTA, TTL 600s. */
export async function saveSeatHolds(
  showtimeId: string,
  seatIds: string[],
  token: string,
): Promise<ApiResponse<SeatHoldResponse>> {
  try {
    return await apiMutation<ApiResponse<SeatHoldResponse>>(
      "/seat-holds",
      { method: "PUT", body: JSON.stringify({ showtimeId, seatIds }) },
      token,
    );
  } catch (error) {
    return toErrorUnion(error);
  }
}

/** LIVE - `DELETE /seat-holds?showtimeId=` (contract §4.8) — release on back-out. */
export async function releaseSeatHolds(
  showtimeId: string,
  token: string,
): Promise<ApiResponse<{ released: boolean }>> {
  try {
    return await apiMutation<ApiResponse<{ released: boolean }>>(
      `/seat-holds?showtimeId=${encodeURIComponent(showtimeId)}`,
      { method: "DELETE" },
      token,
    );
  } catch (error) {
    return toErrorUnion(error);
  }
}
