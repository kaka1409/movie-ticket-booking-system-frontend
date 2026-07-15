export function getSubTitle(
  pathname: string,
  translate?: (key: string) => string,
): string {
  if (pathname.startsWith("/notifications")) {
    return translate ? translate("notif.title") : "Notifications";
  }
  if (pathname.startsWith("/tickets")) return "Ticket Details";
  if (pathname.startsWith("/profile/reviews")) return "Review & Rating";
  if (pathname.startsWith("/profile/wishlist")) return "Wishlist";
  if (pathname.startsWith("/profile/edit")) return "Edit Profile";
  if (pathname.startsWith("/profile/password")) return "Change Password";
  if (pathname.startsWith("/booking/")) {
    if (pathname.includes("/cinema")) return "Cinema & Showtime";
    if (pathname.includes("/seats")) return "Select Seat";
    if (pathname.includes("/snack")) return "Food & Drinks";
    if (pathname.includes("/credentials")) return "Contact Information";
    if (pathname.includes("/payment")) return "Payment";
    if (pathname.includes("/status/success")) return "Payment Success";
    if (pathname.includes("/status/failed")) return "Payment Failed";
    return "";
  }
  return "";
}

export function getBackHref(pathname: string): string {
  if (pathname.startsWith("/tickets")) return "/tickets";
  if (pathname.startsWith("/profile")) return "/profile";
  if (pathname.startsWith("/booking/")) {
    const slug = pathname.split("/booking/")[1]?.split("/")[0];
    if (pathname.includes("/cinema")) return `/movies/${slug}`;
    if (pathname.includes("/seats")) return `/booking/${slug}/cinema`;
    if (pathname.includes("/snack")) return `/booking/${slug}/seats`;
    if (pathname.includes("/credentials")) return `/booking/${slug}/snack`;
    if (pathname.includes("/payment")) return `/booking/${slug}/credentials`;
    if (pathname.includes("/status/success")) return "/";
    if (pathname.includes("/status/failed")) {
      const failSlug = pathname.split("/booking/")[1]?.split("/")[0];
      return `/booking/${failSlug}/payment`;
    }
    return `/movies/${slug}`;
  }
  return "/";
}
