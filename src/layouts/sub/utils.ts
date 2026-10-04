/**
 * Back-button target for the sub layout: nested detail/confirm/review routes
 * walk one level up, plain ticket detail goes to the list, and `null` means
 * "use `router.back()`" (no known parent inside the app).
 */
export function getBackHref(pathname: string): string | null {
  if (pathname.endsWith("/transfer/confirm")) {
    return pathname.slice(0, -"/confirm".length);
  }
  if (pathname.endsWith("/transfer")) {
    return pathname.slice(0, -"/transfer".length);
  }
  if (pathname.endsWith("/modify/review")) {
    return pathname.slice(0, -"/review".length);
  }
  if (pathname.endsWith("/modify/payment")) {
    return pathname.slice(0, -"/payment".length);
  }
  if (pathname.endsWith("/modify/success")) {
    return pathname.slice(0, -"/success".length);
  }
  if (pathname.endsWith("/modify/showtime")) {
    return pathname.slice(0, -"/showtime".length);
  }
  if (pathname.endsWith("/modify/seats")) {
    return pathname.slice(0, -"/seats".length);
  }
  if (pathname.endsWith("/cancel")) {
    return pathname.slice(0, -"/cancel".length);
  }
  if (/^\/tickets\/[^/]+\/modify$/.test(pathname)) {
    return pathname.slice(0, -"/modify".length);
  }
  if (/^\/tickets\/[^/]+$/.test(pathname)) {
    return "/tickets";
  }
  return null;
}

/**
 * Sub-layout header title for a route. The first matching prefix wins;
 * `translate` is optional so the helper also works without a locale provider
 * (falls back to echoing the i18n key).
 */
export function getSubTitle(pathname: string, translate?: (key: string) => string): string {
  const resolve = translate ?? ((key: string) => key);

  switch (true) {
    case pathname.startsWith("/notifications"):
      return resolve("notif.title");
    case pathname.startsWith("/profile/reviews"):
      return resolve("profile.review_rating");
    case pathname.startsWith("/profile/wishlist"):
      return resolve("profile.wishlist_label");
    case pathname.startsWith("/profile/edit"):
      return resolve("profile.edit_profile");
    case pathname.startsWith("/profile/password"):
      return resolve("profile.change_password");
    case pathname.includes("/modify/review"):
      return resolve("tickets.modify.review.title");
    case pathname.includes("/modify/payment"):
      return resolve("tickets.modify.payment.title");
    case pathname.includes("/modify/success"):
      return resolve("tickets.modify.success.title");
    case pathname.includes("/modify/showtime"):
      return resolve("tickets.modify.showtime.title");
    case pathname.includes("/modify/seats"):
      return resolve("tickets.modify.seats.title");
    case pathname.includes("/cancel"):
      return resolve("tickets.cancel.title");
    case pathname.includes("/modify"):
      return resolve("tickets.modify.title");
    case pathname.includes("/transfer/confirm"):
      return resolve("tickets.transfer.confirm_title");
    case pathname.includes("/transfer"):
      return resolve("tickets.transfer.title");
    case pathname.startsWith("/tickets"):
      return resolve("tickets.detail_title");
    case pathname.startsWith("/booking/"): {
      switch (true) {
        case pathname.includes("/cinema"):
          return resolve("booking.cinema.title");
        case pathname.includes("/seats"):
          return resolve("booking.seats.title");
        case pathname.includes("/snack"):
          return resolve("booking.snack.title");
        case pathname.includes("/credentials"):
          return resolve("booking.credentials.title");
        case pathname.includes("/payment"):
          return resolve("booking.payment.title");
        case pathname.includes("/status/success"):
          return resolve("booking.status.success.title");
        case pathname.includes("/status/failed"):
          return resolve("booking.status.failed.title");
        default:
          return "";
      }
    }
    default:
      return "";
  }
}
