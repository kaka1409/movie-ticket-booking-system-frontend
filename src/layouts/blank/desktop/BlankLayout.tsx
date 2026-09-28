import DesktopShell from "@/layouts/components/DesktopShell";

export default function DesktopBlankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DesktopShell>{children}</DesktopShell>;
}
