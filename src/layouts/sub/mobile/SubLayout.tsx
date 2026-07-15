import Header from "./Header";

export default function MobileSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-(--color-bg) flex flex-col max-w-[min(28rem,100%)] min-w-0">
      <Header />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
