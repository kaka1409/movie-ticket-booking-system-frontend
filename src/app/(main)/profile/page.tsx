import { Suspense } from "react";
import type { Metadata } from "next";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoginPrompt from "@/components/shared/LoginPrompt";
import { getRequestCookie, getRequestLocale, hasSession } from "@/libs/session";
import Avatar from "./components/mobile/Avatar";
import UserInfo from "./components/mobile/UserInfo";
import ProfileMenu from "./components/mobile/ProfileMenu";
import DesktopProfileContent from "./components/desktop/ProfileContent";
import AccountStats from "./components/desktop/AccountStats";
import {
  AccountStatValueSkeleton,
  NextScreeningSkeleton,
} from "./components/desktop/ProfileSkeletons";
import {
  NextScreeningSection,
  ReviewCountSection,
  TicketCountSection,
  WishlistCountSection,
} from "./sections";

export const metadata: Metadata = {
  title: "My Profile",
  robots: { index: false },
};

/**
 * The mobile overview reads nothing but the session, so it paints as soon as the
 * cookies are in; the three counters and next-screening widget stream into
 * their own boxes. A dead session is caught by `ProtectedRoute`.
 */
export default async function ProfilePage() {
  if (!(await hasSession())) return <LoginPrompt />;

  const requestCookie = await getRequestCookie();
  const locale = await getRequestLocale();
  const sectionProps = { cookie: requestCookie, locale };

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
              stats={
                <AccountStats
                  stats={{
                    tickets: (
                      <Suspense fallback={<AccountStatValueSkeleton />}>
                        <TicketCountSection {...sectionProps} />
                      </Suspense>
                    ),
                    reviews: (
                      <Suspense fallback={<AccountStatValueSkeleton />}>
                        <ReviewCountSection {...sectionProps} />
                      </Suspense>
                    ),
                    wishlist: (
                      <Suspense fallback={<AccountStatValueSkeleton />}>
                        <WishlistCountSection {...sectionProps} />
                      </Suspense>
                    ),
                  }}
                />
              }
              nextTicket={
                <Suspense fallback={<NextScreeningSkeleton />}>
                  <NextScreeningSection {...sectionProps} />
                </Suspense>
              }
            />
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}
