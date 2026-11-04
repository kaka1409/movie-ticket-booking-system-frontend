import { CountdownProvider } from "@/features/booking/contexts/CountdownContext";
import SessionExpiryWatcher from "@/app/(sub)/booking/components/shared/SessionExpiryWatcher";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <CountdownProvider>
      <SessionExpiryWatcher />
      {children}
    </CountdownProvider>
  );
}
