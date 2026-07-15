import Header from "./Header";

export default function DesktopSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="w-full flex-1 max-w-7xl mx-auto px-8 py-8">
        {children}
      </main>
    </div>
  );
}
