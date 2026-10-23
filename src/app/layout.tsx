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
 * Locale resolution: `locale` cookie → `Accept-Language` (`vi*` → VN) → EN.
 * Reading cookies rules out static prerendering (already true for every catalog
 * page), while the 60s fetch cache keyed on `?lang=` keeps load flat — and SSR
 * paints the right language, so hydration never corrects it.
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
 * User-Agent device guess so SSR paints the right variant (no mobile→desktop
 * flash). Tablets guess desktop — iPad portrait is 744px, past the 740px split;
 * a wrong guess is corrected client-side by `useDevice`'s `matchMedia` effect.
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
  // cookie-less request is ever sent. A failed seed renders as empty too — the
  // client provider resyncs after hydration (Socket.IO pushes + REST).
  const inbox = (await hasSession())
    ? await getNotifications(await getRequestCookie(), initialLocale)
    : null;
  const initialNotifications = inbox && "data" in inbox ? inbox.data.items : [];
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
