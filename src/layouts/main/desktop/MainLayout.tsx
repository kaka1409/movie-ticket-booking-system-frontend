import DesktopShell from "@/layouts/components/DesktopShell";

export default function DesktopMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DesktopShell>{children}</DesktopShell>;
}
