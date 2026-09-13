import type { Metadata, Viewport } from "next";
import "@/styles/global.css";
import { LocaleProvider } from "@/contexts/LocaleContext";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-dvh flex flex-col">
        <LocaleProvider>
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
