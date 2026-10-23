import type { PaymentMethodOption } from "./types";

/**
 * Brand art for the methods we ship logos for. This is presentation only: a
 * method the backend adds later renders without an image (icon tile), never as
 * a broken card — the catalog owns ids, labels and order.
 */
const PAYMENT_BRAND_IMAGES: Record<string, string> = {
  vnpay: "/images/VNPay.png",
  momo: "/images/momo.png",
};

/** Brand logo for a catalog id, or null when the app has no asset for it. */
export function getPaymentBrandImage(methodId: string): string | null {
  return PAYMENT_BRAND_IMAGES[methodId] ?? null;
}

/**
 * Localized display label from the catalog. A method the current catalog does
 * not list still renders its id readably instead of an empty string.
 */
export function getPaymentLabel(methods: PaymentMethodOption[], methodId: string): string {
  const match = methods.find((method) => method.id === methodId);
  if (match) return match.name;

  return methodId.replace(/[_-]+/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}
