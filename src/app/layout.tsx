import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Inter } from "next/font/google";
import "@/styles/global.css";
import { LocaleProvider, type Locale } from "@/contexts/LocaleContext";
import { DeviceProvider } from "@/contexts/DeviceContext";
import { ToastProvider } from "@/contexts/ToastContext";
import ToastViewport from "@/components/ui/ToastViewport";
import type { Device } from "@/types";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/features/wishlist/context";
import { NotificationProvider } from "@/features/notifications/context";
import { getNotifications } from "@/features/notifications/api";
import { getRequestCookie, hasSession } from "@/libs/session";
import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE } from "@/libs/site";

/**
 * Self-hosted Inter (no runtime request to Google). `latin-ext` + `vietnamese`
 * subsets cover Vietnamese diacritics; the CSS variable is consumed by
 * `--font-sans` in `global.css`.
 */
const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Book Movie Tickets Online`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["movie tickets", "cinema", "booking", "PrimeSeat", "movie showtimes"],
  alternates: {
    languages: {
      "en-US": "/",
      "vi-VN": "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Book Movie Tickets Online`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    locale: "en_US",
    alternateLocale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Book Movie Tickets Online`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0F0F0F",
  width: "device-width",
  initialScale: 1,
};

/**
 * Server-side locale resolution: saved `locale` cookie first, then the
 * browser's `Accept-Language` (any `vi*` primary tag → VN), EN fallback.
 * Reading cookies/headers opts the app out of static prerendering, but that
 * cost was already paid — every catalog page threads the locale cookie for
 * `?lang=` (see Catalog Localization in AGENTS.md) — while the 60s fetch
 * cache keeps backend load flat. The payoff: SSR paints the visitor's
 * language on the first byte, so hydration corrects nothing and never
 * flashes (returning VN users) or mis-defaults (first-time vi browsers).
 */
async function resolveRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get("locale")?.value;
  if (saved === "vn" || saved === "en") return saved;

  const headerStore = await headers();
  const primaryTag = headerStore.get("accept-language")?.split(",")[0]?.trim().toLowerCase();
  if (primaryTag === "vi" || primaryTag?.startsWith("vi-")) return "vn";
  return "en";
}

/**
 * Server-side device guess from the request User-Agent — feeds `DeviceProvider`
 * so SSR paints the right layout variant on the first byte (no mobile→desktop
 * flash, no hydration correction). Reading headers costs no extra static
 * generation: this layout already reads cookies/headers for the locale.
 * Tablets guess desktop: at the 740px breakpoint both iPad portrait (744px)
 * and landscape render the desktop variant. A wrong guess (e.g. an unusually
 * narrow tablet, iPadOS reporting desktop Safari) is corrected client-side by
 * the `matchMedia` effect in `useDevice`.
 */
async function resolveInitialDevice(): Promise<Device> {
  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent") ?? "";
  if (/ipad|tablet/i.test(userAgent)) return "desktop";
  // Android phones carry a "Mobile" token, Android tablets don't.
  if (/android/i.test(userAgent)) return /mobile/i.test(userAgent) ? "mobile" : "desktop";
  return /webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent)
    ? "mobile"
    : "desktop";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLocale = await resolveRequestLocale();
  const initialDevice = await resolveInitialDevice();
  // SSR inbox seed for the badge + list; empty for logged-out visitors so no
  // cookie-less request is ever sent. The client provider keeps it live after
  // hydration (Socket.IO pushes + REST resync).
  const initialNotifications = (await hasSession())
    ? (await getNotifications(await getRequestCookie())).items
    : [];
  return (
    <html
      lang={initialLocale === "vn" ? "vi" : "en"}
      className={inter.variable}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh flex flex-col">
        <ToastProvider>
          <ToastViewport />
          <DeviceProvider initialDevice={initialDevice}>
            <LocaleProvider initialLocale={initialLocale}>
              <AuthProvider>
                <NotificationProvider initialNotifications={initialNotifications}>
                  <WishlistProvider>{children}</WishlistProvider>
                </NotificationProvider>
              </AuthProvider>
            </LocaleProvider>
          </DeviceProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
