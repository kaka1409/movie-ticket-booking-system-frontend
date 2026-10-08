import Header from "./Header";
import BottomNav from "./BottomNav";

export default function MobileMainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-md flex-1 overflow-y-auto pb-15">{children}</main>
      <BottomNav />
    </div>
  );
}
