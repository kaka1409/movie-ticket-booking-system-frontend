import { BOOKING_SESSION_SECONDS } from "@/features/booking/constants";
import { BookingProvider } from "@/features/booking/contexts/BookingContext";
import { CountdownProvider } from "@/features/booking/contexts/CountdownContext";
import SessionExpiryWatcher from "@/app/(sub)/booking/components/shared/SessionExpiryWatcher";

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
