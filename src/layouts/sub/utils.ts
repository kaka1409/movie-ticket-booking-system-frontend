export function getSubTitle(
  pathname: string,
  translate?: (key: string) => string,
): string {
  const t = translate ?? ((k: string) => k);
  if (pathname.startsWith("/notifications")) return t("notif.title");
  if (pathname.startsWith("/profile/reviews")) return t("profile.review_rating");
  if (pathname.startsWith("/profile/wishlist")) return t("profile.wishlist_label");
  if (pathname.startsWith("/profile/edit")) return t("profile.edit_profile");
  if (pathname.startsWith("/profile/password")) return t("profile.change_password");
  if (pathname.startsWith("/tickets")) return t("tickets.detail_title");
  if (pathname.startsWith("/booking/")) {
    if (pathname.includes("/cinema")) return t("booking.cinema.title");
    if (pathname.includes("/seats")) return t("booking.seats.title");
    if (pathname.includes("/snack")) return t("booking.snack.title");
    if (pathname.includes("/credentials")) return t("booking.credentials.title");
    if (pathname.includes("/payment")) return t("booking.payment.title");
    if (pathname.includes("/status/success")) return t("booking.status.success.title");
    if (pathname.includes("/status/failed")) return t("booking.status.failed.title");
    return "";
  }
  return "";
}


