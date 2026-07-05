import LayoutProvider from "@/components/layout/LayoutProvider";

export default function BlankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutProvider layout="blank">{children}</LayoutProvider>;
}
