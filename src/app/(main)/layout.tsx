import type { Metadata } from "next";
import LayoutProvider from "@/components/layout/LayoutProvider";

export const metadata: Metadata = {
  title: "PrimeSeat — Cinema Ticket Booking",
  description: "Book cinema tickets instantly with PrimeSeat. Now Showing, Coming Soon, Quick Booking.",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutProvider>{children}</LayoutProvider>;
}
