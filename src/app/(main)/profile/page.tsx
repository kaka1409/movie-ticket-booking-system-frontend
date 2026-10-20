import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { hasSession, isUnauthorizedResult } from "@/libs/session";
import { getRequestCookie, getRequestLocale } from "@/libs/session";
import Avatar from "./components/mobile/Avatar";
import UserInfo from "./components/mobile/UserInfo";
import ProfileMenu from "./components/mobile/ProfileMenu";
import DesktopProfileContent from "./components/desktop/ProfileContent";
import { getMyReviews } from "@/features/reviews/api";
import { getWishlist } from "@/features/wishlist/api";
import { getUpcomingTickets } from "@/features/tickets/api";
import type { TicketPageMeta } from "@/features/tickets/adapters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  robots: { index: false },
};

const DEFAULT_TICKET_META: TicketPageMeta = {
  total: 0,
  totalPages: 1,
  page: 1,
  limit: 12,
  hasNextPage: false,
};

export default async function ProfilePage() {
  if (!(await hasSession())) return <LoginPrompt />;

  const requestCookie = await getRequestCookie();
  const locale = await getRequestLocale();

  const [reviewsSettled, wishlistSettled, ticketsSettled] = await Promise.allSettled([
    getMyReviews({ skip: 0, limit: 1 }, requestCookie, locale),
    getWishlist(requestCookie, locale),
    getUpcomingTickets(1, requestCookie, locale),
  ]);

  if (
    (reviewsSettled.status === "fulfilled" && isUnauthorizedResult(reviewsSettled.value)) ||
    (wishlistSettled.status === "fulfilled" && isUnauthorizedResult(wishlistSettled.value)) ||
    (ticketsSettled.status === "fulfilled" && isUnauthorizedResult(ticketsSettled.value))
  ) {
    return <LoginPrompt />;
  }

  const reviewTotal =
    reviewsSettled.status === "fulfilled" && !("error" in reviewsSettled.value)
      ? reviewsSettled.value.data.total
      : null;
  const wishlistTotal =
    wishlistSettled.status === "fulfilled" && !("error" in wishlistSettled.value)
      ? wishlistSettled.value.data.length
      : null;
  const ticketTotal =
    ticketsSettled.status === "fulfilled" &&
    !("error" in ticketsSettled.value) &&
    ticketsSettled.value.meta
      ? ticketsSettled.value.meta.total
      : ticketsSettled.status === "fulfilled" && !("error" in ticketsSettled.value)
        ? DEFAULT_TICKET_META.total
        : null;

  return (
    <ProtectedRoute>
      <>
        {/* Mobile */}
        <div className="block md:hidden">
          <div className="flex flex-col items-center pt-10 pb-8">
            <Avatar />
            <UserInfo />
            <ProfileMenu />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
            <DesktopProfileContent
              stats={{
                reviews: reviewTotal,
                wishlist: wishlistTotal,
                tickets: ticketTotal,
              }}
            />
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}
