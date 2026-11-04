"use client";

import { useDevice } from "@/hooks/useDevice";
import { usePathname } from "next/navigation";
import { BookingProvider } from "@/features/booking/contexts/BookingContext";
import { BOOKING_SESSION_SECONDS } from "@/features/booking/constants";
import MobileSubLayout from "./mobile/SubLayout";
import DesktopSubLayout from "./desktop/SubLayout";

export default function SubLayout({ children }: { children: React.ReactNode }) {
  const device = useDevice();
  const pathname = usePathname();
  const bookingSlug = pathname.startsWith("/booking/") ? pathname.split("/")[2] : null;
  const layout =
    device === "mobile" ? (
      <MobileSubLayout>{children}</MobileSubLayout>
    ) : (
      <DesktopSubLayout>{children}</DesktopSubLayout>
    );

  if (!bookingSlug) return layout;

  return (
    <BookingProvider key={bookingSlug} initialCountdownSeconds={BOOKING_SESSION_SECONDS}>
      {layout}
    </BookingProvider>
  );
}
