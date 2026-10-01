import Header from "@/layouts/main/desktop/Header";
import Footer from "@/layouts/main/desktop/Footer";

/* Shared desktop chrome: sticky header, page body, footer.
   Used by the (main) group and by (blank) desktop (movie detail). */
export default function DesktopShell({
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
