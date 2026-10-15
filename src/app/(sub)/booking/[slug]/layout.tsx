import { getCountdownSeconds } from "@/features/booking/api";
import { BookingProvider } from "@/features/booking/context";
import SessionExpiryWatcher from "@/features/booking/components/SessionExpiryWatcher";

export default async function BookingLayout({ children }: { children: React.ReactNode }) {
  const countdownSeconds = await getCountdownSeconds();

  return (
    <BookingProvider initialCountdownSeconds={countdownSeconds}>
      <SessionExpiryWatcher />
      {children}
    </BookingProvider>
  );
}
