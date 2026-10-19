import DesktopShell from "@/layouts/components/DesktopShell";

/**
 * Desktop sub chrome. Unlike the mobile skin, desktop sub pages carry no back +
 * title strip: the shared main header already orients the visitor, and every sub
 * page owns its own context (the booking flow renders its own `StepRail`).
 */
export default function DesktopSubLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopShell>
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">{children}</div>
    </DesktopShell>
  );
}
