import { BOOKING_SESSION_SECONDS } from "@/features/booking/constants";
import { BookingProvider } from "@/features/booking/context";
import { CountdownProvider } from "@/features/booking/countdown";
import SessionExpiryWatcher from "@/features/booking/components/SessionExpiryWatcher";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider initialCountdownSeconds={BOOKING_SESSION_SECONDS}>
      <CountdownProvider>
        <SessionExpiryWatcher />
        {children}
      </CountdownProvider>
    </BookingProvider>
  );
}
