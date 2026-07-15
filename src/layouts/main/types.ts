import { Home, Clapperboard, Ticket, User } from "lucide-react";

export const NAV_ITEMS = [
  { key: "nav.home", href: "/", icon: Home },
  { key: "nav.movies", href: "/movies", icon: Clapperboard },
  { key: "nav.tickets", href: "/tickets", icon: Ticket },
  { key: "nav.profile", href: "/profile", icon: User },
] as const;

export const ICON_SIZE = 18;
