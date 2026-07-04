import LayoutProvider from "@/components/layout/LayoutProvider";

export default function SubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutProvider layout="sub">{children}</LayoutProvider>;
}
