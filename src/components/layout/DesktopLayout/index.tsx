"use client";

import Header from "./Header";
import Footer from "./Footer";

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  );
}
