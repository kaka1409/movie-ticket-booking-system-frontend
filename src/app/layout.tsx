import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "@/styles/global.css";
import { LocaleProvider, type Locale } from "@/contexts/LocaleContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/features/wishlist/context";

export const metadata: Metadata = {
  title: "PrimeSeat",
  description: "A movie ticket booking system",
};

export const viewport: Viewport = {
  themeColor: "#0F0F0F",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale")?.value;
  const initialLocale: Locale = localeCookie === "vn" ? "vn" : "en";

  return (
    <html lang={initialLocale === "vn" ? "vi" : "en"} data-scroll-behavior="smooth">
      <body className="min-h-dvh flex flex-col">
        <LocaleProvider initialLocale={initialLocale}>
          <AuthProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
