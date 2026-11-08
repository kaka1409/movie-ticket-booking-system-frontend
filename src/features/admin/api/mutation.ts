import { apiMutation, toActionFailure } from "@/libs/api";
import type { AdminActionResult } from "../types";

type AdminEnvelope<TData> = { data?: TData } | TData | null;

/**
 * Single write path for the console. Kept out of the `api/` read modules (GET
 * only) and out of the `"use server"` files (which may export nothing but
 * actions), so all ~30 admin mutations share one error contract instead of
 * repeating the try/catch.
 *
 * The bearer token is the caller's RAM copy (`useAuth().token`); a 401 therefore
 * surfaces as a normal failure message rather than a silent refresh.
 */
export async function mutateAdmin<TData = null>(
  method: "POST" | "PATCH" | "DELETE" | "PUT",
  path: string,
  token: string,
  body?: unknown,
): Promise<AdminActionResult<TData>> {
  try {
    const payload = await apiMutation<AdminEnvelope<TData>>(
      path,
      {
        method,
        cache: "no-store",
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      },
      token,
    );

    const data =
      payload && typeof payload === "object" && "data" in payload
        ? ((payload as { data: TData }).data ?? null)
        : ((payload as TData | null) ?? null);

    return { success: true, data: data as TData };
  } catch (error) {
    return toActionFailure(error);
  }
}
