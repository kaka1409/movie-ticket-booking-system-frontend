import { getCountdownSeconds } from "@/features/booking/api";
import { BookingProvider } from "@/features/booking/context";

export default async function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const countdownSeconds = await getCountdownSeconds();

  return (
    <BookingProvider initialCountdownSeconds={countdownSeconds}>
      {children}
    </BookingProvider>
  );
}
