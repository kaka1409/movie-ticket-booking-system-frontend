import type { Notification } from "./types";

export const INITIAL_NOTIFS: Notification[] = [
  {
    id: 1,
    type: "success",
    title: "Booking Confirmed!",
    message: (
      <>
        Your premium tickets for <strong>Dune: Part Two</strong> are ready.
        View your seating details.
      </>
    ),
    time: "2 MINS AGO",
    action: { label: "View Detail", href: "/tickets" },
    read: false,
  },
  {
    id: 2,
    type: "error",
    title: "Payment Failed",
    message:
      "Your payment for Oppenheimer could not be processed. Please update your payment method.",
    time: "3 HOURS AGO",
    action: { label: "View Detail", href: "/tickets" },
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Movie Reminder",
    message: (
      <strong>
        The Batman: Echoes starts in 2 hours. Don't forget to order your snacks
        ahead of time!
      </strong>
    ),
    time: "1 HOUR AGO",
    read: false,
  },
  {
    id: 4,
    type: "info",
    title: "Welcome to PrimeSeat",
    message:
      "Experience cinematic excellence. Explore new releases and book your premium seats today.",
    time: "OCT 12",
    read: true,
  },
];
