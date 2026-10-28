import { cache } from "react";
import { settleApiResponse } from "@/libs/api";
import type { ErrorResponse } from "@/libs/api";
import { getPaymentMethods } from "./api";
import type { PaymentMethodOption } from "./types";

/** The payment step's catalog behind one read. */
export interface PaymentCatalogData {
  methods: PaymentMethodOption[];
  /** True when the backend sells the `simulated` gateway (demo mode). */
  demo: boolean;
  error: ErrorResponse["error"] | null;
  /** A rejected session renders nothing — the route's gate owns the prompt. */
  isUnauthorized: boolean;
}

/**
 * Gateway catalog, read by three boundaries on the step (mobile picker, desktop
 * picker, the default-selection effect). `cache()` keeps them at one backend
 * call; the catalog itself is server-cached for a minute.
 */
export const getPaymentCatalog = cache(async (locale: "en" | "vn"): Promise<PaymentCatalogData> => {
  const result = await settleApiResponse(getPaymentMethods(locale));

  if ("error" in result) {
    return {
      methods: [],
      demo: false,
      error: result.error,
      isUnauthorized: result.error.status === 401,
    };
  }

  return {
    methods: result.data.methods,
    demo: result.data.demo,
    error: null,
    isUnauthorized: false,
  };
});
