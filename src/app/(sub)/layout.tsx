import LayoutProvider from "@/layouts/LayoutProvider";

export default function SubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutProvider layout="sub">{children}</LayoutProvider>;
}
