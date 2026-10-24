/**
 * Back-button target for the sub layout. Every route maps to a deterministic
 * in-app parent so the back button always works, even on a first entry with no
 * browser history (deep link / new tab). The only exception is the terminal
 * booking status pages, which return `null` — the mobile header hides its back
 * button there (both have a "Back to Home" CTA). Unrecognised routes fall back
 * to the home page.
 */
export function getBackHref(pathname: string): string | null {
  if (pathname.includes("/status/success") || pathname.includes("/status/failed")) {
    return null;
  }
  if (pathname.startsWith("/booking/")) {
    const slug = pathname.split("/")[2] ?? "";
    if (pathname.endsWith("/cinema")) return `/movies/${slug}`;
    if (pathname.endsWith("/seats")) return `/booking/${slug}/cinema`;
    if (pathname.endsWith("/snack")) return `/booking/${slug}/seats`;
    if (pathname.endsWith("/credentials")) return `/booking/${slug}/snack`;
    if (pathname.endsWith("/payment")) return `/booking/${slug}/credentials`;
    return `/movies/${slug}`;
  }
  if (pathname.startsWith("/notifications")) {
    return "/";
  }
  if (pathname.startsWith("/profile/")) {
    return "/profile";
  }
  if (pathname.endsWith("/transfer/payment")) {
    return pathname.slice(0, -"/transfer/payment".length);
  }
  if (pathname.endsWith("/transfer/confirm")) {
    return pathname.slice(0, -"/confirm".length);
  }
  if (pathname.endsWith("/transfer")) {
    return pathname.slice(0, -"/transfer".length);
  }
  if (pathname.endsWith("/modify/review")) {
    return pathname.slice(0, -"/review".length);
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
  return "/";
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
    case pathname.includes("/transfer/payment"):
      return resolve("tickets.transfer.payment.title");
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
