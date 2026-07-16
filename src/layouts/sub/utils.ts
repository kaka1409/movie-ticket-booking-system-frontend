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


