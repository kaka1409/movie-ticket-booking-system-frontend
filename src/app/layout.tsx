import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/global.css";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/features/wishlist/context";
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
 * No `cookies()` here on purpose: reading them would force every route dynamic.
 * SSR always renders the default locale (EN); `LocaleProvider` applies the
 * visitor's saved choice (localStorage → cookie) right after hydration.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-dvh flex flex-col">
        <LocaleProvider>
          <AuthProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
