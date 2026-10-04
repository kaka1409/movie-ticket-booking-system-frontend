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

export function getSubTitle(pathname: string, translate?: (key: string) => string): string {
  const t = translate ?? ((k: string) => k);

  switch (true) {
    case pathname.startsWith("/notifications"):
      return t("notif.title");
    case pathname.startsWith("/profile/reviews"):
      return t("profile.review_rating");
    case pathname.startsWith("/profile/wishlist"):
      return t("profile.wishlist_label");
    case pathname.startsWith("/profile/edit"):
      return t("profile.edit_profile");
    case pathname.startsWith("/profile/password"):
      return t("profile.change_password");
    case pathname.includes("/modify/review"):
      return t("tickets.modify.review.title");
    case pathname.includes("/modify/payment"):
      return t("tickets.modify.payment.title");
    case pathname.includes("/modify/success"):
      return t("tickets.modify.success.title");
    case pathname.includes("/modify/showtime"):
      return t("tickets.modify.showtime.title");
    case pathname.includes("/modify/seats"):
      return t("tickets.modify.seats.title");
    case pathname.includes("/cancel"):
      return t("tickets.cancel.title");
    case pathname.includes("/modify"):
      return t("tickets.modify.title");
    case pathname.includes("/transfer/confirm"):
      return t("tickets.transfer.confirm_title");
    case pathname.includes("/transfer"):
      return t("tickets.transfer.title");
    case pathname.startsWith("/tickets"):
      return t("tickets.detail_title");
    case pathname.startsWith("/booking/"): {
      switch (true) {
        case pathname.includes("/cinema"):
          return t("booking.cinema.title");
        case pathname.includes("/seats"):
          return t("booking.seats.title");
        case pathname.includes("/snack"):
          return t("booking.snack.title");
        case pathname.includes("/credentials"):
          return t("booking.credentials.title");
        case pathname.includes("/payment"):
          return t("booking.payment.title");
        case pathname.includes("/status/success"):
          return t("booking.status.success.title");
        case pathname.includes("/status/failed"):
          return t("booking.status.failed.title");
        default:
          return "";
      }
    }
    default:
      return "";
  }
}
