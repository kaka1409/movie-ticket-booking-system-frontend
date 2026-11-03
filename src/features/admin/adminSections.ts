import {
  Building2,
  CalendarClock,
  Clapperboard,
  Sparkles,
  CreditCard,
  LayoutDashboard,
  MessagesSquare,
  Package,
  Popcorn,
  ScanLine,
  Settings,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  /** i18n key under `admin.nav`. */
  labelKey: string;
  href: string;
  Icon: LucideIcon;
}

export interface AdminNavGroup {
  /** i18n key under `admin.nav`. */
  labelKey: string;
  items: AdminNavItem[];
}

/**
 * Sidebar source of truth. Every entry maps to a mounted route — the console
 * links nothing the backend cannot answer (bookings and refunds are deferred
 * until they have an admin read surface).
 */
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    labelKey: "admin.nav.overview",
    items: [{ labelKey: "admin.nav.dashboard", href: "/admin", Icon: LayoutDashboard }],
  },
  {
    labelKey: "admin.nav.cinema",
    items: [
      { labelKey: "admin.nav.movies", href: "/admin/movies", Icon: Clapperboard },
      { labelKey: "admin.nav.movie_research", href: "/admin/movie-research", Icon: Sparkles },
      { labelKey: "admin.nav.showtimes", href: "/admin/showtimes", Icon: CalendarClock },
      { labelKey: "admin.nav.cinemas", href: "/admin/cinemas", Icon: Building2 },
      { labelKey: "admin.nav.catalogs", href: "/admin/catalogs", Icon: Tags },
    ],
  },
  {
    labelKey: "admin.nav.food",
    items: [
      { labelKey: "admin.nav.food_items", href: "/admin/food", Icon: Popcorn },
      { labelKey: "admin.nav.combos", href: "/admin/combos", Icon: Package },
    ],
  },
  {
    labelKey: "admin.nav.transactions",
    items: [
      { labelKey: "admin.nav.payment_methods", href: "/admin/payment-methods", Icon: CreditCard },
    ],
  },
  {
    labelKey: "admin.nav.users",
    items: [
      { labelKey: "admin.nav.customers", href: "/admin/users", Icon: Users },
      { labelKey: "admin.nav.reviews", href: "/admin/reviews", Icon: MessagesSquare },
    ],
  },
  {
    labelKey: "admin.nav.system",
    items: [
      { labelKey: "admin.nav.check_in", href: "/admin/check-in", Icon: ScanLine },
      { labelKey: "admin.nav.settings", href: "/admin/settings", Icon: Settings },
    ],
  },
];

/**
 * `/admin` only matches itself — every other entry also matches its sub-routes,
 * so `/admin/movies/dune-part-three` keeps "Movies" lit.
 */
export function isAdminNavActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
